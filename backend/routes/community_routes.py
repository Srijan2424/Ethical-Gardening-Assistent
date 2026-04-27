from fastapi import APIRouter
from backend.database.db import get_connection

router = APIRouter()

# 📝 CREATE POST
@router.post("/posts")
def create_post(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO posts (user_id, content)
        VALUES (?, ?)
    """, (data["user_id"], data["content"]))

    conn.commit()
    conn.close()

    return {"message": "Post created"}


# 📥 GET ALL POSTS
@router.get("/posts")
def get_posts():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT posts.*, users.name
        FROM posts
        JOIN users ON users.id = posts.user_id
        ORDER BY posts.created_at DESC
    """)

    posts = [dict(row) for row in cursor.fetchall()]

    # attach replies + likes
    for post in posts:
        cursor.execute("SELECT COUNT(*) as count FROM likes WHERE post_id = ?", (post["id"],))
        post["likes"] = cursor.fetchone()["count"]

        cursor.execute("""
            SELECT replies.*, users.name
            FROM replies
            JOIN users ON users.id = replies.user_id
            WHERE replies.post_id = ?
        """, (post["id"],))

        post["replies"] = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return posts


# ❤️ LIKE POST
@router.post("/like")
def like_post(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO likes (post_id, user_id)
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT 1 FROM likes WHERE post_id=? AND user_id=?
        )
    """, (data["post_id"], data["user_id"], data["post_id"], data["user_id"]))

    conn.commit()
    conn.close()

    return {"message": "Liked"}


# 💬 REPLY
@router.post("/reply")
def reply(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO replies (post_id, user_id, content)
        VALUES (?, ?, ?)
    """, (data["post_id"], data["user_id"], data["content"]))

    conn.commit()
    conn.close()

    return {"message": "Reply added"}