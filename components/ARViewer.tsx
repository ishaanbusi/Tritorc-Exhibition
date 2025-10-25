"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Smartphone } from "lucide-react";

interface ARViewerProps {
  modelPath: string; // .glb for Android
  modelPathIOS: string; // .usdz for iOS
  productName: string;
  poster?: string;
}

export default function ARViewer({
  modelPath,
  modelPathIOS,
  productName,
}: ARViewerProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect AR support
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /android/i.test(ua);

    setIsIOS(isIOSDevice);
    setIsARSupported(isIOSDevice || isAndroid);
  }, []);

  const handleARLaunch = () => {
    if (isIOS) {
      // iOS Quick Look
      const anchor = document.createElement("a");
      anchor.href = modelPathIOS;
      anchor.rel = "ar";
      anchor.appendChild(document.createElement("img"));
      anchor.click();
    } else {
      // Android Scene Viewer
      setShowInstructions(true);
    }
  };

  if (!isARSupported) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-center">
        <div className="bg-gray-950/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
          <Smartphone className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-gray-400 text-sm sm:text-base">
          AR mode is only available on mobile devices
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Scan the QR code with your phone to try AR
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleARLaunch}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-[#D6212F] to-[#B51D27] text-white py-3.5 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#D6212F]/20 hover:shadow-[#D6212F]/30 transition-all"
      >
        <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-base">View in Your Space (AR)</span>
      </motion.button>

      {/* Android Model Viewer - Hidden */}
      {!isIOS && (
        <div className="hidden">
          {/* @ts-ignore - model-viewer is a custom element */}
          <model-viewer
            src={modelPath}
            ar
            ar-modes="scene-viewer webxr quick-look"
            camera-controls
            auto-rotate
            loading="eager"
            alt={productName}
          />
        </div>
      )}

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  AR Instructions
                </h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D6212F] to-[#B51D27] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold shadow-lg shadow-[#D6212F]/20">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">
                      Point your camera
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Find a flat surface in your space
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D6212F] to-[#B51D27] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold shadow-lg shadow-[#D6212F]/20">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">
                      Tap to place
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      The product will appear in 3D
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D6212F] to-[#B51D27] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold shadow-lg shadow-[#D6212F]/20">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">
                      Move & rotate
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Use gestures to adjust position and size
                    </p>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <a
                href={`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
                  modelPath
                )}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`}
                className="w-full bg-gradient-to-r from-[#D6212F] to-[#B51D27] text-white py-3 sm:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#D6212F]/20 hover:shadow-[#D6212F]/30 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span className="text-sm sm:text-base">Launch AR</span>
              </a>

              {/* Tip */}
              <div className="mt-4 bg-gray-950/50 border border-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 text-center">
                  💡 Make sure you have good lighting for best results
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
