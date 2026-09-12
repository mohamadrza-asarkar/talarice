import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, getStoredToken, setStoredToken } from '../services/api';

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
    return saved;
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
        const u = res?.data || res?.user;
        if (u) {
          const formatted = {
            ...u,
            id: u._id || u.id,
            isAdmin: u.role === 'admin'
          };
          setCurrentUser(formatted);
        }
      })
      .catch((err) => {
        // Token might be invalid or expired
        console.debug('Failed to sync auth with server:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = useCallback(async (identifier, password) => {
    if (!identifier || !identifier.trim()) {
      return { success: false, message: 'لطفاً ایمیل یا شماره موبایل را وارد کنید.' };
    }
    if (!password || !password.trim()) {
      return { success: false, message: 'وارد کردن رمز عبور الزامی است.' };
    }

    const cleanInput = identifier.trim();
    const cleanPassword = password.trim();
    const isEmail = cleanInput.includes('@');
    const email = isEmail ? cleanInput : `${cleanInput}@talarice.ir`;

    setIsLoadingAuth(true);

    // 1. Try real API Login
    try {
      const res = await authApi.login({ email, password: cleanPassword });
      if (res.success && res.data?.user) {
        const u = res.data.user;
        const userObj = {
          ...u,
          id: u._id || u.id,
          isAdmin: u.role === 'admin'
        };
        setCurrentUser(userObj);
        triggerNotification(`خوش آمدید، ${userObj.name || 'کاربر گرامی'}`, 'success');
        setIsLoadingAuth(false);
        return { success: true, user: userObj };
      }
    } catch (apiErr) {
      console.warn('API login error, checking local fallback:', apiErr.message);
    }

    // 2. Local Fallback Verification
    const user = users.find(
      (u) => (u.phone === cleanInput || u.email === cleanInput || u.email === email)
    );

    if (!user) {
      setIsLoadingAuth(false);
      return { success: false, message: 'کاربری با این مشخصات یافت نشد. لطفاً ثبت‌نام فرمایید.' };
    }

    if (user.password !== cleanPassword) {
      setIsLoadingAuth(false);
      return { success: false, message: 'رمز عبور نادرست است.' };
    }

    setCurrentUser(user);
    triggerNotification(`خوش آمدید، ${user.name}`, 'success');
    setIsLoadingAuth(false);
    return { success: true, user };
  }, [users, triggerNotification]);

  const registerUser = useCallback(async (name, phone, password, emailInput) => {
    if (!phone || !phone.trim()) {
      return { success: false, message: 'لطفاً شماره موبایل خود را وارد نمایید.' };
    }
    if (!password || !password.trim()) {
      return { success: false, message: 'وارد کردن رمز عبور الزامی است.' };
    }
    if (password.trim().length < 4) {
      return { success: false, message: 'رمز عبور باید حداقل ۴ کاراکتر باشد.' };
    }

    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();
    const cleanName = (name && name.trim()) ? name.trim() : `کاربر ${cleanPhone.slice(-4)}`;
    const email = (emailInput && emailInput.trim()) ? emailInput.trim() : `${cleanPhone}@talarice.ir`;

    setIsLoadingAuth(true);

    // 1. Try real API Register
    try {
      const res = await authApi.register({
        name: cleanName,
        email,
        password: cleanPassword,
        phone: cleanPhone
      });

      if (res.success && res.data?.user) {
        const u = res.data.user;
        const userObj = {
          ...u,
          id: u._id || u.id,
          isAdmin: u.role === 'admin'
        };
        setCurrentUser(userObj);
        setUsers((prev) => [...prev, userObj]);
        triggerNotification(`ثبت‌نام شما با موفقیت انجام شد: ${userObj.name}`, 'success');
        setIsLoadingAuth(false);
        return { success: true, user: userObj };
      }
    } catch (apiErr) {
      console.warn('API register error, falling back to local creation:', apiErr.message);
    }

    // 2. Local Fallback Creation
    const existingUser = users.find((u) => u.phone === cleanPhone || u.email === email);
    if (existingUser) {
      setIsLoadingAuth(false);
      return { success: false, message: 'این شماره یا ایمیل قبلاً ثبت‌نام شده است. لطفاً وارد شوید.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      _id: `usr-${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      email,
      password: cleanPassword,
      role: 'user',
      isAdmin: false,
      address: ''
    };

    setCurrentUser(newUser);
    setUsers((prev) => [...prev, newUser]);
    triggerNotification(`ثبت‌نام شما با موفقیت انجام شد: ${newUser.name}`, 'success');
    setIsLoadingAuth(false);
    return { success: true, user: newUser };
  }, [users, triggerNotification]);

  const updateProfile = useCallback(async (newName, newPhone) => {
    try {
      const res = await authApi.updateProfile({ name: newName, phone: newPhone });
      if (res.success && res.data) {
        const updated = {
          ...currentUser,
          ...res.data,
          id: res.data._id || currentUser.id
        };
        setCurrentUser(updated);
        triggerNotification('مشخصات کاربری با موفقیت در سرور به‌روزرسانی شد.', 'success');
        return { success: true, user: updated };
      }
    } catch (err) {
      console.debug('API updateProfile failed, updating locally:', err.message);
    }

    // Local update
    const updated = {
      ...currentUser,
      name: newName,
      phone: newPhone
    };
    setCurrentUser(updated);
    triggerNotification('مشخصات کاربری به‌روزرسانی شد.', 'success');
    return { success: true, user: updated };
  }, [currentUser, triggerNotification]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const res = await authApi.changePassword({ oldPassword, newPassword });
      if (res.success) {
        triggerNotification('رمز عبور با موفقیت تغییر یافت.', 'success');
        return { success: true, message: res.message };
      }
    } catch (err) {
      return { success: false, message: err.message || 'خطا در تغییر رمز عبور' };
    }
    return { success: true };
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
