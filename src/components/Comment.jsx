import api from "./api";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Individual Comment Component (Recursive)
function CommentItem({ comment, depth = 0, onReplySubmit, postId }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState(comment.replies || []);
  const [replyError, setReplyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async () => {
    if (replyText.trim() === "") {
      setReplyError("Reply cannot be empty");
      setTimeout(() => setReplyError(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setReplyError("");

    try {
      const response = await api.post("/comment", {
        comment: replyText,
        postId,
        parentCommentId: comment.id,
      });

      // Create new reply object with response data
      const newReply = {
        id: response.data.id || Date.now(), // Use server ID or timestamp as fallback
        comment: replyText,
        username: localStorage.getItem("username"),
        created_at: new Date().toISOString(),
        replies: [],
      };

      // Add the new reply to local state immediately
      setLocalReplies([...localReplies, newReply]);
      setReplyText("");
      setShowReplyBox(false);

      // Optionally call parent callback to refresh all comments
      if (onReplySubmit) {
        onReplySubmit();
      }
    } catch (err) {
      console.error("Error posting reply:", err);
      setReplyError("Failed to post reply. Please try again.");
      setTimeout(() => setReplyError(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
    return `${Math.floor(seconds / 31536000)}y ago`;
  };

  return (
    <div className={`comment-thread ${depth > 0 ? "ml-6" : ""} mb-4`}>
      {/* Vertical line for nested comments */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
      )}

      <div className="relative">
        {/* Comment Container */}
        <div className="flex gap-2 mb-2 pb-4 border-b border-gray-100 dark:border-gray-800">
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex-shrink-0 w-6 h-6 mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center justify-center"
          >
            {isCollapsed ? "+" : "−"}
          </button>

          {/* Comment Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {comment.username
                  ? comment.username.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <Link
                to={`/profile/${comment.username}`}
                className="font-semibold hover:underline text-gray-800 dark:text-gray-200"
              >
                {comment.username}
              </Link>
              <span>•</span>
              <span>{formatTimeAgo(comment.created_at)}</span>
            </div>

            {/* Comment Text */}
            {!isCollapsed && (
              <>
                <div className="text-sm text-gray-800 dark:text-gray-200 mb-2 transition-all duration-300 ease-in-out">
                  {comment.comment}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out">
                  {/* Upvote */}
                  <button className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>

                  {/* Vote Count */}
                  <span>0</span>

                  {/* Downvote */}
                  <button className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Reply Button */}
                  <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded"
                  >
                    Reply
                  </button>

                  {/* Share Button */}
                  <button className="hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded">
                    Share
                  </button>
                </div>

                {/* Reply Input Box */}
                {showReplyBox && (
                  <div className="mt-3 mb-2 animate-fadeIn">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.username}...`}
                      className={`w-full p-2 border ${
                        replyError
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      rows="3"
                      disabled={isSubmitting}
                    />
                    {replyError && (
                      <p className="text-red-500 text-xs mt-1">{replyError}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleReplySubmit}
                        disabled={isSubmitting}
                        className={`px-4 py-1.5 ${
                          isSubmitting
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white rounded-full text-xs font-semibold`}
                      >
                        {isSubmitting ? "Posting..." : "Reply"}
                      </button>
                      <button
                        onClick={() => {
                          setShowReplyBox(false);
                          setReplyText("");
                          setReplyError("");
                        }}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {!isCollapsed &&
                  localReplies &&
                  localReplies.length > 0 &&
                  localReplies.map((reply) => (
                    <div key={reply.id} className="mt-4">
                      <CommentItem
                        comment={reply}
                        postId={postId}
                        depth={depth + 1}
                        onReplySubmit={onReplySubmit}
                      />
                    </div>
                  ))}
              </>
            )}

            {/* Collapsed State */}
            {isCollapsed && (
              <div className="text-xs text-gray-500 dark:text-gray-400 animate-fadeIn">
                {localReplies.length > 0
                  ? `${localReplies.length} ${
                      localReplies.length === 1 ? "reply" : "replies"
                    } hidden`
                  : "Comment hidden"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add smooth transition styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Main Comment Component
export function Comment({ postId, comments, onRefresh }) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function send() {
    if (comment.trim() === "") {
      setCommentError("Comment cannot be empty");
      setTimeout(() => setCommentError(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setCommentError("");

    try {
      await api.post("/comment", {
        comment: comment,
        postId: postId,
      });

      setComment("");

      // Refresh comments after posting
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error(
        "Error while inserting comment: ",
        err.response?.data?.message || err.message
      );
      setCommentError("Failed to post comment. Please try again.");
      setTimeout(() => setCommentError(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      send();
    }
  };

  return (
    <div className="mt-6">
      {/* Comment Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Comment as{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {localStorage.getItem("username") || "Guest"}
          </span>
        </div>
        <textarea
          placeholder="What are your thoughts?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`w-full p-3 border ${
            commentError
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          rows="4"
          disabled={isSubmitting}
        />
        {commentError && (
          <p className="text-red-500 text-xs mt-1">{commentError}</p>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              setComment("");
              setCommentError("");
            }}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={send}
            disabled={!comment.trim() || isSubmitting}
            className={`px-4 py-2 text-sm font-semibold rounded-full ${
              comment.trim() && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Posting..." : "Comment"}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments && Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={{ ...comment, postId }}
              postId={postId}
              depth={0}
              onReplySubmit={onRefresh}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
