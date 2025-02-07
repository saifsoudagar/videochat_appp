// frontend/src/pages/ChatPage.jsx
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Peer from "simple-peer";
import MatchButton from "../components/MatchButton";
import VideoChat from "../components/VideoChat";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user, logout } = useAuth();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [partnerSocketId, setPartnerSocketId] = useState(null);

  const socketRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        console.log("Local stream obtained:", stream);

        // Connect to Socket.io server
        socketRef.current = io("http://localhost:5000", {
          query: { userId: user.userId },
        });

        socketRef.current.on("connect", () => {
          console.log("Socket connected:", socketRef.current.id);
        });

        // Listen for match-found event
        socketRef.current.on("match-found", ({ partnerSocketId }) => {
          console.log("Match found with partnerSocketId:", partnerSocketId);
          setIsMatched(true);
          setPartnerSocketId(partnerSocketId);
          initiatePeerConnection(partnerSocketId, stream);
        });

        // Listen for signaling data
        socketRef.current.on("signal", ({ from, signal }) => {
          console.log("Received signal from:", from, signal);
          if (peerRef.current) {
            peerRef.current.signal(signal);
          }
        });

        // Listen for partner disconnection if implemented on server
        socketRef.current.on("partner-disconnected", () => {
          console.log("Partner disconnected.");
          handleDisconnect();
        });
      })
      .catch((err) => console.error("Error accessing media devices:", err));

    return () => {
      handleDisconnect();
    };
  }, [user.userId]);

  const initiatePeerConnection = (partnerSocketId, stream) => {
    // Decide which peer is initiator based on socket ids
    const isInitiator = socketRef.current.id < partnerSocketId;
    const peer = new Peer({ initiator: isInitiator, trickle: false, stream });

    peer.on("signal", (signal) => {
      console.log("Sending signal to partner:", partnerSocketId, signal);
      socketRef.current.emit("signal", { target: partnerSocketId, signal });
    });

    peer.on("stream", (remoteStream) => {
      console.log("Remote stream received:", remoteStream);
      setRemoteStream(remoteStream);
    });

    peer.on("close", () => {
      console.log("Peer connection closed.");
      handleDisconnect();
    });

    peer.on("error", (err) => console.error("Peer error:", err));

    peerRef.current = peer;
  };

  const handleDisconnect = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
      console.log("Destroyed peer connection.");
    }
    if (socketRef.current) {
      socketRef.current.emit("leave-chat");
    }
    setRemoteStream(null);
    setIsMatched(false);
    setPartnerSocketId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-[#212121] text-white">
      {/* Navigation Bar */}
      <nav className="bg-[#27272b] shadow-md p-4 px-6 flex justify-between items-center">
        <h1 className="md:text-[34px] text-xl font-bold">Soulmegle</h1>
        <div className="flex items-center space-x-4">
          <MatchButton
            userId={user.userId}
            socket={socketRef.current}
            isMatched={isMatched}
            interests={user.interests} // Pass interests from user object
            handleDisconnect={handleDisconnect}
          />
          <button 
            onClick={logout} 
            className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-200 text-white px-6 py-3 rounded-full"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-[#1E1E1E] p-4 py-auto flex flex-row justify-between">
        {/* Video Chat Section */}
        <div className="flex-1 mr-4">
          <VideoChat localStream={localStream} remoteStream={remoteStream} />
        </div>

        {/* Chat Box Section (Right-hand side) */}
        {isMatched && partnerSocketId && (
          <div className="w-1/3">
            <ChatBox socket={socketRef.current} partnerSocketId={partnerSocketId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
