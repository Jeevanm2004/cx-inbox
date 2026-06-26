import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

type BadgeVariant = 'whatsapp' | 'chat' | 'email' | 'open' | 'assigned' | 'resolved' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const baseStyles = "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-colors border";

const variants = {
  whatsapp: "bg-[#25D366]/10 text-[#0c6b5b] dark:text-[#4ade80] border-[#25D366]/20 dark:border-[#25D366]/30",
  chat: "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/50",
  email: "bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/50",
  open: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
  assigned: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
  resolved: "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/50",
  default: "bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50"
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const renderIcon = () => {
    switch (variant) {
      case 'whatsapp':
        return (
          <svg className="w-2.5 h-2.5 mr-1 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.556 0 10.078-4.547 10.082-10.13.002-2.705-1.047-5.249-2.956-7.16-1.91-1.91-4.448-2.961-7.164-2.962-5.56 0-10.084 4.546-10.088 10.13-.001 1.883.513 3.722 1.49 5.345l-.99 3.61 3.729-.974-.012-.009z" />
          </svg>
        );
      case 'chat':
        return <MessageSquare className="w-2.5 h-2.5 mr-1 text-violet-600 dark:text-violet-400" />;
      case 'email':
        return <Mail className="w-2.5 h-2.5 mr-1 text-slate-500 dark:text-slate-400" />;
      default:
        return null;
    }
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {renderIcon()}
      {children}
    </span>
  );
};
