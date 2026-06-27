import React, { useState } from 'react';
import { RotateCw, Search, X, TrendingUp, Star, WifiOff, Inbox, PanelLeftClose, ChevronDown, Sun, Moon } from 'lucide-react';
import type { Conversation } from '../../types';
import { groupConversationsByPriority } from '../../utils/priority';
import { ConversationCard } from './ConversationCard';

interface InboxListProps {
  conversations: Conversation[];
  isLoading?: boolean;
  error?: string | null;
  selectedId?: string;
  onSelectConversation: (id: string) => void;
  onRetry?: () => void;
  onToggleSidebar?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const InboxList: React.FC<InboxListProps> = ({ 
  conversations, 
  isLoading,
  error,
  selectedId, 
  onSelectConversation,
  onRetry,
  onToggleSidebar,
  theme = 'light',
  onToggleTheme
}) => {
  const [filterType, setFilterType] = useState<'open' | 'resolved'>('open');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high' | 'normal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);

  const filteredConversations = conversations.filter(c => {
    const matchesStatus = filterType === 'open' 
      ? (c.status === 'open' || c.status === 'assigned') 
      : c.status === 'resolved';
    const matchesSearch = searchQuery.trim() === '' || 
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.escalationReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const { urgent, high, normal } = groupConversationsByPriority(filteredConversations);

  const renderSkeletonSection = (title: string, count: number) => (
    <div className="mb-6 px-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</span>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-6 animate-pulse"></div>
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-8"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // We compute stats based on all active/open conversations (independent of search query)
  const openConvs = conversations.filter(c => c.status === 'open' || c.status === 'assigned');
  const unassignedCount = openConvs.filter(c => c.assignedTo === null).length;
  const slaBreaches = openConvs.filter(c => c.waitingTime > 30).length;
  const avgCsat = openConvs.length > 0 
    ? (openConvs.reduce((acc, c) => acc + c.csatScore, 0) / openConvs.length).toFixed(1)
    : '0.0';

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black border-r border-slate-200/60 dark:border-zinc-800 relative z-20">
      <div className="px-5 pt-6 pb-4 border-b border-slate-200/60 dark:border-zinc-800 bg-slate-50 dark:bg-black sticky top-0 z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="CX Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <h2 className="text-xl font-bold text-black dark:text-slate-100 tracking-tight">Inbox</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Number Box / Loader */}
            {isLoading ? (
              <div className="h-5 bg-slate-100 dark:bg-zinc-900 rounded w-12 animate-pulse"></div>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-600 text-white shadow-sm">
                {filteredConversations.length}
              </span>
            )}
            
            {/* Refresh Button */}
            <button 
              onClick={onRetry} 
              disabled={isLoading}
              className={`p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
              title="Refresh conversations"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Sidebar Toggle Button */}
            <button 
              onClick={onToggleSidebar}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-md transition-all active:scale-95 flex items-center justify-center"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queue... (Press '/' to focus)"
            className="block w-full pl-8 pr-10 py-1.5 text-xs bg-slate-200/50 hover:bg-slate-200/80 focus:bg-white dark:bg-zinc-950 dark:hover:bg-zinc-900/80 dark:focus:bg-black text-slate-900 dark:text-slate-100 border border-slate-200/20 dark:border-zinc-800/60 focus:border-violet-300 dark:focus:border-violet-500/60 rounded-xl outline-none transition-all duration-200 shadow-inner"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {!searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded">/</kbd>
            </div>
          )}
        </div>

        {/* Triage Insights Dashboard (only shown when not loading, and matches Open tab) */}
        {!isLoading && !error && filterType === 'open' && (
          <div className="bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-3 shadow-sm transition-all duration-300">
            <button 
              onClick={() => setShowStats(!showStats)}
              className={`flex items-center justify-between w-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group animate-fade-in ${showStats ? 'mb-2' : ''}`}
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Triage Insights</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-300 ${showStats ? 'rotate-180' : ''}`} />
            </button>
            
            {showStats && (
              <div className="grid grid-cols-2 gap-2 pt-0.5 animate-fade-in">
                <div className="bg-slate-50 dark:bg-black hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 p-2.5 rounded-xl border border-slate-200/40 dark:border-zinc-800/50 flex flex-col items-center justify-center text-center transition-colors">
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Unassigned</span>
                  <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 mt-0.5">{unassignedCount} <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">tickets</span></span>
                </div>
                <div className="bg-slate-50 dark:bg-black hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 p-2.5 rounded-xl border border-slate-200/40 dark:border-zinc-800/50 flex flex-col items-center justify-center text-center transition-colors">
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">SLA Breaches</span>
                  <span className={`text-[13px] font-black mt-0.5 flex items-center justify-center gap-1.5 ${slaBreaches > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {slaBreaches}
                    {slaBreaches > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-pulse" />}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-black hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 p-2.5 rounded-xl border border-slate-200/40 dark:border-zinc-800/50 flex flex-col items-center justify-center text-center transition-colors">
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Wait Time</span>
                  <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 mt-0.5">
                    {openConvs.length > 0 
                      ? `${Math.round(openConvs.reduce((acc, c) => acc + c.waitingTime, 0) / openConvs.length)}m`
                      : '0m'}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-black hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 p-2.5 rounded-xl border border-slate-200/40 dark:border-zinc-800/50 flex flex-col items-center justify-center text-center transition-colors">
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg CSAT</span>
                  <span className="text-[13px] font-black text-slate-800 dark:text-slate-200 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {avgCsat}<span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">/5</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex bg-slate-200/50 dark:bg-black p-1 rounded-[14px] border border-slate-200/50 dark:border-zinc-800/40 shadow-inner">
          <button
            onClick={() => setFilterType('open')}
            className={`flex-1 py-1.5 px-3 rounded-[10px] text-[13px] font-semibold transition-all duration-300 ${
              filterType === 'open' 
                ? 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-zinc-800' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-zinc-900/40'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilterType('resolved')}
            className={`flex-1 py-1.5 px-3 rounded-[10px] text-[13px] font-semibold transition-all duration-300 ${
              filterType === 'resolved' 
                ? 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08),_0_1px_2px_-1px_rgba(0,0,0,0.04)] ring-1 ring-inset ring-slate-900/5 dark:ring-zinc-800 border dark:border-zinc-800' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-zinc-900/40'
            }`}
          >
            Closed
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-4 pb-4">
        {isLoading ? (
          <div className="mt-4">
            <div className="flex flex-col gap-3">
              {renderSkeletonSection("Urgent", 1)}
              {renderSkeletonSection("High Priority", 2)}
              {renderSkeletonSection("Normal", 3)}
            </div>
          </div>
        ) : error ? (
          <div className="m-5 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center justify-center text-center mt-8 shadow-inner animate-fade-in">
            <WifiOff className="w-10 h-10 text-rose-500 mb-3 animate-gentle-shake" />
            <h3 className="text-rose-700 font-bold mb-1.5 text-lg">Failed to load.</h3>
            <p className="text-rose-600 text-sm mb-5 leading-relaxed">The server refused the connection. Please try reconnecting.</p>
            <button 
              onClick={onRetry}
              className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-transform duration-200 active:scale-95 w-full shadow-lg shadow-rose-900/10 ring-1 ring-rose-500/20"
            >
              Try Again
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 pb-20 text-center animate-fade-in">
            <Inbox className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4 animate-float" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1.5">All caught up!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">There are no active conversations in the queue.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Unified Priority Summary Header — only shown on Open tab */}
            {filterType === 'open' && (
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-black border-b border-slate-200/60 dark:border-zinc-800 sticky top-0 z-10 gap-2">
                {/* ALL button */}
                <button
                  onClick={() => setPriorityFilter('all')}
                  className={`flex flex-col items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl transition-all duration-300 ${priorityFilter === 'all' ? 'bg-white dark:bg-zinc-950 shadow-sm border border-violet-100 dark:border-zinc-800' : 'hover:bg-slate-100/80 dark:hover:bg-zinc-900/60'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:inline-block ${priorityFilter === 'all' ? 'text-violet-700 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`}>All</span>
                  </div>
                  <span className={`text-[12px] font-bold ${priorityFilter === 'all' ? 'text-violet-700 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'}`}>{filteredConversations.length}</span>
                </button>

                <div className="w-px h-8 bg-slate-100/80 dark:bg-zinc-850"></div>

                <button 
                  onClick={() => setPriorityFilter(priorityFilter === 'urgent' ? 'all' : 'urgent')}
                  className={`flex flex-col items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl transition-all duration-300 ${priorityFilter === 'urgent' ? 'bg-white dark:bg-zinc-950 shadow-sm border border-rose-100 dark:border-zinc-800' : 'hover:bg-slate-100/80 dark:hover:bg-zinc-900/60'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${priorityFilter === 'urgent' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-rose-400'}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:inline-block ${priorityFilter === 'urgent' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>Urgent</span>
                  </div>
                  <span className={`text-[12px] font-bold ${priorityFilter === 'urgent' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>{urgent.length}</span>
                </button>
                
                <div className="w-px h-8 bg-slate-100/80 dark:bg-zinc-850"></div>
                
                <button 
                  onClick={() => setPriorityFilter(priorityFilter === 'high' ? 'all' : 'high')}
                  className={`flex flex-col items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl transition-all duration-300 ${priorityFilter === 'high' ? 'bg-white dark:bg-zinc-950 shadow-sm border border-amber-100 dark:border-zinc-800' : 'hover:bg-slate-100/80 dark:hover:bg-zinc-900/60'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${priorityFilter === 'high' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-amber-400'}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:inline-block ${priorityFilter === 'high' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>High</span>
                  </div>
                  <span className={`text-[12px] font-bold ${priorityFilter === 'high' ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>{high.length}</span>
                </button>
                
                <div className="w-px h-8 bg-slate-100/80 dark:bg-zinc-850"></div>
                
                <button 
                  onClick={() => setPriorityFilter(priorityFilter === 'normal' ? 'all' : 'normal')}
                  className={`flex flex-col items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl transition-all duration-300 ${priorityFilter === 'normal' ? 'bg-emerald-50 dark:bg-zinc-950/60 ring-1 ring-emerald-200 dark:ring-zinc-800 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.1)]' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/60'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${priorityFilter === 'normal' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-emerald-400'}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:inline-block ${priorityFilter === 'normal' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>Normal</span>
                  </div>
                  <span className={`text-[12px] font-bold ${priorityFilter === 'normal' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{normal.length}</span>
                </button>
              </div>
            )}

            {/* Single flat list — sorted urgent → high → normal.
                On the Closed tab, priorityFilter is ignored so all resolved conversations always appear. */}
            <div className="flex flex-col px-4 py-3 gap-3 pb-24">
              {(() => {
                const visibleConvs =
                  filterType === 'resolved'
                    ? [...urgent, ...high, ...normal] // always show ALL resolved, ignore priorityFilter
                    : priorityFilter === 'urgent' ? urgent
                    : priorityFilter === 'high' ? high
                    : priorityFilter === 'normal' ? normal
                    : [...urgent, ...high, ...normal]; // 'all' — sorted by priority

                return visibleConvs.map(conv => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    isSelected={selectedId === conv.id}
                    onSelect={() => onSelectConversation(conv.id)}
                  />
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Agent Profile Footer - Floating Pill Design */}
      <div className="flex-shrink-0 m-4 mt-auto p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="https://randomuser.me/api/portraits/women/44.jpg" 
              alt="Sarah Chen"
              className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-zinc-800"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-black dark:text-slate-100 tracking-wide">Sarah Chen</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">sarah.chen@innovate.io</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Vertical Separator */}
          <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 flex-shrink-0" />

          {/* Theme Toggle Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleTheme?.();
            }}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-all active:scale-95 flex items-center justify-center border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
