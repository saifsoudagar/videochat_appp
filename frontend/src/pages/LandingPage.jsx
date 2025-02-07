import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#212121] h-screen flex justify-center items-center px-3 sm:px-8">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* Header */}
        <h1 className="text-[32px] font-bold text-white text-center animate-float sm:text-[28px] md:text-[34px]">
        Find your vibe tribe – the magic begins when interests align ✨🎧
       <br />
          <span className="md:text-[20px] font-medium text-gray-400 sm:text-md">
          Don’t just talk—✨ glow up your social life!
          </span>
        </h1>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-[#3361cc] hover:bg-blue-600 active:scale-95 active:bg-blue-700 transition-all duration-200 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-blue-500/50"
          >
            Explore your vibe
          </button>
         
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
