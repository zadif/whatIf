import { useState, useEffect } from "react";
import api from "./api.js";
import { Card } from "./Card.jsx";
import { Link, useNavigate } from "react-router-dom";

export function Feed() {
  let [feed, setFeed] = useState([]);
  let [loading, setLoading] = useState(true);
  let [loadingMore, setLoadingMore] = useState(false);
  let [noMoreFeed, setNoMoreFeed] = useState(1);
  let [error, setError] = useState(null);
  let [page, setPage] = useState(0);
  const navigate = useNavigate();

  async function search() {
    // Only show full screen loader on first load
    if (page === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const response = await api.get(`/feed/${page}`);
      if (response.data.length > 0) {
        let i = 5;
        let arr = response.data;
        let size = arr.length;
        //swapping the feed 5 times
        while (i--) {
          const i = Math.floor(Math.random() * size);
          const j = Math.floor(Math.random() * size);
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
        setFeed((prev) => [...prev, ...arr]);
      } else if (response.data.length == 0) {
        setNoMoreFeed(0);
      }

      // setFeed((prev) => [...prev, ...response.data]);

      return response;
    } catch (err) {
      console.error("Error in fetching feed from backend: ", err.message);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    search();
  }, [page]);

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      noMoreFeed === 1 &&
      !loadingMore
    ) {
      setPage((prev) => prev + 1);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="container-fluid py-8">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className=" tryAgain bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={search}
          >
            Try Again
          </button>
        </div>
      ) : feed.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
            No posts yet!
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Be the first to create a WhatIf scenario or follow more users to see
            their posts.
          </p>
          <Link to="/addNew" className="btn btn-primary">
            Create Your First WhatIf
          </Link>
        </div>
      ) : (
        <>
          {/* Create WhatIf Prompt Box */}
          <div className="md:max-w-3xl mx-auto mb-6">
            <div
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate("/addNew")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {localStorage.getItem("username")?.charAt(0).toUpperCase() ||
                    "?"}
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  What if... ?
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-around">
                <button
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/addNew");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="font-medium">Create WhatIf</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:max-w-3xl mx-auto">
            {feed.map((post) => {
              return (
                <Card
                  username={post.username}
                  prompt={post.prompt}
                  response={post.response}
                  tone={post.tone}
                  type={post.type}
                  likeCount={post.likeCount}
                  created_at={post.created_at}
                  key={post.id}
                  userID={post.userID}
                  postID={post.id}
                  has_Liked={post.has_liked}
                  view={false}
                />
              );
            })}
          </div>
          {noMoreFeed === 1 && loadingMore && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {noMoreFeed === 0 && (
            <div className="text-center py-8 ender">
              <p className="text-gray-500 dark:text-gray-400">
                The feed has ended, but your creativity doesn't have to!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
