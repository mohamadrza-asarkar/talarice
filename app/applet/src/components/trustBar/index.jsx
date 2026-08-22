import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const TrustBar = () => {
  const { trustItems } = useApp();
  const [selectedTrust, setSelectedTrust] = useState(null);

  if (!trustItems || trustItems.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.trustGrid}>
        {trustItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTrust(item)}
            className={styles.trustButton}
          >
            <div className={styles.iconWrapper}>
              <i className={`${item.iconClass} ${styles.icon}`} />
            </div>
            <span className={styles.title}>
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {selectedTrust && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}>
                <i className={`${selectedTrust.iconClass} ${styles.modalIcon}`} />
              </div>
              <h3 className={styles.modalTitle}>
                {selectedTrust.title}
              </h3>
            </div>
            <p className={styles.modalDescription}>
              {selectedTrust.description}
            </p>
            <button
              onClick={() => setSelectedTrust(null)}
              className={styles.closeButton}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
