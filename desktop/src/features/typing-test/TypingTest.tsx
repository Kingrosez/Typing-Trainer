import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface TypingTestProps {
  duration: number; // in seconds
  text?: string;
}

const TypingTest: React.FC<TypingTestProps> = ({ duration, text }) => {
  const navigate = useNavigate();
  const [testText, setTestText] = useState<string>(text || "");
  const [userInput, setUserInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errors, setErrors] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sample texts for different difficulty levels
  const sampleTexts = {
    beginner:
      "The quick brown fox jumps over the lazy dog. This is a simple sentence for beginners to practice typing.",
    intermediate:
      "Typing speed and accuracy are important skills in today's digital world. Practicing regularly helps improve these abilities significantly.",
    advanced:
      "In the realm of computer science, understanding fundamental concepts such as data structures, algorithms, and programming paradigms is crucial for developing efficient software solutions that can scale and adapt to changing requirements.",
  };

  // Initialize test text
  useEffect(() => {
    if (!text) {
      setTestText(sampleTexts.beginner);
    }
  }, [text]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      finishTest();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, timeLeft]);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Start timer on first keystroke
    if (!isRunning && value.length > 0) {
      setIsRunning(true);
    }

    setUserInput(value);
    setCurrentCharIndex(value.length);

    // Calculate accuracy and errors
    calculateMetrics(value);
  };

  // Calculate typing metrics
  const calculateMetrics = (input: string) => {
    let correctChars = 0;
    const totalChars = input.length;
    let errorCount = 0;

    for (let i = 0; i < input.length; i++) {
      if (i < testText.length && input[i] === testText[i]) {
        correctChars++;
      } else {
        errorCount++;
      }
    }

    setErrors(errorCount);

    // Calculate accuracy
    const accuracyPercent =
      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(accuracyPercent);

    // Calculate WPM (words per minute)
    if (isRunning || isFinished) {
      // WPM = (number of characters typed / 5) / minutes
      const minutes = (duration - timeLeft) / 60;
      if (minutes > 0) {
        const wpmValue = Math.round(correctChars / 5 / minutes);
        setWpm(wpmValue);
      }
    }
  };

  // Finish test and calculate final metrics
  const finishTest = () => {
    setIsRunning(false);
    setIsFinished(true);

    // Calculate final WPM and accuracy
    calculateMetrics(userInput);
  };

  // Reset the test
  const resetTest = () => {
    setUserInput("");
    setTimeLeft(duration);
    setIsRunning(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCurrentCharIndex(0);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle key press for space navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      resetTest();
    }
  };

  // Focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Typing Test
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={resetTest}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Timer and metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Time Left
            </p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {timeLeft}s
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-green-700 dark:text-green-300">WPM</p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">
              {wpm}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Accuracy
            </p>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {accuracy}%
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-red-700 dark:text-red-300">Errors</p>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200">
              {errors}
            </p>
          </div>
        </div>

        {/* Test text display */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[120px]">
          {testText.split("").map((char, index) => {
            let className = "text-gray-800 dark:text-gray-200";

            if (index < userInput.length) {
              // Character has been typed
              className =
                userInput[index] === char
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50";
            } else if (index === currentCharIndex) {
              // Current character to type
              className =
                "bg-blue-200 dark:bg-blue-800 text-gray-800 dark:text-gray-200";
            }

            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Input area */}
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isFinished}
          placeholder="Start typing here..."
          className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {/* Test finished results */}
        {isFinished && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Test Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Final WPM
                </p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {wpm}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Accuracy
                </p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {accuracy}%
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-center">
                <p className="text-sm text-red-700 dark:text-red-300">
                  Total Errors
                </p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                  {errors}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={resetTest}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start New Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTest;
