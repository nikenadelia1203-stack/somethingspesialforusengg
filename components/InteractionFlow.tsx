'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Circle } from 'lucide-react';

// --- Background Particles ---
const BackgroundHearts = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        y: '110vh',
                        x: `${(i * 10) + Math.random() * 5}%`,
                        scale: 0.5
                    }}
                    animate={{
                        opacity: [0, 0.25, 0],
                        y: '-10vh',
                        rotate: [0, 180],
                        scale: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                    className="absolute text-red-500/15"
                >
                    <Heart size={30} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// --- Step 1: Birthday Love Mode ---
const LoveModeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        if (isOn) {
            const timer = setTimeout(() => onComplete(), 2500);
            return () => clearTimeout(timer);
        }
    }, [isOn, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            className="flex flex-col items-center justify-center relative z-10"
        >
            <div className={`backdrop-blur-2xl p-10 rounded-[3rem] transition-all duration-1000 ease-in-out flex flex-col items-center space-y-8 border border-white/10 ${isOn ? 'bg-red-950/20 shadow-[0_0_80px_rgba(225,29,72,0.3)] border-red-500/30' : 'bg-white/5 shadow-2xl'}`}>
                <div className="relative">
                    <motion.div
                        animate={isOn ? {
                            scale: [1, 1.15, 1],
                            filter: ['drop-shadow(0 0 0px rgba(225,29,72,0))', 'drop-shadow(0 0 20px rgba(225,29,72,0.8))', 'drop-shadow(0 0 0px rgba(225,29,72,0))']
                        } : {}}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <Heart className={`w-20 h-20 transition-all duration-1000 ${isOn ? 'text-red-500 fill-red-500' : 'text-white/20'}`} />
                    </motion.div>
                </div>

                <div className="flex flex-col items-center space-y-6">
                    <span className={`text-3xl font-serif tracking-wider transition-colors duration-1000 ${isOn ? 'text-red-200' : 'text-white/40'}`}>
                        Special Birthday Mode
                    </span>

                    <button
                        onClick={() => setIsOn(!isOn)}
                        className={`group relative w-32 h-16 rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] p-1.5 focus:outline-none cursor-pointer ${isOn ? 'bg-red-700 shadow-[0_0_30px_rgba(225,29,72,0.6)]' : 'bg-white/10'}`}
                    >
                        <motion.div
                            animate={{ x: isOn ? 64 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="w-13 h-13 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center pointer-events-none"
                        >
                            <Heart
                                size={24}
                                className={`transition-colors duration-500 ${isOn ? "text-red-600 fill-red-600" : "text-gray-400"}`}
                            />
                        </motion.div>

                        <AnimatePresence>
                            {!isOn && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30"
                                >
                                    off
                                </motion.span>
                            )}
                            {isOn && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90"
                                >
                                    on
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- Step 2: Tic-Tac-Toe Game ---
const TicTacToeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isUserTurn, setIsUserTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [message, setMessage] = useState("Main game sebentar yuk...");

    const checkWinner = useCallback((squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.includes(null) ? null : 'draw';
    }, []);

    const makeAIMove = useCallback((currentBoard: (string | null)[]) => {
        const emptyIndices = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (emptyIndices.length === 0) return;

        const nonCenterIndices = emptyIndices.filter(i => i !== 4);
        const targetIndex = nonCenterIndices.length > 0
            ? nonCenterIndices[Math.floor(Math.random() * nonCenterIndices.length)]
            : 4;

        const newBoard = [...currentBoard];
        newBoard[targetIndex] = 'O';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result);
        } else {
            setIsUserTurn(true);
        }
    }, [checkWinner]);

    const handleSquareClick = (index: number) => {
        if (board[index] || winner || !isUserTurn) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result);
        } else {
            setIsUserTurn(false);
            setTimeout(() => makeAIMove(newBoard), 500);
        }
    };

    useEffect(() => {
        if (winner === 'X') {
            setMessage("you got it!");
            setTimeout(() => onComplete(), 3200);
        } else if (winner === 'O' || winner === 'draw') {
            setMessage(winner === 'draw' ? "Seri! Coba lagi yaa ❤️" : "Hampir! Sekali lagi...");
            setTimeout(() => {
                setBoard(Array(9).fill(null));
                setWinner(null);
                setIsUserTurn(true);
            }, 1200);
        }
    }, [winner, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center space-y-8 relative z-10"
        >
            <h2 className="text-3xl font-serif text-red-100 text-center drop-shadow-lg max-w-xs whitespace-pre-line leading-tight">
                {winner === 'X' ? "Kamu Memenangkan" : message}
            </h2>
            <div className="grid grid-cols-3 gap-3 p-4 bg-red-950/20 backdrop-blur-md rounded-3xl border border-red-500/20 shadow-2xl">
                {board.map((square, i) => (
                    <button
                        key={i}
                        onClick={() => handleSquareClick(i)}
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-2xl flex items-center justify-center border border-red-500/10 hover:bg-white/10 transition-all duration-300 group"
                    >
                        <AnimatePresence mode="wait">
                            {square === 'X' ? (
                                <motion.div
                                    key={winner === 'X' ? "heart" : "x"}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={winner === 'X' ? { delay: i * 0.1, type: 'spring' } : {}}
                                >
                                    {winner === 'X' ?
                                        <Heart className="w-12 h-12 text-red-500 fill-red-500 filter drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]" /> :
                                        <X className="w-12 h-12 text-red-200/80" />
                                    }
                                </motion.div>
                            ) : square === 'O' ? (
                                <motion.div key="o" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <Circle className="w-12 h-12 text-rose-300 opacity-40" />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {winner === 'X' && (
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-serif text-red-200 text-center drop-shadow-lg mt-2 font-bold"
                    >
                        you did it! ❤️
                    </motion.h2>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Step 3: Birthday Love Gauge ---
const LoveMeterStep = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete(), 1200);
                    return 100;
                }
                return prev + 1;
            });
        }, 35);
        return () => clearInterval(interval);
    }, [onComplete]);

    const radius = 90;
    const circumference = Math.PI * radius;
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-10 w-full max-w-lg px-6 relative z-10"
        >
            <div className="relative w-full aspect-[2/1] flex flex-col items-center justify-end overflow-hidden">
                <svg viewBox="0 0 200 100" className="w-full h-full absolute top-0 overflow-visible">
                    <path
                        d="M 10,100 A 90,90 0 0 1 190,100"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    <motion.path
                        d="M 10,100 A 90,90 0 0 1 190,100"
                        fill="none"
                        stroke="url(#loveGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        style={{ filter: 'drop-shadow(0 0 10px rgba(225, 29, 72, 0.7))' }}
                    />
                    <defs>
                        <linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9f1239" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="z-10 flex flex-col items-center pb-4">
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <Heart className="w-14 h-14 text-red-500 fill-red-500 mb-2" />
                    </motion.div>
                    <div className="text-6xl font-black text-red-100 font-mono tracking-tighter">
                        {progress}<span className="text-red-400 text-3xl">%</span>
                    </div>
                    <span className="text-xl text-red-200/80 font-serif italic mt-1 tracking-widest">Love & Wishes</span>
                </div>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-red-500/20">
                <motion.div
                    className="h-full bg-gradient-to-r from-red-800 to-rose-500"
                    animate={{ width: `${progress}%` }}
                />
            </div>
        </motion.div>
    );
};

