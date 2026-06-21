import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoast, RoastRecord } from '../api.js';
import styles from '../styles.module.css';

/**
 * The generated certificate result page. Loads a roast by id and renders the
 * certificate card with sharing actions.
 */
export function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [roast, setRoast] = useState<RoastRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRoast(id)
      .then(setRoast)
      .catch(() => setRoast(null))
      .finally(() => setLoading(false));
  }, [id]);

  const copyCaption = () => {
    if (!roast) return;
    navigator.clipboard?.writeText(`${roast.socialCaption}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return <div className={styles.loading}>Loading your certificate…</div>;
  if (!roast)
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>Certificate not found.</p>
          <Link to="/roast" className={styles.ctaButton}>Get roasted</Link>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.certWrap}>
        <div className={styles.certificate}>
          <div className={styles.certSerial}>{roast.serialLabel}</div>
          <div className={styles.certName}>{roast.name}</div>
          <div className={styles.certTitle}>{roast.title}</div>
          <p className={styles.certLine}>“{roast.roastLine}”</p>
          <div className={styles.certCompliment}>{roast.hiddenCompliment}</div>
          <div className={styles.certFooter}>
            <span>The Million AI Roast Wall</span>
            <span>{new Date(roast.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className={styles.caption}>
          <strong>Share caption:</strong> {roast.socialCaption}
        </div>

        <div className={styles.actionRow}>
          <button className={styles.secondaryButton} onClick={copyCaption}>
            {copied ? '✅ Copied!' : '📋 Copy caption'}
          </button>
          <Link to="/wall" className={styles.secondaryButton}>🏛️ See the wall</Link>
          <Link to="/roast" className={styles.secondaryButton}>🔁 Roast again</Link>
        </div>
      </div>
    </div>
  );
}
