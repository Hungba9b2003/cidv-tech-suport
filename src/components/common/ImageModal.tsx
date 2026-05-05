import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 md:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls */}
            <div className="absolute -top-12 right-0 flex items-center gap-4">
               {title && (
                 <span className="text-white text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg mr-auto">
                    {title}
                 </span>
               )}
               <a 
                 href={imageUrl} 
                 target="_blank" 
                 rel="no-referrer"
                 className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                 title="Mở trong tab mới"
               >
                 <Download className="h-5 w-5" />
               </a>
               <button 
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
               >
                 <X className="h-6 w-6" />
               </button>
            </div>

            <img 
              src={imageUrl} 
              alt={title || 'Enlarged view'} 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10 object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
