import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "./api.js";

export function Card(props) {
  let {
    username,
    prompt,
    response,
    tone,
    type,
    likeCount,
    created_at,
    userID,
    postID,
    has_Liked,
    view,
  } = props;
  const [likes, setLikes] = useState(likeCount || 0);
  const [hasLiked, setHasLiked] = useState(has_Liked);

  function formatDateToRelative(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();

    // Normalize to midnight (ignore hours/mins/seconds)
    const inputDay = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate()
    );
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const diffMs = todayDay - inputDay;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    return `${diffDays} days ago`;
  }

  const handleLike = async () => {
    if (hasLiked) {
      if (likes - 1 > -1) {
        setLikes(likes - 1);

        let response = await api.post("/like", {
          postID: postID,
          action: "dislike",
        });
      }
    } else {
      setLikes(likes + 1);

      let response = await api.post("/like", {
        postID: postID,
        action: "like",
      });
    }
    setHasLiked(!hasLiked);
  };

  // Determine badge color based on tone
  const getBadgeColor = (tone) => {
    switch (tone?.toLowerCase()) {
      case "mythical":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "dark":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      case "scientific":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "absurd":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      case "humorous":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
  };

  // Determine badge color based on type
  const getTypeBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "news":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "tweet":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "article":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "dialogue":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "timeline":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "image":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="card mb-6 hover:shadow-lg transition-all duration-200">
      {/* Card Header with User Info */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {username ? username.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="ml-3">
          <Link to={"/profile/" + username}>
            <div className="font-semibold text-gray-800 dark:text-white">
              {username}
            </div>
          </Link>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDateToRelative(created_at)}
          </div>
        </div>
      </div>
      {view ? (
        <>
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white text-lg">
              {prompt}
            </h3>
          </div>

          {/* Response Content */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {response}
            </p>
          </div>
        </>
      ) : (
        <Link to={"/post/" + postID}>
          {/* Prompt Display */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white text-lg">
              {prompt}
            </h3>
          </div>

          {/* Response Content */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {response}
            </p>
          </div>
        </Link>
      )}

      {/* Tags/Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tone && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(tone)}`}
          >
            {tone}
          </span>
        )}
        {type && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(
              type
            )}`}
          >
            {type}
          </span>
        )}
      </div>

      {/* Interaction Bar */}
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            hasLiked
              ? "text-red-500 dark:text-red-400"
              : "text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
          } transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={hasLiked ? "currentColor" : "none"}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={hasLiked ? 0 : 1.5}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span>{likes} likes</span>
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {/* You can add share/comment buttons here */}
        </div>
      </div>
    </div>
  );
}
