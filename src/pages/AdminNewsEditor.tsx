import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Code2, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  Heading, 
  Link as LinkIcon, 
  Palette,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { storage } from '../lib/storage';
import { NewsArticle } from '../types';
import { cn } from '../lib/utils';
import { ImageModal } from '../components/common/ImageModal';
import { Maximize2 } from 'lucide-react';

export default function AdminNewsEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Partial<NewsArticle>>({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: 'Kỹ thuật',
    author: 'Admin',
    publishDate: new Date()
  });
  
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{url: string, title?: string} | null>(null);

  useEffect(() => {
    // Auth check
    const isAuth = localStorage.getItem('is_admin') === 'true';
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (id) {
      const existing = storage.getArticleById(id);
      if (existing) {
        setArticle(existing);
      }
    }
  }, [id, navigate]);

  const handleInsertTag = (tag: string, end: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, endPos);
    const after = text.substring(endPos);
    
    const newVal = before + tag + selection + end + after;
    setArticle({ ...article, content: newVal });
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length + selection.length);
    }, 0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!article.title || !article.content) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    setIsSaving(true);
    
    // Use our new storage utility
    storage.saveArticle(article);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin');
      }, 1000);
    }, 500);
  };

  const handleDelete = () => {
    if (id && confirm('Xác nhận xóa bài viết này vĩnh viễn?')) {
      storage.deleteArticle(id);
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <Navbar onSearch={() => {}} />
      
      <main className="max-w-[1400px] mx-auto px-4 py-4 md:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all shadow-sm group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {id ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Admin News Editor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu bài viết'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Editor Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
              <input 
                type="text"
                placeholder="Tiêu đề bài viết..."
                value={article.title}
                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                className="w-full text-3xl md:text-4xl font-black text-slate-900 placeholder:text-slate-200 outline-none mb-6 tracking-tight"
                required
              />

              <div className="flex flex-col border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between p-2 bg-white border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setViewMode('code')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === 'code' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      HTML Code
                    </button>
                    <button 
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === 'preview' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Trực quan
                    </button>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {[
                      { icon: Bold, tag: '<b>', end: '</b>', label: 'Đậm' },
                      { icon: Italic, tag: '<i>', end: '</i>', label: 'Nghiêng' },
                      { icon: Heading, tag: '<h3 class="text-2xl font-black text-slate-900 my-4">', end: '</h3>', label: 'Tiêu đề' },
                      { icon: ImageIcon, tag: '<img src="URL" class="w-full rounded-2xl my-6" />', end: '', label: 'Ảnh' },
                      { icon: LinkIcon, tag: '<a href="#" class="text-blue-600 font-bold underline">', end: '</a>', label: 'Link' },
                      { icon: Palette, tag: '<div class="p-4 bg-slate-100 rounded-xl">', end: '</div>', label: 'Hộp' },
                    ].map((tool, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInsertTag(tool.tag, tool.end)}
                        className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all flex items-center gap-1.5"
                        title={tool.label}
                      >
                        <tool.icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="relative min-h-[500px]">
                  {viewMode === 'code' ? (
                    <textarea 
                      id="content-editor"
                      value={article.content}
                      onChange={(e) => setArticle({ ...article, content: e.target.value })}
                      placeholder="Viết nội dung bài viết bằng HTML/CSS..."
                      className="w-full h-full min-h-[500px] p-6 bg-transparent outline-none font-mono text-sm leading-relaxed resize-y"
                      required
                    />
                  ) : (
                    <div className="p-8 article-content max-w-none min-h-[500px] bg-white">
                      <div dangerouslySetInnerHTML={{ __html: article.content || '<p class="text-slate-300 italic">Bản xem trước trống...</p>' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Cấu hình bài viết</h3>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Chuyên mục</label>
                <select 
                  value={article.category}
                  onChange={(e) => setArticle({ ...article, category: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold text-sm"
                >
                  <option>Kỹ thuật</option>
                  <option>Cẩm nang</option>
                  <option>Thông báo</option>
                </select>
              </div>

              {/* SEO Section */}
              <div className="pt-4 border-t border-slate-50">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Cấu hình SEO</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">SEO Title</label>
                    <input 
                      type="text"
                      value={article.seo?.metaTitle || ''}
                      onChange={(e) => setArticle({ 
                        ...article, 
                        seo: { ...article.seo, metaTitle: e.target.value } 
                      })}
                      placeholder="Tiêu đề hiển thị trên Google..."
                      className="w-full h-10 px-4 rounded-lg bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-medium text-xs text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">SEO Meta Description</label>
                    <textarea 
                      value={article.seo?.metaDescription || ''}
                      onChange={(e) => setArticle({ 
                        ...article, 
                        seo: { ...article.seo, metaDescription: e.target.value } 
                      })}
                      placeholder="Mô tả cho công cụ tìm kiếm..."
                      className="w-full h-20 p-4 rounded-lg bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-medium text-xs text-slate-600 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Từ khóa (Keywords)</label>
                    <input 
                      type="text"
                      value={article.seo?.keywords || ''}
                      onChange={(e) => setArticle({ 
                        ...article, 
                        seo: { ...article.seo, keywords: e.target.value } 
                      })}
                      placeholder="keo pur, go cong nghiep,..."
                      className="w-full h-10 px-4 rounded-lg bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-medium text-xs text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Ảnh đại diện (URL)</label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      value={article.imageUrl}
                      onChange={(e) => setArticle({ ...article, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold text-sm transition-all"
                    />
                  </div>
                  {article.imageUrl && (
                    <div 
                      className="w-24 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group flex-shrink-0 cursor-zoom-in"
                      onClick={() => setZoomedImage({ url: article.imageUrl || '', title: 'Quick Preview' })}
                    >
                      <img src={article.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Quick preview" />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">Live</span>
                      </div>
                    </div>
                  )}
                </div>
                {article.imageUrl && (
                  <div 
                    className="mt-4 aspect-video rounded-3xl overflow-hidden border-2 border-slate-50 shadow-sm relative group cursor-zoom-in"
                    onClick={() => setZoomedImage({ url: article.imageUrl || '', title: article.title })}
                  >
                    <img 
                      src={article.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt="Full Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/f8fafc/cbd5e1?text=Link+ảnh+lỗi';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                         <Maximize2 className="h-6 w-6" />
                       </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-900/80 to-transparent">
                       <p className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">Xem trước hiển thị bài viết</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Tóm tắt (Excerpt)</label>
                <textarea 
                  value={article.excerpt}
                  onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                  placeholder="Mô tả ngắn gọn về bài viết..."
                  className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-medium text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Tác giả</label>
                <input 
                  type="text"
                  value={article.author}
                  onChange={(e) => setArticle({ ...article, author: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold text-sm"
                />
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
               <h4 className="text-red-600 font-black text-xs uppercase tracking-widest mb-2">Vùng nguy hiểm</h4>
               <p className="text-red-400 text-[10px] font-bold mb-4">Xóa bài viết này sẽ không thể khôi phục lại dữ liệu.</p>
               <button 
                type="button"
                onClick={handleDelete}
                className="w-full py-3 bg-white text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2 border border-red-100"
               >
                 <Trash2 className="h-4 w-4" />
                 Xóa bài viết
               </button>
            </div>
          </div>
        </form>
      </main>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-sm">Lưu bài viết thành công!</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Đang quay lại trang quản trị...</p>
            </div>
          </motion.div>
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
