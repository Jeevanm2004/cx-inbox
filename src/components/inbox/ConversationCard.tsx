import React from 'react';
import { Star, AlertTriangle } from 'lucide-react';
import type { Conversation } from '../../types';
import { formatWaitingTime } from '../../utils/format';
import { Badge } from '../shared/Badge';

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}

const priorityDotStyles = {
  urgent: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]',
  high: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]',
  normal: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
};

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onSelect
}) => {
  const isOtherAgent = conversation.assignedTo !== null && conversation.assignedTo !== 'You';

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.slice(0, 2);
  };

  return (
    <button
      onClick={onSelect}
      aria-selected={isSelected}
      title={isOtherAgent ? `Assigned to ${conversation.assignedTo}` : undefined}
      className={`group w-full text-left p-4 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] outline-none relative overflow-hidden transform border
        ${isSelected 
          ? 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-md shadow-slate-200/50 dark:shadow-black/25' 
          : conversation.waitingTime > 30 && conversation.status !== 'resolved'
            ? 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/40 hover:border-rose-200 dark:hover:border-rose-800 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 hover:shadow-sm'
            : 'bg-transparent border-transparent hover:border-slate-200/80 dark:hover:border-zinc-800/80 hover:bg-white/60 dark:hover:bg-zinc-950/30 hover:shadow-sm'
        }
        `}
    >
      {/* Glowing Active Border */}
      <div 
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md transition-all duration-300 ease-out z-10 ${
          isSelected ? 'bg-violet-600' : 'bg-transparent'
        }`} 
      />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 truncate pr-2">
          <div className="relative flex-shrink-0">
            <img 
              src={`https://i.pravatar.cc/150?u=${conversation.id}`}
              alt={conversation.customerName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200/60 dark:border-zinc-800 shadow-sm bg-slate-50 dark:bg-black"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.customerName)}&background=F1F5F9&color=475569&bold=true`;
              }}
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-black ${priorityDotStyles[conversation.priority]}`} />
          </div>
          <div className="font-bold text-[14px] text-slate-900 dark:text-slate-100 tracking-tight truncate">
            {conversation.customerName}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 mt-1">
          <div className="text-[10px] font-bold text-slate-700 dark:text-slate-400 tracking-widest uppercase whitespace-nowrap">
            {formatWaitingTime(conversation.waitingTime)}
          </div>
          {isOtherAgent && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-zinc-900 text-[9px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-zinc-800 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
              {getInitials(conversation.assignedTo!)}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 mb-3 items-center">
        <Badge variant={conversation.channel}>{conversation.channel}</Badge>
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-black/60 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-zinc-800/40">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          CSAT {conversation.csatScore}
        </div>
        {conversation.waitingTime > 30 && conversation.status !== 'resolved' && (
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/60 animate-pulse">
            <span className="w-1 h-1 rounded-full bg-rose-500 dark:bg-rose-400 inline-block shadow-[0_0_6px_rgba(244,63,94,0.6)]"></span>
            SLA Breach
          </div>
        )}
      </div>

      {conversation.escalationReason && (
        <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium mb-2.5 truncate px-2.5 py-1.5 bg-rose-50/80 dark:bg-rose-950/40 rounded-lg border border-rose-100/80 dark:border-rose-900/60 inline-flex items-center gap-1.5 max-w-full">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 animate-pulse" />
          <span className="truncate">{conversation.escalationReason}</span>
        </div>
      )}

      <div className="flex items-start gap-2 mt-2">
        <div className="text-[13px] text-slate-800 dark:text-slate-300 leading-[1.6] line-clamp-2 flex-1 font-medium tracking-normal pr-4">
          {conversation.lastMessage}
        </div>
      </div>
    </button>
  );
};
