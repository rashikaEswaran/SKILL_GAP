import os
import json
import numpy as np
import joblib
from typing import List, Dict, Any, Tuple
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

class RandomForestSkillModel:
    """
    Random Forest Machine Learning Model for Skill Gap Analytics.
    Uses:
    1. RandomForestRegressor: Predicts continuous readiness score (0-100)
    2. RandomForestClassifier: Predicts gap severity & placement probability tier
    3. Feature Importances: Pinpoints which skills contribute most to role readiness
    """

    MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "weights")
    MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_weights.joblib")

    def __init__(self, db_path: str = None):
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, "skills_db.json")

        self.db_path = db_path
        self.skills_db = self._load_db()
        self.all_skills = self._get_ordered_skills_list()
        self.all_roles = list(self.skills_db.get("roles", {}).keys())

        self.regressor: RandomForestRegressor = None
        self.classifier: RandomForestClassifier = None
        self.classes_ = ["High Gap", "Moderate Gap", "Low Gap"]

        self._initialize_or_load_models()

    def _load_db(self) -> Dict[str, Any]:
        if os.path.exists(self.db_path):
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"roles": {}, "skill_taxonomy": {}}

    def _get_ordered_skills_list(self) -> List[str]:
        """Creates a stable canonical feature index for all recognized skills."""
        skills_set = set()
        for cat, skills in self.skills_db.get("skill_taxonomy", {}).items():
            for s in skills:
                skills_set.add(s)
        for role, data in self.skills_db.get("roles", {}).items():
            for s in data.get("core_skills", []) + data.get("emerging_skills", []):
                skills_set.add(s)
        return sorted(list(skills_set))

    def _initialize_or_load_models(self):
        if os.path.exists(self.MODEL_PATH):
            try:
                data = joblib.load(self.MODEL_PATH)
                self.regressor = data["regressor"]
                self.classifier = data["classifier"]
                self.all_skills = data.get("all_skills", self.all_skills)
                self.all_roles = data.get("all_roles", self.all_roles)
                return
            except Exception as e:
                print(f"[RandomForest] Failed to load saved weights: {e}, retraining...")

        # If model file does not exist, train initial models immediately
        self.train()

    def encode_features(self, candidate_skills: List[str], target_role: str) -> np.ndarray:
        """
        Transforms candidate skills and target role into feature vector:
        - Multi-hot binary vector of all recognized skills
        - Target role one-hot representation
        - Core overlap ratio
        - Emerging overlap ratio
        - Total skills count
        """
        candidate_set = {s.strip().lower() for s in candidate_skills}

        # 1. Multi-hot skill vector
        skill_vec = [1.0 if s.lower() in candidate_set else 0.0 for s in self.all_skills]

        # 2. Role one-hot vector
        role_vec = [1.0 if r.lower() == target_role.lower() else 0.0 for r in self.all_roles]
        if not any(role_vec):
            role_vec = [0.0] * len(self.all_roles)
            if role_vec:
                role_vec[0] = 1.0

        # 3. Domain ratios
        role_info = self.skills_db.get("roles", {}).get(target_role, {})
        core_skills = role_info.get("core_skills", [])
        emerging_skills = role_info.get("emerging_skills", [])

        core_matches = sum(1.0 for s in core_skills if s.lower() in candidate_set)
        emerging_matches = sum(1.0 for s in emerging_skills if s.lower() in candidate_set)

        core_ratio = core_matches / max(len(core_skills), 1)
        emerging_ratio = emerging_matches / max(len(emerging_skills), 1)
        total_count = float(len(candidate_skills))

        features = skill_vec + role_vec + [core_ratio, emerging_ratio, total_count]
        return np.array(features, dtype=np.float32).reshape(1, -1)

    def train(self, n_estimators: int = 120):
        """
        Generates comprehensive role permutations and trains the Random Forest ensemble.
        """
        os.makedirs(self.MODEL_DIR, exist_ok=True)
        X_train = []
        y_score = []
        y_tier = []

        np.random.seed(42)

        # Generate representative dataset from benchmark roles
        for role_name, role_data in self.skills_db.get("roles", {}).items():
            core = role_data.get("core_skills", [])
            emerging = role_data.get("emerging_skills", [])
            soft = role_data.get("soft_skills", [])

            # Simulate 150 student profiles per role with varying skill coverage
            for _ in range(150):
                # Randomly sample core skills (between 0% and 100%)
                p_core = np.random.uniform(0.1, 1.0)
                n_core = np.random.binomial(len(core), p_core)
                sampled_core = list(np.random.choice(core, size=n_core, replace=False)) if n_core > 0 else []

                # Randomly sample emerging skills
                p_emerging = np.random.uniform(0.0, 0.9)
                n_emerging = np.random.binomial(len(emerging), p_emerging)
                sampled_emerging = list(np.random.choice(emerging, size=n_emerging, replace=False)) if n_emerging > 0 else []

                # Randomly sample soft skills
                n_soft = np.random.binomial(len(soft), 0.7)
                sampled_soft = list(np.random.choice(soft, size=n_soft, replace=False)) if n_soft > 0 else []

                # Add some unrelated domain skills (noise)
                other_skills = [s for s in self.all_skills if s not in core and s not in emerging]
                noise = list(np.random.choice(other_skills, size=np.random.randint(0, 4), replace=False))

                skills = list(set(sampled_core + sampled_emerging + sampled_soft + noise))

                # Ground truth scoring formula with realistic variance
                c_ratio = len(sampled_core) / max(len(core), 1)
                e_ratio = len(sampled_emerging) / max(len(emerging), 1)
                s_ratio = len(sampled_soft) / max(len(soft), 1)

                score = (c_ratio * 70.0) + (e_ratio * 20.0) + (s_ratio * 10.0) + np.random.normal(0, 2.5)
                score = float(np.clip(score, 5.0, 98.0))

                if score >= 80.0:
                    tier = "Low Gap"
                elif score >= 50.0:
                    tier = "Moderate Gap"
                else:
                    tier = "High Gap"

                feat = self.encode_features(skills, role_name).flatten()
                X_train.append(feat)
                y_score.append(score)
                y_tier.append(tier)

        X = np.array(X_train)
        y_reg = np.array(y_score)
        y_clf = np.array(y_tier)

        # Train Random Forest Regressor for score prediction
        self.regressor = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=16,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        )
        self.regressor.fit(X, y_reg)

        # Train Random Forest Classifier for gap tier prediction
        self.classifier = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=16,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        )
        self.classifier.fit(X, y_clf)

        # Persist weights to disk
        joblib.dump({
            "regressor": self.regressor,
            "classifier": self.classifier,
            "all_skills": self.all_skills,
            "all_roles": self.all_roles
        }, self.MODEL_PATH)

        print(f"[RandomForest] Successfully trained & saved ensemble to {self.MODEL_PATH}")

    def predict(self, candidate_skills: List[str], target_role: str) -> Dict[str, Any]:
        """
        Executes Random Forest inference for candidate skill profile.
        Returns predicted readiness score, gap tier, placement probabilities, and top skill importances.
        """
        features = self.encode_features(candidate_skills, target_role)

        # 1. Random Forest Score Regression
        predicted_score = float(self.regressor.predict(features)[0])
        predicted_score = round(max(5.0, min(predicted_score, 98.0)), 1)

        # 2. Random Forest Severity Classification & Class Probabilities
        predicted_tier = str(self.classifier.predict(features)[0])
        probabilities = self.classifier.predict_proba(features)[0]
        prob_dict = {cls: round(float(p) * 100, 1) for cls, p in zip(self.classifier.classes_, probabilities)}

        # 3. Top Feature Importances for this Role
        feature_importances = self.regressor.feature_importances_
        skill_weights = []
        for i, skill in enumerate(self.all_skills):
            importance = float(feature_importances[i])
            is_present = skill.lower() in [s.lower() for s in candidate_skills]
            skill_weights.append({
                "skill": skill,
                "importance": round(importance * 100, 2),
                "acquired": is_present
            })

        # Rank skills with highest influence
        skill_weights = sorted(skill_weights, key=lambda x: x["importance"], reverse=True)
        top_impact_skills = skill_weights[:6]

        return {
            "model_name": "Random Forest Ensemble (scikit-learn)",
            "predicted_readiness_score": int(round(predicted_score)),
            "predicted_gap_tier": predicted_tier,
            "placement_probabilities": prob_dict,
            "top_impact_skills": top_impact_skills,
            "trees_in_forest": self.regressor.n_estimators
        }

if __name__ == "__main__":
    rf = RandomForestSkillModel()
    sample_skills = ["Python", "Machine Learning", "Deep Learning", "PyTorch", "Docker"]
    res = rf.predict(sample_skills, "ML Engineer")
    print("Random Forest Prediction Result:")
    print(json.dumps(res, indent=2))
