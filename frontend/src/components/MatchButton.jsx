// frontend/src/components/MatchButton.jsx
import { useState, useEffect } from "react";

const MatchButton = ({ userId, socket, isMatched, interests, handleDisconnect }) => {
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if (!isMatched) {
      setIsMatching(false);
    }
  }, [isMatched]);

  const handleClick = () => {
    if (!socket) return;
    if (isMatched) {
      handleDisconnect();
    } else {
      if (!Array.isArray(interests) || interests.length === 0) {
        alert("Please select some interests before matching!");
        return;
      }
      setIsMatching(true);
      // Emit "find-match" with both userId and interests for interest-based matching
      socket.emit("find-match", { userId, interests });
    }
  };

  let buttonText = "Find Match";
  if (isMatching && !isMatched) {
    buttonText = "Finding Match...";
  } else if (isMatched) {
    buttonText = "Disconnect";
  }

  return (
    <button
      onClick={handleClick}
      disabled={!socket || (isMatching && !isMatched)}
      className="bg-[#3361cc] hover:bg-blue-600 text-white px-6 py-3 rounded-full disabled:opacity-50"
    >
      {buttonText}
    </button>
  );
};

export default MatchButton;
