// -------------------------------------------------------------
// Authentication API (/api/auth)
// Strictly uses phone and password (no fake emails)
// -------------------------------------------------------------
import { client, setStoredToken } from './client';

// Unwraps Mongoose documents (_doc) and API envelopes
export function unwrapDoc(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  let target = raw;
  if (target._doc && typeof target._doc === 'object') {
    target = { ...target, ...target._doc };
  }
  if (target.data && typeof target.data === 'object' && !Array.isArray(target.data)) {
    target = target.data._doc ? { ...target.data, ...target.data._doc } : target.data;
  }
  if (target.user && typeof target.user === 'object' && !Array.isArray(target.user)) {
    target = target.user._doc ? { ...target.user, ...target.user._doc } : target.user;
  }
  if (target._doc && typeof target._doc === 'object') {
    target = { ...target, ...target._doc };
  }
  return target;
}

// Normalize user object from various server response formats
export function normalizeUser(raw) {
  if (!raw) return null;
  const u = unwrapDoc(raw);
  if (!u || typeof u !== 'object') return null;

  const phone = String(u.phone || u.phoneNumber || u.mobile || '').trim();
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
    id: String(id),
    _id: String(id),
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
  const unwrapped = unwrapDoc(resData);
  const token =
    unwrapped.token ||
    unwrapped.accessToken ||
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
   * Register with name, email, phone, password (Section 1.1)
   * @param {{ name: string, phone: string, email?: string, password: string }} payload
   */
  async register({ name, phone, email, password }) {
    const cleanPhone = (phone || '').trim();
    const cleanPassword = (password || '').trim();
    const cleanName = (name || '').trim();
    const cleanEmail = (email || (cleanPhone ? `${cleanPhone}@talarice.ir` : 'user@example.com')).trim();

    const res = await client.post('/auth/register', {
      name: cleanName,
      email: cleanEmail,
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
   * Login with email/phone and password (Section 1.2)
   * @param {{ email?: string, phone?: string, identifier?: string, password: string }} payload
   */
  async login({ email, phone, identifier, password }) {
    const rawIdentifier = (email || phone || identifier || '').trim();
    const cleanPassword = (password || '').trim();
    const isEmail = rawIdentifier.includes('@');
    const cleanEmail = isEmail ? rawIdentifier : `${rawIdentifier}@talarice.ir`;
    const cleanPhone = !isEmail ? rawIdentifier : '';

    const res = await client.post('/auth/login', {
      email: isEmail ? rawIdentifier : cleanEmail,
      phone: cleanPhone || rawIdentifier,
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
