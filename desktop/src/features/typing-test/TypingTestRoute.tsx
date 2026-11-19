import React from "react";
import { useLocation } from "react-router-dom";
import TypingTest from "./TypingTest";

const TypingTestRoute: React.FC = () => {
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const duration = parseInt(queryParams.get("duration") || "60", 10);
  const text = queryParams.get("text") || "";

  return <TypingTest duration={duration} text={decodeURIComponent(text)} />;
};

export default TypingTestRoute;
