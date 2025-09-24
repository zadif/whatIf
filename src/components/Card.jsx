import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "./api.js";
import { useModal } from "./ModalContext.jsx";

// ShareButton component
function ShareButton({ postID }) {
  const { openToastModal, openErrorModal } = useModal();
  const [isSharing, setIsSharing] = useState(false);

  const handleCopy = () => {
    if (isSharing) return; // Prevent multiple rapid clicks

    setIsSharing(true);
    const link = `${window.location.origin}/post/${postID}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Show auto-dismissing toast modal
        openToastModal(
          "Link Copied!",
          "The link has been copied to your clipboard."
        );

        // Reset sharing state after a short delay
        setTimeout(() => {
          setIsSharing(false);
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy", err);
        openErrorModal(
          "Failed to Copy",
          "There was an error copying the link. Please try again."
        );
        setIsSharing(false);
      });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${
        isSharing ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title="Share this WhatIf"
      disabled={isSharing}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      <span>{isSharing ? "Sharing..." : "Share"}</span>
    </button>
  );
}

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
    publi,
    onDelete,
  } = props;
  const [likes, setLikes] = useState(likeCount || 0);
  const [hasLiked, setHasLiked] = useState(has_Liked);
  let [publ, setPubl] = useState(publi);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { openConfirmModal, openSuccessModal, openErrorModal } = useModal();
  const [isDisabled, setIsDisabled] = useState(false);
  // Click outside handler to close the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    // Add event listener when menu is open
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  async function deletePost() {
    openConfirmModal(
      "Delete Post",
      "Are you sure you want to delete this WhatIf? This action cannot be undone.",
      async () => {
        try {
          let response = await api.delete("/whatIf", {
            data: { postId: postID },
          });
          if (response.data.message == "deleted") {
            openSuccessModal(
              "Deleted Successfully",
              "Your WhatIf has been permanently deleted."
            );

            // If we have an onDelete handler, call it to refresh the parent component
            if (onDelete) {
              setTimeout(() => {
                onDelete(postID);
              }, 1500);
            }
          } else {
            openErrorModal(
              "Error Deleting Post",
              "Something went wrong while deleting your post. Please try again."
            );
          }
        } catch (err) {
          console.error("Error while deleting", err);
          openErrorModal(
            "Error Deleting Post",
            "Something went wrong while deleting your post. Please try again."
          );
        }
      },
      "Delete",
      "Cancel"
    );
  }
  async function changeVisibility() {
    const newVisibility = !publ;
    const statusText = newVisibility ? "public" : "private";

    openConfirmModal(
      "Change Visibility",
      `Are you sure you want to make this WhatIf ${statusText}?`,
      async () => {
        try {
          let response = await api.post("/update", {
            postId: postID,
            publi: newVisibility,
          });
          if (response.data.message == "updated") {
            setPubl(newVisibility);
            openSuccessModal(
              "Visibility Changed",
              `Your WhatIf is now ${statusText}.`
            );
          } else {
            openErrorModal(
              "Error Changing Visibility",
              "Something went wrong while updating visibility. Please try again."
            );
          }
        } catch (err) {
          console.error("Error while updating visibility", err);
          openErrorModal(
            "Error Changing Visibility",
            "Something went wrong while updating visibility. Please try again."
          );
        }
      },
      "Change",
      "Cancel"
    );
  }

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

        let response = api.post("/like", {
          postID: postID,
          action: "dislike",
        });
      }
    } else {
      setLikes(likes + 1);

      let response = api.post("/like", {
        postID: postID,
        action: "like",
      });
    }
    if (!isDisabled) {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, 3000);
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
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
        {
          //Only show these buttons when public exists , and it only exists
          // when whatifs are fetched via profile - NOW MOVED TO THREE-DOT MENU
        }
        {publi !== undefined && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    changeVisibility();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {publ ? "Make Private" : "Make Public"}
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    deletePost();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {
        //If the whatifs are visible from feed or profile
        //I show Link , so that it redirects the whole whatIf
        // to a single post page i.e. View
      }
      {view ? (
        <>
          <div className="mb-4">
            <h2 className="roboto-font font-medium text-gray-900 dark:text-white text-lg">
              {prompt}
            </h2>
          </div>

          {/* Response Content - Full Content for View Mode */}
          <div className="nunito-font bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
            <div
              className="text-gray-700 dark:text-gray-300 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          </div>
        </>
      ) : (
        <Link to={"/post/" + postID}>
          {/* Prompt Display */}
          <div className="mb-4">
            <h2 className="roboto-font font-medium text-gray-900 dark:text-white text-lg">
              {prompt}
            </h2>
          </div>

          {/* Response Content */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4">
            <div
              className="nunito-font text-gray-700 dark:text-gray-300 whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html:
                  response.length > 200
                    ? response.slice(0, 200) + "..."
                    : response,
              }}
            />
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
          disabled={isDisabled}
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

        <ShareButton postID={postID} />
      </div>
    </div>
  );
}
