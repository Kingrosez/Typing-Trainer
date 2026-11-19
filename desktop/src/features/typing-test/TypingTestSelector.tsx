import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TypingTestSelector: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [customText, setCustomText] = useState<string>("");
  const [useCustomText, setUseCustomText] = useState<boolean>(false);

  const durations = [15, 30, 60, 120];

  const handleStartTest = () => {
    if (useCustomText && customText.trim()) {
      navigate(
        `/typing-test?duration=${selectedDuration}&text=${encodeURIComponent(customText)}`,
      );
    } else {
      navigate(`/typing-test?duration=${selectedDuration}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Typing Test
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Select Duration
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedDuration === duration
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {duration} seconds
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Test Options
          </h2>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="customText"
              checked={useCustomText}
              onChange={(e) => setUseCustomText(e.target.checked)}
              className="mr-2 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="customText"
              className="text-gray-700 dark:text-gray-300"
            >
              Use custom text
            </label>
          </div>

          {useCustomText && (
            <div className="mb-4">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter your custom text here..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStartTest}
            disabled={!useCustomText && !customText.trim()}
            className={`px-8 py-3 rounded-lg text-lg font-semibold transition-colors ${
              useCustomText && customText.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypingTestSelector;
