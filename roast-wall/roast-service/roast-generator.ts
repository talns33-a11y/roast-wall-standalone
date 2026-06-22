/**
 * Input details collected from the roast submission form.
 */
export interface RoastInput {
  /** The person's name. */
  name: string;
  /** The person's age (as a string from the form). */
  age: string;
  /** Profession or hobby. */
  professionOrHobby: string;
  /** One thing the person is proud of. */
  proudOf: string;
  /** One ridiculous thing about the person. */
  ridiculousThing: string;
  /** Desired tone of the roast. */
  tone: RoastTone;
}

/** Supported roast tones. */
export type RoastTone = 'dry' | 'sharp' | 'gentle' | 'brutal-but-safe';

/**
 * The generated roast content (without serial / id metadata).
 */
export interface GeneratedRoast {
  /** Catchy roast title. */
  title: string;
  /** A single funny roast line. */
  roastLine: string;
  /** A hidden compliment that softens the roast. */
  hiddenCompliment: string;
  /** Full shareable certificate text. */
  certificateText: string;
  /** Social sharing caption. */
  socialCaption: string;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const TITLES: Record<RoastTone, string[]> = {
  dry: [
    'Guilty of Operating Below Ambient Enthusiasm',
    'Convicted: Chronic Mild Effort in a World That Asked for More',
    'Found Liable for Existing at Room Temperature',
    'Guilty of Prolonged and Deliberate Adequacy',
  ],
  sharp: [
    'Guilty of Confidence Disproportionate to the Evidence',
    'Convicted: First-Degree Delusion With Aggravating Circumstances',
    'Charged and Found Guilty of Being the Plot Twist Nobody Ordered',
    'Convicted on All Counts of Knowing Better and Proceeding Anyway',
  ],
  gentle: [
    'Lovably Convicted of Harmless Chaos, First Offence',
    'Found Guilty of Being Too Much and Not Enough, Simultaneously',
    'Convicted of Adorable Disorder — Sentence Suspended With Affection',
    'Guilty of Wholesome Recklessness, No Prior Record',
  ],
  'brutal-but-safe': [
    'Convicted on All Counts: Questionable Judgment, Unearned Confidence, and Doing It Anyway',
    'Guilty of Crimes Against Self-Awareness, Premeditated',
    'Found Guilty in Absentia of Their Own Better Judgment',
    'Maximum Conviction: The Defendant Was Warned and Continued',
  ],
};

/**
 * Tone-specific court-finding templates. Each uses placeholders filled
 * from the input. All findings are absurd, playful, and safe.
 */
const ROAST_LINES: Record<RoastTone, string[]> = {
  dry: [
    'The court finds that {name}, having spent {age} years on this planet, considers "{proud}" a significant personal achievement. The court notes: it is not.',
    'Exhibit A: a self-described {job} who is also documented as "{ridiculous}". The prosecution presents no further evidence, as none is required.',
    '{name} submitted "{proud}" as character evidence. After due consideration, the tribunal has decided this says more than the defence intended.',
    'The record shows {age} years of accumulated experience culminating in "{ridiculous}". The court declines to comment further, but its expression speaks volumes.',
  ],
  sharp: [
    '{name} presents as a {job}. The evidence — specifically "{ridiculous}" — suggests the court is owed an explanation.',
    'Proud of "{proud}" at age {age}? Counsel notes the bar was subterranean. The defendant brought a shovel.',
    'The defendant voluntarily disclosed "{ridiculous}". The court did not ask. This is now part of the permanent record.',
    '{name} argued that being a {job} who does "{ridiculous}" demonstrates versatility. The court finds this argument creative, and nothing else.',
  ],
  gentle: [
    '{name} stands convicted of "{ridiculous}", which the court finds simultaneously baffling and completely on-brand for someone of their particular energy.',
    'A {job} who is proud of "{proud}" — the court finds this chaotic, harmless, and oddly endearing. Guilty nonetheless.',
    'At {age} years of age, still being "{ridiculous}". The court has seen worse. The court has not encountered much that is weirder.',
    '{name} testified that "{proud}" was their finest hour. The court, after reflection, finds this both defensible and very them.',
  ],
  'brutal-but-safe': [
    '{name} asserts that "{ridiculous}" is a personality trait. The prosecution asserts it is a cry for structure. The court finds: both.',
    'You are proud of "{proud}" the way a defendant is proud of showing up — the bar is on the floor and yet here we are.',
    '{age} years of accumulated choices and "{ridiculous}" is the submission? The tribunal is not angry. It is just deeply, deeply unsurprised.',
    '{name} claimed the title of {job} while simultaneously being "{ridiculous}". The court entered this into evidence and then took a recess to compose itself.',
  ],
};

const COMPLIMENTS: string[] = [
  'Mercy of the court: the tribunal acknowledges that "{proud}" did, in fact, require a non-trivial amount of effort, and this has been noted in the defendant\'s favour.',
  'In the interest of mercy: being a {job} who openly admits "{ridiculous}" is the kind of honesty this court rarely encounters, and quietly respects.',
  'The court grants leniency on the grounds that the world is measurably more interesting with {name} in it, and this is not nothing.',
  'Extenuating circumstance noted: "{proud}" is, upon reflection, genuinely worth being proud of. Sentence reduced accordingly.',
  'The court finds that "{ridiculous}" — while inadmissible as a character defence — is, between us, the most charming thing about the defendant.',
  'Mercy granted: the defendant showed up, answered honestly, and stood trial. That alone distinguishes them from most.',
  'The tribunal notes, off the record, that a {job} who owns "{ridiculous}" with that level of confidence is something the rest of us frankly envy.',
  'Mitigating factor: the defendant\'s willingness to stand trial at all suggests a self-awareness the court had not anticipated and is now prepared to reward.',
];

const CAPTIONS: string[] = [
  'I just stood trial before an AI court and was found guilty on all counts 😭😭 #AIShameTrial',
  'The AI judge read my testimony and convicted me. I genuinely cannot argue with it. ⚖️ #AIShameTrial',
  'My official AI verdict is in and it is devastating and accurate 💀 think you can handle yours? #AIShameTrial',
  'I have a conviction with a case number now. This is my villain origin story. ⚖️ #AIShameTrial',
  'Just received my AI court verdict and the mercy clause hurt more than the charge 😭 #AIShameTrial',
  'The AI Shame Trial found me guilty and honestly? Fair. ⚖️ #AIShameTrial',
  'I submitted my testimony and the AI court used my own words against me 🔥 #AIShameTrial',
  'Convicted by an AI. Sentenced. Case number assigned. My permanent record is ruined. ⚖️ #AIShameTrial',
];

function fill(template: string, input: RoastInput): string {
  return template
    .replace(/\{name\}/g, input.name || 'Anonymous')
    .replace(/\{age\}/g, input.age || 'an unknown number of')
    .replace(/\{job\}/g, input.professionOrHobby || 'professional mystery')
    .replace(/\{proud\}/g, input.proudOf || 'existing')
    .replace(/\{ridiculous\}/g, input.ridiculousThing || 'being like this');
}

/**
 * Generate a funny, safe court verdict from the given input. Deterministic per
 * input so the same answers always produce the same verdict.
 *
 * @param input the trial submission details.
 * @returns the generated verdict content.
 */
export function generateRoast(input: RoastInput): GeneratedRoast {
  const tone: RoastTone = ROAST_LINES[input.tone] ? input.tone : 'brutal-but-safe';
  const seed = hashString(
    `${input.name}|${input.age}|${input.professionOrHobby}|${input.proudOf}|${input.ridiculousThing}|${tone}`
  );

  const title = pick(TITLES[tone], seed);
  const roastLine = fill(pick(ROAST_LINES[tone], seed), input);
  const hiddenCompliment = fill(pick(COMPLIMENTS, seed >> 2), input);
  const socialCaption = pick(CAPTIONS, seed >> 3);

  const certificateText = [
    `⚖️ AI SHAME TRIAL — OFFICIAL VERDICT ⚖️`,
    ``,
    `This certifies that ${input.name || 'Anonymous'} has been tried, convicted, and sentenced.`,
    ``,
    `Conviction: ${title}`,
    ``,
    `"${roastLine}"`,
    ``,
    `${hiddenCompliment}`,
  ].join('\n');

  return { title, roastLine, hiddenCompliment, certificateText, socialCaption };
}
