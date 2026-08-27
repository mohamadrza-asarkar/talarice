import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const TrustBar = () => {
  const { trustItems } = useApp();
  const [selectedTrust, setSelectedTrust] = useState(null);

  if (!trustItems?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.trustGrid}>
        {trustItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTrust(item)}
            className={styles.trustItem}
          >
            <div className={styles.iconWrapper}>
              <i className={item.iconClass} />
            </div>
            <span className={styles.itemTitle}>{item.title}</span>
          </button>
        ))}
      </div>

      {selectedTrust && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTrust(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <i className={selectedTrust.iconClass} />
              </div>
              <h3 className={styles.modalTitle}>{selectedTrust.title}</h3>
            </div>
            <p className={styles.modalDescription}>{selectedTrust.description}</p>
            <button onClick={() => setSelectedTrust(null)} className={styles.closeButton}>
              بستن
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
