import React from 'react';
import { ShieldCheck } from 'lucide-react';
import styles from './style.module.css';

export const UsersTab = () => {
  return (
    <div>
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>مشتریان فروشگاه</h1>
          <p className={styles.tabSubtitle}>مدیریت اطلاعات و سطح دسترسی کاربران</p>
        </div>
      </div>
      
      <div className={styles.privacyBox}>
        <div className={styles.privacyIcon}>
          <ShieldCheck size={48} strokeWidth={2} />
        </div>
        <h2 className={styles.privacyTitle}>حریم خصوصی فعال است</h2>
        <p className={styles.privacyDesc}>در راستای سادگی و حفظ امنیت اطلاعات، جزئیات لیست مشتریان در این نمای ساده پنهان شده است.</p>
      </div>
    </div>
  );
};
