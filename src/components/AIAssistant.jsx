'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Quick prompt chips ─────────────────────────────────────── */
const QUICK_PROMPTS = [
  { emoji: '🍛', label: 'Paneer recipe',       prompt: 'Mere paas paneer aur onion hai, kya banau?' },
  { emoji: '💪', label: 'High protein',         prompt: 'High protein Indian meal batao' },
  { emoji: '🌅', label: 'Easy breakfast',       prompt: 'Easy Indian breakfast under 15 mins' },
  { emoji: '📖', label: 'Explain recipe',       prompt: 'Ye recipe easy words me explain karo' },
  { emoji: '🌶️', label: 'Make it spicy',        prompt: 'Make this spicy Indian style' },
  { emoji: '🥗', label: 'Low calorie',          prompt: 'Low calorie Indian dinner batao' },
  { emoji: '🌿', label: 'Vegetarian',           prompt: 'Vegetarian version banana chahta hoon' },
  { emoji: '⚡', label: '5-min recipe',         prompt: '5 minute me banne wali recipe do' },
];

/* ── Simple markdown renderer ───────────────────────────────── */
function MarkdownText({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-base font-bold text-amber-300 mt-4 mb-2 first:mt-0">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-amber-200/80 mt-3 mb-1.5 uppercase tracking-wide">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={i} className="text-sm font-semibold text-slate-300 mt-2 mb-1">
          {line.slice(5)}
        </h4>
      );
    } else if (/^\*\*(.+)\*\*$/.test(line.trim())) {
      elements.push(
        <p key={i} className="text-xs font-semibold text-amber-400/90 mt-2 mb-1">
          {line.trim().slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
          <span className="text-sm text-slate-300 leading-relaxed">
            {renderInline(line.slice(2))}
          </span>
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1];
      elements.push(
        <div key={i} className="flex items-start gap-2.5 py-1">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30
                           text-amber-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
            {num}
          </span>
          <span className="text-sm text-slate-300 leading-relaxed flex-1">
            {renderInline(line.replace(/^\d+\.\s/, ''))}
          </span>
        </div>
      );
    } else if (line.startsWith('---') || line.startsWith('***')) {
      elements.push(<hr key={i} className="border-white/10 my-3" />);
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-slate-300 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function renderInline(text) {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-slate-100 font-semibold">{part.slice(2, -2)}</strong>;
    }
    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1 py-0.5 bg-white/10 rounded text-amber-300 text-xs">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

/* ── Message bubble ─────────────────────────────────────────── */
function MessageBubble({ msg, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
        ${isUser
          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
          : 'bg-gradient-to-br from-violet-500 to-purple-700 text-white'}`}
      >
        {isUser ? '👤' : '✨'}
      </div>

      {/* Content */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-tr-sm'
            : 'bg-white/8 border border-white/10 text-slate-200 rounded-tl-sm'}`}
        >
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <MarkdownText text={msg.content} />
          )}
        </div>

        {/* Copy button for AI messages */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors px-1 flex items-center gap-1"
          >
            {copied ? '✓ Copied' : '⎘ Copy'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ── Typing indicator ───────────────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2.5"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs">
        ✨
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/8 border border-white/10 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main AI Assistant Component ────────────────────────────── */
export default function AIAssistant({ recipe = null }) {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([
    {
      role: 'assistant',
      content: `Namaste! 👋 Main **ChefAI** hoon — aapka personal cooking assistant!\n\nAap mujhse pooch sakte ho:\n- **Koi bhi recipe** — ingredients ke basis pe\n- **Dietary preferences** — high protein, low calorie, vegetarian\n- **Recipe explanation** — easy steps mein\n- **Customization** — spicier, healthier, faster\n\nKya banana hai aaj? 😄`,
    },
  ]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [unread,    setUnread]    = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const abortRef       = useRef(null);

  /* Auto-scroll */
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  /* Focus input on open */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setUnread(0);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');
    setLoading(true);

    const userMsg = { role: 'user', content: msg };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);

    // Scroll to bottom after user message
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const historyForApi = newHistory.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          recipe: recipe || null,
          history: historyForApi.slice(0, -1), // exclude current user message
        }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMsg = { role: 'assistant', content: data.answer };
        setMessages((prev) => [...prev, aiMsg]);
        if (!isOpen) setUnread((u) => u + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ ${data.message || 'Something went wrong. Please try again.'}` },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Network error. Please check your connection and try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, recipe, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! 🧹 Kya poochhna chahte ho? 😊`,
    }]);
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <motion.button
        id="ai-assistant-toggle"
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl
                   bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500
                   flex items-center justify-center text-white text-2xl
                   ring-4 ring-amber-500/30 hover:ring-amber-400/50 transition-shadow"
        aria-label="Open AI cooking assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              ✕
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              👨‍🍳
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[420px] h-[580px] max-h-[80vh]
                       rounded-3xl overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)]
                       flex flex-col border border-white/10
                       bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8
                            bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md text-lg flex-shrink-0">
                ✨
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white">ChefAI Assistant</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Online · Powered by Gemini
                </p>
              </div>
              {/* Actions */}
              <button
                onClick={clearHistory}
                title="Clear chat"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400
                           hover:text-white hover:bg-white/10 transition-all text-xs flex items-center justify-center"
              >
                🗑
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400
                           hover:text-white hover:bg-white/10 transition-all text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Recipe context badge */}
            {recipe && (
              <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-amber-400/70 uppercase tracking-wider font-bold">Context</span>
                <span className="text-xs text-amber-300 font-medium truncate">
                  📖 {recipe.strMeal || recipe.name || 'Current Recipe'}
                </span>
              </div>
            )}

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth
                            [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}

              <AnimatePresence>
                {loading && <TypingIndicator />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-3 py-2 border-t border-white/8 flex-shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
                {QUICK_PROMPTS.map(({ emoji, label, prompt }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(prompt)}
                    disabled={loading}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                               bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium
                               hover:bg-amber-500/15 hover:border-amber-500/30 hover:text-amber-300
                               transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-white/8 flex gap-2 items-end flex-shrink-0
                            bg-slate-950/60 backdrop-blur-sm">
              <textarea
                ref={inputRef}
                id="ai-assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                placeholder="Ask anything about food… (Enter to send)"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/8 border border-white/12 text-white text-sm
                           placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:bg-white/10
                           transition-all resize-none disabled:opacity-50 leading-relaxed
                           [field-sizing:content] max-h-32"
                style={{ minHeight: '42px' }}
              />
              <motion.button
                id="ai-assistant-send"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl flex-shrink-0
                           bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-base
                           flex items-center justify-center shadow-md shadow-amber-900/30
                           disabled:opacity-40 disabled:cursor-not-allowed hover:from-amber-300 hover:to-orange-400
                           transition-all"
                aria-label="Send message"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : '↑'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
