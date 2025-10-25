"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { Maximize2, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ThreeDViewerProps {
  modelPath: string;
  productName?: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

export default function ThreeDViewer({
  modelPath,
  productName,
}: ThreeDViewerProps) {
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!modelPath) {
      setModelAvailable(false);
      return;
    }
    let alive = true;
    (async () => {
      try {
        // Fetch HEAD or small GET to validate resource (avoid parsing)
        const res = await fetch(modelPath, {
          method: "GET",
          cache: "no-store",
        });
        if (!alive) return;
        if (!res.ok) {
          console.warn("Model fetch failed:", res.status, res.statusText);
          setModelAvailable(false);
          return;
        }
        // optionally check size header
        const length = res.headers.get("content-length");
        if (length !== null && parseInt(length, 10) === 0) {
          console.warn("Model response empty (content-length = 0)");
          setModelAvailable(false);
          return;
        }
        // mark available
        setModelAvailable(true);
      } catch (e) {
        console.warn("Model fetch error:", e);
        if (alive) setModelAvailable(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [modelPath]);

  useEffect(() => {
    if (modelAvailable) {
      try {
        // preload model for smoother Suspense load
        useGLTF.preload(modelPath);
      } catch (e) {
        console.warn("useGLTF.preload failed:", e);
      }
    }
  }, [modelAvailable, modelPath]);

  if (modelAvailable === false) {
    return (
      <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
        <div className="text-sm text-red-600 bg-white/80 px-4 py-2 rounded">
          Model not found or invalid.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.3} intensity={0.5} />

        <Environment preset="studio" />
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />

        <Suspense fallback={<Html center>Loading model…</Html>}>
          {modelAvailable ? (
            <Model url={modelPath} />
          ) : (
            <Html center>Checking model…</Html>
          )}
        </Suspense>

        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          minDistance={2}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg flex items-center gap-4">
        <button className="hover:text-primary transition">
          <RotateCw className="w-5 h-5" />
        </button>
        <button className="hover:text-primary transition">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button className="hover:text-primary transition">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button className="hover:text-primary transition">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-sm"
      >
        Click and drag to rotate • Scroll to zoom
      </motion.div>
    </div>
  );
}
