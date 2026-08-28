import client from './client';

function parseUser(u) {
  if (!u) return null;
  return {
    id: String(u.id || u._id || 'usr-1'),
    name: u.name || u.fullName || 'مشتری عزیز',
    phone: u.phone || u.mobile || '',
    email: u.email || '',
    address: u.address || '',
    postalCode: u.postalCode || '',
    role: u.role || 'user',
    isAdmin: Boolean(u.isAdmin || u.role === 'admin')
  };
}

export const authApi = {
  /**
   * Login user with phone/email and password
   */
  async login(credentials) {
    try {
      const response = await client.post('/auth/login', credentials);
      if (response && response.success && response.data && response.data.token) {
        localStorage.setItem('tala_token', response.data.token);
        const parsedUser = parseUser(response.data.user);
        localStorage.setItem('tala_auth', JSON.stringify({ isLoggedIn: true, user: parsedUser }));
        return {
          success: true,
          token: response.data.token,
          user: parsedUser,
          message: response.message || 'ورود به حساب کاربری با موفقیت انجام شد.'
        };
      }
    } catch (err) {
      console.warn('[authApi] Server login error:', err.message || err);
      throw err;
    }
  },

  /**
   * Register new customer
   */
  async register(userData) {
    try {
      const response = await client.post('/auth/register', userData);
      if (response && response.success && response.data && response.data.token) {
        localStorage.setItem('tala_token', response.data.token);
        const parsedUser = parseUser(response.data.user);
        localStorage.setItem('tala_auth', JSON.stringify({ isLoggedIn: true, user: parsedUser }));
        return {
          success: true,
          token: response.data.token,
          user: parsedUser,
          message: response.message || 'ثبت‌نام با موفقیت انجام گردید.'
        };
      }
    } catch (err) {
      console.warn('[authApi] Server register error:', err.message || err);
      throw err;
    }
  },

  /**
   * Fetch current authenticated profile
   */
  async getProfile() {
    try {
      const response = await client.get('/auth/me');
      if (response && response.success && response.data) {
        const parsedUser = parseUser(response.data);
        localStorage.setItem('tala_auth', JSON.stringify({ isLoggedIn: true, user: parsedUser }));
        return {
          success: true,
          user: parsedUser
        };
      }
    } catch (err) {
      console.warn('[authApi] Fetch profile error:', err.message || err);
    }
    const saved = localStorage.getItem('tala_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.user) return { success: true, user: parseUser(parsed.user) };
      } catch {}
    }
    return { success: false, user: null };
  },

  /**
   * Update user profile address or phone
   */
  async updateProfile(profileData) {
    try {
      const response = await client.put('/auth/profile', profileData);
      if (response && response.success && response.data) {
        const updated = parseUser(response.data);
        localStorage.setItem('tala_auth', JSON.stringify({ isLoggedIn: true, user: updated }));
        return {
          success: true,
          user: updated,
          message: response.message || 'اطلاعات کاربری با موفقیت به‌روزرسانی شد.'
        };
      }
    } catch (err) {
      console.warn('[authApi] Update profile error:', err.message || err);
      throw err;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('tala_token');
    localStorage.removeItem('token');
    localStorage.removeItem('tala_auth');
    return { success: true, message: 'از حساب کاربری خارج شدید.' };
  }
};

export default authApi;
