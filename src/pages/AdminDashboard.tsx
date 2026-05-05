import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Lock, 
  Globe,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  LogOut,
  ChevronRight,
  Newspaper,
  Image as ImageIcon
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { VideoTutorial, Category, WorkshopCode, VideoGroup, NewsArticle } from '../types';
import { MOCK_VIDEOS, MOCK_CATEGORIES, MOCK_WORKSHOPS, MOCK_GROUPS, MOCK_NEWS } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageModal } from '../components/common/ImageModal';
import { Maximize2, ZoomIn } from 'lucide-react';

type Tab = 'videos' | 'workshops' | 'groups' | 'news' | 'seo';

import { storage } from '../lib/storage';
import { SiteSettings } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [videos, setVideos] = useState<VideoTutorial[]>(MOCK_VIDEOS);
  const [workshops, setWorkshops] = useState<WorkshopCode[]>(MOCK_WORKSHOPS);
  const [groups, setGroups] = useState<VideoGroup[]>(MOCK_GROUPS);
  const [news, setNews] = useState<NewsArticle[]>(storage.getNews());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(storage.getSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingVideo, setEditingVideo] = useState<VideoTutorial | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isAddingWorkshop, setIsAddingWorkshop] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{url: string, title?: string} | null>(null);
  
  // Auth Check
  useEffect(() => {
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (!isAdmin) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Refresh news when tab changes to news
    if (activeTab === 'news') {
      setNews(storage.getNews());
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    navigate('/');
  };

  // Workshop Code Creation State
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    code: '',
    selectedVideos: [] as string[]
  });

  const [newVideoSteps, setNewVideoSteps] = useState<{ title: string; timestamp: string }[]>([
    { title: '', timestamp: '' }
  ]);

  const addStep = () => {
    setNewVideoSteps([...newVideoSteps, { title: '', timestamp: '' }]);
  };

  const removeStep = (index: number) => {
    setNewVideoSteps(newVideoSteps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: 'title' | 'timestamp', value: string) => {
    const updated = [...newVideoSteps];
    updated[index][field] = value;
    setNewVideoSteps(updated);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingVideo(false);
    setEditingVideo(null);
  };

  const handleSaveWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    const workshop: WorkshopCode = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWorkshop,
      createdAt: new Date()
    };
    setWorkshops([...workshops, workshop]);
    setIsAddingWorkshop(false);
    setNewWorkshop({ name: '', code: '', selectedVideos: [] });
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Xác nhận xóa bài viết này?')) {
      const updated = storage.deleteArticle(id);
      setNews(updated);
    }
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingGroup(false);
  };

  // Filter videos based on search
  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onSearch={() => {}} />

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-6 gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sticky top-24">
            <div className="px-4 py-6 border-b border-slate-50 mb-4">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Hệ thống Quản trị</h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Admin Panel v2.0</p>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'videos', icon: Video, label: 'Quản lý Video' },
                { id: 'workshops', icon: Users, label: 'Quản lý Xưởng' },
                { id: 'groups', icon: LayoutDashboard, label: 'Nhóm Video' },
                { id: 'news', icon: Newspaper, label: 'Tin tức' },
                { id: 'seo', icon: Globe, label: 'Cấu hình SEO' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                    activeTab === item.id 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-blue-400" : "text-slate-400 group-hover:text-slate-600")} />
                    {item.label}
                  </div>
                  {activeTab === item.id && <ChevronRight className="h-4 w-4 text-white/50" />}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-50 px-2 text-center">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'videos' && 'Thư viện Video'}
              {activeTab === 'workshops' && 'Đơn vị Xưởng'}
              {activeTab === 'groups' && 'Bộ sưu tập'}
              {activeTab === 'news' && 'Quản lý Tin tức'}
              {activeTab === 'seo' && 'Tối ưu Tìm kiếm'}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              {activeTab === 'videos' && 'Quản lý tất cả video hướng dẫn kỹ thuật trên hệ thống.'}
              {activeTab === 'workshops' && 'Cấp quyền và quản lý mã truy cập cho các đơn vị xưởng nội thất.'}
              {activeTab === 'groups' && 'Phân loại video theo quy trình sản xuất hoặc dòng máy.'}
              {activeTab === 'news' && 'Biên tập và xuất bản các bài viết hướng dẫn chuyên môn.'}
              {activeTab === 'seo' && 'Tối ưu Tìm kiếm thông tin website và mã theo dõi.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  {/* Video Management Header */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Tìm tên video hoặc mã..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setEditingVideo(null);
                        setIsAddingVideo(true);
                        setNewVideoSteps([{ title: '', timestamp: '' }]);
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Plus className="h-5 w-5" />
                      Đăng Video mới
                    </button>
                  </div>

                  {/* Video List Table */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thông tin Video</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loại máy</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nhóm</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chế độ xem</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredVideos.map((video) => (
                          <tr key={video.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div 
                                  className="w-20 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 cursor-zoom-in relative group/img"
                                  onClick={() => setZoomedImage({ url: video.thumbnailUrl, title: video.title })}
                                >
                                  <img src={video.thumbnailUrl} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" />
                                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 className="h-4 w-4 text-white" />
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{video.title}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">{video.duration} • {video.steps.length} bước</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                {MOCK_CATEGORIES.find(c => c.id === video.categoryId)?.name || video.categoryId}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {video.groupId ? (
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded whitespace-nowrap">
                                  {groups.find(g => g.id === video.groupId)?.title || "Có nhóm"}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 italic">Chưa nhóm</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {video.isPrivate ? (
                                <div className="flex items-center gap-1.5 text-amber-600">
                                  <Lock className="h-3 w-3" />
                                  <span className="text-[11px] font-bold uppercase">Ẩn</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-green-600">
                                  <Globe className="h-3 w-3" />
                                  <span className="text-[11px] font-bold uppercase">Công khai</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingVideo(video);
                                    setNewVideoSteps(video.steps.map(s => ({ title: s.title, timestamp: s.timestamp })));
                                    setIsAddingVideo(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'workshops' && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Tổng số Xưởng</p>
                   <div className="flex items-end justify-between">
                      <h4 className="text-4xl font-black text-slate-900">{workshops.length}</h4>
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                         <Users className="h-5 w-5" />
                      </div>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Mã còn hiệu lực</p>
                   <div className="flex items-end justify-between">
                      <h4 className="text-4xl font-black text-green-600">{workshops.length}</h4>
                      <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                         <CheckCircle className="h-5 w-5" />
                      </div>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Phân bổ video</p>
                   <div className="flex items-end justify-between">
                      <h4 className="text-4xl font-black text-amber-500">
                         {workshops.reduce((acc, w) => acc + w.permittedVideoIds.length, 0)}
                      </h4>
                      <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                         <Video className="h-5 w-5" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-bold text-slate-800">Danh sách Mã truy cập Xưởng</h3>
                   <button 
                     onClick={() => setIsAddingWorkshop(true)}
                     className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                   >
                     + Tạo mã mới
                   </button>
                </div>
                <div className="p-6">
                   <div className="space-y-4">
                      {workshops.map((workshop, idx) => (
                        <div key={workshop.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600">
                                {idx + 1}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-800">{workshop.name}</p>
                                 <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase">Mã: {workshop.code}</p>
                                    <span className="text-[10px] text-slate-400 font-bold">• {workshop.permittedVideoIds.length} video được phép</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Ngày tạo</p>
                                 <p className="text-xs font-black text-slate-700">29/04/2026</p>
                              </div>
                              <button className="p-2 text-slate-400 hover:text-slate-900">
                                 <MoreVertical className="h-4 w-4" />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Quản lý Nhóm Video</h2>
              <button 
                onClick={() => setIsAddingGroup(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Tạo Nhóm mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {groups.map(group => (
                 <div key={group.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between mb-4">
                       <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                          <LayoutDashboard className="h-6 w-6" />
                       </div>
                       <div className="flex gap-1">
                          <button className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                          <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                       </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{group.title}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6">{group.description}</p>
                    <div className="pt-6 border-t border-slate-50">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Video trong nhóm ({group.videoIds.length})</p>
                       <div className="flex -space-x-2 overflow-hidden">
                          {group.videoIds.map((vidId, i) => {
                            const v = videos.find(v => v.id === vidId);
                            return v ? (
                              <img key={i} src={v.thumbnailUrl} alt={v.title} className="inline-block h-8 w-12 rounded-lg ring-2 ring-white object-cover" />
                            ) : null;
                          })}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tìm bài viết..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => navigate('/admin/news/new')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Viết bài mới
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bài viết</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chuyên mục</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ngày đăng</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNews.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 cursor-zoom-in relative group/img"
                            onClick={() => setZoomedImage({ url: article.imageUrl, title: article.title })}
                          >
                            <img src={article.imageUrl} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{article.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{article.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500">
                          {article.publishDate.toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/news/edit/${article.id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteNews(article.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="max-w-4xl max-h-[80vh] overflow-y-auto pr-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình SEO Toàn trang</h2>
                  <p className="text-slate-500 text-sm font-medium italic">Thiết lập các thông số SEO mặc định và mã theo dõi cho website.</p>
                </div>
                <Icons.Globe className="h-10 w-10 text-slate-100" />
              </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Tiêu đề mặc định (Meta Title)</label>
                      <input 
                        type="text"
                        value={siteSettings.defaultTitle}
                        onChange={(e) => setSiteSettings({ ...siteSettings, defaultTitle: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold text-sm"
                        placeholder="Nhập tiêu đề website..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Ảnh OG (Open Graph URL)</label>
                      <div className="relative">
                         <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <input 
                            type="text"
                            value={siteSettings.ogImage}
                            onChange={(e) => setSiteSettings({ ...siteSettings, ogImage: e.target.value })}
                            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold text-sm"
                            placeholder="Dán link ảnh đại diện chia sẻ (1200x630)..."
                          />
                      </div>
                      <p className="mt-2 text-[10px] text-slate-400 font-bold italic">Link ảnh được sử dụng khi chia sẻ website lên Facebook/Zalo.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Mô tả mặc định (Meta Description)</label>
                      <textarea 
                        value={siteSettings.defaultDescription}
                        onChange={(e) => setSiteSettings({ ...siteSettings, defaultDescription: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold text-sm h-32 resize-none"
                        placeholder="Nhập mô tả website..."
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Xem trước ảnh OG</label>
                    <div 
                      className="aspect-[1.91/1] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center group relative cursor-zoom-in"
                      onClick={() => siteSettings.ogImage && setZoomedImage({ url: siteSettings.ogImage, title: 'Xem trước SEO Image' })}
                    >
                      {siteSettings.ogImage ? (
                        <>
                          <img 
                            src={siteSettings.ogImage} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            alt="OG Preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/1200x630/f8fafc/cbd5e1?text=Link+ảnh+lỗi';
                            }}
                          />
                          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                               <Maximize2 className="h-5 w-5" />
                             </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-slate-900/80 backdrop-blur-sm">
                             <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 truncate">{siteSettings.siteName}</p>
                             <p className="text-white/70 text-[9px] font-bold truncate">{siteSettings.defaultDescription}</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 text-slate-300">
                           <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
                           <p className="text-xs font-black uppercase tracking-widest">Chưa có link ảnh</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 md:col-span-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Mã Theo Dõi & Scripts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-blue-600">Google Analytics ID (G-XXXXX)</label>
                      <input 
                        type="text"
                        value={siteSettings.googleAnalyticsId}
                        onChange={(e) => setSiteSettings({ ...siteSettings, googleAnalyticsId: e.target.value })}
                        placeholder="G-..."
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-pink-600">Facebook Pixel ID</label>
                      <input 
                        type="text"
                        value={siteSettings.fbPixelId}
                        onChange={(e) => setSiteSettings({ ...siteSettings, fbPixelId: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => {
                    storage.saveSettings(siteSettings);
                    alert('Cấu hình SEO đã được lưu thành công!');
                  }}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all active:scale-95"
                >
                  Cập nhật cấu hình
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
      </div>

      <AnimatePresence>
        {isAddingWorkshop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-2">Tạo Mã Truy Cập Xưởng</h2>
              <p className="text-slate-500 mb-8 font-medium italic text-sm">Cấp quyền truy cập cho đơn vị khách hàng cụ thể.</p>
              
              <div className="space-y-6 overflow-y-auto pr-2 mb-8">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tên Xưởng / Khách hàng</label>
                        <input 
                          type="text" 
                          placeholder="Công ty A..."
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 font-bold text-sm"
                          value={newWorkshop.name}
                          onChange={e => setNewWorkshop({...newWorkshop, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mã truy cập (Duy nhất)</label>
                        <input 
                          type="text" 
                          placeholder="ABC12345"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 font-bold text-sm"
                          value={newWorkshop.code}
                          onChange={e => setNewWorkshop({...newWorkshop, code: e.target.value.toUpperCase()})}
                        />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Chọn Video được phép xem ({newWorkshop.selectedVideos.length})</label>
                    <div className="grid grid-cols-1 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-64 overflow-y-auto">
                       {videos.map(v => (
                         <label key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 cursor-pointer hover:border-blue-300 transition-all">
                            <input 
                              type="checkbox" 
                              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600/10"
                              checked={newWorkshop.selectedVideos.includes(v.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWorkshop({...newWorkshop, selectedVideos: [...newWorkshop.selectedVideos, v.id]});
                                } else {
                                  setNewWorkshop({...newWorkshop, selectedVideos: newWorkshop.selectedVideos.filter(id => id !== v.id)});
                                }
                              }}
                            />
                            <div className="flex items-center gap-3">
                               <img src={v.thumbnailUrl} className="w-12 h-8 rounded object-cover" />
                               <div>
                                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{v.title}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">{v.isPrivate ? "Video Ẩn" : "Công khai"}</p>
                               </div>
                            </div>
                         </label>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => setIsAddingWorkshop(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                 >
                   Hủy bỏ
                 </button>
                 <button 
                   onClick={handleSaveWorkshop}
                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                 >
                   Xác nhận Cấp mã
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl bg-white rounded-[2rem] p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                {editingVideo ? "Chỉnh sửa Video" : "Đăng Video Hướng Dẫn"}
              </h2>
              <p className="text-slate-500 mb-8 font-medium">Hoàn thiện thông tin để tải video lên hệ thống.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tiêu đề video</label>
                    <input 
                      type="text" 
                      defaultValue={editingVideo?.title}
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-600" 
                    />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mô tả chi tiết</label>
                    <textarea 
                      defaultValue={editingVideo?.description}
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-600 h-32"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Danh mục máy</label>
                    <select 
                      defaultValue={editingVideo?.categoryId}
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none"
                    >
                       {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nhóm Video</label>
                    <select 
                      defaultValue={editingVideo?.groupId}
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none"
                    >
                       <option value="">Không có nhóm</option>
                       {groups.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                    </select>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <input 
                      type="checkbox" 
                      id="isPrivate" 
                      defaultChecked={editingVideo?.isPrivate}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600/10" 
                    />
                    <label htmlFor="isPrivate" className="text-sm font-bold text-slate-700 cursor-pointer">Video riêng tư (Ẩn khỏi công khai)</label>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Ảnh đại diện (Thumbnail URL)</label>
                     <div className="relative">
                       <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <input 
                         type="text" 
                         defaultValue={editingVideo?.thumbnailUrl}
                         placeholder="https://..."
                         className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-600 transition-all" 
                       />
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-24 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative group">
                        {editingVideo?.thumbnailUrl ? (
                          <img src={editingVideo.thumbnailUrl} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-slate-300">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-[8px] font-black text-white uppercase tracking-widest">Demo</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 italic">Xem trước ảnh đại diện video</p>
                   </div>
                 </div>

                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Link Video (Youtube/Storage)</label>
                    <input 
                      type="text" 
                      defaultValue={editingVideo?.videoUrl}
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold outline-none focus:border-blue-600" 
                    />
                 </div>

                 {/* SEO Section */}
                 <div className="col-span-2 mt-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Cấu hình SEO (Tối ưu tìm kiếm)</h3>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meta Title</label>
                          <input 
                             type="text" 
                             defaultValue={editingVideo?.seo?.metaTitle}
                             placeholder="Tiêu đề hiển thị trên Google..."
                             className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold outline-none" 
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meta Description</label>
                          <textarea 
                             defaultValue={editingVideo?.seo?.metaDescription}
                             placeholder="Mô tả ngắn gọn nội dung video cho máy tìm kiếm..."
                             className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold outline-none h-16"
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Từ khóa (Keywords)</label>
                          <input 
                             type="text" 
                             defaultValue={editingVideo?.seo?.keywords}
                             placeholder="máy cnc, bảo trì, hướng dẫn..."
                             className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold outline-none" 
                          />
                       </div>
                    </div>
                 </div>

                 {/* Video Steps Section */}
                 <div className="col-span-2 mt-4">
                    <div className="flex items-center justify-between mb-4">
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Cấu trúc nội dung (Timeline)</label>
                       <button 
                         onClick={addStep}
                         className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded border border-blue-100"
                       >
                         + Thêm mốc thời gian
                       </button>
                    </div>
                    
                    <div className="space-y-3">
                       {newVideoSteps.map((step, idx) => (
                         <div key={idx} className="flex gap-3 items-center">
                            <input 
                              type="text" 
                              placeholder="00:00" 
                              className="w-24 px-3 py-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
                              value={step.timestamp}
                              onChange={(e) => updateStep(idx, 'timestamp', e.target.value)}
                            />
                            <input 
                              type="text" 
                              placeholder="Mô tả hành động tại mốc này..." 
                              className="flex-1 px-3 py-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
                              value={step.title}
                              onChange={(e) => updateStep(idx, 'title', e.target.value)}
                            />
                            {newVideoSteps.length > 1 && (
                              <button 
                                onClick={() => removeStep(idx)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => {
                    setIsAddingVideo(false);
                    setEditingVideo(null);
                  }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                 >
                   Hủy bỏ
                 </button>
                 <button 
                   onClick={handleSaveVideo}
                   className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                 >
                   {editingVideo ? "Cập nhật Video" : "Xác nhận Đăng tải"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Group Modal */}
      <AnimatePresence>
        {isAddingGroup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-2">Tạo Nhóm Video</h2>
              <p className="text-slate-500 mb-8 font-medium text-sm">Gộp các video thành một khóa học hoặc quy trình liền mạch.</p>
              
              <div className="space-y-6 overflow-y-auto pr-2 mb-8">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tên nhóm / Khóa học</label>
                    <input 
                      type="text" 
                      placeholder="Bảo trì máy cắt CNC..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 font-bold text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mô tả nhóm</label>
                    <textarea 
                      placeholder="Mô tả mục tiêu của nhóm này..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 font-bold text-sm h-24"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Video trong nhóm</label>
                    <div className="grid grid-cols-1 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-64 overflow-y-auto">
                       {videos.map(v => (
                         <label key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 cursor-pointer hover:border-blue-300 transition-all">
                            <input 
                              type="checkbox" 
                              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600/10"
                            />
                            <div className="flex items-center gap-3">
                               <img src={v.thumbnailUrl} className="w-12 h-8 rounded object-cover" />
                               <p className="text-xs font-bold text-slate-800 line-clamp-1">{v.title}</p>
                            </div>
                         </label>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => setIsAddingGroup(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                 >
                   Hủy bỏ
                 </button>
                 <button 
                   onClick={handleSaveGroup}
                   className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                 >
                   Lưu nhóm
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImageModal 
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        imageUrl={zoomedImage?.url || ''}
        title={zoomedImage?.title}
      />
    </div>
  );
}
