"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, rotation: 0 });
  const isDraggingRef = useRef(false);

  // Handle scroll snap for mobile
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || is360Mode) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.clientWidth;
      const index = Math.round(scrollLeft / itemWidth);
      setSelectedIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [is360Mode]);

  // 360 rotation handlers
  const handle360Start = useCallback(
    (clientX: number) => {
      isDraggingRef.current = true;
      dragStartRef.current = { x: clientX, rotation };
    },
    [rotation]
  );

  const handle360Move = useCallback(
    (clientX: number) => {
      if (!isDraggingRef.current || !is360Mode) return;
      const deltaX = clientX - dragStartRef.current.x;
      const newRotation = (dragStartRef.current.rotation + deltaX * 0.5) % 360;
      setRotation(newRotation < 0 ? newRotation + 360 : newRotation);
    },
    [is360Mode]
  );

  const handle360End = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const get360ImageIndex = useCallback(() => {
    const totalImages = rotation360Images.length;
    const index = Math.floor((rotation / 360) * totalImages);
    return Math.abs(index) % totalImages;
  }, [rotation, rotation360Images.length]);

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
    }
    setSelectedIndex(index);
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <>
      <div className="relative w-full">
        {/* Main Gallery */}
        <div className="relative aspect-[4/3] bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          {!is360Mode ? (
            <div
              ref={scrollRef}
              className="w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide flex"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 snap-center relative"
                  onClick={toggleZoom}
                >
                  <Image
                    src={image}
                    alt={`${productName} - View ${index + 1}`}
                    fill
                    className={`object-contain transition-transform duration-300 ${
                      isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="w-full h-full cursor-grab active:cursor-grabbing bg-gray-950 relative touch-none"
              onMouseDown={(e) => handle360Start(e.clientX)}
              onMouseMove={(e) => handle360Move(e.clientX)}
              onMouseUp={handle360End}
              onMouseLeave={handle360End}
              onTouchStart={(e) => handle360Start(e.touches[0].clientX)}
              onTouchMove={(e) => handle360Move(e.touches[0].clientX)}
              onTouchEnd={handle360End}
            >
              <Image
                src={rotation360Images[get360ImageIndex()]}
                alt={`${productName} - 360° View`}
                fill
                className="object-contain pointer-events-none select-none"
                draggable={false}
                priority
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                <span className="hidden sm:inline">Drag to rotate • </span>
                {Math.round((rotation / 360) * 100)}%
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2 z-10">
            {enable360 && rotation360Images.length > 0 && (
              <button
                onClick={() => {
                  setIs360Mode(!is360Mode);
                  setIsZoomed(false);
                }}
                className={`p-2 sm:p-2.5 rounded-lg shadow-lg transition-colors ${
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
              className="bg-gray-900/90 text-white hover:bg-gray-800 border border-gray-700 p-2 sm:p-2.5 rounded-lg shadow-lg transition-colors"
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

          {/* Navigation Arrows - Desktop */}
          {!is360Mode && images.length > 1 && (
            <>
              <button
                onClick={() => scrollToImage(Math.max(0, selectedIndex - 1))}
                disabled={selectedIndex === 0}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/90 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 text-white w-10 h-10 items-center justify-center rounded-full shadow-lg transition-colors z-10"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  scrollToImage(Math.min(images.length - 1, selectedIndex + 1))
                }
                disabled={selectedIndex === images.length - 1}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/90 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 text-white w-10 h-10 items-center justify-center rounded-full shadow-lg transition-colors z-10"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-3 sm:mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all bg-gray-950 ${
                selectedIndex === index
                  ? "border-[#D6212F] shadow-lg shadow-[#D6212F]/20 scale-105"
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
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {!is360Mode ? (
              <div className="relative w-full h-full">
                <Image
                  src={images[selectedIndex]}
                  alt={`${productName} - View ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedIndex(Math.max(0, selectedIndex - 1))
                      }
                      disabled={selectedIndex === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/90 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-colors text-2xl"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setSelectedIndex(
                          Math.min(images.length - 1, selectedIndex + 1)
                        )
                      }
                      disabled={selectedIndex === images.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/90 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-colors text-2xl"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                  {selectedIndex + 1} / {images.length}
                </div>
              </div>
            ) : (
              <div
                className="w-full h-full cursor-grab active:cursor-grabbing relative touch-none"
                onMouseDown={(e) => handle360Start(e.clientX)}
                onMouseMove={(e) => handle360Move(e.clientX)}
                onMouseUp={handle360End}
                onMouseLeave={handle360End}
                onTouchStart={(e) => handle360Start(e.touches[0].clientX)}
                onTouchMove={(e) => handle360Move(e.touches[0].clientX)}
                onTouchEnd={handle360End}
              >
                <Image
                  src={rotation360Images[get360ImageIndex()]}
                  alt={`${productName} - 360° View`}
                  fill
                  className="object-contain pointer-events-none select-none"
                  draggable={false}
                  priority
                />
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
