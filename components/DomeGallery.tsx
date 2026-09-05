'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const moments = [
  {
    image: '/1.jpeg',
    number: '01 / LOBBY',
    title: 'WAITING IN THE GAMEPLAY LOADING',
    text: 'Every game had to start somewhere.',
  },
  {
    image: '/2.jpeg',
    number: '02 / IN GAME',
    title: 'RIGHT IN THE CHAOS',
    text: 'Somehow, the chaos was more fun together.',
  },
  {
    image: '/3.jpeg',
    number: '03 / LOADING',
    title: 'ONE MORE GAME?',
    text: 'Probably. Just one more.',
  },
];

export default function DomeGallery() {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  return (
    <section className="relative w-full overflow-hidden py-6">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-[10%] top-[10%] text-4xl animate-pulse">✦</div>
        <div className="absolute right-[8%] top-[35%] text-3xl animate-pulse">🕸️</div>
        <div className="absolute bottom-[20%] left-[5%] text-3xl animate-pulse">✧</div>
      </div>

      <div className="relative mx-auto w-full max-w-md px-2">
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-[10px] tracking-[0.24em] text-rose-200/60">
            08 / THREE MOMENTS
          </p>
          <h2 className="font-serif text-[clamp(32px,8vw,48px)] leading-[0.95] text-[#f6ece6]">
            Some games.
            <br />
            <em className="font-normal">Some memories.</em>
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-rose-100/45">
            Nothing fancy. Just three little moments worth keeping.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {moments.map((moment, index) => (
            <motion.button
              key={moment.image}
              onClick={() => setActiveImage(index)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative w-full cursor-pointer bg-[#e9ded3] p-2 text-left text-[#352b2c] shadow-[0_20px_45px_rgba(0,0,0,.45)] transition ${
                index === 0 ? '-rotate-[1deg]' : index === 1 ? 'rotate-[1deg]' : '-rotate-[0.5deg]'
              }`}
            >
              <div className="flex h-8 items-center justify-between px-2 font-mono text-[9px] tracking-[0.14em]">
                <span>{moment.number}</span>
                <span className="text-[#7b2c38]">✦</span>
              </div>

              <div className="relative aspect-square overflow-hidden bg-[#21191a]">
                <img
                  src={moment.image}
                  alt={moment.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[9px] tracking-[0.12em] text-white/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                  VIEW ✦
                </div>
              </div>

              <div className="p-3 pb-4">
                <p className="font-mono text-[10px] tracking-[0.1em] text-[#7b2c38]">
                  {moment.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#705e60]">
                  {moment.text}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-5 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#e9ded3] p-2 shadow-2xl"
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white backdrop-blur-md cursor-pointer"
              >
                ×
              </button>

              <img
                src={moments[activeImage].image}
                alt={moments[activeImage].title}
                className="max-h-[65vh] w-full object-contain"
              />

              <div className="p-3 text-[#352b2c]">
                <p className="font-mono text-[10px] tracking-[0.12em] text-[#7b2c38]">
                  {moments[activeImage].number}
                </p>
                <h3 className="mt-1 font-serif text-lg font-bold">
                  {moments[activeImage].title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#705e60]">
                  {moments[activeImage].text}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
