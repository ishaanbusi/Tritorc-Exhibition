"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { Layers, RotateCcw } from "lucide-react";

interface ExplodedViewProps {
  modelPath: string;
  parts?: { id?: string; name: string; [key: string]: any }[];
}

function ExplodedModel({
  modelPath,
  exploded,
  selectedPart,
  onSelectPart,
}: any) {
  const { scene } = useGLTF(modelPath);

  return (
    <group>
      {scene.children.map((child, index) => {
        const offset = exploded
          ? parts[index]?.position || [0, 0, 0]
          : [0, 0, 0];
        const isSelected = selectedPart === index;

        return (
          <group
            key={index}
            position={offset}
            onClick={() => onSelectPart(index)}
          >
            <primitive object={child.clone()} scale={isSelected ? 1.1 : 1} />
            {isSelected && exploded && (
              <Html position={[0, 1, 0]}>
                <div className="bg-white rounded-lg shadow-xl p-4 min-w-[200px] -translate-x-1/2">
                  <h4 className="font-bold mb-2">{parts[index]?.name}</h4>
                  <p className="text-sm text-gray-600">
                    {parts[index]?.description}
                  </p>
                </div>
              </Html>
            )}
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
  const [selectedPart, setSelectedPart] = useState<number | null>(
    parts.length ? 0 : null
  );

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <ExplodedModel
          modelPath={modelPath}
          exploded={exploded}
          selectedPart={selectedPart}
          onSelectPart={setSelectedPart}
        />
        <OrbitControls enableZoom={true} />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg flex items-center gap-4">
        <button
          onClick={() => setExploded(!exploded)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            exploded ? "bg-primary text-white" : "hover:bg-gray-100"
          }`}
        >
          <Layers className="w-5 h-5" />
          {exploded ? "Collapse" : "Explode"}
        </button>
        <button
          onClick={() => setSelectedPart(null)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Parts List */}
      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 max-w-xs">
        <h3 className="font-bold mb-3">Components</h3>
        <ul className="space-y-2">
          {parts.length === 0 ? (
            <li className="text-sm text-gray-500">No components available.</li>
          ) : (
            parts.map((part, index) => (
              <li
                key={part.id ?? index}
                onClick={() => setSelectedPart(index)}
                className="cursor-pointer"
              >
                {part.name}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
