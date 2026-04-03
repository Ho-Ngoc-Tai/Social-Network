"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { feedActions } from "../stores/reducers/feed/feedSlice";
import { RootState } from "../stores/store";

export default function FeedDemo() {
  const dispatch = useDispatch();
  const { items, isLoading, error, createLoading, createError } = useSelector((state: RootState) => state.feed);

  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    // Load feed on component mount
    dispatch(feedActions.loadFeedRequested({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      dispatch(feedActions.createPostRequested({ content: postContent }));
      setPostContent("");
    }
  };

  const handleLoadMore = () => {
    const nextPage = Math.floor(items.length / 10) + 1;
    dispatch(feedActions.loadFeedRequested({ page: nextPage, limit: 10 }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Social Feed</h2>

      {/* Create Post Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Create Post</h3>
        <form onSubmit={handleCreatePost}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "vertical",
              marginBottom: "10px",
            }}
          />
          <button
            type="submit"
            disabled={createLoading || !postContent.trim()}
            style={{
              backgroundColor: createLoading ? "#ccc" : "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: createLoading || !postContent.trim() ? "not-allowed" : "pointer",
            }}
          >
            {createLoading ? "Posting..." : "Post"}
          </button>
        </form>

        {createError && (
          <div style={{ marginTop: "10px", color: "red" }}>
            Error: {createError}
          </div>
        )}
      </div>

      {/* Feed Loading/Error */}
      {isLoading && <div>Loading feed...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {/* Feed Items */}
      <div>
        {items.map((post) => (
          <div
            key={post.id}
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "20px",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
              {post.author.full_name} (@{post.author.username})
            </div>
            <div style={{ marginBottom: "10px", whiteSpace: "pre-wrap" }}>
              {post.content}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              <span>{new Date(post.created_at).toLocaleString()}</span>
              <span style={{ marginLeft: "20px" }}>❤️ {post.likes_count}</span>
              <span style={{ marginLeft: "20px" }}>💬 {post.comments_count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {items.length > 0 && !isLoading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleLoadMore}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
