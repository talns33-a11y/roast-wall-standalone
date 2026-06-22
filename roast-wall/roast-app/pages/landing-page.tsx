import { Link, useSearchParams } from 'react-router-dom';
import styles from '../styles.module.css';

export function LandingPage() {
  const [searchParams] = useSearchParams();
  const summonedBy = searchParams.get('summoned_by');

  if (summonedBy) {
    return (
      <div className={styles.container}>
        <section className={styles.hero}>
          <span className={styles.badge}>⚖️ You Have Been Summoned</span>
          <h1 className={styles.headline}>
            {summonedBy} has summoned you to stand trial.
          </h1>
          <p className={styles.subheadline}>
            The court is waiting. Your testimony is required.
          </p>
          <Link to="/roast" className={styles.ctaButton}>
            ⚖️ Answer the summons
          </Link>
          <p className={styles.payNote}>
            Demo mode — no real payment yet. Trial is free while in session.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/wall" className={styles.secondaryButton} style={{ display: 'inline-block', maxWidth: 280 }}>
              🏛️ See who has already been convicted
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.badge}>⚖️ The Public AI Shame Trial</span>
        <h1 className={styles.headline}>
          Stand trial for your life choices.
        </h1>
        <p className={styles.subheadline}>
          Present your testimony. The AI will deliberate.
          A verdict will be issued. Your conviction becomes a matter of public record.
        </p>
        {/* Placeholder payment CTA — swap Link href for real checkout URL when payment is live. */}
        <Link to="/roast" className={styles.ctaButton}>
          ⚖️ Submit yourself for judgment
        </Link>
        <p className={styles.payNote}>
          Demo mode — no real payment yet. Trial is free while in session.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureEmoji}>📜</div>
            <h3 className={styles.featureTitle}>Present your testimony</h3>
            <p className={styles.featureText}>
              Answer five questions. The court will use your own words against you.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureEmoji}>🔨</div>
            <h3 className={styles.featureTitle}>Receive your verdict</h3>
            <p className={styles.featureText}>
              An official charge, a sentence, and a hidden mercy clause — with your unique case number.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureEmoji}>🏛️</div>
            <h3 className={styles.featureTitle}>Enter the public record</h3>
            <p className={styles.featureText}>
              Every conviction is added to the Hall of the Convicted — a permanent public record.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <Link to="/wall" className={styles.secondaryButton} style={{ display: 'inline-block', maxWidth: 280 }}>
            🏛️ See who&apos;s been convicted
          </Link>
        </div>
      </section>
    </div>
  );
}
