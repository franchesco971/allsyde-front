'use client';

import { Shield } from 'lucide-react';
import styles from './AuthBranding.module.scss';

interface AuthBrandingProps {
  description?: string;
}

export default function AuthBranding({ description }: AuthBrandingProps) {
  return (
    <div className={styles.branding}>
      <img
        src="https://images.pexels.com/photos/16276655/pexels-photo-16276655.jpeg"
        alt="Modern building"
        className={styles.brandingImage}
      />
      <div className={styles.brandingOverlay} />
      <div className={styles.brandingContent}>
        <h1 className={styles.brandingTitle}>AllSyde Risk</h1>
        {description && (
          <p className={styles.brandingDesc}>{description}</p>
        )}
        <div className={styles.brandingStats}>
          <div className={styles.brandingStat}>
            <div className={styles.brandingStatIcon}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className={styles.brandingStatValue}>100%</div>
              <div className={styles.brandingStatLabel}>Conformité</div>
            </div>
          </div>
          <div className={styles.brandingStat}>
            <div className={styles.brandingStatIcon}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className={styles.brandingStatValue}>IA</div>
              <div className={styles.brandingStatLabel}>Activée</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
