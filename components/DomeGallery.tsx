'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Hanya memakai 3 foto kamu
const images = [
  '/1.jpeg',
  '/2.jpeg',
  '/3.jpeg',
  '/1.jpeg',
  '/2.jpeg',
  '/3.jpeg',
];

export default function DomeGallery() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a040d] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.25)_0%,transparent_70%)] pointer-events-none" />

      {/* Grid Foto 3D Simple & Light */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 max-w-4xl w-full">
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
            onClick={() => setActiveImage(src)}
            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-red-500/30 shadow-[0_0_20px_rgba(225,29,72,0.3)] cursor-pointer group"
          >
            <img
              src={src}
              alt={`Memory ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-serif">Click to view ❤️</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal Popup Saat Foto Diklik */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <motion.img
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={activeImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-3xl border-2 border-red-500 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
