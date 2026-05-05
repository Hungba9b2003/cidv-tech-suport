import React from 'react';
import { X, PlayCircle, Info, CheckCircle2, Share2, UserCheck } from 'lucide-react';
import { VideoTutorial } from '../../types';
import { motion } from 'framer-motion';

export function VideoDetail({ video, onClose }: { video: VideoTutorial; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative flex h-full max-h-[850px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md text-slate-800 hover:bg-slate-100 border border-slate-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex-1 bg-slate-950 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
             <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 group shadow-2xl">
                <img 
                   src={video.thumbnailUrl} 
                   className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity"
                   referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <PlayCircle className="h-20 w-20 text-white cursor-pointer hover:scale-110 transition-transform drop-shadow-2xl" />
                  <p className="text-white/70 text-sm mt-4 font-medium backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">Sẵn sàng phát hướng dẫn</p>
                </div>
             </div>
          </div>
          
          <div className="p-6 bg-slate-900 border-t border-white/5">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">K</div>
                   <div>
                     <p className="text-sm font-bold text-white">Kỹ Thuật Viên Chuyên Trách</p>
                     <div className="flex items-center gap-1.5">
                       <UserCheck className="h-3 w-3 text-blue-400" />
                       <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Đã xác minh kỹ thuật</span>
                     </div>
                   </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </button>
             </div>
          </div>
        </div>

        <div className="w-full h-full overflow-y-auto bg-white p-8 md:w-[450px] border-l border-slate-100">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1 border border-blue-200 px-2 py-0.5 rounded">
                <Info className="h-3 w-3" />
                <span>CHUYÊN MỤC: KỸ THUẬT</span>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4 leading-tight">{video.title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {video.description}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              Các bước căn chỉnh máy ({video.steps.length})
            </h3>
            <div className="space-y-2">
              {video.steps.map((step, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center gap-4 group p-4 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-blue-200 transition-all text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {step.timestamp}
                  </span>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-100">
             <h4 className="text-xs font-bold text-blue-600 uppercase mb-2 tracking-widest">Cần trợ giúp ngay?</h4>
             <p className="text-xs text-slate-500 mb-6 leading-relaxed">Đội ngũ kỹ thuật hỗ trợ 24/7 cho khách hàng đã mua thiết bị. Kết nối ngay nếu bạn gặp vướng mắc.</p>
             <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95">
               Liên hệ Kỹ thuật (Hotline)
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
