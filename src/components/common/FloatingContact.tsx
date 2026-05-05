import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';

interface FloatingContactProps {
  onClick: () => void;
}

export function FloatingContact({ onClick }: FloatingContactProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-colors border-4 border-white"
    >
      <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      <PhoneCall className="h-7 w-7" />
      
      <div className="absolute right-20 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
         <p className="text-xs font-black text-slate-800">Cần hỗ trợ kỹ thuật?</p>
      </div>
    </motion.button>
  );
}
