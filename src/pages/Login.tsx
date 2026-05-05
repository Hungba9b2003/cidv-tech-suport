import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (password === 'admin123') {
      localStorage.setItem('is_admin', 'true');
      navigate('/admin');
    } else {
      setError('Mật khẩu không chính xác');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 transition-colors text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại trang chủ
        </button>

        <div className="flex flex-col items-center mb-8">
           <div className="h-20 w-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-inner">
             <ShieldCheck className="h-10 w-10" />
           </div>
           <h2 className="text-2xl font-black text-slate-800">Quản trị viên</h2>
           <p className="text-slate-500 font-medium text-sm">Vui lòng nhập mật khẩu hệ thống</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
           <div className="relative">
             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
             <input 
               type="password"
               placeholder="Mật khẩu Admin"
               className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-bold"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
           </div>

           {error && (
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-red-500 text-xs font-bold text-center"
             >
               {error}
             </motion.p>
           )}

           <button 
             type="submit"
             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
           >
             Đăng nhập
           </button>
        </form>

        <p className="mt-10 text-center text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
          Bản quyền thuộc về<br/>Phòng Kỹ thuật & Công nghệ
        </p>
      </motion.div>
    </div>
  );
}
