import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listRoasts, RoastRecord } from '../api.js';
import styles from '../styles.module.css';

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
      <h1 className={styles.sectionTitle}>🏛️ Hall of the Convicted</h1>
      <p className={styles.sectionSub}>
        The official public record of everyone who stood trial and was found guilty.
      </p>
      <div className={styles.counter}>⚖️ {roasts.length} convictions on record</div>

      {loading ? (
        <div className={styles.loading}>Retrieving the public record…</div>
      ) : roasts.length === 0 ? (
        <div className={styles.empty}>
          <p>No convictions yet. Be the first to stand trial.</p>
          <Link to=”/roast” className={styles.ctaButton}>⚖️ Submit yourself for judgment</Link>
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
              <span className={styles.wallName}>{r.name}</span>
              <span className={styles.wallTitle}>CONVICTED: {r.title}</span>
              <span className={styles.wallLine}>”{r.roastLine}”</span>
              <span className={styles.wallSerial}>Case {r.serialLabel}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
