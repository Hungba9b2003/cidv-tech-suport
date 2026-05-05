import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { BottomNav } from '../components/layout/BottomNav';
import { storage } from '../lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, X, BookOpen, Share2, Facebook, Twitter, TrendingUp, Maximize2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ContactModal } from '../components/common/ContactModal';
import { FloatingContact } from '../components/common/FloatingContact';
import { ImageModal } from '../components/common/ImageModal';
import { cn } from '../lib/utils';
import { NewsArticle } from '../types';

export default function News() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{url: string, title?: string} | null>(null);
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);

  React.useEffect(() => {
    setNewsList(storage.getNews());
  }, []);

  const categories = ['Kỹ thuật', 'Cẩm nang', 'Thông báo'];

  const filteredNews = newsList.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredNews[0];
  const otherPosts = filteredNews.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 md:pb-0 selection:bg-blue-600/10 selection:text-blue-600">
      <Navbar onSearch={setSearchQuery} />
      <BottomNav />

      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8 md:px-6 relative">
        <FloatingContact onClick={() => setShowContactModal(true)} />
        
        {/* News Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2 leading-none">Cẩm nang<br /><span className="text-blue-600">Kỹ thuật</span></h1>
            <p className="text-slate-500 font-medium max-w-xl text-sm md:text-base leading-relaxed">
              Kiến thức chuyên sâu về máy cán phẳng, keo PUR và giải pháp sản xuất.
            </p>
          </div>
          
          <div className="w-full md:w-80 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all font-bold text-slate-800 text-sm"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar pb-1">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              !selectedCategory ? "bg-slate-900 text-white" : "bg-white text-slate-400 border border-slate-200"
            )}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"
              )}
            >
              # {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {filteredNews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Không có bài viết.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {/* Featured Post */}
                {featuredPost && !selectedCategory && !searchQuery && (
                  <motion.div 
                    layoutId={featuredPost.id}
                    className="group cursor-pointer"
                    onClick={() => setReadingArticle(featuredPost)}
                  >
                    <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-6 shadow-xl transition-all duration-500">
                      <img src={featuredPost.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomedImage({ url: featuredPost.imageUrl, title: featuredPost.title });
                        }}
                        className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
                      >
                        <Maximize2 className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg mb-4">
                          {featuredPost.category}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-2 leading-tight">
                          {featuredPost.title}
                        </h2>
                        <div className="flex items-center gap-4 text-white/70 text-xs font-bold">
                           <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              <span>{featuredPost.author}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{featuredPost.publishDate.toLocaleDateString('vi-VN')}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Grid of other posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  {(selectedCategory || searchQuery ? filteredNews : otherPosts).map((post) => (
                    <motion.div 
                      key={post.id} 
                      className="group cursor-pointer flex flex-col"
                      onClick={() => setReadingArticle(post)}
                    >
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 shadow-md bg-slate-200">
                        <img src={post.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-white/95 backdrop-blur text-slate-900 text-[8px] font-black uppercase tracking-widest rounded-lg">
                            {post.category}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedImage({ url: post.imageUrl, title: post.title });
                          }}
                          className="absolute bottom-4 right-4 p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                           <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                              <User className="h-2.5 w-2.5 text-slate-400" />
                           </div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.author}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Newsletter CTA */}
            <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                    <Icons.Zap className="h-5 w-5" />
                 </div>
                 <h4 className="text-xl font-black mb-2 leading-tight">Cộng đồng kỹ thuật</h4>
                 <p className="text-blue-100 text-xs font-medium leading-relaxed mb-6">
                   Kiến thức độc quyền giúp xưởng bứt phá công nghệ.
                 </p>
                 <div className="space-y-2">
                   <input 
                      type="email" 
                      placeholder="Email bài học..."
                      className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-xl outline-none placeholder:text-white/40 text-xs font-bold"
                   />
                   <button className="w-full h-12 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all">
                     Đăng ký
                   </button>
                 </div>
               </div>
            </div>

            {/* Trending Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                 Tiêu điểm
               </h4>
               <div className="space-y-6">
                  {newsList.slice(1, 4).map((post, i) => (
                    <div 
                      key={post.id} 
                      className="group flex gap-4 cursor-pointer"
                      onClick={() => setReadingArticle(post)}
                    >
                       <span className="text-3xl font-black text-slate-100 group-hover:text-blue-100 transition-colors leading-none">{i+1}</span>
                       <div>
                         <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">{post.category}</p>
                         <h5 className="font-black text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                           {post.title}
                         </h5>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
               <a href="#" className="flex-1 flex items-center justify-center h-12 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all shadow-sm">
                  <Facebook className="h-5 w-5" />
               </a>
               <a href="#" className="flex-1 flex items-center justify-center h-12 rounded-xl bg-slate-900/10 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <Icons.Youtube className="h-5 w-5" />
               </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Article Reader Overlay */}
      <AnimatePresence>
        {readingArticle && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[120] bg-white overflow-y-auto scroll-smooth"
          >
            {/* Reader Header */}
            <header className="sticky top-0 z-50 w-full flex items-center justify-between px-8 py-5 bg-white/90 backdrop-blur-xl border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="hidden md:block">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{readingArticle.category}</p>
                     <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-sm">{readingArticle.title}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button className="hidden sm:flex h-10 px-6 items-center justify-center bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                     Theo dõi kênh
                  </button>
                  <button 
                    onClick={() => setReadingArticle(null)}
                    className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
               </div>
            </header>

            <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
               <div className="text-center mb-16">
                  <span className="inline-block px-5 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
                    Chuyên mục: {readingArticle.category}
                  </span>
                  <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-10 leading-[1.05] italic">
                    {readingArticle.title}
                  </h1>
                  <div className="flex items-center justify-center gap-10 text-sm font-bold">
                    <div className="flex items-center gap-3 text-slate-800">
                       <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                          <User className="h-5 w-5 text-slate-400" />
                       </div>
                       <span>{readingArticle.author}</span>
                    </div>
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full opacity-20 hidden sm:block" />
                    <div className="flex items-center gap-3 text-slate-400">
                       <Calendar className="h-5 w-5" />
                       <span>{readingArticle.publishDate.toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
               </div>

               <div 
                 className="aspect-video w-full rounded-[3.5rem] overflow-hidden mb-20 shadow-3xl cursor-zoom-in group relative"
                 onClick={() => setZoomedImage({ url: readingArticle.imageUrl, title: readingArticle.title })}
               >
                  <img src={readingArticle.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-black uppercase tracking-widest">
                      Phóng to ảnh
                    </div>
                  </div>
               </div>

               <div className="max-w-3xl mx-auto">
                  <div className="prose prose-slate max-w-none">
                     <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 leading-relaxed tracking-tight border-l-4 border-blue-600 pl-8 italic">
                       {readingArticle.excerpt}
                     </p>
                     <div 
                        className="article-content text-lg md:text-xl leading-loose text-slate-600 font-medium"
                        dangerouslySetInnerHTML={{ __html: readingArticle.content }}
                     />
                  </div>

                  {/* Share & Feedback */}
                  <div className="mt-24 pt-16 border-t border-slate-100">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                           <h4 className="text-xl font-black text-slate-900 mb-2">Bạn thấy bài viết hay?</h4>
                           <p className="text-slate-500 font-medium italic">Hãy chia sẻ nó cho cộng đồng kỹ thuật của bạn.</p>
                        </div>
                        <div className="flex gap-3">
                           <button className="h-14 w-14 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-transform"><Facebook className="h-6 w-6" /></button>
                           <button className="h-14 w-14 flex items-center justify-center rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-500/20 active:scale-95 transition-transform"><Twitter className="h-6 w-6" /></button>
                           <button className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"><Share2 className="h-6 w-6" /></button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Related Posts */}
               <div className="mt-32">
                  <div className="flex items-center justify-between mb-12">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Đọc thêm bài tiếp theo</h2>
                     <button className="text-sm font-black text-blue-600 uppercase tracking-widest hover:underline transition-all">Xem tất cả</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {newsList.filter(n => n.id !== readingArticle.id).slice(0, 2).map(post => (
                      <div 
                        key={post.id} 
                        className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-600/5 transition-all cursor-pointer"
                        onClick={() => {
                          setReadingArticle(post);
                          document.querySelector('.fixed.inset-0')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden mb-6">
                          <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 mb-2">{post.category}</p>
                        <h4 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h4>
                      </div>
                    ))}
                  </div>
               </div>
            </article>

            <footer className="bg-slate-900 py-20 px-8 text-center mt-20">
               <h3 className="text-white font-black text-3xl mb-4 italic">TechGuide Cloud</h3>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-12">Hỗ trợ kỹ thuật tối tân cho mọi nhà xưởng</p>
               <button 
                  onClick={() => setReadingArticle(null)}
                  className="px-12 py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
               >
                  Quay lại trang tin
               </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

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
