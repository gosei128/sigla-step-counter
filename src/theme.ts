// Colors from the design. oklch values are pre-converted to sRGB hex (RN has no oklch).
export type Mood = 'idle' | 'walking' | 'goal';

export const PAL: Record<Mood, { main: string; soft: string; deep: string }> = {
  idle: { main: '#BDB6AE', soft: '#EEEBE6', deep: '#8A827B' },
  walking: { main: '#F3AE58', soft: '#FFEBD2', deep: '#9B540C' },
  goal: { main: '#49C4B7', soft: '#D6F7F1', deep: '#006D69' },
};

export const INK = '#2A2521';

export const C = {
  bg: '#FBF8F3',
  card: '#FFFFFF',
  border: 'rgba(42,37,33,0.06)',
  ink: INK,
  muted: '#7A716A',
  faint: '#A69D95',
  body: '#5C544E',
  track: '#F1EDE7',
  well: '#F7F4EF',
  chip: '#F4F1EC',
  dash: '#D8D1C9',
  qmark: '#B5ADA5',
  navOff: '#C4BCB4',
  goalBorder: '#EAE5DE',
  onDevice: '#9FB89A',
  shard: '#F2A548',
  shardSoft: '#FFEBD2',
  shardInk: '#894C06',
  evoPct: '#00736F',
};

export const F = {
  display: 'Fredoka_600SemiBold',
  displayMed: 'Fredoka_500Medium',
  regular: 'NunitoSans_400Regular',
  semi: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  heavy: 'NunitoSans_800ExtraBold',
};
