import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoast, RoastRecord } from '../api.js';
import styles from '../styles.module.css';

export function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [roast, setRoast] = useState<RoastRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRoast(id)
      .then(setRoast)
      .catch(() => setRoast(null))
      .finally(() => setLoading(false));
  }, [id]);

  const copyCaption = () => {
    if (!roast) return;
    const text = `${roast.socialCaption} ${window.location.href}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    });
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const shareOnX = () => {
    if (!roast) return;
    const text = encodeURIComponent(roast.socialCaption);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://x.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (loading) return <div className={styles.loading}>The court is deliberating...</div>;
  if (!roast)
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>Verdict not found.</p>
          <Link to="/roast" className={styles.ctaButton}>Stand trial</Link>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.certWrap}>
        <div className={styles.certificate}>
          <div className={styles.certSerial}>Case {roast.serialLabel}</div>
          <div className={styles.certName}>{roast.name}</div>
          <div className={styles.certTitle}>CONVICTED: {roast.title}</div>
          <p className={styles.certLine}>&quot;{roast.roastLine}&quot;</p>
          <div className={styles.certCompliment}>Mercy of the court: {roast.hiddenCompliment}</div>
          <div className={styles.certFooter}>
            <span>AI Shame Trial &mdash; Official Verdict</span>
            <span>{new Date(roast.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className={styles.caption}>
          <strong>Your sentence:</strong> {roast.socialCaption}
        </div>

        <div className={styles.actionRow}>
          <button className={styles.secondaryButton} onClick={shareOnX}>
            Share on X
          </button>
          <button className={styles.secondaryButton} onClick={copyCaption}>
            {copiedCaption ? 'Copied!' : 'Copy sentence'}
          </button>
          <button className={styles.secondaryButton} onClick={copyLink}>
            {copiedLink ? 'Copied!' : 'Copy verdict link'}
          </button>
          <Link to="/wall" className={styles.secondaryButton}>Hall of the Convicted</Link>
          <Link to="/roast" className={styles.secondaryButton}>Try again</Link>
        </div>
      </div>
    </div>
  );
}
