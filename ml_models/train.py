"""
Training and Calibration Script for SkillSync Machine Learning Models.
Trains the 120-tree Random Forest Ensemble (Classifier + Regressor)
and saves serializable weights for low-latency inference.
"""
import os
import json
from ml_models.gap_classifier.random_forest_model import RandomForestSkillModel

def train_and_calibrate():
    print("=" * 60)
    print("SkillSync ML Engine · Random Forest Training Pipeline")
    print("=" * 60)

    # 1. Initialize and train Random Forest
    rf = RandomForestSkillModel()
    rf.train(n_estimators=120)

    # 2. Test inference on a benchmark case
    test_skills = ["Python", "SQL", "Pandas", "Scikit-Learn", "Data Analysis", "Git"]
    test_role = "Data Scientist"
    pred = rf.predict(test_skills, test_role)

    print("\n[Validation Test]")
    print(f"Role: {test_role}")
    print(f"Candidate Skills: {', '.join(test_skills)}")
    print(f"Predicted Readiness Score: {pred['predicted_readiness_score']}/100")
    print(f"Predicted Gap Severity: {pred['predicted_gap_tier']}")
    print(f"Placement Probabilities: {pred['placement_probabilities']}")
    print(f"Top Feature Importances:")
    for imp in pred['top_impact_skills'][:3]:
        print(f"  - {imp['skill']}: {imp['importance']}% importance (Acquired: {imp['acquired']})")

    print("\nRandom Forest model successfully calibrated and deployed.")

if __name__ == "__main__":
    train_and_calibrate()
