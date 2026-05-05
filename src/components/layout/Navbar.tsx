import React from 'react';
import { Search, Menu, User, PlayCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Navbar({ onSearch }: { onSearch: (query: string) => void }) {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 shadow-lg shadow-blue-600/20">
              <PlayCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-slate-800">
              TECH<span className="text-blue-600">GUIDE</span>
            </span>
          </div>
          
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm hướng dẫn..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            <button onClick={() => navigate('/')} className="text-xs font-black uppercase tracking-widest text-slate-800 hover:text-blue-600 transition-colors">Trang chủ</button>
            <button onClick={() => navigate('/news')} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Tin tức</button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button 
            onClick={() => {
              const isAdmin = localStorage.getItem('is_admin') === 'true';
              navigate(isAdmin ? '/admin' : '/login');
            }}
            className="flex h-10 w-10 md:w-auto items-center justify-center gap-2 md:px-4 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all text-sm font-bold border border-transparent hover:border-blue-100"
          >
            <ShieldCheck className="h-5 w-5" />
            <span className="hidden md:inline">Admin</span>
          </button>
          
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
            <User className="h-5 w-5 text-slate-600" />
          </div>
          
          <button className="sm:hidden p-2 text-slate-600">
             <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
