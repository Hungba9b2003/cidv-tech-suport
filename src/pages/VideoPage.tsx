import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, PlayCircle, Info, CheckCircle2, Share2, UserCheck, ChevronLeft, Settings, Maximize } from 'lucide-react';
import { VideoTutorial } from '../types';
import { MOCK_VIDEOS } from '../data/mockData';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { BottomNav } from '../components/layout/BottomNav';
import { ImageModal } from '../components/common/ImageModal';
import { ContactModal } from '../components/common/ContactModal';
import { FloatingContact } from '../components/common/FloatingContact';
import { Maximize2, ZoomIn } from 'lucide-react';

export default function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoTutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{url: string, title?: string} | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      if (!id) return;
      try {
        const docRef = doc(db, 'videos', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setVideo({ id: docSnap.id, ...docSnap.data() } as VideoTutorial);
        } else {
          // Fallback to mock
          const mock = MOCK_VIDEOS.find(v => v.id === id);
          if (mock) setVideo(mock);
        }
      } catch (err) {
        // Fallback to mock
        const mock = MOCK_VIDEOS.find(v => v.id === id);
        if (mock) setVideo(mock);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Đang tải hướng dẫn...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy video</h1>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-600 font-bold hover:underline"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  // Helper to convert time string to seconds
  const timeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const totalSeconds = video ? timeToSeconds(video.duration) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 md:pb-0">
      <Navbar onSearch={() => {}} />
      <BottomNav />
      
      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-3 md:mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors py-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Quay lại
        </button>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-2xl group">
               <img 
                  src={video.thumbnailUrl} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <PlayCircle className="h-16 w-16 md:h-24 md:w-24 text-white cursor-pointer hover:scale-110 transition-transform drop-shadow-2xl" />
                 <p className="text-white/80 text-[10px] md:text-sm mt-4 font-bold backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                   Bắt đầu xem hướng dẫn
                 </p>
               </div>
               
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   if (video) setZoomedImage({ url: video.thumbnailUrl, title: video.title });
                 }}
                 className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10"
                 title="Phóng to ảnh thumbnail"
               >
                 <ZoomIn className="h-6 w-6" />
               </button>
               
               {/* Controls Bar with YouTube-style segments */}
               <div className="absolute bottom-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                 {/* Progress Bar Segments */}
                 <div className="flex gap-1 mb-4 group/progress cursor-pointer">
                    {video.steps.map((step, idx) => {
                      const startTime = timeToSeconds(step.timestamp);
                      const nextStep = video.steps[idx + 1];
                      const endTime = nextStep ? timeToSeconds(nextStep.timestamp) : totalSeconds;
                      const segmentDuration = endTime - startTime;
                      const widthPercentage = (segmentDuration / totalSeconds) * 100;

                      return (
                        <div 
                          key={idx}
                          className="h-1.5 md:h-2 bg-white/20 rounded-full relative group/segment group-hover/progress:h-2 md:group-hover/progress:h-3 transition-all"
                          style={{ width: `${widthPercentage}%` }}
                        >
                          {/* Inner progress - simulation for segment 1 */}
                          {idx === 0 && (
                            <div className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)] w-full"></div>
                          )}
                          
                          {/* Segment Label on Hover (Hidden on mobile) */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900/95 backdrop-blur text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/segment:opacity-100 whitespace-nowrap pointer-events-none transition-all transform translate-y-2 group-hover/segment:translate-y-0 shadow-xl z-20 hidden md:block">
                            {step.title}
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95" />
                          </div>
                        </div>
                      );
                    })}
                 </div>

                 <div className="flex items-center justify-between text-white text-[10px] md:text-xs font-bold">
                    <div className="flex items-center gap-4">
                      <span>00:00 / {video.duration}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Settings className="h-4 w-4 md:h-5 md:w-5" />
                      <Maximize className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
                <div>
                  <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">{video.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-blue-600/20">KT</div>
                       <div>
                         <p className="text-sm md:text-base font-black text-slate-800">Kỹ thuật viên Tuấn Anh</p>
                         <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Đã xác minh chính chủ</p>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 md:gap-3">
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                  </button>
                  <button className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                    Đăng ký
                  </button>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-black text-slate-800 m-0">Mô tả hướng dẫn</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-[450px] flex flex-col gap-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                Nội dung chi tiết ({video.steps.length} phần)
              </h3>
              <div className="space-y-3">
                {video.steps.map((step, idx) => (
                  <button 
                    key={idx}
                    className="w-full flex items-center gap-4 group p-4 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all text-left"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[11px] font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      {step.timestamp}
                    </span>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-blue-50 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-600 uppercase mb-2 tracking-widest">Hỗ trợ trực tiếp</h4>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">Bạn cần giải đáp trực tiếp về video này? Kết nối với chuyên gia của chúng tôi ngay.</p>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Gọi kỹ thuật hỗ trợ
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Video liên quan</h3>
               {MOCK_VIDEOS.filter(v => v.id !== video.id).map(rVideo => (
                  <div 
                    key={rVideo.id}
                    onClick={() => navigate(`/video/${rVideo.id}`)}
                    className="flex gap-4 p-3 bg-white rounded-2xl border border-slate-100 hover:border-blue-300 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className="w-32 h-20 rounded-xl bg-slate-200 overflow-hidden relative flex-shrink-0">
                      <img src={rVideo.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        {rVideo.duration}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between py-1">
                       <h4 className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600">
                         {rVideo.title}
                       </h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">Phòng kỹ thuật • 2 ngày trước</p>
                    </div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <FloatingContact onClick={() => setShowContactModal(true)} />
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)}
      />

      <ImageModal 
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        imageUrl={zoomedImage?.url || ''}
        title={zoomedImage?.title}
      />
    </div>
  );
}

// Sidebar Area
