import { Link } from 'react-router-dom';
import styles from '../styles.module.css';

/**
 * The landing page: headline, subheadline, placeholder payment CTA, and features.
 */
export function LandingPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.badge}>🔥 The Million AI Roast Wall</span>
        <h1 className={styles.headline}>
          Get roasted by AI and claim your place on the Million AI Roast Wall.
        </h1>
        <p className={styles.subheadline}>
          Pay $9, answer five questions, and get a funny personal AI roast certificate
          with your own public serial number.
        </p>
        {/* Placeholder payment button — replace href with Gumroad / Stripe / PayPal / Lemon Squeezy later. */}
        <Link to="/roast" className={styles.ctaButton}>
          💸 Pay $9 and get roasted
        </Link>
        <p className={styles.payNote}>
          Demo mode — no real payment yet. Button is ready to swap for a real checkout link.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureEmoji}>📝</div>
            <h3 className={styles.featureTitle}>Answer 5 questions</h3>
            <p className={styles.featureText}>
              Tell us who you are. The funnier the truth, the better the roast.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureEmoji}>🎓</div>
            <h3 className={styles.featureTitle}>Get a certificate</h3>
            <p className={styles.featureText}>
              A personal roast with a title, a hidden compliment, and a unique serial number.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureEmoji}>🏛️</div>
            <h3 className={styles.featureTitle}>Join the wall</h3>
            <p className={styles.featureText}>
              Every roast goes up on the public wall — a viral internet monument.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <Link to="/wall" className={styles.secondaryButton} style={{ display: 'inline-block', maxWidth: 260 }}>
            👀 See the public wall
          </Link>
        </div>
      </section>
    </div>
  );
}
