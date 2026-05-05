import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '../../types';
import { cn } from '../../lib/utils';

export function Sidebar({
  categories,
  selectedId,
  onSelect,
  onContactClick,
}: {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onContactClick?: () => void;
}) {
  return (
    <aside className="hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-200 bg-white p-6 md:flex">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Danh mục máy móc
        </h3>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            !selectedId ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Icons.LayoutGrid className="h-4 w-4" />
          Tất cả video
        </button>
        {categories.map((cat) => {
          const IconComponent = (Icons as any)[cat.icon] || Icons.Circle;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                selectedId === cat.id ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <IconComponent className="h-4 w-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Hỗ trợ & Bảo mật
        </h3>
        
        <button
          onClick={onContactClick}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all border border-blue-100 bg-blue-50/50 text-blue-600 hover:bg-blue-600 hover:text-white group"
        >
          <Icons.PhoneCall className="h-4 w-4 group-hover:animate-bounce" />
          Gọi kỹ thuật
        </button>

        <button
          onClick={() => onSelect('private')}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all border",
            selectedId === 'private' 
              ? "bg-slate-900 text-white border-blue-600 shadow-lg shadow-blue-600/10" 
              : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
          )}
        >
          <Icons.Lock className="h-4 w-4 text-blue-500" />
          Video Xưởng Riêng
        </button>
      </div>
    </aside>
  );
}
