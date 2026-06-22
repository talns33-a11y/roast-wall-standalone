import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoast, RoastRecord } from '../api.js';
import styles from '../styles.module.css';

export function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [roast, setRoast] = useState<RoastRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Existing share state
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Feature A — summon mechanic
  const [friendName, setFriendName] = useState('');
  const [summons, setSummons] = useState('');
  const [copiedSummons, setCopiedSummons] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRoast(id)
      .then(setRoast)
      .catch(() => setRoast(null))
      .finally(() => setLoading(false));
  }, [id]);

  // --- existing share actions ---

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

  // --- Feature E: native share with fallback ---

  const shareNative = () => {
    const shareData = {
      title: roast ? `AI Shame Trial — ${roast.name} convicted` : 'AI Shame Trial',
      text: roast ? roast.socialCaption : 'Stand trial before the AI court.',
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // user cancelled or share failed — fall back silently
        copyLink();
      });
    } else {
      copyLink();
    }
  };

  // --- Feature A: summon mechanic ---

  const generateSummons = () => {
    if (!roast || !friendName.trim()) return;
    const summonsUrl =
      window.location.origin +
      '/?summoned_by=' +
      encodeURIComponent(roast.name);
    const message = [
      `${friendName.trim()}, you have been summoned to stand trial by the AI Shame Trial.`,
      `${roast.name} received ${roast.serialLabel} and dares you to face judgment.`,
      `Answer the summons:`,
      summonsUrl,
    ].join('\n');
    setSummons(message);
  };

  const copySummons = () => {
    if (!summons) return;
    navigator.clipboard?.writeText(summons).then(() => {
      setCopiedSummons(true);
      setTimeout(() => setCopiedSummons(false), 2000);
    });
  };

  const shareOnXSummons = () => {
    if (!roast || !friendName.trim()) return;
    const summonsUrl =
      window.location.origin +
      '/?summoned_by=' +
      encodeURIComponent(roast.name);
    const tweetText = encodeURIComponent(
      `${friendName.trim()}, you have been summoned to stand trial. ${roast.name} received ${roast.serialLabel} and dares you. #AIShameTrial`
    );
    const tweetUrl = encodeURIComponent(summonsUrl);
    window.open(
      `https://x.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
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

        {/* Certificate card */}
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

        {/* Share sentence */}
        <div className={styles.caption}>
          <strong>Your sentence:</strong> {roast.socialCaption}
        </div>

        {/* Existing + new share actions */}
        <div className={styles.actionRow}>
          <button className={styles.secondaryButton} onClick={shareNative}>
            Share via...
          </button>
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

        {/* Feature A — Summon a friend */}
        <div className={styles.summonSection}>
          <div className={styles.summonHeadline}>⚖️ Summon a friend to stand trial</div>
          <div className={styles.summonSub}>
            The court orders you to bring others before it. Enter a name to generate a summons.
          </div>
          <div className={styles.summonInputRow}>
            <input
              className={styles.summonInput}
              type="text"
              placeholder="Friend's name"
              value={friendName}
              onChange={(e) => { setFriendName(e.target.value); setSummons(''); }}
              maxLength={60}
            />
            <button
              className={styles.secondaryButton}
              style={{ flex: '0 0 auto' }}
              onClick={generateSummons}
              disabled={!friendName.trim()}
            >
              Generate summons
            </button>
          </div>

          {summons ? (
            <>
              <div className={styles.summonOutput}>{summons}</div>
              <div className={styles.summonRow}>
                <button className={styles.secondaryButton} onClick={copySummons}>
                  {copiedSummons ? 'Copied!' : 'Copy summons'}
                </button>
                <button className={styles.secondaryButton} onClick={shareOnXSummons}>
                  Share summons on X
                </button>
              </div>
            </>
          ) : null}
        </div>

        {/* Feature D — Visitor CTA */}
        <div className={styles.visitorCta}>
          <div className={styles.visitorCtaHeadline}>The court is now in session.</div>
          <p className={styles.visitorCtaSub}>
            Will you stand trial for your life choices?
          </p>
          <Link to="/roast" className={styles.ctaButton}>
            ⚖️ Submit yourself for judgment
          </Link>
        </div>

      </div>
    </div>
  );
}
