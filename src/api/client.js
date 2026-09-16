// -------------------------------------------------------------
// Native Fetch API Client (No Axios / No XHR)
// Base URL from documentation:
// https://ais-dev-rpvkewlvjilhjnoamjgjvq-240344892228.europe-west1.run.app/api
// -------------------------------------------------------------

let DEFAULT_DOCS_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000/api';

export const API_BASE_URL = DEFAULT_DOCS_BASE_URL;

export function getImageUrl(imgPath) {
  if (!imgPath) return '';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('data:')) {
    return imgPath;
  }
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  if (imgPath.startsWith('/')) {
    return `${baseUrl}${imgPath}`;
  }
  return `${baseUrl}/${imgPath}`;
}

export const TOKEN_STORAGE_KEY = 'tala_rice_token';


export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not store token:', err);
  }
}

/**
 * Modern native fetch wrapper with automatic token injection & error handling
 */
export async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const token = getStoredToken();
  const rawBody = options.body !== undefined ? options.body : options.data;
  const isFormData = typeof FormData !== 'undefined' && rawBody instanceof FormData;

  // Preserve Content-Type and Accept headers properly without options.headers overwriting Content-Type
  const customHeaders = options.headers || {};
  const headers = {
    'Accept': 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders
  };

  let body = undefined;
  if (rawBody !== undefined && rawBody !== null) {
    if (isFormData || typeof rawBody === 'string') {
      body = rawBody;
    } else {
      body = JSON.stringify(rawBody);
    }
  }

  const { headers: _h, body: _b, data: _d, ...restOptions } = options;

  const config = {
    method: options.method || 'GET',
    headers,
    ...restOptions
  };

  if (body !== undefined && config.method !== 'GET' && config.method !== 'HEAD') {
    config.body = body;
  }

  try {
    const response = await fetch(url, config);
    let data = null;
    const isNoBody = response.status === 304 || response.status === 204;

    if (!isNoBody) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = {};
        }
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } else {
      data = { status: response.status, success: true };
    }

    if (!response.ok && response.status !== 304) {
      const errorMsg = data?.message || data?.error || `خطای سرور (کد ${response.status})`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.statusCode = response.status;
      error.data = data;
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error('عدم برقراری ارتباط با وب‌سرویس بک‌اند (لطفاً اتصال اینترنت یا آدرس سرور را بررسی کنید).');
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw err;
  }
}

export const client = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
};

export default client;
