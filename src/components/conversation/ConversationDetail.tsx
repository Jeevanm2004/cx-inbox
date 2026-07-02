import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, MessageCircle, AlertTriangle, AlertOctagon, X, Mail, MessageSquare, Calendar } from 'lucide-react';
import type { Conversation, Message } from '../../types';
import { Badge } from '../shared/Badge';
import { ChatHistory } from './ChatHistory';
import { ReplyBox } from './ReplyBox';
import { useAssign } from '../../hooks/useAssign';
import { useResolve } from '../../hooks/useResolve';
import { useReply } from '../../hooks/useReply';

interface ConversationDetailProps {
  conversation: Conversation | null;
  conversations: Conversation[];
  totalConversations: number;
  onUpdateConversation: (c: Conversation) => void;
  onAddMessage: (id: string, message: Message) => void;
  isSidebarOpen?: boolean;
}

export const ConversationDetail: React.FC<ConversationDetailProps> = ({ 
  conversation,
  conversations = [],
  totalConversations,
  onUpdateConversation,
  onAddMessage,
  isSidebarOpen
}) => {
  const { assign, isLoading: isAssigning } = useAssign();
  const { resolve, unresolve, isLoading } = useResolve();
  const { reply, isLoading: isReplying } = useReply();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSendReply = (text: string) => {
    if (!conversation) return;
    reply(
      conversation.id, 
      text, 
      (newMessage) => {
        onAddMessage(conversation.id, newMessage);
      },
      (errorMsg) => {
        setToastMessage(errorMsg);
      }
    );
  };

  const handleAssign = () => {
    if (!conversation) return;
    assign(conversation.id, (updated) => {
      onUpdateConversation(updated);
      setTimeout(() => {
        const input = document.getElementById('reply-input') as HTMLInputElement | null;
        input?.focus();
      }, 50);
    });
  };

  const handleResolve = () => {
    if (!conversation) return;
    resolve(
      conversation.id, 
      (updated) => {
        onUpdateConversation(updated);
        setToastMessage(null);
      },
      (errorMsg) => {
        setToastMessage(errorMsg);
      }
    );
  };

  if (!conversation) {
    const isInboxZero = totalConversations === 0;

    // Calculate Triage Insights
    const openConvs = conversations.filter(c => c.status === 'open' || c.status === 'assigned');
    const unassignedCount = openConvs.filter(c => c.assignedTo === null).length;
    const slaBreaches = openConvs.filter(c => c.waitingTime > 30).length;
    const avgWaitTime = openConvs.length > 0 
      ? Math.round(openConvs.reduce((acc, c) => acc + c.waitingTime, 0) / openConvs.length)
      : 0;
    const avgCsat = openConvs.length > 0 
      ? (openConvs.reduce((acc, c) => acc + c.csatScore, 0) / openConvs.length).toFixed(1)
      : '0.0';

    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-black animate-fade-in overflow-y-auto p-8">
        <div className="flex flex-col items-center max-w-lg w-full text-center">
          <div className="text-slate-300 dark:text-zinc-800 mb-4">
            <svg className="w-16 h-16 mx-auto animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isInboxZero ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              )}
            </svg>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-black dark:text-slate-100">
            {isInboxZero ? "Inbox Zero!" : "Welcome to CX Inbox"}
          </h3>
          <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400 mb-6">
            {isInboxZero ? "You have cleared all active conversations. Great job!" : "Select a conversation from the left to get started."}
          </p>

          {!isInboxZero && (
            <>
              {/* Triage Insights Grid */}
              <div className="grid grid-cols-2 gap-4 w-full mb-6 animate-fade-in">
                <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" /> Unassigned
                  </span>
                  <span className="text-[18px] font-black text-slate-800 dark:text-slate-200">
                    {unassignedCount} <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">tickets</span>
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" /> SLA Breaches
                  </span>
                  <span className={`text-[18px] font-black flex items-center justify-center gap-1.5 ${slaBreaches > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {slaBreaches}
                    {slaBreaches > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    )}
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" /> Avg Wait
                  </span>
                  <span className="text-[18px] font-black text-slate-800 dark:text-slate-200">
                    {avgWaitTime}m
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> CSAT
                  </span>
                  <span className="text-[18px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-0.5 justify-center">
                    {avgCsat}<span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/5</span>
                  </span>
                </div>
              </div>

              {/* Keyboard Shortcuts Reference */}
              <div className="w-full p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-800/80 shadow-sm dark:shadow-black/25 text-left flex flex-col gap-3.5 animate-fade-in">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block mb-1">Keyboard Shortcuts Quick Reference</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {/* Full Width Row (Navigate Queue) */}
                  <div className="md:col-span-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-zinc-900 pb-3 gap-4">
                    <span>Navigate Queue</span>
                    <div className="flex items-center gap-0.5">
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">↓</kbd>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">j</kbd>
                      <span className="text-slate-300 dark:text-slate-700 text-[10px] mx-0.5">/</span>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">↑</kbd>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">k</kbd>
                    </div>
                  </div>

                  {/* Column 1 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Focus Reply Box</span>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">i</kbd>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Unfocus / Blur</span>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">Esc</kbd>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Search Inbox</span>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">/</kbd>
                    </div>
                  </div>
                  
                  {/* Column 2 */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Assign to Self</span>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">a</kbd>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Resolve Ticket</span>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">r</kbd>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Shortcuts Guide</span>
                      <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md">?</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-white dark:bg-black h-screen shadow-[-1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[-1px_0_0_rgba(255,255,255,0.05)] z-10 overflow-hidden relative">
      {/* Action Header */}
      <header className={`flex flex-col border-b border-slate-200/80 dark:border-zinc-900 bg-white dark:bg-black py-6 flex-shrink-0 z-20 shadow-sm transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${!isSidebarOpen ? 'pl-[60px] pr-8' : 'px-8'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3 drop-shadow-sm">
              {conversation.customerName}
            </h2>
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <span className="text-slate-600 dark:text-slate-400">{conversation.customerEmail}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500">Customer since {conversation.customerSince}</span>
              <Badge variant={conversation.channel}>{conversation.channel}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Assign Button */}
            {conversation.assignedTo === 'You' ? (
              <button disabled className="bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-zinc-800 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed">
                Assigned to you
              </button>
            ) : conversation.assignedTo ? (
              <button disabled className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-zinc-900 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed">
                Assigned to {conversation.assignedTo}
              </button>
            ) : (
              <button 
                id="action-assign"
                onClick={handleAssign} 
                disabled={isAssigning}
                aria-busy={isAssigning}
                aria-live="polite"
                className="bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-50 flex items-center min-w-[120px] justify-center gap-2"
              >
                {isAssigning ? 'Assigning...' : (
                  <span className="flex items-center gap-1.5">
                    Assign to me
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-sans font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded">A</kbd>
                  </span>
                )}
              </button>
            )}

            {/* Resolve Button */}
            {conversation.status === 'resolved' ? (
              <button disabled className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed flex items-center min-w-[120px] justify-center">
                Resolved
              </button>
            ) : conversation.assignedTo === 'You' && (
              <button 
                id="action-resolve"
                onClick={handleResolve} 
                disabled={isResolving}
                aria-busy={isResolving}
                aria-live="polite"
                className="bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-400 dark:hover:bg-emerald-500 text-white border border-emerald-600 dark:border-emerald-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all duration-300 active:scale-[0.97] min-w-[120px] justify-center flex items-center gap-2 disabled:opacity-50"
              >
                {isResolving ? 'Resolving...' : (
                  <span className="flex items-center gap-1.5">
                    Resolve
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-sans font-bold text-emerald-100 dark:text-emerald-50 bg-emerald-600 dark:bg-emerald-700 border border-emerald-500 dark:border-emerald-600 rounded">R</kbd>
                  </span>
                )}
              </button>
            )}

            {/* Profile Toggle Button */}
            <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800 ml-2 mr-1"></div>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${isProfileOpen ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-600 dark:hover:text-slate-300'}`}
              aria-label="Toggle Profile Panel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {conversation.escalationReason && (
          <div className="bg-rose-50/50 dark:bg-rose-950/15 ring-1 ring-rose-200/60 dark:ring-rose-900/40 rounded-2xl p-4 flex items-start gap-4 mt-3 animate-fade-in shadow-[0_2px_12px_-4px_rgba(244,63,94,0.1)] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-rose-100/80 dark:bg-rose-950/60 flex items-center justify-center flex-shrink-0 shadow-sm border border-rose-200/50 dark:border-rose-900/60">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse"></span>
            </div>
            <div className="pt-0.5">
              <div className="text-[11px] font-bold text-rose-600/90 dark:text-rose-400 uppercase tracking-widest mb-1.5">Human Escalation Trigger</div>
              <div className="text-sm text-rose-900/90 dark:text-rose-300 font-medium leading-relaxed">{conversation.escalationReason}</div>
            </div>
          </div>
        )}
      </header>

      {/* Layout Split: Chat vs Profile Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative">
          <div className="flex-1 overflow-y-auto relative bg-white dark:bg-black">
            <ChatHistory messages={conversation.messages} />
          </div>

          <div className="p-6 border-t border-slate-200/80 dark:border-zinc-900 bg-white dark:bg-black flex-shrink-0 z-20">
            <ReplyBox 
              key={conversation.id} 
              isSending={isReplying} 
              disabled={conversation.assignedTo !== 'You' || conversation.status === 'resolved'}
              onSend={handleSendReply} 
            />
          </div>
        </div>

        {/* Right Profile Panel */}
        <AnimatePresence initial={false}>
          {isProfileOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0, borderLeftWidth: 0 }}
              animate={{ width: 320, opacity: 1, borderLeftWidth: 1 }}
              exit={{ width: 0, opacity: 0, borderLeftWidth: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full bg-slate-50 dark:bg-zinc-950 border-l border-slate-200/80 dark:border-zinc-800 overflow-hidden flex-shrink-0"
            >
              <div className="w-[320px] h-full overflow-y-auto custom-scrollbar">
                <div className="p-6 flex flex-col gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-950 border-4 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.customerName)}&background=random&color=fff`} 
                        alt={conversation.customerName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">{conversation.customerName}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{conversation.customerEmail}</p>
                    </div>
                  </div>

                  {/* Customer Metrics */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-white dark:bg-black p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800/60 shadow-sm flex flex-col items-center justify-center gap-0.5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> CSAT
                      </span>
                      <span className="text-xl font-black text-slate-700 dark:text-slate-300">{conversation.csatScore}<span className="text-sm text-slate-400 dark:text-slate-500">/5</span></span>
                    </div>
                    <div className="bg-white dark:bg-black p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800/60 shadow-sm flex flex-col items-center justify-center gap-0.5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-violet-500" /> Since
                      </span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                        {conversation.messages[0]
                          ? new Date(conversation.messages[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Details Block */}
                  <div className="mt-2 space-y-3">

                    {/* Priority */}
                    <div className="bg-white dark:bg-black rounded-xl border border-slate-200/80 dark:border-zinc-800/60 shadow-sm px-4 py-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Priority</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          conversation.priority === 'urgent' ? 'bg-rose-500' :
                          conversation.priority === 'high' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{conversation.priority} Priority</span>
                      </div>
                    </div>

                    {/* Channel */}
                    <div className="bg-white dark:bg-black rounded-xl border border-slate-200/80 dark:border-zinc-800/60 shadow-sm px-4 py-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Channel</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize flex items-center">
                          {conversation.channel === 'whatsapp' ? (
                            <>
                              <svg className="w-3.5 h-3.5 mr-1.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.556 0 10.078-4.547 10.082-10.13.002-2.705-1.047-5.249-2.956-7.16-1.91-1.91-4.448-2.961-7.164-2.962-5.56 0-10.084 4.546-10.088 10.13-.001 1.883.513 3.722 1.49 5.345l-.99 3.61 3.729-.974-.012-.009z" />
                              </svg>
                              WhatsApp
                            </>
                          ) : conversation.channel === 'email' ? (
                            <>
                              <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                              Email
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-violet-600 dark:text-violet-400" />
                              Live Chat
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Assigned To */}
                    <div className="bg-white dark:bg-black rounded-xl border border-slate-200/80 dark:border-zinc-800/60 shadow-sm px-4 py-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Assigned To</h4>
                      <div className="flex items-center gap-2">
                        {conversation.assignedTo ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                                {conversation.assignedTo.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{conversation.assignedTo}</span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                        )}
                      </div>
                    </div>

                    {/* Wait Time & Message Count */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/80 dark:border-zinc-800/60 shadow-sm px-3 py-3 flex flex-col gap-1">
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" /> Wait Time
                        </h4>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {conversation.waitingTime < 60
                            ? `${conversation.waitingTime}m`
                            : `${Math.round(conversation.waitingTime / 60)}h`}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/80 dark:border-zinc-800/60 shadow-sm px-3 py-3 flex flex-col gap-1">
                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-slate-400 dark:text-slate-500" /> Messages
                        </h4>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{conversation.messages.length}</span>
                      </div>
                    </div>

                    {/* Escalation Reason */}
                    {conversation.escalationReason && (
                      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl px-4 py-3">
                        <h4 className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400 dark:text-rose-500" /> Escalation Reason
                        </h4>
                        <p className="text-sm text-rose-700 dark:text-rose-300 font-medium leading-relaxed">{conversation.escalationReason}</p>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification for failed action */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-white dark:bg-zinc-950 border border-rose-100 dark:border-zinc-900 shadow-[0_10px_30px_-6px_rgba(244,63,94,0.15)] dark:shadow-black/40 rounded-2xl p-4 flex items-center gap-3.5 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-rose-100/80 dark:bg-rose-950/50 flex items-center justify-center shadow-sm border border-rose-200/50 dark:border-zinc-900 flex-shrink-0 animate-bounce">
              <AlertOctagon className="w-4.5 h-4.5 text-rose-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Action Failed</h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">{toastMessage}</p>
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <button 
                onClick={handleResolve} 
                className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-sm border border-rose-400 transition-colors active:scale-95"
              >
                Retry
              </button>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 p-1 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
