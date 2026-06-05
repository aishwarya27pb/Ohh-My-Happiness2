'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Gift, Sparkles } from 'lucide-react';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'data';
    content: string;
}

const QUICK_REPLIES = [
    '🎁 Build Custom Box',
    '🚚 Free Shipping?',
    '💼 Corporate Orders',
    '🎟️ Coupon Codes',
];

const SESSION_KEY = 'omh-chat-messages';

function loadStoredMessages(): Message[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (v): v is Message =>
                v !== null &&
                typeof v === 'object' &&
                typeof (v as any).id === 'string' &&
                typeof (v as any).content === 'string' &&
                ((v as any).role === 'user' || (v as any).role === 'assistant')
        );
    } catch {
        return [];
    }
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessages] = useState<Message[]>(loadStoredMessages);

    const {
        messages,
        input,
        setInput,
        append,
        handleSubmit,
        isLoading,
        error,
    } = useChat({ initialMessages } as any) as any;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Persist messages in sessionStorage
    useEffect(() => {
        if (!messages) return;
        const toStore = messages
            .filter((m: any) => m.role === 'user' || m.role === 'assistant')
            .map((m: any) => ({ id: m.id, role: m.role, content: m.content }));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(toStore));
    }, [messages]);

    // Auto-scroll on new replies
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleQuickReply = (text: string) => {
        if (typeof append === 'function') {
            append({ role: 'user', content: text });
        }
    };

    const showQuickReplies = messages.length === 0 && !isLoading;

    return (
        <>
            {/* Floating golden trigger button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="trigger"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#FFB449] shadow-xl flex items-center justify-center hover:bg-[#FF8A00] transition-colors border border-white/20 group"
                        onClick={() => setIsOpen(true)}
                        aria-label="Open chat"
                    >
                        <MessageCircle className="w-6 h-6 text-[#2E1E0F] group-hover:scale-110 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Premium Gifting Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 32, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 32, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                        className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[360px] h-[min(540px,calc(100dvh-6rem))] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#FFE4C2] bg-[#FFF9EE]/95 backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#FFB449] to-[#FF8A00] text-[#2E1E0F] flex-shrink-0 shadow-md">
                            <div className="w-8 h-8 rounded-full bg-[#FFF9EE]/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                                <Gift className="w-4.5 h-4.5 text-[#2E1E0F]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm leading-tight">Happiness Assistant</p>
                                <p className="text-[#2E1E0F]/70 text-xs flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Powered by Gemini RAG
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#2E1E0F]/70 hover:text-[#2E1E0F] transition-colors flex-shrink-0"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages panel */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-gradient-to-b from-[#FFF9EE] to-[#FFE4C2]/30">
                            {/* Base greeting */}
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#FFB449] flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                                    <Gift className="w-3 h-3 text-[#2E1E0F]" />
                                </div>
                                <div className="bg-white/80 border border-[#FFE4C2] rounded-2xl rounded-tl-sm px-3.5 py-2 text-[#2E1E0F] text-sm max-w-[80%] leading-relaxed shadow-sm">
                                    Warm greetings from **Ohh My Happiness**! 🎁 How can I help you find or customize the perfect gift hamper today?
                                </div>
                            </div>

                            {/* Quick reply chips */}
                            {showQuickReplies && (
                                <div className="flex flex-wrap gap-2 pl-8">
                                    {QUICK_REPLIES.map((text) => (
                                        <button
                                            key={text}
                                            onClick={() => handleQuickReply(text)}
                                            className="text-xs px-3 py-1.5 rounded-full border border-[#FFB449] text-[#FF8A00] bg-white hover:bg-[#FFB449]/10 transition-all font-medium shadow-sm hover:scale-102"
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Dynamic replies list */}
                            {messages && messages.map((m: any) => (
                                <div
                                    key={m.id}
                                    className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}
                                >
                                    {m.role === 'assistant' && (
                                        <div className="w-6 h-6 rounded-full bg-[#FFB449] flex-shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                                            <Gift className="w-3 h-3 text-[#2E1E0F]" />
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-2xl px-3.5 py-2 text-sm max-w-[80%] leading-relaxed whitespace-pre-wrap shadow-sm border ${
                                            m.role === 'user'
                                                ? 'bg-[#FFB449] text-[#2E1E0F] border-[#FFB449] rounded-tr-sm font-semibold'
                                                : 'bg-white/80 text-[#2E1E0F] border-[#FFE4C2] rounded-tl-sm'
                                        }`}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}

                            {/* Typings / Stream completion indicator */}
                            {isLoading && (
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#FFB449] flex-shrink-0 flex items-center justify-center">
                                        <Gift className="w-3 h-3 text-[#2E1E0F]" />
                                    </div>
                                    <div className="bg-white/80 border border-[#FFE4C2] rounded-2xl rounded-tl-sm px-3.5 py-3 flex gap-1 items-center shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] animate-bounce [animation-delay:0ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] animate-bounce [animation-delay:150ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                        <Gift className="w-3 h-3 text-red-500" />
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl rounded-tl-sm px-3.5 py-2 text-red-600 text-sm max-w-[80%] leading-relaxed shadow-sm">
                                        We are experiencing a small issue. Please try typing your request again.
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex gap-2 p-3 border-t border-[#FFE4C2] bg-white flex-shrink-0"
                        >
                            <input
                                value={input ?? ''}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about hampers, BYOB, shipping..."
                                disabled={isLoading}
                                aria-label="Type your message"
                                autoComplete="off"
                                className="flex-1 bg-[#FFF9EE]/50 text-[#2E1E0F] placeholder-[#2E1E0F]/40 border border-[#FFE4C2] rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FFB449]/50 disabled:opacity-50 min-w-0"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !(input ?? '').trim()}
                                className="w-9 h-9 rounded-xl bg-[#FFB449] hover:bg-[#FF8A00] flex items-center justify-center text-[#2E1E0F] disabled:opacity-40 transition-colors flex-shrink-0 shadow-sm"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
