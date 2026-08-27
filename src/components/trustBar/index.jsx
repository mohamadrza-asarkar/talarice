import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const TrustBar = () => {
  const { trustItems } = useApp();
  const [selectedTrust, setSelectedTrust] = useState(null);

  if (!trustItems?.length) return null;

  return (
    <section className={styles.trustGrid}>
      {trustItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setSelectedTrust(item)}
          className={styles.trustItem}
        >
          <i className={item.iconClass} />
          <span>{item.title}</span>
        </button>
      ))}

      {selectedTrust && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTrust(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <i className={selectedTrust.iconClass} />
              <h3>{selectedTrust.title}</h3>
            </header>
            <p className={styles.modalDescription}>{selectedTrust.description}</p>
            <button type="button" onClick={() => setSelectedTrust(null)} className={styles.closeButton}>
              بستن
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

