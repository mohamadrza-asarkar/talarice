import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import { Sparkles } from 'lucide-react';
import styles from './style.module.css';

export const Header = () => {
  const navigate = useNavigate();
  const { isAdmin } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            onClick={() => navigate('/')}
            className={styles.logoWrapper}
          >
            <Logo variant="circle" />
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(180, 83, 9, 0.35))',
                border: '1px solid rgba(217, 119, 6, 0.5)',
                color: '#fbbf24',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              <Sparkles size={14} color="#fbbf24" />
              پنل ادمین
            </button>
          )}
        </div>
        <SearchBar />
      </div>
    </header>
  );
};
