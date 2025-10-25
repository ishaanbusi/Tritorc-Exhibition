"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next video if available
      if (activeVideo < videos.length - 1) {
        setActiveVideo(activeVideo + 1);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeVideo, videos.length]);

  useEffect(() => {
    // Reset when video changes
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeVideo]);

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
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration
      );
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 10,
        0
      );
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const goToNextVideo = () => {
    if (activeVideo < videos.length - 1) {
      setActiveVideo(activeVideo + 1);
    }
  };

  const goToPreviousVideo = () => {
    if (activeVideo > 0) {
      setActiveVideo(activeVideo - 1);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-2xl sm:text-3xl font-bold text-white">
        Product in Action
      </h3>

      {/* Main Video Player */}
      <div
        className="relative aspect-video bg-black border border-gray-800 rounded-xl overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videos[activeVideo]}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
        />

        {/* Play button overlay (when paused) */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D6212F] hover:bg-[#B51D27] rounded-full flex items-center justify-center shadow-2xl shadow-[#D6212F]/50 transition-all hover:scale-110">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        <AnimatePresence>
          {(showControls || !isPlaying) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-6"
            >
              {/* Progress Bar */}
              <div
                className="w-full h-1 sm:h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3 sm:mb-4 cursor-pointer group/progress"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#D6212F] to-[#FF4757] transition-all relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="w-full flex items-center gap-2 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="bg-gray-900/80 hover:bg-gray-800 backdrop-blur-sm p-2 sm:p-3 rounded-full transition border border-gray-700"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={skipBackward}
                  className="hidden sm:block text-white hover:text-[#D6212F] transition"
                  title="Skip back 10s"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={skipForward}
                  className="hidden sm:block text-white hover:text-[#D6212F] transition"
                  title="Skip forward 10s"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Time Display */}
                <div className="text-white text-xs sm:text-sm font-medium tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <div className="flex-1" />

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#D6212F] transition"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-[#D6212F] transition"
                >
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Counter */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-800 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
          {activeVideo + 1} / {videos.length}
        </div>
      </div>

      {/* Video Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => setActiveVideo(index)}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition bg-black group/thumb ${
              activeVideo === index
                ? "border-[#D6212F] shadow-lg shadow-[#D6212F]/20"
                : "border-gray-800 hover:border-gray-700"
            }`}
          >
            <video
              src={video}
              className="w-full h-full object-cover"
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/60 transition flex items-center justify-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition ${
                  activeVideo === index
                    ? "bg-[#D6212F]"
                    : "bg-gray-900/80 group-hover/thumb:bg-gray-800"
                }`}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
              </div>
            </div>
            {activeVideo === index && (
              <div className="absolute top-2 right-2 bg-[#D6212F] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Playing
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Navigation Buttons (Mobile) */}
      {videos.length > 1 && (
        <div className="flex gap-3 sm:hidden">
          <button
            onClick={goToPreviousVideo}
            disabled={activeVideo === 0}
            className="flex-1 bg-gray-900/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-800 text-white px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <SkipBack className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={goToNextVideo}
            disabled={activeVideo === videos.length - 1}
            className="flex-1 bg-gray-900/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-800 text-white px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            Next
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
