'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Step =
  | 'loading'
  | 'gift'
  | 'pin'
  | 'welcome'
  | 'puzzle'
  | 'playlist'
  | 'story'
  | 'final';

const CORRECT_PIN = '0609';

/* =========================================================
   BACKGROUND PARTICLES
========================================================= */

function FloatingParticles() {
  const items = Array.from({ length: 18 });

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {items.map((_, index) => (
        <motion.span
          key={index}
          className="absolute text-sm text-rose-200/25"
          initial={{
            left: `${(index * 19 + 7) % 100}%`,
            top: '-10%',
            opacity: 0,
          }}
          animate={{
            top: '110%',
            opacity: [0, 0.55, 0.3, 0],
            rotate: [0, 80, 180],
          }}
          transition={{
            duration: 10 + (index % 5) * 1.8,
            delay: index * 0.35,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {['✦', '·', '✧', '♥', '🕸️'][index % 5]}
        </motion.span>
      ))}
    </div>
  );
}

/* =========================================================
   MAIN SHELL
========================================================= */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        fixed
        inset-0
        overflow-hidden
        bg-[#090a0f]
        text-[#f6ece6]
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_80%_10%,rgba(115,24,42,.38),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(20,38,65,.38),transparent_42%)]
        "
      />

      <FloatingParticles />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE UI
========================================================= */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[10px] tracking-[0.24em] text-rose-200/60">
      {children}
    </p>
  );
}

function BigTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-serif text-[clamp(42px,10vw,76px)] font-semibold leading-[0.95] tracking-tight">
      {children}
    </h1>
  );
}

function MainButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        mt-7
        border
        border-rose-200/20
        bg-white/[0.04]
        px-6
        py-3
        font-serif
        text-sm
        tracking-wide
        transition
        hover:bg-white/[0.09]
        active:scale-95
      "
    >
      {children}
    </button>
  );
}

/* =========================================================
   01 — LOADING
========================================================= */

