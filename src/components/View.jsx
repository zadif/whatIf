import { useEffect, useState } from "react";
import api from "./api";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card } from "./Card";

export function View() {
  let { postID } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isValidNonNegativeInteger = (value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  };

  async function fetchPostData() {
    setLoading(true);
    setError(null);

    try {
      if (!isValidNonNegativeInteger(postID)) {
        setError("Invalid PostId");
        return;
      }

      const response = await api.get(`/whatIf/${postID}`);

      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error("Post not found or empty response received");
      }

      setPost(response.data);
      return response;
    } catch (err) {
      console.error("Error fetching post data: ", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load post"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPostData();
  }, [postID]);

  // Update meta tags when post data changes
  useEffect(() => {
    if (post && post.prompt) {
      // Update page title
      document.title = `${post.prompt} - What If`;

      // Helper function to update or create meta tag
      const updateMetaTag = (attr, attrValue, content) => {
        let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
        if (element) {
          element.setAttribute("content", content);
        } else {
          element = document.createElement("meta");
          element.setAttribute(attr, attrValue);
          element.setAttribute("content", content);
          document.head.appendChild(element);
        }
      };

      // Strip HTML tags from response for description
      const description = post.response
        ? post.response.replace(/<[^>]*>/g, "").slice(0, 200) + "..."
        : "Explore endless possibilities and scenarios";

      // Open Graph tags
      updateMetaTag("property", "og:title", post.prompt);
      updateMetaTag("property", "og:description", description);
      updateMetaTag("property", "og:type", "article");
      updateMetaTag(
        "property",
        "og:url",
        `https://whatif.qzz.io/post/${postID}`
      );
      updateMetaTag("property", "og:image", "https://whatif.qzz.io/logo.jpg");

      // Twitter Card tags
      updateMetaTag("name", "twitter:card", "summary_large_image");
      updateMetaTag("name", "twitter:title", post.prompt);
      updateMetaTag("name", "twitter:description", description);
      updateMetaTag("name", "twitter:image", "https://whatif.qzz.io/logo.jpg");

      // Standard meta description
      updateMetaTag("name", "description", description);
    }

    // Cleanup function to reset to default
    return () => {
      document.title = "What If";
    };
  }, [post, postID]);

  const handleRetry = () => {
    fetchPostData();
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading post...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-6 mx-auto max-w-2xl my-8 tryAgain">
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
            Error Loading Post
          </h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
        <div className="flex space-x-4">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No data found (post exists in response but has no content)
  if (!post || Object.keys(post).length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-6 mx-auto max-w-2xl my-8">
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-500 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
            Post Not Found
          </h3>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Success state - render the card with post data
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
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
        view={true}
      />
      {!localStorage.getItem("username") && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-6 mt-6 text-center">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">
            Join the Community
          </h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Login to turn your 'What Ifs' into reality and discover others
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
