"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RotateCw, ZoomIn } from "lucide-react";

interface ARViewerProps {
  modelPath: string; // .glb for Android
  modelPathIOS: string; // .usdz for iOS
  productName: string;
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
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">
          AR mode is only available on mobile devices
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleARLaunch}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-primary to-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg"
      >
        <Camera className="w-6 h-6" />
        View in Your Space (AR)
      </motion.button>

      {/* Android Model Viewer */}
      {!isIOS && (
        <model-viewer
          src={modelPath}
          ar
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          className="hidden"
        />
      )}

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">AR Instructions</h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Point your camera</p>
                    <p className="text-gray-600 text-sm">
                      Find a flat surface in your space
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Tap to place</p>
                    <p className="text-gray-600 text-sm">
                      The product will appear in 3D
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Move & rotate</p>
                    <p className="text-gray-600 text-sm">
                      Use gestures to adjust position and size
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
                  modelPath
                )}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`}
                className="mt-6 w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Launch AR
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