// --- Step 4: Birthday Typewriter Message ---
const TypewriterStep = ({ onComplete }: { onComplete: () => void }) => {
    const textTitle = "HAPPY BIRTHDAY SAYANG";
    const textSub = "may 22 be kind to you.\nand may the next chapter be even better. 🕸️";

    const [displayedTitle, setDisplayedTitle] = useState("");
    const [displayedSub, setDisplayedSub] = useState("");
    const [titleDone, setTitleDone] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!titleDone && displayedTitle !== textTitle) {
            timer = setTimeout(() => {
                setDisplayedTitle(textTitle.slice(0, displayedTitle.length + 1));
            }, 100);
        } else if (!titleDone && displayedTitle === textTitle) {
            timer = setTimeout(() => setTitleDone(true), 500);
        }
        return () => clearTimeout(timer);
    }, [displayedTitle, titleDone, textTitle]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (titleDone && displayedSub !== textSub) {
            timer = setTimeout(() => {
                setDisplayedSub(textSub.slice(0, displayedSub.length + 1));
            }, 60);
        } else if (titleDone && displayedSub === textSub) {
            timer = setTimeout(() => onComplete(), 3000);
        }
        return () => clearTimeout(timer);
    }, [displayedSub, titleDone, onComplete, textSub]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            className="flex flex-col items-center justify-center p-8 relative z-10 text-center space-y-4 max-w-xl"
        >
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-red-200 leading-tight tracking-wide drop-shadow-[0_0_15px_rgba(225,29,72,0.6)]">
                {displayedTitle}
                {!titleDone && (
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 sm:w-3 h-8 sm:h-12 bg-red-500 ml-2 align-middle"
                    />
                )}
            </h1>

            {titleDone && (
                <p className="text-base sm:text-xl font-serif text-rose-200/90 whitespace-pre-line leading-relaxed italic">
                    {displayedSub}
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-1.5 h-5 bg-red-400 ml-1 align-middle"
                    />
                </p>
            )}
        </motion.div>
    );
};

export default function InteractionFlow({ onFlowComplete }: { onFlowComplete: () => void }) {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 z-50 bg-[#0a040d] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.18)_0%,transparent_75%)]" />

            <BackgroundHearts />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <LoveModeStep key="step1" onComplete={() => setStep(2)} />
                )}
                {step === 2 && (
                    <TicTacToeStep key="step2" onComplete={() => setStep(3)} />
                )}
                {step === 3 && (
                    <LoveMeterStep key="step3" onComplete={() => setStep(4)} />
                )}
                {step === 4 && (
                    <TypewriterStep key="step4" onComplete={() => onFlowComplete()} />
                )}
            </AnimatePresence>

            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-950/30 blur-[120px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-950/30 blur-[120px] rounded-full" />
        </div>
    );
}
