import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(name, phone, password);
        if (res.success) navigate('/profile');
        else setError(res.message);
      } else {
        const res = await loginUser(phone, password);
        if (res.success) navigate(res.user?.role === 'admin' ? '/admin' : '/profile');
        else setError(res.message);
      }
    } catch (err) {
      setError(err?.message || 'خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-sm bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-6 flex flex-col gap-4 text-white">
        <div className="text-center">
          <h1 className="text-lg font-black text-[#d4af37]">{isRegister ? 'ثبت‌نام کاربر جدید' : 'ورود به حساب کاربری'}</h1>
          <p className="text-xs text-gray-300 mt-1">فروشگاه آنلاین برنج طلا رایس</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs p-2.5 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isRegister && (
            <div>
              <label className="text-xs text-gray-300 block mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="علی رضایی"
                className="w-full bg-[#042a1b] border border-white/20 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-300 block mb-1">شماره موبایل یا ایمیل</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="w-full bg-[#042a1b] border border-white/20 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">رمز عبور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              className="w-full bg-[#042a1b] border border-white/20 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] text-[#042a1b] py-2.5 rounded-xl font-bold text-xs hover:bg-yellow-400 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'در حال ارسال...' : isRegister ? 'ثبت‌نام' : 'ورود'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10 text-xs">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-[#d4af37] hover:underline"
          >
            {isRegister ? 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید' : 'حساب کاربری ندارید؟ ثبت‌نام کنید'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
