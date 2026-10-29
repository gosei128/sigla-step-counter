import type { Mood } from '../theme';

export const DATA: Record<Mood, { steps: number; label: string }> = {
  idle: { steps: 1200, label: 'Resting' },
  walking: { steps: 7600, label: 'Walking' },
  goal: { steps: 10450, label: 'Goal hit' },
};

export const REPLIES: Record<Mood, string[]> = {
  idle: ['Mmf. Five more minutes…', "Okay, okay, I'm awake. Sort of.", 'That was nice. A walk would be nicer.', "*yawn* You're squishy too, you know."],
  walking: ['Hehe! That tickles.', "Squish me all you want, I'm sturdy.", 'Ooh, that gave me a little boost!', 'Careful, I bounce!'],
  goal: ['Wheee! Again! Again!', "I'm so full of steps I could pop!", 'Best. Day. Ever.', "Can't squish this much joy!"],
};

export const OB: { mood: Mood; title: string; body: string; cta: string }[] = [
  { mood: 'idle', title: "Hi. I'm Sigla.", body: "I'm a little spirit that lives on your steps. When you move, I feel it.", cta: 'Nice to meet you' },
  { mood: 'walking', title: 'How far should we go each day?', body: 'Pick a daily goal. You can change it later.', cta: 'Sounds good' },
  { mood: 'goal', title: 'I stay right here with you.', body: 'Your steps are counted and saved on this phone. No account, no signal needed.', cta: "Let's walk" },
];

export const GOALS: [number, string][] = [[6000, 'Easy'], [8000, 'Steady'], [10000, 'Bold']];

export const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function homeLine(mood: Mood, steps: number, goal: number) {
  if (mood === 'idle') return 'Feeling a bit heavy today. A short walk would help.';
  if (mood === 'walking') return `${(goal - steps).toLocaleString()} more steps and I'll be stoked.`;
  return "We did it! I'm buzzing all over.";
}

export const EVO_LINE = "I can feel a little crest growing. Keep it up and I'll show you.";

export type Quest = { id: string; title: string; done: number; total: number; unit?: string; xp: number; note: string };

// Mock quest data until quests are generated from real activity.
export const DAILY_QUESTS: Quest[] = [
  { id: 'early', title: "Walk before 9am and I'll dig up a bonus shard.", done: 620, total: 1000, unit: 'steps', xp: 50, note: 'ends 9:00' },
  { id: 'lunch', title: 'Take a 10-minute walk after lunch.', done: 0, total: 10, unit: 'min', xp: 30, note: '12:00 – 14:00' },
  { id: 'stairs', title: 'Find some stairs. I love the view.', done: 4, total: 4, unit: 'flights', xp: 20, note: 'done' },
];

export const WEEKLY_QUESTS: Quest[] = [
  { id: 'five', title: 'Hit your goal 5 days this week.', done: 3, total: 5, unit: 'days', xp: 200, note: '2 days left' },
  { id: 'fifty', title: 'Walk 50,000 steps together.', done: 38200, total: 50000, unit: 'steps', xp: 150, note: 'ends Sunday' },
];

export const LEVEL = { level: 4, xp: 340, next: 500 };

// Last 7 days, Monday first. Today (Friday) comes from live steps.
export const WEEK_STEPS = [9200, 8150, 10850, 4100, null, null, null] as (number | null)[];
export const MONTH_STEPS = [52400, 61800, 47300, 38200];
export const STREAK = { current: 12, best: 21 };
