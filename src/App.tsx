import { useCallback, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X, PanelLeft } from 'lucide-react'
import { InboxList } from './components/inbox/InboxList'
import { ConversationDetail } from './components/conversation/ConversationDetail'
import { useConversations } from './hooks/useConversations'
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
import type { Conversation, Message } from './types'

function App() {
  const { state, dispatch, setSelectedId, refetch } = useConversations();
  const { conversations, selectedConversationId, isLoading, error } = state;
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      let newWidth = e.clientX;
      if (newWidth < 280) newWidth = 280; // Min width
      if (newWidth > 800) newWidth = 800; // Max width
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Mirror the manual refresh button: run the same fetch on initial page load
  useEffect(() => {
    refetch();
  }, [refetch]);

  const activeConversation = conversations.find(c => c.id === selectedConversationId) || null;

  const handleAssignTrigger = useCallback(() => document.getElementById('action-assign')?.click(), []);
  const handleResolveTrigger = useCallback(() => document.getElementById('action-resolve')?.click(), []);
  const handleFocusTrigger = useCallback(() => {
    const input = document.getElementById('reply-input') as HTMLTextAreaElement | null;
    if (input && !input.disabled) {
      input.focus();
    }
  }, []);

  useKeyboardNavigation({
    conversations,
    selectedConversationId,
    setSelectedConversationId: setSelectedId,
    onAssign: handleAssignTrigger,
    onResolve: handleResolveTrigger,
    onFocusInput: handleFocusTrigger,
    onOpenHelp: () => setIsHelpOpen(true),
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 overflow-hidden relative">
      <div 
        style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '0px' }}
        className={`relative flex-shrink-0 overflow-hidden ${
          !isDragging ? 'transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]' : ''
        }`}
      >
        <div className="h-full absolute left-0 top-0" style={{ width: `${sidebarWidth}px` }}>
          <InboxList 
            conversations={conversations} 
            isLoading={isLoading}
            error={error}
            selectedId={selectedConversationId} 
            onSelectConversation={setSelectedId} 
            onRetry={refetch}
            onToggleSidebar={() => setIsSidebarOpen(false)}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          />
        </div>
        
        {/* Draggable Resizer Handle */}
        {isSidebarOpen && (
          <div 
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-primary/40 dark:hover:bg-violet-500/40 transition-colors z-50 group flex items-center justify-center"
            onMouseDown={(e) => {
              e.preventDefault(); // prevent text selection
              setIsDragging(true);
            }}
          >
            <div className={`w-[3px] h-8 bg-slate-500 dark:bg-zinc-700 rounded-full transition-opacity ${isDragging ? 'opacity-100 bg-primary dark:bg-violet-500' : 'opacity-0 group-hover:opacity-100'}`}></div>
          </div>
        )}
      </div>

      {/* Top-Left Toggle Button (only shown when sidebar is closed) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-[22px] left-4 z-50 p-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-md shadow-sm active:scale-95 flex items-center justify-center"
          aria-label="Open Inbox Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}

      <ConversationDetail 
        conversation={activeConversation} 
        conversations={conversations}
        totalConversations={conversations.length}
        isSidebarOpen={isSidebarOpen}
        onUpdateConversation={(c: Conversation) => dispatch({ type: 'UPDATE_CONVERSATION', payload: c })}
        onAddMessage={(id: string, message: Message) => dispatch({ type: 'ADD_MESSAGE', payload: { conversationId: id, message } })}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsHelpOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white dark:bg-zinc-950 rounded-3xl p-7 max-w-md w-full border border-slate-100 dark:border-zinc-900 shadow-2xl dark:shadow-black/50 flex flex-col gap-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shadow-sm border border-violet-200 dark:border-violet-900/60">
                  <Keyboard className="w-5.5 h-5.5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Keyboard Shortcuts</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">Work instantly without leaving your keyboard</p>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Navigate queue</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">↓</kbd>
                    <span className="text-slate-300 dark:text-slate-700 text-xs">/</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">j</kbd>
                    <span className="text-slate-400 dark:text-slate-600 text-xs mx-1">and</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">↑</kbd>
                    <span className="text-slate-300 dark:text-slate-700 text-xs">/</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">k</kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Focus reply box</span>
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">i</kbd>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unfocus / Blur</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">Esc</kbd>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Assign conversation</span>
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">a</kbd>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Resolve conversation</span>
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">r</kbd>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-900">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Search inbox</span>
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">/</kbd>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Show keyboard help</span>
                  <kbd className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">?</kbd>
                </div>
              </div>

              <button 
                onClick={() => setIsHelpOpen(false)}
                className="mt-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-300 active:scale-95 text-center shadow-lg shadow-violet-600/10 dark:shadow-violet-950/20 border border-violet-500/20"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
