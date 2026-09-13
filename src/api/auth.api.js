// -------------------------------------------------------------
// Authentication API (/api/auth)
// Strictly uses phone and password (no fake emails)
// -------------------------------------------------------------
import { client, setStoredToken } from './client';

// Normalize user object from various server response formats
export function normalizeUser(raw) {
  if (!raw) return null;
  let u = raw;
  if (raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    u = raw.data.user || raw.data;
  } else if (raw.user && typeof raw.user === 'object') {
    u = raw.user;
  }

  if (!u || typeof u !== 'object') return null;

  const phone = u.phone || u.phoneNumber || u.mobile || '';
  const id = u._id || u.id || (phone ? `usr-${phone}` : `usr-${Date.now()}`);
  const roleStr = String(u.role || u.userRole || u.type || '').trim().toLowerCase();
  const isAdmin = Boolean(
    u.isAdmin === true ||
    u.is_admin === true ||
    roleStr === 'admin' ||
    roleStr === 'superadmin' ||
    roleStr === 'manager' ||
    roleStr === 'administrator'
  );

  return {
    ...u,
    id,
    _id: id,
    name: u.name || u.fullName || u.username || (phone ? `کاربر ${phone.slice(-4)}` : 'کاربر گرامی'),
    phone,
    mobile: phone,
    email: u.email || '',
    address: u.address || '',
    postalCode: u.postalCode || '',
    role: isAdmin ? 'admin' : (roleStr || 'user'),
    isAdmin
  };
}

// Extract and save token from response
function extractAndSaveToken(resData) {
  if (!resData || typeof resData !== 'object') return null;
  const token =
    resData.token ||
    resData.data?.token ||
    resData.accessToken ||
    resData.data?.accessToken ||
    resData.data?.user?.token ||
    resData.user?.token;

  if (token && typeof token === 'string') {
    setStoredToken(token);
    return token;
  }
  return null;
}

export const authApi = {
  /**
   * Register with phone and password
   * @param {{ name: string, phone: string, password: string }} payload
   */
  async register({ name, phone, password }) {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || '').trim();

    const res = await client.post('/auth/register', {
      name: cleanName,
      phone: cleanPhone,
      password: cleanPassword
    });

    extractAndSaveToken(res);
    return {
      ...res,
      user: normalizeUser(res)
    };
  },

  /**
   * Login with phone and password
   * @param {{ phone: string, password: string }} payload
   */
  async login({ phone, password }) {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();

    const res = await client.post('/auth/login', {
      phone: cleanPhone,
      password: cleanPassword
    });

    extractAndSaveToken(res);
    return {
      ...res,
      user: normalizeUser(res)
    };
  },

  /**
   * Get current authenticated user details (/auth/me)
   */
  async getMe() {
    const res = await client.get('/auth/me');
    return {
      ...res,
      user: normalizeUser(res)
    };
  },

  /**
   * Update profile info (name, phone, address)
   */
  async updateProfile({ name, phone, address, postalCode }) {
    const res = await client.put('/auth/profile', {
      name: name?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      postalCode: postalCode?.trim()
    });

    return {
      ...res,
      user: normalizeUser(res)
    };
  },

  /**
   * Change password
   */
  async changePassword({ oldPassword, newPassword }) {
    const res = await client.put('/auth/change-password', {
      oldPassword: (oldPassword || '').trim(),
      newPassword: (newPassword || '').trim()
    });
    return res;
  },

  /**
   * Clear auth session
   */
  logout() {
    setStoredToken(null);
  }
};

export default authApi;
