"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-6 right-6 z-50 ${
            isOnline ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3`}
        >
          {isOnline ? (
            <Wifi className="w-6 h-6" />
          ) : (
            <WifiOff className="w-6 h-6" />
          )}
          <div>
            <div className="font-bold">
              {isOnline ? "Back Online" : "You are offline"}
            </div>
            <div className="text-sm opacity-90">
              {isOnline
                ? "All features are now available"
                : "Viewing cached content"}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
