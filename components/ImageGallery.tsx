"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  enable360?: boolean;
  rotation360Images?: string[];
}

export default function ImageGallery({
  images,
  productName,
  enable360 = false,
  rotation360Images = [],
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handle360Drag = (e: React.MouseEvent) => {
    if (!is360Mode) return;
    const movement = e.movementX;
    setRotation((prev) => (prev + movement) % 360);
  };

  const get360ImageIndex = () => {
    const totalImages = rotation360Images.length;
    const index = Math.floor((rotation / 360) * totalImages);
    return Math.abs(index) % totalImages;
  };

  return (
    <div className="relative w-full">
      {/* Main Gallery */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {!is360Mode ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <Swiper
                modules={[Navigation, Pagination, Zoom]}
                navigation
                pagination={{ clickable: true }}
                zoom={{ maxRatio: 3 }}
                onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)}
                className="w-full h-full"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                      <Image
                        src={image}
                        alt={`${productName} - View ${index + 1}`}
                        fill
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          ) : (
            <motion.div
              key="360"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseMove={handle360Drag}
            >
              <Image
                src={rotation360Images[get360ImageIndex()]}
                alt={`${productName} - 360° View`}
                fill
                className="object-contain pointer-events-none"
                draggable={false}
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                Drag to rotate • {Math.round((rotation / 360) * 100)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {enable360 && rotation360Images.length > 0 && (
            <button
              onClick={() => setIs360Mode(!is360Mode)}
              className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-lg transition"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 2a10 10 0 0 1 0 20" strokeWidth="2" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(true)}
            className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-lg transition"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
              selectedIndex === index ? "border-primary" : "border-transparent"
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
