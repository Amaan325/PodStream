import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteSweep } from "react-icons/md";
import { useSelector } from "react-redux";

const CommentSection = ({ podcastId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // Get current user ID from Redux store
  const userId = useSelector((state) => state.user?.currentUser?._id);

  useEffect(() => {
    fetchComments();
  }, [podcastId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/podcasts/${podcastId}/comments`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(
        `http://localhost:3000/api/podcasts/${podcastId}/comments`,
        { text },
        { withCredentials: true }
      );
      setText("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/api/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="px-6 py-8 bg-black border-t border-gray-800 text-white">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button
          type="submit"
          className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded transition"
        >
          Post Comment
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="bg-gray-900 border border-gray-700 rounded p-4 flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-blue-400 font-semibold">
                  {c.user?.username || "Anonymous"}
                </p>
                <p className="text-white mt-1">{c.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Right-side message or delete button */}
              <div className="ml-4 text-right">
                {c.user?._id === userId ? (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Comment"
                  >
                    <MdDeleteSweep size={24} />
                  </button>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    You are not authorized to delete this comment.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
