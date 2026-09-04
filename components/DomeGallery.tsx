'use client';

import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useGesture } from '@use-gesture/react';

type ImageItem = string | { src: string; alt?: string; caption?: string };

type DomeGalleryProps = {
  images?: ImageItem[];
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
  autoRotationSpeed?: number;
};

type ItemDef = {
  src: string;
  alt: string;
  caption: string;
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
};

// DEFAULT IMAGES DENGAN CAPTION KHUSUS GAME MOBILE LEGENDS
const DEFAULT_IMAGES: ImageItem[] = [
  { src: '/1.jpeg', alt: 'MLBB Lobby', caption: 'Waiting in the lobby for our next match 🎮✨' },
  { src: '/2.jpeg', alt: 'MLBB Loading Screen', caption: 'Loading into the battlefield together ⚔️🌸' },
  { src: '/3.jpeg', alt: 'MLBB In Game', caption: 'Carrying each other all the way to victory 🏆❤️' },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

function buildItems(pool: ImageItem[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '', caption: '' }));
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '', caption: 'Our gaming core memory 🎮' };
    }
    return { 
      src: image.src || '', 
      alt: image.alt || '', 
      caption: image.caption || 'Duo queue moments ⚔️' 
    };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt,
    caption: usedImages[i].caption
  }));
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.6,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#0a040d',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '340px',
  openedImageHeight = '340px',
  imageBorderRadius = '16px',
  openedImageBorderRadius = '24px',
  grayscale = false,
  autoRotationSpeed = 0.12
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<{ src: string; caption: string } | null>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = useCallback((xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      let radius = clamp(minDim * fit, minRadius, maxRadius);

      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, minRadius, maxRadius, overlayBlurColor, imageBorderRadius, openedImageBorderRadius, applyTransform]);

  useEffect(() => {
    if (autoRotationSpeed === 0) return;
    let rafId: number;
    const rotate = () => {
      if (!draggingRef.current && !selectedImg) {
        rotationRef.current.y = wrapAngleSigned(rotationRef.current.y + autoRotationSpeed);
        applyTransform(rotationRef.current.x, rotationRef.current.y);
      }
      rafId = requestAnimationFrame(rotate);
    };
    rafId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(rafId);
  }, [autoRotationSpeed, selectedImg, applyTransform]);

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (selectedImg) return;
        const evt = event as PointerEvent;
        draggingRef.current = true;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
      },
      onDrag: ({ event, last }) => {
        if (selectedImg || !draggingRef.current || !startPosRef.current) return;
        const evt = event as PointerEvent;
        const dx = evt.clientX - startPosRef.current.x;
        const dy = evt.clientY - startPosRef.current.y;

        const nextX = clamp(startRotRef.current.x - dy / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = startRotRef.current.y + dx / dragSensitivity;

        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);

        if (last) {
          draggingRef.current = false;
          startPosRef.current = null;
        }
      }
    },
    { target: mainRef, eventOptions: { passive: false } }
  );

  return (
    <div ref={rootRef} className="relative w-full h-full overflow-hidden bg-[#0a040d] text-[#ffe4e6] select-none">
      
      {/* GLOW BACKGROUND SPIDERMAN */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.2)_0%,transparent_70%)] pointer-events-none" />

      {/* SPHERE GALLERY CONTAINER */}
      <div ref={mainRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center perspective-[1000px]">
        <div
          ref={sphereRef}
          className="relative w-full h-full style-3d transition-transform duration-75 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, idx) => {
            const unit = 360 / segments / 2;
            const rotY = unit * (item.x + (item.sizeX - 1) / 2);
            const rotX = unit * (item.y - (item.sizeY - 1) / 2);

            return (
              <div
                key={idx}
                onClick={() => setSelectedImg({ src: item.src, caption: item.caption })}
                className="absolute top-1/2 left-1/2 w-[110px] h-[110px] -ml-[55px] -mt-[55px] cursor-pointer group"
                style={{
                  transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(var(--radius))`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="w-full h-full p-1 bg-white/10 backdrop-blur-md rounded-[var(--tile-radius)] border border-red-500/30 group-hover:border-red-500 group-hover:scale-110 transition-all duration-300 shadow-lg overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover rounded-[calc(var(--tile-radius)-4px)]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OVERLAY MODAL SAAT FOTO DIKLIK */}
      {selectedImg && (
        <div
          ref={viewerRef}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-y-auto"
        >
          <div ref={scrimRef} className="absolute inset-0" onClick={() => setSelectedImg(null)} />

          <div className="relative z-10 max-w-lg w-full bg-[#16081a] border border-red-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(225,29,72,0.3)] flex flex-col items-center space-y-5 my-auto">
            
            {/* Foto Frame */}
            <div className="bg-white p-3 pb-4 rounded-2xl shadow-2xl -rotate-1 max-w-[280px] w-full">
              <img src={selectedImg.src} alt="MLBB Moment" className="w-full aspect-square object-cover rounded-xl mb-3" />
              <p className="text-center text-slate-800 font-serif italic text-xs font-semibold px-2">
                {selectedImg.caption}
              </p>
            </div>

            {/* Surat Ucapan dari Lia */}
            <div className="w-full text-left bg-black/40 border border-red-500/20 p-4 rounded-2xl space-y-2 text-xs leading-relaxed font-sans text-red-100">
              <p className="font-serif font-bold text-sm text-red-200">HAPPY BIRTHDAY SAYANG 🤍</p>
              <p>happy 22nd birthday, seng.</p>
              <p>semoga di umur yang baru ini kamu selalu dikasih kesehatan, banyak hal baik, dan alasan-alasan kecil buat senyum setiap hari. semoga semua yang lagi kamu usahain pelan-pelan menemukan jalannya, even the things you haven't told anyone about yet.</p>
              <p>i hope this year brings you more good days, more random laughs, and moments that make you think, “okay, life is actually pretty nice.”</p>
              <p>jaga diri baik-baik, makan yang bener, and please remember that you deserve good things too. ❤️</p>
              <div className="text-right font-serif text-xs pt-1 font-bold text-red-400">
                with love, -lia 🕸️
              </div>
            </div>

            {/* Tombol Tutup */}
            <button
              onClick={() => setSelectedImg(null)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-red-800 to-rose-600 border border-red-400 text-xs font-semibold text-white shadow-lg active:scale-95 transition-transform"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}

      {/* INLINE CSS DEKLARASI STYLE */}
      <style jsx global>{`
        .style-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}
