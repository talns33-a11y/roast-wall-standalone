import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listRoasts, RoastRecord } from '../api.js';
import styles from '../styles.module.css';

/**
 * The public wall page. Shows all generated roast certificates as cards.
 */
export function WallPage() {
  const [roasts, setRoasts] = useState<RoastRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRoasts()
      .then(setRoasts)
      .catch(() => setRoasts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>🏛️ The Public Roast Wall</h1>
      <p className={styles.sectionSub}>A viral monument of everyone brave enough to get roasted.</p>
      <div className={styles.counter}>🔥 {roasts.length} roasts and counting</div>

      {loading ? (
        <div className={styles.loading}>Loading the wall…</div>
      ) : roasts.length === 0 ? (
        <div className={styles.empty}>
          <p>No roasts yet. Be the first on the wall!</p>
          <Link to="/roast" className={styles.ctaButton}>🔥 Get roasted</Link>
        </div>
      ) : (
        <div className={styles.wallGrid}>
          {roasts.map((r) => (
            <Link
              key={r.id}
              to={`/certificate/${r.id}`}
              className={styles.wallCard}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className={styles.wallSerial}>{r.serialLabel}</span>
              <span className={styles.wallName}>{r.name}</span>
              <span className={styles.wallTitle}>{r.title}</span>
              <span className={styles.wallLine}>“{r.roastLine}”</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
