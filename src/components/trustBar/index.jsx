import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export function TrustBar() {
  const { trustItems } = useApp();
  const [selectedTrust, setSelectedTrust] = useState(null);

  if (!trustItems?.length) return null;

  return (
    <section className={styles.trustGrid}>
      {trustItems.map(function (item) {
        return (
          <button
            key={item.id}
            type="button"
            onClick={function () { setSelectedTrust(item); }}
            className={styles.trustItem}
          >
            <i className={item.iconClass} />
            <span>{item.title}</span>
          </button>
        );
      })}

      {selectedTrust && (
        <div className={styles.modalOverlay} onClick={function () { setSelectedTrust(null); }}>
          <div className={styles.modalContent} onClick={function (e) { e.stopPropagation(); }}>
            <header className={styles.modalHeader}>
              <i className={selectedTrust.iconClass} />
              <h3>{selectedTrust.title}</h3>
            </header>
            <p className={styles.modalDescription}>{selectedTrust.description}</p>
            <button type="button" onClick={function () { setSelectedTrust(null); }} className={styles.closeButton}>
              بستن
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

