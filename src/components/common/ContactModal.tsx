import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageSquare, Mail, Clock, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl relative border border-slate-100"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-6 shadow-inner">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Hỗ trợ Kỹ thuật 24/7</h2>
              <p className="text-slate-500 font-medium mt-2">Chúng tôi luôn sẵn sàng hỗ trợ bạn vận hành máy móc an toàn và hiệu quả.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-10">
              <a 
                href="tel:0123456789" 
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-white transition-all group"
              >
                <div className="h-12 w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hotline Kỹ thuật</p>
                  <p className="text-lg font-black text-slate-800">0123 456 789</p>
                </div>
              </a>

              <a 
                href="https://zalo.me/0123456789" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-white transition-all group"
              >
                <div className="h-12 w-12 bg-sky-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zalo Kỹ thuật</p>
                  <p className="text-lg font-black text-slate-800">Cơ khí Tùng Lâm</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="h-12 w-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian làm việc</p>
                  <p className="text-sm font-bold text-slate-700">Thứ 2 - Thứ 7: 08:00 - 18:00</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-slate-50">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cùng nhau vận hành tương lai</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
