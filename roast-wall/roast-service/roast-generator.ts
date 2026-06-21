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
    'Certified Professionally Underwhelming',
    'A Masterclass in Mild Effort',
    'The Human Equivalent of Room Temperature',
  ],
  sharp: [
    'Sharp Enough to Cut Their Own Excuses',
    'Officially Too Confident for the Results',
    'The Plot Twist Nobody Asked For',
  ],
  gentle: [
    'Lovably Chaotic and Mostly Harmless',
    'A Soft Roast for a Soft Legend',
    'Adorably Doing Their Best',
  ],
  'brutal-but-safe': [
    'Roasted Medium-Well, Still Edible',
    'The Final Boss of Questionable Choices',
    'Brutally Honest, Lovingly Delivered',
  ],
};

/**
 * Tone-specific roast line templates. Each uses placeholders that are
 * filled from the input. All lines avoid protected traits and stay playful.
 */
const ROAST_LINES: Record<RoastTone, string[]> = {
  dry: [
    '{name}, {age} years on this planet and your biggest flex is still "{proud}". Bold.',
    'Being "{ridiculous}" while pretending to be a serious {job}? Truly inspiring, in a concerning way.',
    'You list "{proud}" like it is a personality. {name}, it is a Tuesday.',
  ],
  sharp: [
    '{name}, you call yourself a {job}, but "{ridiculous}" tells a very different story.',
    'Proud of "{proud}"? At {age}, the bar was on the floor and you brought a shovel.',
    'Confidently being "{ridiculous}" — somebody had to do it, and unfortunately it was you.',
  ],
  gentle: [
    '{name}, "{ridiculous}" is so very you, and honestly we would not change a thing (we would change a few things).',
    'A {job} who is proud of "{proud}"? That is the kind of harmless chaos the world needs more of.',
    'At {age}, still gloriously being "{ridiculous}". Never grow up, {name}.',
  ],
  'brutal-but-safe': [
    '{name}, "{ridiculous}" is not a quirk, it is a lifestyle, and that {job} energy is barely holding it together.',
    'You are proud of "{proud}" the way a cat is proud of knocking a glass off the table — chaotic and unearned.',
    '{age} years of practice and "{ridiculous}" is the masterpiece? The committee is speechless.',
  ],
};

const COMPLIMENTS: string[] = [
  'But honestly, "{proud}" took real guts, and that counts for a lot.',
  'Deep down, being a {job} who owns "{ridiculous}" is exactly the kind of confidence the rest of us wish we had.',
  'Truthfully, the world is more fun with {name} being unapologetically themselves.',
  'And for what it is worth, "{proud}" is genuinely something to be proud of.',
  'Secretly, your "{ridiculous}" is the most charming thing about you.',
];

const CAPTIONS: string[] = [
  'I paid to get roasted by an AI and somehow it was right 😭 #MillionAIRoastWall',
  'Officially roasted and added to the Million AI Roast Wall 🔥 think you can handle yours?',
  'The AI read me for filth and I deserved it 💀 get yours at the Million AI Roast Wall',
  'I have a roast certificate with a serial number now. This is my villain origin story. 🔥',
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
 * Generate a funny, safe roast from the given input. Deterministic per input
 * so the same answers always produce the same roast.
 *
 * @param input the roast submission details.
 * @returns the generated roast content.
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
    `🔥 THE MILLION AI ROAST WALL 🔥`,
    ``,
    `This certifies that ${input.name || 'Anonymous'} has been officially roasted.`,
    ``,
    `Title: ${title}`,
    ``,
    `"${roastLine}"`,
    ``,
    `${hiddenCompliment}`,
  ].join('\n');

  return { title, roastLine, hiddenCompliment, certificateText, socialCaption };
}
