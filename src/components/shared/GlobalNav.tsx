import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    )
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: (
      <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

export const GlobalNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <nav className="w-16 lg:w-20 h-screen bg-slate-950 border-r border-slate-900 flex flex-col items-center py-6 flex-shrink-0 z-50">
      {/* App Logo / Brand */}
      <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm mb-8 shadow-md shadow-violet-900/30 ring-1 ring-violet-500/20">
        CX
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-6 w-full px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative w-full aspect-square flex items-center justify-center rounded-xl transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 group z-10 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 bg-violet-600 rounded-xl shadow-lg shadow-violet-700/25 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-y-0 -left-3 w-1 bg-white rounded-r-md"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                </>
              )}
              <span className="relative z-10">
                {item.icon}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-4 w-full px-3 items-center">
        {/* Settings */}
        <button 
          className="w-full aspect-square flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90"
          aria-label="Settings"
        >
          <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Profile */}
        <button className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden hover:ring-2 hover:ring-violet-500/50 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-full h-full object-cover" />
        </button>
      </div>
    </nav>
  );
};