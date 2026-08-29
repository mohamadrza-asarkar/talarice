import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, X, Check, Sparkles } from 'lucide-react';
import styles from './style.module.css';

const DEFAULT_SAMPLES = [
  { label: 'کیسه نخی طلا رایس', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1000' },
  { label: 'برنج پخته شده و قد کشیده', url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1000' },
  { label: 'دانه‌های برنج معطر', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=1000' },
  { label: 'شالیزار سرسبز کامفیروز', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=1000' }
];

export function ImageUploader({
  value,
  onChange,
  label = 'تصویر شاخص',
  sampleImages = DEFAULT_SAMPLES
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url' | 'samples'
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef(null);

  // Compress image before setting DataURL to keep state lightweight
  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری معتبر (JPG, PNG, WebP) انتخاب نمایید.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onChange(dataUrl);
        setUrlInput(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  function handleUrlSubmit(e) {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  }

  function handleClear() {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <label className={styles.label}>{label}</label>
        
        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '2px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              border: 'none',
              background: mode === 'upload' ? '#ffffff' : 'transparent',
              color: mode === 'upload' ? '#042a1b' : '#64748b',
              fontWeight: 800,
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: mode === 'upload' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <UploadCloud size={13} />
            <span>آپلود فایل</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              border: 'none',
              background: mode === 'url' ? '#ffffff' : 'transparent',
              color: mode === 'url' ? '#042a1b' : '#64748b',
              fontWeight: 800,
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: mode === 'url' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <LinkIcon size={13} />
            <span>لینک مستقیم</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('samples')}
            style={{
              border: 'none',
              background: mode === 'samples' ? '#ffffff' : 'transparent',
              color: mode === 'samples' ? '#042a1b' : '#64748b',
              fontWeight: 800,
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: mode === 'samples' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={13} />
            <span>تصاویر آماده</span>
          </button>
        </div>
      </div>

      {/* Preview Box if image exists */}
      {value ? (
        <div
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #d4af37',
            background: '#042a1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '160px',
            maxHeight: '220px',
            marginBottom: '0.5rem'
          }}
        >
          <img
            src={value}
            alt="پیش‌نمایش تصویر"
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(4,42,27,0.85) 0%, transparent 60%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0.75rem'
            }}
          >
            <span style={{ color: '#fef08a', fontSize: '0.75rem', fontWeight: 800 }}>
              تصویر انتخاب شده و آماده ذخیره است
            </span>
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <X size={14} />
              <span>حذف تصویر</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Mode: Upload Drag & Drop */}
      {mode === 'upload' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: dragActive ? '2px dashed #059669' : '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '1.25rem 1rem',
            textAlign: 'center',
            backgroundColor: dragActive ? '#ecfdf5' : '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#042a1b'
            }}
          >
            <UploadCloud size={22} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem', color: '#042a1b' }}>
              برای آپلود تصویر کلیک کنید یا فایل را به اینجا بکشید
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
              فرمت‌های مجاز: JPG, PNG, WEBP (حداکثر ۵ مگابایت)
            </p>
          </div>
        </div>
      )}

      {/* Mode: Direct URL */}
      {mode === 'url' && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              onChange(e.target.value);
            }}
            dir="ltr"
            className={styles.input}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => onChange(urlInput.trim())}
            className={styles.submitBtn}
            style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            تأیید لینک
          </button>
        </div>
      )}

      {/* Mode: Preset Sample Images */}
      {mode === 'samples' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {sampleImages.map((s, idx) => {
            const isSelected = value === s.url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(s.url);
                  setUrlInput(s.url);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                  background: isSelected ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'right'
                }}
              >
                <img
                  src={s.url}
                  alt={s.label}
                  style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', flex: 1 }}>
                  {s.label}
                </span>
                {isSelected && <Check size={16} color="#059669" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
