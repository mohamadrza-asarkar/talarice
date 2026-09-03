import React from 'react';
import { RefreshCw, ShieldAlert, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'radial-gradient(circle at 50% 50%, #063823 0%, #022215 50%, #00100a 100%)',
            color: '#f8fafc',
            fontFamily: 'inherit'
          }}
        >
          <div
            style={{
              maxWidth: '440px',
              width: '100%',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '1.25rem',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f87171'
              }}
            >
              <ShieldAlert size={32} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                خطا در اجرای برنامه
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                بخشی از رابط کاربری با خطا مواجه شده است. با بارگذاری مجدد می‌توانید ادامه دهید.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: '#d4af37',
                  color: '#042a1b',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                <span>بارگذاری مجدد</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer'
                }}
              >
                <Home size={16} />
                <span>صفحه اصلی</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
