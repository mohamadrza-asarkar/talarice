import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Lock, User, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '', server: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!phone.trim()) {
      newErrors.phone = 'لطفاً شماره موبایل خود را وارد کنید';
    }
    
    if (!password) {
      newErrors.password = 'لطفاً رمز عبور را وارد کنید';
    } else if (mode === 'register' && password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }
    
    if (mode === 'register' && !name.trim()) {
      newErrors.name = 'نام و نام خانوادگی الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginUser(phone, password);
        if (res && res.success) {
          if (res.user?.role === 'admin' || phone === '09999999999') {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        } else {
          setErrors({ server: res?.message || 'شماره موبایل یا رمز عبور اشتباه است.' });
        }
      } else {
        const res = await registerUser(name, phone, password);
        if (res && res.success) {
          navigate('/profile');
        } else {
          setErrors({ server: res?.message || 'خطا در ثبت‌نام.' });
        }
      }
    } catch (err) {
      setErrors({ server: err.message || 'خطا در برقراری ارتباط با سرور.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full relative flex flex-col justify-center items-center font-sans select-none overflow-y-auto px-4 py-6" dir="rtl">
      {/* Dark Nature Gradient & Glass Background */}
      <div className="fixed inset-0 z-0 bg-[#06180d]">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#041a0d]/95 via-[#0a2e19]/80 to-[#041a0d]/95 backdrop-blur-md" />
      </div>

      <div className="relative z-20 w-full max-w-[370px] my-auto">
        
        {/* Header */}
        <div className="text-right mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            {mode === 'login' ? 'ورود' : 'ثبت نام'}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-medium">
            {mode === 'login' ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری جدید'}
          </p>
        </div>

        {/* Server Error Alert */}
        {errors.server && (
          <div className="mb-4 p-3.5 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-red-200">{errors.server}</p>
          </div>
        )}

        <form id="auth-form" className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          
          {/* Name Input (Register mode only - Mandatory) */}
          {mode === 'register' && (
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError('name'); }}
                  placeholder="نام و نام خانوادگی"
                  className={`w-full h-13 pr-12 pl-4 text-sm sm:text-[15px] font-medium bg-[#1a3321]/90 text-white border ${
                    errors.name ? 'border-red-500' : 'border-emerald-800/40 focus:border-[#22c55e]'
                  } rounded-2xl focus:outline-none transition-colors placeholder:text-gray-400`}
                />
                <User className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.name ? 'text-red-400' : 'text-[#22c55e]'}`} />
              </div>
              {errors.name && <p className="text-red-400 text-xs font-bold mt-1.5 px-1">{errors.name}</p>}
            </div>
          )}

          {/* Mobile Phone Number Input */}
          <div>
            <div className="relative">
              <input
                type="tel"
                dir="rtl"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
                placeholder="شماره موبایل"
                className={`w-full h-13 pr-12 pl-4 text-sm sm:text-[15px] font-medium bg-[#1a3321]/90 text-white border ${
                  errors.phone ? 'border-red-500' : 'border-emerald-800/40 focus:border-[#22c55e]'
                } rounded-2xl focus:outline-none transition-colors placeholder:text-gray-400`}
              />
              <Phone className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.phone ? 'text-red-400' : 'text-[#22c55e]'}`} />
            </div>
            {errors.phone && <p className="text-red-400 text-xs font-bold mt-1.5 px-1">{errors.phone}</p>}
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                dir="rtl"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                placeholder="رمز عبور"
                className={`w-full h-13 pr-12 pl-12 text-sm sm:text-[15px] font-medium bg-[#1a3321]/90 text-white border ${
                  errors.password ? 'border-red-500' : 'border-emerald-800/40 focus:border-[#22c55e]'
                } rounded-2xl focus:outline-none transition-colors placeholder:text-gray-400`}
              />
              <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.password ? 'text-red-400' : 'text-[#22c55e]'}`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#22c55e] hover:text-green-300 p-1 transition-colors"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs font-bold mt-1.5 px-1">{errors.password}</p>}
          </div>

          {/* Forgot password */}
          {mode === 'login' && (
            <div className="text-right">
              <button 
                type="button" 
                onClick={() => alert('جهت بازیابی رمز عبور، لطفاً با پشتیبانی طلا رایس تماس بگیرید یا با شماره پیش‌فرض تست لاگین کنید.')}
                className="text-sm font-semibold text-[#22c55e] hover:text-green-300 transition-colors"
              >
                فراموشی رمز عبور؟
              </button>
            </div>
          )}

          {/* Login / Register Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d5336] text-white py-3 rounded-lg font-bold hover:bg-[#0a412b] active:bg-[#083422] focus:outline-none disabled:opacity-70 transition-colors shadow-none cursor-pointer flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                mode === 'login' ? 'ورود' : 'ثبت نام'
              )}
            </button>
          </div>
          
          {/* Switch mode links */}
          <div className="pt-3 pb-2 flex items-center justify-center gap-2 text-sm sm:text-[15px]">
            {mode === 'login' ? (
              <>
                <span className="text-gray-300 font-medium">حساب کاربری ندارید؟</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" />
                <button 
                  type="button" 
                  onClick={() => { setMode('register'); setErrors({}); }} 
                  className="font-bold text-[#22c55e] hover:text-green-300 transition-colors cursor-pointer"
                >
                  ثبت نام
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-300 font-medium">حساب کاربری دارید؟</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" />
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); setErrors({}); }} 
                  className="font-bold text-[#22c55e] hover:text-green-300 transition-colors cursor-pointer"
                >
                  ورود
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
