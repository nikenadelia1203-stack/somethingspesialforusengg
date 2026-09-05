'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Circle, Gift, Sparkles } from 'lucide-react';

// --- Background Particles ---
const BackgroundHearts = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        y: '110vh',
                        x: `${(i * 12) + Math.random() * 5}%`,
                        scale: 0.5
                    }}
                    animate={{
                        opacity: [0, 0.25, 0],
                        y: '-10vh',
                        rotate: [0, 180],
                        scale: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 12 + Math.random() * 8,
                        repeat: Infinity,
                        delay: i * 1.5,
                        ease: "linear"
                    }}
                    className="absolute text-red-500/15"
                >
                    <Heart size={28} fill="currentColor" />
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
            const timer = setTimeout(() => onComplete(), 2000);
            return () => clearTimeout(timer);
        }
    }, [isOn, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
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

// --- Step 2: PIN Lock Screen (060904) ---
const PinStep = ({ onComplete }: { onComplete: () => void }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const TARGET_PIN = '060904';

    const handlePress = (num: string) => {
        if (pin.length < 6) {
            const nextPin = pin + num;
            setPin(nextPin);
            if (nextPin.length === 6) {
                if (nextPin === TARGET_PIN) {
                    setTimeout(() => onComplete(), 300);
                } else {
                    setError(true);
                    setTimeout(() => {
                        setPin('');
                        setError(false);
                    }, 800);
                }
            }
        }
    };

    const handleDelete = () => setPin(prev => prev.slice(0, -1));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center relative z-10 text-center"
        >
            <div className="text-3xl mb-2">🕸️🌸</div>
            <h2 className="text-2xl font-serif text-red-100 mb-1">For You, My Love</h2>
            <p className="text-xs text-red-400 mb-6">Enter our secret code</p>

            <div className={`flex gap-3 mb-8 ${error ? 'animate-bounce' : ''}`}>
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full border border-red-500 transition-all duration-200 ${
                            i < pin.length ? 'bg-red-600 shadow-[0_0_10px_#e11d48]' : 'bg-transparent'
                        }`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
                {['1','2','3','4','5','6','7','8','9'].map((num) => (
                    <button
                        key={num}
                        onClick={() => handlePress(num)}
                        className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/30 text-xl text-red-100 flex items-center justify-center mx-auto active:bg-red-600 transition-all cursor-pointer"
                    >
                        {num}
                    </button>
                ))}
                <button onClick={() => setPin('')} className="w-14 h-14 text-xs text-red-400 flex items-center justify-center mx-auto cursor-pointer">✕</button>
                <button onClick={() => handlePress('0')} className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/30 text-xl text-red-100 flex items-center justify-center mx-auto active:bg-red-600 transition-all cursor-pointer">0</button>
                <button onClick={handleDelete} className="w-14 h-14 text-lg text-red-200 flex items-center justify-center mx-auto cursor-pointer">⌫</button>
            </div>
        </motion.div>
    );
};

// --- Step 3: Premium Animated Gift Box ---
const PremiumGiftStep = ({ onComplete }: { onComplete: () => void }) => {
    const [opened, setOpened] = useState(false);

    const handleClick = () => {
        setOpened(true);
        setTimeout(() => onComplete(), 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center relative z-10 text-center"
        >
            {!opened ? (
                <div className="flex flex-col items-center space-y-6 cursor-pointer" onClick={handleClick}>
                    <p className="text-sm font-serif text-red-200 tracking-wide">
                        Touch the gift box to open it ✨
                    </p>
                    
                    {/* Premium Gift Box Visual */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-rose-500 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
                        <motion.div
                            animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="relative w-36 h-36 bg-gradient-to-br from-red-900 to-rose-950 border-2 border-red-400/60 rounded-3xl p-6 shadow-2xl flex items-center justify-center backdrop-blur-md"
                        >
                            <Gift className="w-20 h-20 text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                            <Sparkles className="absolute top-2 right-2 w-6 h-6 text-amber-300 animate-spin" />
                        </motion.div>
                    </div>
                </div>
            ) : (
                <div className="relative flex flex-col items-center justify-center">
                    {/* Confetti Explosion Effects */}
                    {[...Array(14)].map((_, i) => (
                        <motion.span
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                                scale: [0.5, 1.4],
                                x: (Math.random() - 0.5) * 280,
                                y: (Math.random() - 0.5) * 280,
                                opacity: [1, 0]
                            }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className="absolute text-3xl pointer-events-none"
                        >
                            {['✨', '🌸', '💖', '🎉', '🎁', '🕷️'][i % 6]}
                        </motion.span>
                    ))}
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: [0.3, 1.3, 1], opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-serif font-bold text-red-200 drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]"
                    >
                        Surprise! 🎁✨
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

// --- Step 4: Tic-Tac-Toe Game ---
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
            setTimeout(() => makeAIMove(newBoard), 400);
        }
    };

    useEffect(() => {
        if (winner === 'X') {
            setMessage("you got it!");
            setTimeout(() => onComplete(), 2000);
        } else if (winner === 'O' || winner === 'draw') {
            setMessage(winner === 'draw' ? "Seri! Coba lagi yaa ❤️" : "Hampir! Sekali lagi...");
            setTimeout(() => {
                setBoard(Array(9).fill(null));
                setWinner(null);
                setIsUserTurn(true);
            }, 1000);
        }
    }, [winner, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
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
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-2xl flex items-center justify-center border border-red-500/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    >
                        <AnimatePresence mode="wait">
                            {square === 'X' ? (
                                <motion.div
                                    key={winner === 'X' ? "heart" : "x"}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={winner === 'X' ? { delay: i * 0.08, type: 'spring' } : {}}
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

// --- Step 5: Birthday Love Gauge ---
const LoveMeterStep = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete(), 1000);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, [onComplete]);

    const radius = 90;
    const circumference = Math.PI * radius;
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
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