function LoadingScreen({ next }: { next: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 3, 100));
    }, 70);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = window.setTimeout(next, 700);

      return () => window.clearTimeout(timeout);
    }
  }, [progress, next]);

  return (
    <div className="flex h-full items-center justify-center p-6 text-center">
      <div>
        <motion.div
          className="mb-7 text-5xl"
          animate={{
            y: [0, -8, 0],
            rotate: [-7, 7, -7],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
        >
          🕷️
        </motion.div>

        <SectionLabel>A SMALL DIGITAL SURPRISE</SectionLabel>

        <BigTitle>
          Preparing something
          <br />
          <em className="font-normal">special for you...</em>
        </BigTitle>

        <div className="mx-auto mt-8 h-px w-64 overflow-hidden bg-white/10">
          <motion.div
            className="h-full bg-rose-400"
            animate={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-sm text-rose-100/45">
          please wait just a little longer ✦
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   02 — OPENING GIFT
========================================================= */

function GiftScreen({ next }: { next: () => void }) {
  const [opened, setOpened] = useState(false);

  function openGift() {
    if (opened) return;

    setOpened(true);

    window.setTimeout(next, 1400);
  }

  const burstItems = [
    '♥',
    '✦',
    '🕷️',
    '💥',
    '🕸️',
    '✧',
    '♥',
    '🕷️',
    '✦',
    '💥',
  ];

  return (
    <div className="flex h-full items-center justify-center p-6 text-center">
      <div>
        <SectionLabel>01 / OPEN YOUR GIFT</SectionLabel>

        <BigTitle>
          A little something
          <br />
          <em className="font-normal">for you.</em>
        </BigTitle>

        <div className="relative mx-auto mt-10 h-48 w-52">
          <AnimatePresence>
            {opened &&
              burstItems.map((item, index) => (
                <motion.span
                  key={index}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: ((index % 5) - 2) * 58,
                    y: -80 - Math.floor(index / 5) * 75,
                    scale: [0.4, 1.3],
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1,
                    delay: index * 0.03,
                  }}
                  className="absolute left-1/2 top-1/2 z-30 text-3xl"
                >
                  {item}
                </motion.span>
              ))}
          </AnimatePresence>

          <button
            onClick={openGift}
            className="relative h-full w-full cursor-pointer"
            aria-label="Open gift"
          >
            <motion.div
              className="
                absolute
                left-3
                right-3
                top-3
                z-20
                h-11
                rounded-md
                border
                border-rose-200/30
                bg-[#a92f3c]
              "
              animate={
                opened
                  ? {
                      y: -60,
                      rotate: -9,
                    }
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={
                opened
                  ? { duration: 0.55 }
                  : {
                      duration: 1.8,
                      repeat: Infinity,
                    }
              }
            />

            <motion.div
              className="
                absolute
                bottom-0
                left-3
                right-3
                top-12
                grid
                place-items-center
                rounded-lg
                border
                border-rose-200/20
                bg-gradient-to-br
                from-[#a42d3a]
                to-[#311018]
                text-6xl
                shadow-2xl
              "
              animate={
                opened
                  ? {
                      scale: [1, 1.08, 1],
                    }
                  : {}
              }
            >
              🎁
            </motion.div>
          </button>
        </div>

        <p className="mt-6 text-sm text-rose-100/45">
          tap the gift to open it
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   03 — PIN
========================================================= */

function PinScreen({ next }: { next: () => void }) {
  const [pin, setPin] = useState('');
  const [wrong, setWrong] = useState(false);

  function press(value: string) {
    if (value === '⌫') {
      setPin((current) => current.slice(0, -1));
      return;
    }

    if (pin.length >= 4) return;

    const nextPin = pin + value;

    setPin(nextPin);

    if (nextPin.length === 4) {
      if (nextPin === CORRECT_PIN) {
        window.setTimeout(next, 550);
      } else {
        setWrong(true);

        window.setTimeout(() => {
          setPin('');
          setWrong(false);
        }, 700);
      }
    }
  }

  const numbers = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '',
    '0',
    '⌫',
  ];

  return (
    <div className="flex h-full items-center justify-center p-6 text-center">
      <div>
        <SectionLabel>02 / JUST ONE LITTLE THING</SectionLabel>

        <BigTitle>
          Enter the
          <br />
          <em className="font-normal">birthday code.</em>
        </BigTitle>

        <p className="mt-4 text-sm text-rose-100/45">
          hint: a date worth remembering
        </p>

        <motion.div
          animate={wrong ? { x: [-10, 10, -7, 7, 0] } : {}}
          className="my-8 flex justify-center gap-3"
        >
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className={`
                h-3
                w-3
                rounded-full
                border
                border-rose-300/40
                ${
                  index < pin.length
                    ? 'bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,.7)]'
                    : ''
                }
              `}
            />
          ))}
        </motion.div>

        <div className="mx-auto grid w-60 grid-cols-3 gap-2">
          {numbers.map((number, index) => {
            if (!number) return <div key={index} />;

            return (
              <button
                key={index}
                onClick={() => press(number)}
                className="
                  h-14
                  rounded-md
                  border
                  border-white/10
                  bg-white/[0.035]
                  text-lg
                  transition
                  active:scale-95
                  active:bg-rose-500/20
                "
              >
                {number}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   04 — WELCOME
========================================================= */

function WelcomeScreen({ next }: { next: () => void }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center">
      <div>
        <SectionLabel>03 / HELLO, SENG</SectionLabel>

        <BigTitle>
          Okay...
          <br />
          let&apos;s make this
          <br />
          <em className="font-normal">fun.</em>
        </BigTitle>

        <p className="mt-6 text-rose-100/50">
          Just a few little things waiting for you.
        </p>

        <MainButton onClick={next}>let&apos;s go →</MainButton>
      </div>
    </div>
  );
}

/* =========================================================
   05 — EASY PUZZLE
========================================================= */

function PuzzleScreen({ next }: { next: () => void }) {
  const [solved, setSolved] = useState<boolean[]>(
    Array(12).fill(false)
  );

  const pieces = [
    '🕷️',
    '🕸️',
    '✦',
    '♥',
    '🕷️',
    '✧',
    '🕸️',
    '✦',
    '♥',
    '🕷️',
    '✧',
    '🕸️',
  ];

  const completed = solved.filter(Boolean).length;

  function solve(index: number) {
    setSolved((current) =>
      current.map((value, valueIndex) =>
        valueIndex === index ? true : value
      )
    );
  }

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-6 text-center">
      <div className="my-auto">
        <SectionLabel>04 / LITTLE PUZZLE</SectionLabel>

        <BigTitle>
          Find all the
          <br />
          <em className="font-normal">little pieces.</em>
        </BigTitle>

        <p className="mt-4 text-sm text-rose-100/45">
          don&apos;t worry, this one is easy 😭
        </p>

        <div
          className="
            mx-auto
            mt-7
            grid
            w-[min(360px,90vw)]
            grid-cols-4
            gap-2
            rounded-2xl
            border
            border-white/10
            bg-black/20
            p-2
          "
        >
          {pieces.map((piece, index) => (
            <motion.button
              key={index}
              onClick={() => solve(index)}
              whileTap={{ scale: 0.9 }}
              className={`
                aspect-square
                rounded-xl
                border
                text-xl
                transition
                ${
                  solved[index]
                    ? 'border-rose-300/40 bg-rose-700/30'
                    : 'border-white/10 bg-white/[0.035]'
                }
              `}
            >
              {solved[index] ? piece : '?'}
            </motion.button>
          ))}
        </div>

        <p className="mt-5 font-mono text-xs text-rose-100/50">
          {completed} / 12 pieces found
        </p>

        {completed === 12 && (
          <MainButton onClick={next}>okay, next ✦ →</MainButton>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   06 — PLAYLIST
========================================================= */

function PlaylistScreen({ next }: { next: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const tracks = [
    {
      title: 'An Art Gallery Could Never Be as Unique as You',
      artist: 'mrld',
      src: '/music1.mp3',
    },
    {
      title: 'Shape of My Heart',
      artist: 'Backstreet Boys',
      src: '/music2.mp3',
    },
    {
      title: 'Lover',
      artist: 'Taylor Swift',
      src: '/music3.mp3',
    },
  ];

  const activeTrack = tracks[trackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setPlaying(false);
      setCurrentTime(0);
    }
  }, [trackIndex]);

  async function togglePlay() {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, '0')}`;
  }

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-6">
      <div className="my-auto w-full max-w-md text-center">
        <SectionLabel>05 / YOUR LITTLE SOUNDTRACK</SectionLabel>

        <BigTitle>
          Press play and
          <br />
          <em className="font-normal">keep going.</em>
        </BigTitle>

        <p className="mt-4 text-sm text-rose-100/45">
          a few songs for this little journey.
        </p>

        <div className="mt-7 space-y-2 text-left">
          {tracks.map((track, index) => (
            <button
              key={track.title}
              onClick={() => setTrackIndex(index)}
              className={`
                grid
                w-full
                grid-cols-[35px_1fr]
                rounded-sm
                border
                p-4
                text-left
                transition
                ${
                  trackIndex === index
                    ? 'border-rose-300/40 bg-rose-900/20'
                    : 'border-white/10 bg-white/[0.025]'
                }
              `}
            >
              <span className="font-mono text-xs text-rose-300">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span>
                <b className="block text-sm leading-snug">
                  {track.title}
                </b>

                <small className="mt-1 block text-rose-100/45">
                  {track.artist}
                </small>
              </span>
            </button>
          ))}
        </div>

        <audio
          ref={audioRef}
          src={activeTrack.src}
          preload="metadata"
          onTimeUpdate={() =>
            setCurrentTime(audioRef.current?.currentTime || 0)
          }
          onEnded={() => setPlaying(false)}
        />

        <div
          className="
            mt-5
            grid
            grid-cols-[52px_1fr]
            gap-4
            border
            border-white/10
            bg-white/[0.035]
            p-4
            text-left
          "
        >
          <button
            onClick={togglePlay}
            className="
              row-span-2
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-rose-200/20
              bg-rose-700/70
              text-sm
            "
          >
            {playing ? '❚❚' : '▶'}
          </button>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <b className="block truncate text-sm">
                {activeTrack.title}
              </b>

              <span className="block text-xs text-rose-100/45">
                {activeTrack.artist}
              </span>
            </div>

            <span className="font-mono text-[10px] text-rose-100/45">
              {formatTime(currentTime)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={
              audioRef.current?.duration
                ? (currentTime / audioRef.current.duration) * 100
                : 0
            }
            onChange={(event) => {
              if (!audioRef.current?.duration) return;

              audioRef.current.currentTime =
                (Number(event.target.value) / 100) *
                audioRef.current.duration;
            }}
            className="w-full accent-rose-500"
          />
        </div>

        <p className="mt-4 text-xs text-rose-100/35">
          you can choose whichever song feels right.
        </p>

        <MainButton onClick={next}>continue →</MainButton>
      </div>
    </div>
  );
}

/* =========================================================
   07 — SPIDER-MAN BOUQUET
========================================================= */

function BouquetSection() {
  const [clicked, setClicked] = useState(0);
  const [message, setMessage] = useState(
    'tap the bouquet for a little surprise.'
  );

  const messages = [
    'one more random game together.',
    'more laughs, less overthinking.',
    'make memories worth keeping.',
    'go somewhere you have never been.',
    'another good day waiting somewhere.',
  ];

  function handleBouquetClick() {
    setClicked((value) => value + 1);

    setMessage(
      messages[Math.floor(Math.random() * messages.length)]
    );
  }

  return (
    <section className="py-12 text-center">
      <SectionLabel>06 / THINGS TO DO</SectionLabel>

      <BigTitle>
        A tiny
