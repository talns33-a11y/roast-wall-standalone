import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/landing-page.js';
import { RoastFormPage } from './pages/roast-form-page.js';
import { CertificatePage } from './pages/certificate-page.js';
import { WallPage } from './pages/wall-page.js';
import styles from './styles.module.css';

/**
 * Top navigation bar.
 */
function Nav() {
  const location = useLocation();
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>⚖️ AI Shame Trial</Link>
      <div className={styles.navLinks}>
        <Link to="/wall" className={styles.navLink}>Hall of the Convicted</Link>
        {location.pathname !== '/roast' && (
          <Link to="/roast" className={styles.navLink}>Stand Trial</Link>
        )}
      </div>
    </nav>
  );
}

/**
 * Root application: dark themed shell with nav, routed pages, and footer.
 */
export function RoastApp() {
  return (
    <div className={styles.app}>
      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/roast" element={<RoastFormPage />} />
        <Route path="/certificate/:id" element={<CertificatePage />} />
        <Route path="/wall" element={<WallPage />} />
      </Routes>
      <footer className={styles.footer}>
        AI Shame Trial · All verdicts are AI-generated, absurd, and safe. No real cruelty allowed.
      </footer>
    </div>
  );
}
