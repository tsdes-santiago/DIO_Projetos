# database.py
import sqlite3
from pathlib import Path
from datetime import datetime

DB_DIR = Path("data")
DB_PATH = DB_DIR / "tasks.db"


def get_connection():
    DB_DIR.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'todo',
            priority TEXT DEFAULT 'media',
            due_date TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def add_task(title, description="", status="todo", priority="media", due_date=None):
    now = datetime.now().isoformat(timespec="seconds")
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (title, description, status, priority, due_date, now, now))

    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return task_id


def get_all_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM tasks
        ORDER BY
            CASE status
                WHEN 'doing' THEN 1
                WHEN 'todo' THEN 2
                WHEN 'done' THEN 3
                ELSE 4
            END,
            due_date IS NULL,
            due_date ASC,
            created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_tasks_by_status(status):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM tasks
        WHERE status = ?
        ORDER BY due_date IS NULL, due_date ASC, created_at DESC
    """, (status,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def update_task_status(task_id, new_status):
    now = datetime.now().isoformat(timespec="seconds")
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE tasks
        SET status = ?, updated_at = ?
        WHERE id = ?
    """, (new_status, now, task_id))

    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


def delete_task(task_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


def get_overdue_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM tasks
        WHERE status != 'done'
          AND due_date IS NOT NULL
          AND due_date < date('now', 'localtime')
        ORDER BY due_date ASC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def add_message(role, content):
    now = datetime.now().isoformat(timespec="seconds")
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO messages (role, content, created_at)
        VALUES (?, ?, ?)
    """, (role, content, now))

    conn.commit()
    conn.close()


def get_messages(limit=50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM messages
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    rows = [dict(row) for row in rows]
    rows.reverse()
    return rows

def delete_all_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks")
    conn.commit()
    conn.close()
    
def delete_all_messages():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM messages")
    conn.commit()
    conn.close()

def reset_database():
    try:
        conn = get_connection()
        conn.close()
    except Exception:
        pass

    if DB_PATH.exists():
        DB_PATH.unlink()

    init_db()