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
      <Link to="/" className={styles.brand}>🔥 Roast Wall</Link>
      <div className={styles.navLinks}>
        <Link to="/wall" className={styles.navLink}>The Wall</Link>
        {location.pathname !== '/roast' && (
          <Link to="/roast" className={styles.navLink}>Get roasted</Link>
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
        The Million AI Roast Wall · All roasts are AI-generated, funny, and safe. No cruelty allowed.
      </footer>
    </div>
  );
}
