'use client';

import React, { useState, useRef } from 'react';
import InteractionFlow from '@/components/InteractionFlow';
import DomeGallery from '@/components/DomeGallery';

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFlowComplete = () => {
    setShowGallery(true);
    // Putar lagu music1.mp3 secara otomatis setelah interaksi selesai
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.log('Audio autoplay blocked:', err));
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a040d] text-white">
      {/* Audio Pemutar Musik */}
      <audio ref={audioRef} src="/music1.mp3" loop preload="auto" />

      {!showGallery ? (
        <InteractionFlow onFlowComplete={handleFlowComplete} />
      ) : (
        <DomeGallery />
      )}
    </main>
  );
}
