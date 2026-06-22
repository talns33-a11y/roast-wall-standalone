import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoast, CreateRoastInput } from '../api.js';
import styles from '../styles.module.css';

const TONES: { value: CreateRoastInput['tone']; label: string }[] = [
  { value: 'dry', label: 'dry verdict' },
  { value: 'sharp', label: 'sharp judgment' },
  { value: 'gentle', label: 'lenient court' },
  { value: 'brutal-but-safe', label: 'maximum sentence' },
];

/**
 * The roast submission form. Collects the five details + tone, submits to the
 * backend, then navigates to the generated certificate page.
 */
export function RoastFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateRoastInput>({
    name: '',
    age: '',
    professionOrHobby: '',
    proudOf: '',
    ridiculousThing: '',
    tone: 'brutal-but-safe',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof CreateRoastInput, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const record = await createRoast(form);
      navigate(`/certificate/${record.id}`);
    } catch {
      setError('Something went wrong generating your roast. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>Present your testimony ⚖️</h1>
      <p className={styles.sectionSub}>
        The court is in session. Answer honestly — the AI will use your own words against you.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Your name — for the record</label>
          <input
            className={styles.input}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Alex"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Age at time of offenses</label>
          <input
            className={styles.input}
            value={form.age}
            onChange={(e) => update('age', e.target.value)}
            placeholder="e.g. 28"
            inputMode="numeric"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Profession or hobby (alleged)</label>
          <input
            className={styles.input}
            value={form.professionOrHobby}
            onChange={(e) => update('professionOrHobby', e.target.value)}
            placeholder="e.g. software developer who lifts on weekends"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>One thing you claim to be proud of</label>
          <textarea
            className={styles.textarea}
            value={form.proudOf}
            onChange={(e) => update('proudOf', e.target.value)}
            placeholder="e.g. I once cooked a whole meal without burning it"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>One incriminating fact about yourself</label>
          <textarea
            className={styles.textarea}
            value={form.ridiculousThing}
            onChange={(e) => update('ridiculousThing', e.target.value)}
            placeholder="e.g. I talk to my plants and take it personally when they wilt"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Severity of judgment requested</label>
          <div className={styles.toneRow}>
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`${styles.toneChip} ${form.tone === t.value ? styles.toneChipActive : ''}`}
                onClick={() => update('tone', t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.ctaButton} disabled={submitting}>
          {submitting ? 'The court is deliberating…' : '⚖️ I plead guilty — begin the trial'}
        </button>
      </form>
    </div>
  );
}
