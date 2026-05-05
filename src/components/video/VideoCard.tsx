import React, { useState } from 'react';
import { Play, Clock, Maximize2 } from 'lucide-react';
import { VideoTutorial } from '../../types';
import { motion } from 'framer-motion';
import { ImageModal } from '../common/ImageModal';

export function VideoCard({ video, onClick }: { video: VideoTutorial; onClick: () => void; key?: string }) {
  const [showZoom, setShowZoom] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="group cursor-pointer bg-white p-2 rounded-xl border border-slate-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
        onClick={onClick}
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-200">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-xl scale-90 group-hover:scale-100 transition-transform">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowZoom(true);
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 z-10"
            title="Xem ảnh lớn"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
            {video.duration}
          </div>
        </div>
        <div className="p-2 pt-3">
          <h4 className="line-clamp-2 text-sm font-bold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
            {video.title}
          </h4>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>{video.steps.length} bước kỹ thuật</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>2 ngày trước</span>
            </div>
          </div>
        </div>
      </motion.div>

      <ImageModal 
        isOpen={showZoom} 
        onClose={() => setShowZoom(false)}
        imageUrl={video.thumbnailUrl}
        title={video.title}
      />
    </>
  );
}
