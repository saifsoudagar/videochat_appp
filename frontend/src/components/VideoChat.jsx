// frontend/src/components/VideoChat.jsx
import { useEffect, useRef } from 'react';

const VideoChat = ({ localStream, remoteStream }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="grid grid-cols-2 gap-4 ">
      <div className="bg-black rounded-lg overflow-hidden">
        <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
      </div>
      {remoteStream && (
        <div className="bg-black rounded-lg overflow-hidden">
          <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

export default VideoChat;
