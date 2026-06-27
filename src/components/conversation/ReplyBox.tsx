import React, { useState, useRef, useEffect } from 'react';

interface ReplyBoxProps {
  isSending: boolean;
  disabled?: boolean;
  onSend: (text: string) => void;
}

const COMMON_EMOJIS = ['👍', '👎', '✅', '❌', '😊', '🙏', '🚨', '🛠️', '👋', '🎉', '🔥', '👀', '💡', '🤔', '📦', '📱'];

export const ReplyBox: React.FC<ReplyBoxProps> = ({ isSending, disabled, onSend }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiContainerRef.current && !emojiContainerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <div 
      className={`w-full flex items-center bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] rounded-3xl py-1.5 px-5 transition-all duration-300 relative ${
        disabled 
          ? 'bg-slate-50 dark:bg-zinc-950/60 opacity-60 cursor-not-allowed' 
          : 'hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10 focus-within:shadow-[0_4px_20px_-4px_rgba(124,58,237,0.15)]'
      }`}
    >
      <input
        type="text"
        id="reply-input"
        value={text}
        disabled={disabled || isSending}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Assign to yourself before replying..." : "Type your reply... (Enter to send)"}
        className="flex-1 bg-transparent py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-w-0"
        aria-label="Type your reply"
        autoComplete="off"
        autoCorrect="off"
      />
      
      <div className="relative flex items-center ml-2" ref={emojiContainerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${disabled ? 'cursor-not-allowed text-slate-300 dark:text-zinc-850' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900'}`}
          title="Insert Emoji"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </button>
        
        {showEmojiPicker && !disabled && (
          <div className="absolute bottom-full right-0 mb-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-3 rounded-xl shadow-xl w-64 z-50 animate-fade-in grid grid-cols-4 gap-2">
            <div className="col-span-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 px-1">Quick Emojis</div>
            {COMMON_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  setText(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + emoji);
                  document.getElementById('reply-input')?.focus();
                }}
                className="hover:bg-slate-100 dark:hover:bg-zinc-900 rounded p-1.5 text-xl transition-transform hover:scale-110 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
