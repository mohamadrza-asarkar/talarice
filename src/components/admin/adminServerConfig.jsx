import React, { useState } from 'react';
import {
  getBackendOrigin,
  getApiBaseUrl,
  getBackendUrlOverride,
  setBackendUrlOverride,
  clearBackendUrlOverride
} from '../../api/client';
import styles from './admin.module.css';

export function AdminServerConfig({ showToast }) {
  const [currentOrigin, setCurrentOrigin] = useState(() => getBackendOrigin());
  const [currentApiUrl, setCurrentApiUrl] = useState(() => getApiBaseUrl());
  const [customUrlInput, setCustomUrlInput] = useState(() => getBackendUrlOverride() || '');
  const [hasOverride, setHasOverride] = useState(() => Boolean(getBackendUrlOverride()));

  const handleSave = (e) => {
    e.preventDefault();
    if (!customUrlInput || !customUrlInput.trim()) {
      showToast('لطفاً آدرس معتبر تونل یا سرور (مانند https://xxx.ngrok-free.app) را وارد کنید.', 'error');
      return;
    }

    const saved = setBackendUrlOverride(customUrlInput.trim());
    setCurrentOrigin(getBackendOrigin());
    setCurrentApiUrl(getApiBaseUrl());
    setHasOverride(true);
    showToast(`آدرس سرور با موفقیت به ${saved} تغییر یافت.`, 'success');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleReset = () => {
    clearBackendUrlOverride();
    setCustomUrlInput('');
    setCurrentOrigin(getBackendOrigin());
    setCurrentApiUrl(getApiBaseUrl());
    setHasOverride(false);
    showToast('تنظیمات به حالت اتوماتیک (.env / دامنه جاری) بازگشت.', 'info');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className={styles.adminSection}>
      <header className={styles.sectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>
            <i className="fa-solid fa-network-wired" style={{ marginLeft: '8px', color: '#d97706' }} />
            <span>تنظیمات اتصالات سرور و تونل (Ngrok / Cloudflare / Localhost)</span>
          </h3>
          <p className={styles.sectionSubtitle}>
            جهت اشتراک‌گذاری با مشتری یا اتصال از روی دستگاه‌های دیگر (موبایل/تبلت)، می‌توانید آدرس جدید تونل را اینجا ست کنید.
          </p>
        </div>
      </header>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>آدرس سرور بک‌اند فعلی (Origin):</span>
            <strong style={{ fontSize: '1rem', color: '#0f172a', wordBreak: 'break-all', dir: 'ltr', display: 'block' }}>
              {currentOrigin}
            </strong>
          </div>

          <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>آدرس نهایی APIها:</span>
            <strong style={{ fontSize: '1rem', color: '#059669', wordBreak: 'break-all', dir: 'ltr', display: 'block' }}>
              {currentApiUrl}
            </strong>
          </div>
        </div>

        {hasOverride && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#fef3c7', color: '#92400e', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginLeft: '6px' }} />
              یک آدرس دستی جهت جایگزینی آدرس .env فعال است.
            </span>
            <button
              type="button"
              onClick={handleReset}
              style={{ background: '#d97706', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              حذف و بازنشانی
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.75rem' }}>
          تنظیم آدرس جدید تونل (Ngrok / LocalTunnel)
        </h4>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
            آدرس کامل تونل بک‌اند:
          </label>
          <input
            type="text"
            dir="ltr"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            placeholder="مثال: https://my-backend-tunnel.ngrok-free.app"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
            می‌توانید با یا بدون https:// و با یا بدون پسوند /api وارد کنید. سیستم به صورت هوشمند آن را با تصاویر و APIها تطبیق می‌دهد.
          </small>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="submit"
            style={{ background: '#059669', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>ذخیره و اتصال به آدرس جدید</span>
          </button>

          {hasOverride && (
            <button
              type="button"
              onClick={handleReset}
              style={{ background: '#64748b', color: '#fff', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              بازنشانی به حالت اتوماتیک
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminServerConfig;
