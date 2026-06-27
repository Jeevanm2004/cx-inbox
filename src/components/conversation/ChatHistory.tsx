import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '../../types';

interface ChatHistoryProps {
  messages: Message[];
  conversationId?: string;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, conversationId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevConversationIdRef = useRef<string | undefined>(conversationId);

  useEffect(() => {
    const isNewConversation = prevConversationIdRef.current !== conversationId;
    
    // Snap instantly if swapping tickets, smooth animate if a new message was just sent
    messagesEndRef.current?.scrollIntoView({
      behavior: isNewConversation ? 'auto' : 'smooth'
    });

    prevConversationIdRef.current = conversationId;
  }, [messages, conversationId]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" aria-live="polite">
      <AnimatePresence initial={false}>
        {messages.map((message) => {
          const isCustomer = message.sender === 'customer';
          const isAi = message.sender === 'ai';
          const isAgent = message.sender === 'agent';
          
          const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <motion.div 
              key={message.id} 
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20, originX: isAgent ? 1 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                layout: { type: "spring", stiffness: 300, damping: 24 },
                opacity: { duration: 0.2 },
                scale: { type: "spring", stiffness: 300, damping: 24 }
              }}
              className={`flex flex-col w-full max-w-[85%] ${isAgent ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="text-xs font-semibold text-muted dark:text-slate-400 uppercase tracking-wider">
                  {message.sender === 'ai' ? 'AI Assistant' : message.sender}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500">{timeString}</span>
              </div>
              
              <div 
                className={`px-4 py-3 max-w-[85%] sm:max-w-[75%] text-[14.5px] leading-[1.6] break-words [overflow-wrap:anywhere] ${
                  isCustomer ? 'bg-[#F1F5F9]/80 dark:bg-zinc-900/80 text-slate-900 dark:text-slate-100 rounded-2xl rounded-bl-sm border border-slate-200/80 dark:border-zinc-800/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' : 
                  isAi ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300 rounded-2xl rounded-bl-sm border border-purple-100/80 dark:border-purple-900/40 shadow-sm' : 
                  'bg-violet-600 dark:bg-violet-800 text-white rounded-2xl rounded-br-sm shadow-md border border-violet-500/80 dark:border-violet-700/80'
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Invisible anchor block to pull view to the absolute bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};
