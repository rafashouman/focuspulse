"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { saveMatchResult } from "@/app/actions/saveMatchResult";

// Paleta Bespoke: Obsidian Black (#050505), Deep Navy (#0B132B) e Electric Cyan (#00F0FF)
// Utilizando símbolos de código para temática distópica/hacker
const CARD_SYMBOLS = ["{ }", "[ ]", "< >", "//", "/*", "*/", "0x", "1b"];

interface Card {
    id: string;
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function MemoryMatrix() {
    const [user, setUser] = useState<User | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [authError, setAuthError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [savedScore, setSavedScore] = useState<number | null>(null);
    const gameStartedAt = useRef(0);

    useEffect(() => {
        return onAuthStateChanged(auth, setUser, (error) => {
            console.error("Unable to observe Firebase Auth state.", error);
            setAuthError("Não foi possível verificar sua sessão.");
        });
    }, []);

    const handleLogin = async () => {
        setAuthError("");
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Unable to sign in with Google.", error);
            setAuthError("Não foi possível iniciar sessão com o Google.");
        }
    };

    const handleVictory = async () => {
        if (!user) {
            setAuthError("Inicie sessão para registrar sua pontuação.");
            return;
        }

        setIsSaving(true);
        setSaveError("");
        try {
            const idToken = await user.getIdToken(true);
            const result = await saveMatchResult(
                {
                    gameId: "memory",
                    moves,
                    timeInSeconds: Math.max(
                        1,
                        Math.floor((Date.now() - gameStartedAt.current) / 1000)
                    ),
                },
                idToken
            );

            if (result.success) {
                setSavedScore(result.score);
            } else {
                setSaveError(result.error);
            }
        } catch (error) {
            console.error("Unable to submit game result.", error);
            setSaveError("Não foi possível salvar a pontuação. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    // Inicializa e embaralha o tabuleiro na montagem
    const initializeGame = useCallback(() => {
        const duplicatedSymbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS];
        const shuffledCards = duplicatedSymbols
            .sort(() => Math.random() - 0.5)
            .map((symbol) => ({
                id: crypto.randomUUID(), // Evita colisões de chave no React
                symbol,
                isFlipped: false,
                isMatched: false,
            }));

        setCards(shuffledCards);
        setFlippedIndices([]);
        setMoves(0);
        setMatches(0);
        setIsLocked(false);
        setSavedScore(null);
        setSaveError("");
        gameStartedAt.current = Date.now();
    }, []);

    useEffect(() => {
        const frameId = requestAnimationFrame(initializeGame);
        return () => cancelAnimationFrame(frameId);
    }, [initializeGame]);

    // Lógica principal do motor do jogo
    const handleCardClick = (index: number) => {
        // Bloqueia cliques se o tabuleiro estiver processando, a carta já estiver virada ou resolvida
        if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = cards.map((card, cardIndex) =>
            cardIndex === index ? { ...card, isFlipped: true } : card
        );
        setCards(newCards);

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        // Avalia o par quando duas cartas são viradas
        if (newFlippedIndices.length === 2) {
            setIsLocked(true);
            setMoves((m) => m + 1);

            const [firstIndex, secondIndex] = newFlippedIndices;

            if (newCards[firstIndex].symbol === newCards[secondIndex].symbol) {
                // Match correto: consolida o estado e destrava o tabuleiro
                setMatches((m) => m + 1);
                setCards((currentCards) =>
                    currentCards.map((card, cardIndex) =>
                        cardIndex === firstIndex || cardIndex === secondIndex
                            ? { ...card, isMatched: true }
                            : card
                    )
                );
                setFlippedIndices([]);
                setIsLocked(false);
            } else {
                // Match incorreto: aguarda a animação e reseta o par
                setTimeout(() => {
                    setCards((currentCards) =>
                        currentCards.map((card, cardIndex) =>
                            cardIndex === firstIndex || cardIndex === secondIndex
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedIndices([]);
                    setIsLocked(false);
                }, 1000);
            }
        }
    };

    const isVictory = matches === CARD_SYMBOLS.length;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-4 font-mono text-[#00F0FF] selection:bg-[#3A506B]">

            {/* HUD de Status */}
            <div className="w-full max-w-md flex justify-between items-end mb-8 border-b border-[#1C2541] pb-4">
                <div>
                    <h2 className="text-sm tracking-[0.3em] text-[#3A506B] uppercase mb-1">Status</h2>
                    <p className="text-2xl font-black">{isVictory ? "SISTEMA DESBLOQUEADO" : "MEMÓRIA ATIVA"}</p>
                </div>
                <div className="text-right">
                    {user ? (
                        <p className="max-w-40 truncate text-sm font-bold">
                            {user.displayName || user.email}
                        </p>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="mb-2 border border-[#00F0FF] px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#00F0FF] hover:text-[#050505]"
                        >
                            Iniciar sessão
                        </button>
                    )}
                    <p className="text-sm tracking-widest text-[#3A506B] uppercase mb-1">Tentativas</p>
                    <p className="text-2xl font-bold">{moves.toString().padStart(2, "0")}</p>
                </div>
            </div>

            {authError && (
                <p role="alert" className="mb-4 text-center text-sm text-red-400">
                    {authError}
                </p>
            )}

            {/* Grid do Tabuleiro - Proporção exata 1:1 nas células */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-md aspect-square mb-12 relative z-10">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className="relative w-full h-full aspect-square perspective-1000 cursor-pointer group"
                        onClick={() => handleCardClick(index)}
                    >
                        {/* O container da carta que rotaciona em 3D */}
                        <motion.div
                            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full relative [transform-style:preserve-3d]"
                        >
                            {/* Costas da Carta (Oculta ao virar) */}
                            <div className="absolute inset-0 w-full h-full bg-[#0B132B] border border-[#1C2541] group-hover:border-[#3A506B] [backface-visibility:hidden] flex items-center justify-center transition-colors">
                                <div className="w-4 h-4 bg-[#1C2541] rotate-45 group-hover:bg-[#3A506B] transition-colors" />
                            </div>

                            {/* Frente da Carta (O Símbolo/Ícone, rotacionado a 180deg para corrigir a orientação) */}
                            <div
                                className={`absolute inset-0 w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-black [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 ${card.isMatched
                                        ? "bg-[#050505] border-[#3A506B] text-[#3A506B]"
                                        : "bg-[#050505] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                                    }`}
                            >
                                {/* Efeito de Glitch Visual para o Símbolo */}
                                <span className={card.isMatched ? "opacity-50" : "drop-shadow-[2px_0_0_#00F0FF]"}>
                                    {card.symbol}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {isVictory && (
                <div className="mb-6 text-center">
                    {savedScore !== null ? (
                        <p role="status" className="font-bold">
                            Pontuação registrada: {savedScore}
                        </p>
                    ) : (
                        <button
                            onClick={() => void handleVictory()}
                            disabled={isSaving || !user}
                            className="border border-[#00F0FF] px-6 py-3 font-bold uppercase tracking-widest transition-colors hover:bg-[#00F0FF] hover:text-[#050505] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? "Salvando pontuação..."
                                : user
                                  ? "Registrar pontuação"
                                  : "Inicie sessão para registrar"}
                        </button>
                    )}
                    {saveError && (
                        <p role="alert" className="mt-3 text-sm text-red-400">
                            {saveError}
                        </p>
                    )}
                </div>
            )}

            {/* Ação de Reiniciar */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeGame}
                className="px-8 py-3 border border-[#00F0FF] bg-[#050505] hover:bg-[#00F0FF] text-[#00F0FF] hover:text-[#050505] font-bold tracking-widest uppercase transition-colors"
            >
                Reiniciar Sequência
            </motion.button>

        </div>
    );
}