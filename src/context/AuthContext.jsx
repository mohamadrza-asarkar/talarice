import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, getStoredToken, setStoredToken, normalizeUser } from '../api';

const AuthContext = createContext();

const STORAGE_KEYS = {
  USER: 'tala_rice_user',
  USERS_LIST: 'tala_rice_users_list'
};

const isTestUser = (u) => {
  if (!u) return true;
  if (u.id === 'usr-admin' || u.id === 'usr-customer') return true;
  if (u.phone === '09120000000') return true;
  if (u.email === 'user@example.com') return true;
  return false;
};

function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage write error:', err);
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const list = getStorage(STORAGE_KEYS.USERS_LIST, []);
    return Array.isArray(list) ? list.filter((u) => !isTestUser(u)) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = getStorage(STORAGE_KEYS.USER, null);
    if (isTestUser(saved)) {
      try {
        localStorage.removeItem(STORAGE_KEYS.USER);
      } catch {
        // ignore
      }
      return null;
    }
    return normalizeUser(saved);
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    setStorage(STORAGE_KEYS.USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStorage(STORAGE_KEYS.USERS_LIST, users);
  }, [users]);

  // Decoupled notification trigger using window custom events
  const triggerNotification = useCallback((message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('tala-toast', { detail: { message, type } }));
  }, []);

  // Fetch current user from /api/auth/me on mount if token exists
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    let isMounted = true;
    authApi.getMe()
      .then((res) => {
        if (!isMounted) return;
        const normalized = res?.user || normalizeUser(res);
        if (normalized) {
          setCurrentUser(normalized);
        }
      })
      .catch((err) => {
        console.debug('Failed to sync auth with server:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = useCallback(async (phone, password) => {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanPhone) {
      return { success: false, message: 'لطفاً شماره موبایل را وارد کنید.' };
    }
    if (!cleanPassword) {
      return { success: false, message: 'وارد کردن رمز عبور الزامی است.' };
    }

    setIsLoadingAuth(true);

    try {
      const res = await authApi.login({ phone: cleanPhone, password: cleanPassword });
      const userObj = res?.user || normalizeUser(res);
      if (!userObj) {
        throw new Error(res?.message || 'پاسخ نامعتبر از سرور دریافت شد.');
      }
      setCurrentUser(userObj);
      triggerNotification(`خوش آمدید، ${userObj.name || 'کاربر گرامی'}`, 'success');
      setIsLoadingAuth(false);
      return { success: true, user: userObj };
    } catch (apiErr) {
      setIsLoadingAuth(false);
      triggerNotification(apiErr.message, 'error');
      return { success: false, message: apiErr.message };
    }
  }, [triggerNotification]);

  const registerUser = useCallback(async (name, phone, password) => {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanPhone) {
      return { success: false, message: 'لطفاً شماره موبایل خود را وارد نمایید.' };
    }
    if (!cleanPassword) {
      return { success: false, message: 'وارد کردن رمز عبور الزامی است.' };
    }
    if (cleanPassword.length < 4) {
      return { success: false, message: 'رمز عبور باید حداقل ۴ کاراکتر باشد.' };
    }

    setIsLoadingAuth(true);

    try {
      const res = await authApi.register({
        name: cleanName || `کاربر ${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        password: cleanPassword
      });

      const userObj = res?.user || normalizeUser(res);
      if (!userObj) {
        throw new Error(res?.message || 'پاسخ نامعتبر از سرور دریافت شد.');
      }
      setCurrentUser(userObj);
      triggerNotification(`ثبت‌نام شما با موفقیت انجام شد: ${userObj.name}`, 'success');
      setIsLoadingAuth(false);
      return { success: true, user: userObj };
    } catch (apiErr) {
      setIsLoadingAuth(false);
      triggerNotification(apiErr.message, 'error');
      return { success: false, message: apiErr.message };
    }
  }, [triggerNotification]);

  const updateProfile = useCallback(async ({ name, phone, address, postalCode } = {}) => {
    try {
      const res = await authApi.updateProfile({ name, phone, address, postalCode });
      const updatedUser = res?.user || normalizeUser(res) || {
        ...currentUser,
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(postalCode !== undefined ? { postalCode } : {})
      };
      setCurrentUser(updatedUser);
      triggerNotification('مشخصات کاربری با موفقیت به‌روزرسانی شد.', 'success');
      return { success: true, user: updatedUser };
    } catch (err) {
      triggerNotification(`خطا در به‌روزرسانی مشخصات: ${err.message}`, 'error');
      return { success: false, message: err.message };
    }
  }, [currentUser, triggerNotification]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const res = await authApi.changePassword({ oldPassword, newPassword });
      triggerNotification('رمز عبور با موفقیت تغییر یافت.', 'success');
      return { success: true, message: res?.message || 'رمز عبور با موفقیت تغییر کرد.' };
    } catch (err) {
      return { success: false, message: err.message || 'خطا در تغییر رمز عبور' };
    }
  }, [triggerNotification]);

  const logout = useCallback(() => {
    authApi.logout();
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    triggerNotification('از حساب کاربری خارج شدید.', 'info');
  }, [triggerNotification]);

  const isAdmin = Boolean(currentUser && (currentUser.role === 'admin' || currentUser.isAdmin === true));
  const isAuthenticated = Boolean(currentUser);

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        isAdmin,
        isLoadingAuth,
        loginUser,
        registerUser,
        updateProfile,
        changePassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
