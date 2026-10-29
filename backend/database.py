import os
import json
import pymysql
from pymysql.cursors import DictCursor
from typing import Dict, Any, List, Optional

MYSQL_HOST = os.getenv("MYSQL_HOST", "127.0.0.1")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root")
MYSQL_DB = os.getenv("MYSQL_DATABASE", "skillsync_db")

def get_connection(include_db: bool = True):
    return pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB if include_db else None,
        charset="utf8mb4",
        cursorclass=DictCursor,
        autocommit=True
    )

def init_mysql():
    """Initializes the MySQL database and tables if they do not exist."""
    try:
        # Step 1: Create Database
        root_conn = get_connection(include_db=False)
        with root_conn.cursor() as cur:
            cur.execute(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        root_conn.close()

        # Step 2: Create Tables
        conn = get_connection(include_db=True)
        with conn.cursor() as cur:
            # 1. Profiles Table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS `profiles` (
                `id` VARCHAR(64) PRIMARY KEY,
                `email` VARCHAR(191) UNIQUE,
                `full_name` VARCHAR(191),
                `college` VARCHAR(191) DEFAULT 'Tech University',
                `department` VARCHAR(191) DEFAULT 'Computer Science',
                `academic_year` VARCHAR(64) DEFAULT 'Final Year',
                `avatar_url` TEXT,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)

            # 2. Analyses Table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS `analyses` (
                `id` VARCHAR(64) PRIMARY KEY,
                `user_id` VARCHAR(64),
                `title` VARCHAR(255),
                `target_role` VARCHAR(128),
                `input_text` MEDIUMTEXT,
                `extracted_skills` JSON,
                `matched_skills` JSON,
                `missing_skills` JSON,
                `gap_score` INT DEFAULT 30,
                `industry_match` INT DEFAULT 70,
                `readiness_score` INT DEFAULT 70,
                `recommendations` JSON,
                `courses` JSON,
                `study_materials` JSON,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)

            # 3. SkillSwap Posts Table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS `skillswap_posts` (
                `id` VARCHAR(64) PRIMARY KEY,
                `user_id` VARCHAR(64),
                `title` VARCHAR(255),
                `description` TEXT,
                `post_type` VARCHAR(64) DEFAULT 'Skill Exchange',
                `skill_level` VARCHAR(64) DEFAULT 'Intermediate',
                `skills_to_teach` JSON,
                `skills_to_learn` JSON,
                `availability` VARCHAR(128),
                `preferred_collaboration` VARCHAR(128),
                `status` VARCHAR(32) DEFAULT 'active',
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)

            # 4. SkillSwap Requests Table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS `skillswap_requests` (
                `id` VARCHAR(64) PRIMARY KEY,
                `post_id` VARCHAR(64),
                `sender_id` VARCHAR(64),
                `recipient_id` VARCHAR(64),
                `message` TEXT,
                `status` VARCHAR(32) DEFAULT 'pending',
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)

            # 5. SkillSwap Messages Table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS `skillswap_messages` (
                `id` VARCHAR(64) PRIMARY KEY,
                `sender_id` VARCHAR(64),
                `recipient_id` VARCHAR(64),
                `request_id` VARCHAR(64),
                `message` TEXT,
                `is_read` BOOLEAN DEFAULT FALSE,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)

            # Seed default demo profile if empty
            cur.execute("SELECT COUNT(*) AS cnt FROM `profiles` WHERE `id` = '00000000-0000-0000-0000-000000000001'")
            res = cur.fetchone()
            if res and res["cnt"] == 0:
                cur.execute("""
                INSERT INTO `profiles` (`id`, `email`, `full_name`, `college`, `department`, `academic_year`)
                VALUES ('00000000-0000-0000-0000-000000000001', 'demo@skillsync.edu', 'Demo Student', 'Tech University', 'Computer Science', 'Final Year')
                """)

        conn.close()
        print(f"[MySQL] Successfully connected and verified '{MYSQL_DB}' database & tables!")
        return True
    except Exception as e:
        print(f"[MySQL] Connection or initialization failed: {e}")
        return False

# --- Helper Query Methods ---

def save_analysis(record: Dict[str, Any]) -> str:
    conn = get_connection()
    with conn.cursor() as cur:
        sql = """
        INSERT INTO `analyses` (
            `id`, `user_id`, `title`, `target_role`, `input_text`,
            `extracted_skills`, `matched_skills`, `missing_skills`,
            `gap_score`, `industry_match`, `readiness_score`,
            `recommendations`, `courses`, `study_materials`, `created_at`
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        ON DUPLICATE KEY UPDATE
            `title`=VALUES(`title`),
            `target_role`=VALUES(`target_role`),
            `readiness_score`=VALUES(`readiness_score`);
        """
        cur.execute(sql, (
            record["id"],
            record.get("user_id", "00000000-0000-0000-0000-000000000001"),
            record.get("title", "Skill Gap Analysis"),
            record.get("target_role", "Engineering Role"),
            record.get("input_text", ""),
            json.dumps(record.get("extracted_skills", [])),
            json.dumps(record.get("matched_skills", [])),
            json.dumps(record.get("missing_skills", [])),
            int(record.get("gap_score", 30)),
            int(record.get("industry_match", 70)),
            int(record.get("readiness_score", 70)),
            json.dumps(record.get("recommendations", [])),
            json.dumps(record.get("courses", [])),
            json.dumps(record.get("study_materials", [])),
        ))
    conn.close()
    return record["id"]

def get_analyses(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    with conn.cursor() as cur:
        if user_id:
            cur.execute("SELECT * FROM `analyses` WHERE `user_id` = %s ORDER BY `created_at` DESC", (user_id,))
        else:
            cur.execute("SELECT * FROM `analyses` ORDER BY `created_at` DESC")
        rows = cur.fetchall()
    conn.close()

    for r in rows:
        for json_col in ["extracted_skills", "matched_skills", "missing_skills", "recommendations", "courses", "study_materials"]:
            if r.get(json_col) and isinstance(r[json_col], str):
                try:
                    r[json_col] = json.loads(r[json_col])
                except Exception:
                    pass
        if r.get("created_at"):
            r["created_at"] = r["created_at"].isoformat()
    return rows

def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM `analyses` WHERE `id` = %s", (analysis_id,))
        row = cur.fetchone()
    conn.close()
    if not row:
        return None
    for json_col in ["extracted_skills", "matched_skills", "missing_skills", "recommendations", "courses", "study_materials"]:
        if row.get(json_col) and isinstance(row[json_col], str):
            try:
                row[json_col] = json.loads(row[json_col])
            except Exception:
                pass
    if row.get("created_at"):
        row["created_at"] = row["created_at"].isoformat()
    return row

def delete_analysis(analysis_id: str) -> bool:
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM `analyses` WHERE `id` = %s", (analysis_id,))
    conn.close()
    return True
