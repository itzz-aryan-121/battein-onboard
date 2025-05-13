'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WaveBackground from '../components/WaveBackground';

export default function VideoCallPage() {
  const router = useRouter();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [callerName, setCallerName] = useState('Aryan Tomar');
  
  // Sample duration timer
  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isConnected]);
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // In a real app, you would initialize WebRTC here
  useEffect(() => {
    // Simulating getting local camera for demo
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          // For demo, we'll just clone the stream to the remote video
          // In a real app, this would come from the peer connection
          setTimeout(() => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream.clone();
            }
          }, 1000);
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
        });
    }
    
    return () => {
      // Cleanup: stop all tracks when component unmounts
      const localStream = localVideoRef.current?.srcObject as MediaStream;
      const remoteStream = remoteVideoRef.current?.srcObject as MediaStream;
      
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Handle toggling mic
  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };
  
  // Handle toggling camera
  const toggleCamera = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isCameraOff;
      });
      setIsCameraOff(!isCameraOff);
    }
  };
  
  // Handle ending call
  const endCall = () => {
    // In a real app, you would close the peer connection here
    router.push('/dashboard');
  };
  
  return (
    <div className="flex flex-col bg-gray-900 min-h-screen relative overflow-hidden">
      {/* Main Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video (Full screen) */}
        <div className="absolute inset-0 bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Call Duration */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 rounded-full px-4 py-1 text-white text-sm font-medium">
            {formatDuration(callDuration)}
          </div>
          
          {/* Caller Name */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-white text-xl font-medium">
            {callerName}
          </div>
        </div>
        
        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-32 right-6 w-32 h-44 rounded-xl overflow-hidden border-2 border-white shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted // Always mute local video to prevent feedback
            className="w-full h-full object-cover"
          />
          
          {/* Camera Off Overlay */}
          {isCameraOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-8 8m0-8l8 8m-8-8v12m16-12v12M4 20h16" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center gap-4 z-10">
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm px-8 py-4 rounded-full flex items-center gap-8">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-90 transition-colors`}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          
          {/* End Call Button */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-8 8m0-8l8 8m-8-8v12m16-12v12M4 20h16" />
            </svg>
          </button>
          
          {/* Camera Toggle Button */}
          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full ${isCameraOff ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-90 transition-colors`}
          >
            {isCameraOff ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Wave Background Component - with lower opacity to fit dark theme */}
      <div className="opacity-30">
        <WaveBackground height={180} />
      </div>
    </div>
  );
} 