import React from 'react';
import styles from './Pyramid.module.css';

export default function Pyramid() {
  return (
    <div className={styles['pyramid-loader']} aria-hidden="true">
      <div className={styles.wrapper}>
        <span className={`${styles.side} ${styles.side1}`} />
        <span className={`${styles.side} ${styles.side2}`} />
        <span className={`${styles.side} ${styles.side3}`} />
        <span className={`${styles.side} ${styles.side4}`} />
        <span className={styles.shadow} />
      </div>
    </div>
  );
}
