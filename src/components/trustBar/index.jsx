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
            className={styles.trustItem}
          >
            <div className={styles.iconWrapper}>
              <i className={item.iconClass} style={{ fontSize: '1rem' }} />
            </div>
            <span className={styles.itemTitle}>
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {selectedTrust && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <i className={selectedTrust.iconClass} style={{ fontSize: '1.125rem' }} />
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


/* 
* ==========================================
* PURE CSS EQUIVALENT (AUTO-GENERATED SKELETON)
* ==========================================
* 
* .animate-fade-in {
*   // Add pure CSS for animate-fade-in here
* }
* 
* .backdrop-blur-sm {
*   // Add pure CSS for backdrop-blur-sm here
* }
* 
* .bg-\[#073822\] {
*   // Add pure CSS for bg-[#073822] here
* }
* 
* .bg-black\/70 {
*   // Add pure CSS for bg-black/70 here
* }
* 
* .bg-white {
*   // Add pure CSS for bg-white here
* }
* 
* .border {
*   // Add pure CSS for border here
* }
* 
* .border-2 {
*   // Add pure CSS for border-2 here
* }
* 
* .border-\[#d4af37\] {
*   // Add pure CSS for border-[#d4af37] here
* }
* 
* .border-\[#d4af37\]\/30 {
*   // Add pure CSS for border-[#d4af37]/30 here
* }
* 
* .border-b {
*   // Add pure CSS for border-b here
* }
* 
* .cursor-pointer {
*   // Add pure CSS for cursor-pointer here
* }
* 
* .fixed {
*   // Add pure CSS for fixed here
* }
* 
* .flex {
*   // Add pure CSS for flex here
* }
* 
* .flex-col {
*   // Add pure CSS for flex-col here
* }
* 
* .font-black {
*   // Add pure CSS for font-black here
* }
* 
* .font-medium {
*   // Add pure CSS for font-medium here
* }
* 
* .gap-3 {
*   // Add pure CSS for gap-3 here
* }
* 
* .h-10 {
*   // Add pure CSS for h-10 here
* }
* 
* .h-11 {
*   // Add pure CSS for h-11 here
* }
* 
* .hover\:bg-white\/80 {
*   // Add pure CSS for hover:bg-white/80 here
* }
* 
* .inset-0 {
*   // Add pure CSS for inset-0 here
* }
* 
* .items-center {
*   // Add pure CSS for items-center here
* }
* 
* .justify-center {
*   // Add pure CSS for justify-center here
* }
* 
* .leading-relaxed {
*   // Add pure CSS for leading-relaxed here
* }
* 
* .leading-tight {
*   // Add pure CSS for leading-tight here
* }
* 
* .max-w-sm {
*   // Add pure CSS for max-w-sm here
* }
* 
* .mb-1 {
*   // Add pure CSS for mb-1 here
* }
* 
* .mb-3 {
*   // Add pure CSS for mb-3 here
* }
* 
* .mb-4 {
*   // Add pure CSS for mb-4 here
* }
* 
* .p-1 {
*   // Add pure CSS for p-1 here
* }
* 
* .p-4 {
*   // Add pure CSS for p-4 here
* }
* 
* .p-5 {
*   // Add pure CSS for p-5 here
* }
* 
* .pb-3 {
*   // Add pure CSS for pb-3 here
* }
* 
* .px-4 {
*   // Add pure CSS for px-4 here
* }
* 
* .py-2 {
*   // Add pure CSS for py-2 here
* }
* 
* .py-2\.5 {
*   // Add pure CSS for py-2.5 here
* }
* 
* .rounded-2xl {
*   // Add pure CSS for rounded-2xl here
* }
* 
* .rounded-full {
*   // Add pure CSS for rounded-full here
* }
* 
* .rounded-xl {
*   // Add pure CSS for rounded-xl here
* }
* 
* .shadow-2xl {
*   // Add pure CSS for shadow-2xl here
* }
* 
* .shadow-sm {
*   // Add pure CSS for shadow-sm here
* }
* 
* .text-\[#073822\] {
*   // Add pure CSS for text-[#073822] here
* }
* 
* .text-\[#1e3a29\] {
*   // Add pure CSS for text-[#1e3a29] here
* }
* 
* .text-\[#fef08a\] {
*   // Add pure CSS for text-[#fef08a] here
* }
* 
* .text-\[10px\] {
*   // Add pure CSS for text-[10px] here
* }
* 
* .text-center {
*   // Add pure CSS for text-center here
* }
* 
* .text-justify {
*   // Add pure CSS for text-justify here
* }
* 
* .text-sm {
*   // Add pure CSS for text-sm here
* }
* 
* .text-xs {
*   // Add pure CSS for text-xs here
* }
* 
* .transition-all {
*   // Add pure CSS for transition-all here
* }
* 
* .transition-colors {
*   // Add pure CSS for transition-colors here
* }
* 
* .w-10 {
*   // Add pure CSS for w-10 here
* }
* 
* .w-11 {
*   // Add pure CSS for w-11 here
* }
* 
* .w-full {
*   // Add pure CSS for w-full here
* }
* 
* .z-50 {
*   // Add pure CSS for z-50 here
* }
* 
*/
