import { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "../glassRadio.css";

export function WhatIfs() {
  const [input, setInput] = useState("");
  const [option, setOption] = useState("news");
  const [tone, setTone] = useState("Mythical");
  const [publi, setPubli] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function generate() {
    // Reset states
    setError("");
    setSuccessMessage("");

    if (!input || !option || !tone) {
      setError("Please fill in all required fields");
      return;
    }

    // Prevent using the image option as it's coming soon
    if (option === "image") {
      setError(
        "The Image Description feature is coming soon! Please select another format."
      );
      return;
    }

    setLoading(true);

    try {
      let username = localStorage.getItem("username");
      const response = await api.post("/generate", {
        prompt: `What if ${input}`,
        option: option,
        tone: tone,
        publi: publi,
        username: username,
      });
      if (
        response.data.message == "Model is overloaded. Try again in few seconds"
      ) {
        setError(response.data.message);
      } else if (response.data.message == "error") {
        setError("There is an error. Please try again later");
      } else {
        setSuccessMessage("Your WhatIf has been created !");
      }

      // Clear input field after successful creation
      setInput("");

      // After a successful creation, wait briefly and redirect to feed/profile
      setTimeout(() => {
        navigate("/post/" + response.data.postId);
      }, 2000);
    } catch (err) {
      console.log(err);
      if (err.response.data.message == "Glitch in the matrix") {
        setError("Glitch in the matrix");
      } else {
        setError("Failed to create your WhatIf. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Function to get option descriptions
  const getOptionDescription = (optionType) => {
    switch (optionType) {
      case "news":
        return "A punchy headline as if this scenario is breaking news";
      case "tweet":
        return "A short, engaging social media post with under 280 characters";
      case "article":
        return "A brief article with a clear beginning, middle, and end";
      case "dialogue":
        return "A conversation between two people about this scenario";
      case "timeline":
        return "A chronological sequence of events following this scenario";
      case "image":
        return "A textual description of what this scenario would look like";
      default:
        return "";
    }
  };

  // Function to get tone descriptions
  const getToneDescription = (toneType) => {
    switch (toneType) {
      case "Mythical":
        return "Fantastical, legendary, otherworldly";
      case "Dark":
        return "Somber, mysterious, sometimes unsettling";
      case "Scientific":
        return "Factual, analytical, evidence-based";
      case "Absurd":
        return "Ridiculous, illogical, comically strange";
      case "Humorous":
        return "Funny, witty, lighthearted";
      default:
        return "";
    }
  };

  return (
    <div className="container-fluid py-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Create a New WhatIf
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label
              htmlFor="whatif-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              What if...
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                What if
              </span>
              <input
                id="whatif-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="dinosaurs never went extinct"
                className="input rounded-l-none flex-1"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Be creative! Your scenario can be realistic or completely
              fantastical.
            </p>
          </div>

          {/* Format Selection */}
          <div>
            <label
              htmlFor="options"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Format
            </label>
            <select
              id="options"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              className="input"
              disabled={loading}
            >
              <option value="news">News Headline</option>
              <option value="tweet">Tweet</option>
              <option value="article">Mini Article</option>
              <option value="dialogue">Dialogue</option>
              <option value="timeline">Alternate Timeline</option>
              <option value="image" disabled className="text-gray-400">
                Image Description ✨ Coming Soon ✨
              </option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {getOptionDescription(option)}
            </p>
          </div>

          {/* Tone Selection */}
          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input"
              disabled={loading}
            >
              <option value="Mythical">Mythical</option>
              <option value="Dark">Dark</option>
              <option value="Scientific">Scientific</option>
              <option value="Absurd">Absurd</option>
              <option value="Humorous">Humorous</option>
              <option value="Historical">Historical</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {getToneDescription(tone)}
            </p>
          </div>

          {/* Visibility Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Visibility
            </label>
            <div className="glass-radio-group">
              <input
                type="radio"
                name="visibility"
                id="visibility-public"
                checked={publi === 1}
                onChange={() => setPubli(1)}
                disabled={loading}
              />
              <label htmlFor="visibility-public">Public</label>
              <input
                type="radio"
                name="visibility"
                id="visibility-private"
                checked={publi === 0}
                onChange={() => setPubli(0)}
                disabled={loading}
              />
              <label htmlFor="visibility-private">Private</label>

              <div className="glass-glider"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Public WhatIfs will appear in everyone's feed. Private ones are
              only visible to you.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={generate}
            className="btn btn-primary w-full py-3 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate the World"
            )}
          </button>
        </div>
      </div>

      {/* Preview Section - Could be expanded later */}
    </div>
  );
}
