import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCat = searchParams.get('cat');

  const navItems = [
    { 
      label: 'Chung', 
      icon: Icons.LayoutGrid, 
      path: '/', 
      cat: 'all',
      active: location.pathname === '/' && (!currentCat || currentCat === 'all')
    },
    { 
      label: 'Riêng', 
      icon: Icons.Lock, 
      path: '/', 
      cat: 'private',
      active: location.pathname === '/' && currentCat === 'private'
    },
    { 
      label: 'Home', 
      icon: Icons.Home, 
      path: '/', 
      cat: null,
      isMain: true,
      active: location.pathname === '/' && !currentCat 
    },
    { 
      label: 'Tin tức', 
      icon: Icons.Newspaper, 
      path: '/news', 
      active: location.pathname === '/news' 
    },
    { 
      label: 'Admin', 
      icon: Icons.ShieldCheck, 
      path: '/admin', 
      active: location.pathname === '/admin' || location.pathname === '/login'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] block md:hidden">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
      
      <div className="mx-4 mb-6 flex items-center justify-between rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/40 p-2 shadow-2xl shadow-slate-900/10 h-18">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          
          if (item.isMain) {
            return (
              <button
                key={idx}
                onClick={() => navigate('/')}
                className={cn(
                  "relative -top-6 flex h-16 w-16 items-center justify-center rounded-full transition-all shadow-xl active:scale-95",
                  item.active 
                    ? "bg-blue-600 text-white shadow-blue-600/40" 
                    : "bg-slate-900 text-white shadow-slate-900/40"
                )}
              >
                <Icon className="h-7 w-7" />
              </button>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (item.cat) navigate(`/?cat=${item.cat}`);
                else navigate(item.path);
              }}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-all py-1",
                item.active ? "text-blue-600" : "text-slate-400"
              )}
            >
              <Icon className={cn("h-5 w-5", item.active && "animate-pulse")} />
              <span className="text-[9px] font-black uppercase tracking-tighter">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
