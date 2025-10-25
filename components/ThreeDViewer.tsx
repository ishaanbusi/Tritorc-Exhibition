"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Minimize2,
} from "lucide-react";
import * as THREE from "three";

// Dynamically import Canvas with no SSR
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

const OrbitControls = dynamic(
  () => import("@react-three/drei").then((mod) => mod.OrbitControls),
  { ssr: false }
);

const Environment = dynamic(
  () => import("@react-three/drei").then((mod) => mod.Environment),
  { ssr: false }
);

const ContactShadows = dynamic(
  () => import("@react-three/drei").then((mod) => mod.ContactShadows),
  { ssr: false }
);

const Html = dynamic(
  () => import("@react-three/drei").then((mod) => mod.Html),
  { ssr: false }
);

const PerspectiveCamera = dynamic(
  () => import("@react-three/drei").then((mod) => mod.PerspectiveCamera),
  { ssr: false }
);

interface ThreeDViewerProps {
  modelPath: string;
  productName?: string;
}

// Separate Model component that will be loaded dynamically
const ModelLoader = dynamic(
  () =>
    Promise.resolve(({ url }: { url: string }) => {
      const [scene, setScene] = useState<any>(null);

      useEffect(() => {
        if (typeof window === "undefined") return;

        const loadModel = async () => {
          try {
            const { useGLTF } = await import("@react-three/drei");
            const { scene: loadedScene } = useGLTF(url);
            setScene(loadedScene);
          } catch (error) {
            console.error("Error loading model:", error);
          }
        };

        loadModel();
      }, [url]);

      useEffect(() => {
        if (scene) {
          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDim;

          scene.position.sub(center);
          scene.scale.set(scale, scale, scale);
        }
      }, [scene]);

      if (!scene) return null;

      return <primitive object={scene} />;
    }),
  { ssr: false }
);

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-[#D6212F] rounded-full animate-spin" />
      <p className="text-white text-sm font-medium">Loading 3D Model...</p>
    </div>
  );
}

function CameraController({ controlsRef, onUpdate }: any) {
  const orbitRef = useRef<any>(null);
  const OrbitControlsComponent = OrbitControls as any;

  useEffect(() => {
    if (orbitRef.current && controlsRef) {
      controlsRef.current = orbitRef.current;
    }
  }, [controlsRef]);

  return (
    <OrbitControlsComponent
      ref={orbitRef}
      enableZoom
      enablePan
      enableRotate
      minDistance={3}
      maxDistance={15}
      autoRotate
      autoRotateSpeed={0.5}
      onChange={onUpdate}
    />
  );
}

export default function ThreeDViewer({
  modelPath,
  productName,
}: ThreeDViewerProps) {
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    if (!modelPath) {
      setModelAvailable(false);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const res = await fetch(modelPath, {
          method: "HEAD",
          cache: "no-store",
        });
        if (!alive) return;
        if (!res.ok) {
          console.warn("Model fetch failed:", res.status, res.statusText);
          setModelAvailable(false);
          return;
        }
        setModelAvailable(true);
      } catch (e) {
        console.warn("Model fetch error:", e);
        if (alive) setModelAvailable(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [modelPath, isMounted]);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    if (modelAvailable) {
      (async () => {
        try {
          const { useGLTF } = await import("@react-three/drei");
          useGLTF.preload(modelPath);
        } catch (e) {
          console.warn("useGLTF.preload failed:", e);
        }
      })();
    }
  }, [modelAvailable, modelPath, isMounted]);

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      const distance = camera.position.distanceTo(controls.target);
      const newDistance = Math.max(distance * 0.8, controls.minDistance);

      const direction = new THREE.Vector3();
      direction.subVectors(camera.position, controls.target).normalize();
      camera.position
        .copy(controls.target)
        .add(direction.multiplyScalar(newDistance));
      controls.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      const distance = camera.position.distanceTo(controls.target);
      const newDistance = Math.min(distance * 1.25, controls.maxDistance);

      const direction = new THREE.Vector3();
      direction.subVectors(camera.position, controls.target).normalize();
      camera.position
        .copy(controls.target)
        .add(direction.multiplyScalar(newDistance));
      controls.update();
    }
  };

  const handleReset = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.reset();
      setAutoRotate(true);
    }
  };

  const handleInteraction = () => {
    if (autoRotate) {
      setAutoRotate(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#D6212F] rounded-full animate-spin" />
          <p className="text-white text-sm font-medium">
            Initializing 3D Viewer...
          </p>
        </div>
      </div>
    );
  }

  if (modelAvailable === false) {
    return (
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-sm sm:text-base text-gray-400 font-medium">
            3D Model not available
          </p>
          <p className="text-xs text-gray-600 mt-2">Please check back later</p>
        </div>
      </div>
    );
  }

  const ViewerCanvas = ({ fullscreen = false }: { fullscreen?: boolean }) => {
    const CanvasComponent = Canvas as any;
    const PerspectiveCameraComponent = PerspectiveCamera as any;
    const EnvironmentComponent = Environment as any;
    const ContactShadowsComponent = ContactShadows as any;
    const HtmlComponent = Html as any;

    return (
      <div
        className={`relative w-full ${
          fullscreen ? "h-full" : "h-[400px] sm:h-[500px] lg:h-[600px]"
        } bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg`}
      >
        <CanvasComponent
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          onPointerDown={handleInteraction}
        >
          <PerspectiveCameraComponent makeDefault position={[0, 0, 8]} />

          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <spotLight position={[-10, 10, 10]} angle={0.3} intensity={0.8} />
          <pointLight position={[0, 5, 0]} intensity={0.5} />

          <EnvironmentComponent preset="city" />
          <ContactShadowsComponent
            position={[0, -1.4, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />

          <Suspense
            fallback={
              <HtmlComponent center>
                <LoadingSpinner />
              </HtmlComponent>
            }
          >
            {modelAvailable && <ModelLoader url={modelPath} />}
          </Suspense>

          <CameraController
            controlsRef={controlsRef}
            onUpdate={handleInteraction}
          />
        </CanvasComponent>

        {/* Control Panel */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleReset}
            className="hover:text-[#D6212F] transition text-gray-400 hover:scale-110 active:scale-95"
            aria-label="Reset view"
            title="Reset view"
          >
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-5 bg-gray-700" />
          <button
            onClick={handleZoomIn}
            className="hover:text-[#D6212F] transition text-gray-400 hover:scale-110 active:scale-95"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="hover:text-[#D6212F] transition text-gray-400 hover:scale-110 active:scale-95"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-5 bg-gray-700" />
          {!fullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="hover:text-[#D6212F] transition text-gray-400 hover:scale-110 active:scale-95"
              aria-label="Fullscreen"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          {fullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="hover:text-[#D6212F] transition text-gray-400 hover:scale-110 active:scale-95"
              aria-label="Exit fullscreen"
              title="Exit fullscreen"
            >
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Auto-rotate indicator */}
        {autoRotate && (
          <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-800 text-gray-400 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D6212F] rounded-full animate-pulse" />
            Auto-rotating
          </div>
        )}

        {/* Instructions */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium shadow-lg max-w-[90%] text-center"
            >
              <span className="hidden sm:inline">
                Click and drag to rotate • Scroll to zoom
              </span>
              <span className="sm:hidden">Drag to rotate • Pinch to zoom</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <ViewerCanvas />

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-white p-3 rounded-full shadow-lg transition z-10"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full max-w-7xl">
              <ViewerCanvas fullscreen />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
