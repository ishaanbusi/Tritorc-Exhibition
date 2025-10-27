"use client";

import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Layers, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Part {
  id?: string;
  name: string;
  description?: string;
  position?: [number, number, number];
  [key: string]: unknown;
}

interface ExplodedViewProps {
  modelPath: string;
  parts?: Part[];
}

interface ExplodedModelProps {
  modelPath: string;
  exploded: boolean;
  selectedPart: number | null;
  onSelectPart: (index: number) => void;
  parts: Part[];
}

function ExplodedModel({
  modelPath,
  exploded,
  selectedPart,
  onSelectPart,
  parts,
}: ExplodedModelProps) {
  const { scene } = useGLTF(modelPath);

  // Memoize cloned children to prevent recreating on every render
  const children = useMemo(() => {
    return scene.children.map((child) => child.clone());
  }, [scene]);

  return (
    <group>
      {children.map((child, index) => {
        // Calculate position only when exploded changes
        const offset =
          exploded && parts[index]?.position
            ? parts[index].position
            : [0, 0, 0];
        const isSelected = selectedPart === index;

        return (
          <group
            key={index}
            position={offset as [number, number, number]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart(index);
            }}
          >
            <primitive object={child} scale={isSelected ? 1.1 : 1} />
          </group>
        );
      })}
    </group>
  );
}

export default function ExplodedView({
  modelPath,
  parts = [],
}: ExplodedViewProps) {
  const [exploded, setExploded] = useState(false);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);

  // Generate default positions if not provided
  const partsWithPositions = useMemo(() => {
    return parts.map((part, index) => ({
      ...part,
      position:
        part.position ||
        ([
          Math.cos((index / parts.length) * Math.PI * 2) * 2,
          Math.sin((index / parts.length) * Math.PI * 2) * 2,
          0,
        ] as [number, number, number]),
    }));
  }, [parts]);

  const selectedPartData =
    selectedPart !== null ? partsWithPositions[selectedPart] : null;

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: false }} // Disable antialiasing for better performance
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow={false}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        <ExplodedModel
          modelPath={modelPath}
          exploded={exploded}
          selectedPart={selectedPart}
          onSelectPart={setSelectedPart}
          parts={partsWithPositions}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxDistance={20}
          minDistance={5}
        />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setExploded(!exploded)}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition text-sm font-semibold ${
            exploded
              ? "bg-[#D6212F] text-white shadow-lg shadow-[#D6212F]/20"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">
            {exploded ? "Collapse" : "Explode"}
          </span>
        </button>
        <div className="w-px h-5 bg-gray-700" />
        <button
          onClick={() => setSelectedPart(null)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition"
          title="Reset selection"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Parts List */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl p-3 sm:p-4 max-w-[200px] sm:max-w-xs shadow-lg"
      >
        <h3 className="font-bold text-white mb-3 text-sm sm:text-base flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D6212F]" />
          Components
        </h3>
        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5 sm:space-y-2">
            {parts.length === 0 ? (
              <li className="text-xs sm:text-sm text-gray-500">
                No components available.
              </li>
            ) : (
              parts.map((part, index) => (
                <li
                  key={part.id ?? index}
                  onClick={() => setSelectedPart(index)}
                  className={`cursor-pointer text-xs sm:text-sm px-3 py-2 rounded-lg transition ${
                    selectedPart === index
                      ? "bg-[#D6212F] text-white font-medium shadow-lg shadow-[#D6212F]/20"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {part.name}
                </li>
              ))
            )}
          </ul>
        </div>
      </motion.div>

      {/* Selected Part Info Modal */}
      <AnimatePresence>
        {selectedPartData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-4 max-w-md"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-white text-base sm:text-lg">
                {selectedPartData.name}
              </h4>
              <button
                onClick={() => setSelectedPart(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              {selectedPartData.description || "No description available"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!exploded && (
        <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-800 text-gray-400 px-3 py-2 rounded-lg text-xs sm:text-sm">
          Click &quot;Explode&quot; to separate components
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d6212f;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b51d27;
        }
      `}</style>
    </div>
  );
}
