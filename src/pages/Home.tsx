import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Category, VideoTutorial, WorkshopCode, VideoGroup } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { VideoCard } from '../components/video/VideoCard';
import { MOCK_CATEGORIES, MOCK_VIDEOS, MOCK_WORKSHOPS, MOCK_GROUPS } from '../data/mockData';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactModal } from '../components/common/ContactModal';
import { FloatingContact } from '../components/common/FloatingContact';
import { cn } from '../lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [videos, setVideos] = useState<VideoTutorial[]>(MOCK_VIDEOS);
  const [groups, setGroups] = useState<VideoGroup[]>(MOCK_GROUPS);
  const [workshopCodes, setWorkshopCodes] = useState<WorkshopCode[]>(MOCK_WORKSHOPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeWorkshop, setActiveWorkshop] = useState<WorkshopCode | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Load logic
    const savedCode = localStorage.getItem('workshop_code');
    if (savedCode) {
      const workshop = MOCK_WORKSHOPS.find(w => w.code === savedCode);
      if (workshop) {
        setActiveWorkshop(workshop);
      }
    }

    async function fetchData() {
      // Mocked for now, but keeping the structure
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (catParam === 'private' && !activeWorkshop) {
      setShowCodeInput(true);
      setSelectedCategoryId(null); // Wait for code
    } else if (catParam === 'all') {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(catParam);
    }
  }, [catParam, activeWorkshop]);

  const handleApplyCode = () => {
    const workshop = workshopCodes.find(w => w.code === inputCode.trim());
    if (workshop) {
      setActiveWorkshop(workshop);
      localStorage.setItem('workshop_code', workshop.code);
      setShowCodeInput(false);
      setSelectedCategoryId('private');
      setErrorMsg('');
    } else {
      setErrorMsg('Mã truy cập không tồn tại hoặc đã hết hạn');
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategoryId === 'private') {
      if (!activeWorkshop) return false;
      return matchesSearch && activeWorkshop.permittedVideoIds.includes(video.id);
    }

    const matchesCategory = selectedCategoryId ? video.categoryId === selectedCategoryId : true;
    return matchesSearch && matchesCategory && !video.isPrivate;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600/10 selection:text-blue-600 pb-20 md:pb-0">
      <Navbar onSearch={setSearchQuery} />
      <BottomNav />
      
      <div className="flex max-w-[1920px] mx-auto">
        <Sidebar 
          categories={categories} 
          selectedId={selectedCategoryId} 
          onSelect={(id) => {
            if (id === 'private' && !activeWorkshop) {
              setShowCodeInput(true);
            } else {
              setSelectedCategoryId(id);
            }
          }} 
          onContactClick={() => setShowContactModal(true)}
        />
        
        <main className="flex-1 p-4 md:p-6 h-[calc(100vh-64px)] overflow-y-auto relative scroll-smooth">
          <FloatingContact onClick={() => setShowContactModal(true)} />
          
          {/* Mobile Category Scroll */}
          <div className="md:hidden flex overflow-x-auto gap-1.5 pb-4 no-scrollbar -mx-4 px-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 pt-2 border-b border-slate-100">
            <button 
              onClick={() => navigate('/')}
              className={cn(
                "whitespace-nowrap px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all",
                !selectedCategoryId ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "bg-white text-slate-400 border border-slate-200"
              )}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => navigate(`/?cat=${cat.id}`)}
                className={cn(
                  "whitespace-nowrap px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all",
                  selectedCategoryId === cat.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-400 border border-slate-200"
                )}
              >
                {cat.name}
              </button>
            ))}
            <button 
              onClick={() => {
                navigate('/?cat=private');
              }}
              className={cn(
                "whitespace-nowrap px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5",
                selectedCategoryId === 'private' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white text-slate-400 border border-slate-200"
              )}
            >
              <Icons.Lock className="h-3 w-3" />
              Xưởng riêng
            </button>
          </div>

          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 md:text-3xl uppercase">
                {selectedCategoryId === 'private' 
                  ? `Video Xưởng (${activeWorkshop?.name})`
                  : selectedCategoryId 
                    ? categories.find(c => c.id === selectedCategoryId)?.name 
                    : "Hướng dẫn vận hành"}
              </h1>
              <p className="mt-1 text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">
                {selectedCategoryId === 'private' 
                  ? "Dành riêng cho đơn vị của bạn" 
                  : `Kho tài liệu video hỗ trợ khách hàng`}
              </p>
            </div>
            
            {selectedCategoryId === 'private' && (
              <button 
                onClick={() => {
                  localStorage.removeItem('workshop_code');
                  setActiveWorkshop(null);
                  setSelectedCategoryId(null);
                }}
                className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-100 px-3 py-1.5 rounded-lg bg-red-50"
              >
                Đăng xuất xưởng
              </button>
            )}
            
            {selectedCategoryId !== 'private' && (
              <div className="flex items-center gap-2">
                 <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Sắp xếp:</span>
                 <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                   <option>Mới nhất</option>
                   <option>Xem nhiều</option>
                 </select>
              </div>
            )}
          </div>

          {/* Groups Section */}
          {(!selectedCategoryId || selectedCategoryId === 'all') && groups.length > 0 && !searchQuery && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Icons.Layers className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Bộ video hướng dẫn</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map(group => (
                  <div 
                    key={group.id}
                    className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => {
                      if (group.videoIds.length > 0) {
                        navigate(`/video/${group.videoIds[0]}`);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Icons.LayoutDashboard className="h-7 w-7" />
                      </div>
                      <div className="flex -space-x-3">
                        {group.videoIds.slice(0, 3).map((vidId, i) => {
                          const v = videos.find(v => v.id === vidId);
                          return v ? (
                            <img key={i} src={v.thumbnailUrl} className="h-10 w-10 rounded-full border-4 border-white object-cover" />
                          ) : null;
                        })}
                        {group.videoIds.length > 3 && (
                          <div className="h-10 w-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{group.videoIds.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{group.title}</h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{group.description}</p>
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                      <span>Xem ngay {group.videoIds.length} video</span>
                      <Icons.ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex items-center gap-2 mb-6">
            <Icons.PlayCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
              {selectedCategoryId === 'private' ? 'Video dành cho Xưởng' : 'Tất cả video đơn lẻ'}
            </h2>
          </div>
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onClick={() => navigate(`/video/${video.id}`)} 
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-64 flex-col items-center justify-center rounded-2xl bg-white border border-dashed border-slate-300"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Icons.SearchX className="h-8 w-8" />
              </div>
              <p className="text-slate-500 font-medium">Không tìm thấy hướng dẫn phù hợp.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategoryId(null); }}
                className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                Xóa bộ lọc
              </button>
            </motion.div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {showCodeInput && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                 <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                   <Icons.Lock className="h-6 w-6" />
                 </div>
                 <button onClick={() => setShowCodeInput(false)} className="text-slate-400 hover:text-slate-600">
                   <Icons.X className="h-6 w-6" />
                 </button>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Truy cập Video Xưởng</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">Nhập mã truy cập (ví dụ: XUONG123) do bộ phận kỹ thuật cung cấp cho xưởng của bạn.</p>
              
              <div className="space-y-4">
                <input 
                  type="text"
                  placeholder="Nhập mã bí mật..."
                  className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all placeholder:font-medium"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
                />
                {errorMsg && (
                   <p className="text-red-500 text-xs font-bold px-1">{errorMsg}</p>
                )}
                <button 
                  onClick={handleApplyCode}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Xác nhận truy cập
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  );
}
