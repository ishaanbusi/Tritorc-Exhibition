"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion } from "framer-motion";

interface VideoSectionProps {
  videos: string[];
  productName: string;
}

export default function VideoSection({
  videos,
  productName,
}: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Product in Action</h3>

      {/* Main Video Player */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
        <video
          ref={videoRef}
          src={videos[activeVideo]}
          className="w-full h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Controls Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6"
        >
          <div className="w-full flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3" />
            </div>

            <button
              onClick={toggleMute}
              className="text-white hover:text-primary transition"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Video Selector */}
      <div className="grid grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => setActiveVideo(index)}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition ${
              activeVideo === index ? "border-primary" : "border-gray-200"
            }`}
          >
            <video src={video} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
