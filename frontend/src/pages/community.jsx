import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const userId = localStorage.getItem("user_id");

  const loadPosts = async () => {
    try {
      const res = await api.getPosts();
      setPosts(res);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // ✅ FIXED POST
  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      await api.createPost(userId, content); // ✅ FIX
      setContent("");
      loadPosts();
    } catch (err) {
      console.error("Post error:", err);
    }
  };

  // ✅ FIXED LIKE
  const handleLike = async (postId) => {
    try {
      await api.likePost(postId); // ✅ FIX
      loadPosts();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleReply = async (postId, text) => {
    if (!text.trim()) return;

    try {
      await api.replyPost({
        user_id: userId,
        post_id: postId,
        content: text
      });

      loadPosts();
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">🌿 Community</h2>

      {/* CREATE POST */}
      <div className="community-card">
        <textarea
          placeholder="Share something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="primary-btn" onClick={handlePost}>
          Post
        </button>
      </div>

      {/* POSTS */}
      <div className="posts-container">
        {posts.length === 0 ? (
          <p>No posts yet 🌱</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">

              {/* ✅ USER + TIME */}
              <div className="post-header">
                <span className="post-user">{post.name}</span>
                <span className="post-time">
                  {post.created_at
                    ? new Date(post.created_at).toLocaleString()
                    : ""}
                </span>
              </div>

              {/* CONTENT */}
              <p className="post-content">{post.content}</p>

              {/* LIKE */}
              <button onClick={() => handleLike(post.id)}>
                ❤️ {post.likes || 0}
              </button>

              {/* REPLIES */}
              {(post.replies || []).map(r => (
                <div key={r.id} className="reply">
                  <b>{r.name}</b>: {r.content}
                </div>
              ))}

              <ReplyBox onReply={(text) => handleReply(post.id, text)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// 🔁 REPLY BOX
function ReplyBox({ onReply }) {
  const [text, setText] = useState("");

  return (
    <div className="reply-box">
      <input
        placeholder="Reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          if (!text.trim()) return;
          onReply(text);
          setText("");
        }}
      >
        Reply
      </button>
    </div>
  );
}