import React from 'react';

interface PriorityGroupProps {
  label: string;
  count: number;
  colorIndicator: 'red' | 'yellow' | 'green';
  children: React.ReactNode;
}

const colorMap = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500'
};

export const PriorityGroup: React.FC<PriorityGroupProps> = ({
  label,
  count,
  colorIndicator,
  children
}) => {
  if (count === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center px-4 py-2 bg-surface/50 border-y border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className={`w-2.5 h-2.5 rounded-full mr-2.5 ${colorMap[colorIndicator]} shadow-sm`} />
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider flex-1">
          {label}
        </h3>
        <span className="bg-slate-800 text-muted text-xs py-0.5 px-2.5 rounded-full font-semibold border border-slate-700">
          {count}
        </span>
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
};
