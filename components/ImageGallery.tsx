"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
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
    <>
      <div className="relative w-full">
        {/* Main Gallery */}
        <div className="relative aspect-[4/3] bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
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
                  onSlideChange={(swiper) =>
                    setSelectedIndex(swiper.activeIndex)
                  }
                  className="w-full h-full product-swiper-dark"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container w-full h-full flex items-center justify-center bg-gray-950">
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
                className="w-full h-full cursor-grab active:cursor-grabbing bg-gray-950"
                onMouseMove={handle360Drag}
              >
                <Image
                  src={rotation360Images[get360ImageIndex()]}
                  alt={`${productName} - 360° View`}
                  fill
                  className="object-contain pointer-events-none"
                  draggable={false}
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  <span className="hidden sm:inline">Drag to rotate • </span>
                  {Math.round((rotation / 360) * 100)}%
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 z-10">
            {enable360 && rotation360Images.length > 0 && (
              <button
                onClick={() => setIs360Mode(!is360Mode)}
                className={`p-2 sm:p-2.5 rounded-lg shadow-lg transition ${
                  is360Mode
                    ? "bg-[#D6212F] text-white hover:bg-[#B51D27]"
                    : "bg-gray-900/90 text-white hover:bg-gray-800 border border-gray-700"
                }`}
                aria-label="Toggle 360° view"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
              className="bg-gray-900/90 text-white hover:bg-gray-800 border border-gray-700 p-2 sm:p-2.5 rounded-lg shadow-lg transition"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Image Counter */}
          {!is360Mode && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-lg">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-3 sm:mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition bg-gray-950 ${
                selectedIndex === index
                  ? "border-[#D6212F] shadow-lg shadow-[#D6212F]/20"
                  : "border-gray-800 hover:border-gray-700"
              }`}
              aria-label={`View image ${index + 1}`}
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

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-white p-3 rounded-full shadow-lg transition z-10"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {!is360Mode ? (
                <Swiper
                  modules={[Navigation, Pagination, Zoom]}
                  navigation
                  pagination={{ clickable: true }}
                  zoom={{ maxRatio: 5 }}
                  initialSlide={selectedIndex}
                  onSlideChange={(swiper) =>
                    setSelectedIndex(swiper.activeIndex)
                  }
                  className="w-full h-full product-swiper-dark"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                        <Image
                          src={image}
                          alt={`${productName} - View ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div
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
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .product-swiper-dark .swiper-button-next,
        .product-swiper-dark .swiper-button-prev {
          background: rgba(17, 24, 39, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgb(55, 65, 81);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
        }

        .product-swiper-dark .swiper-button-next:hover,
        .product-swiper-dark .swiper-button-prev:hover {
          background: rgba(31, 41, 55, 0.9);
          border-color: rgb(75, 85, 99);
        }

        .product-swiper-dark .swiper-button-next::after,
        .product-swiper-dark .swiper-button-prev::after {
          font-size: 16px;
        }

        .product-swiper-dark .swiper-pagination-bullet {
          background: rgb(55, 65, 81);
          opacity: 1;
        }

        .product-swiper-dark .swiper-pagination-bullet-active {
          background: #d6212f;
        }

        @media (max-width: 640px) {
          .product-swiper-dark .swiper-button-next,
          .product-swiper-dark .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .product-swiper-dark .swiper-button-next::after,
          .product-swiper-dark .swiper-button-prev::after {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
