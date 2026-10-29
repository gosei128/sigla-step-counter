import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DATA, REPLIES } from '../data/copy';
import type { Mood } from '../theme';

const KEY = 'sigla:v1';

type Ctx = {
  ready: boolean;
  onboarded: boolean;
  goal: number;
  steps: number;
  mood: Mood;
  reply: string | null;
  burst: string | null;
  setGoal: (g: number) => void;
  // Mock step source. Swap for a pedometer feed later.
  setSteps: (s: number) => void;
  setMoodPreview: (m: Mood) => void;
  finishOnboarding: (goal: number) => void;
  resetOnboarding: () => void;
  animations: boolean;
  setAnimations: (v: boolean) => void;
  reminders: boolean;
  setReminders: (v: boolean) => void;
  poke: (id: string, mood: Mood) => void;
};

const SiglaContext = createContext<Ctx | null>(null);

export function moodFor(steps: number, goal: number): Mood {
  if (steps >= goal) return 'goal';
  if (steps < goal * 0.25) return 'idle';
  return 'walking';
}

export function SiglaProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [goal, setGoal] = useState(8000);
  const [steps, setSteps] = useState(DATA.walking.steps);
  const [preview, setPreview] = useState<Mood | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [burst, setBurst] = useState<string | null>(null);
  const [animations, setAnimations] = useState(true);
  const [reminders, setReminders] = useState(true);
  const pokes = useRef<Record<string, number>>({});
  const rt = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(raw => {
        if (!raw) return;
        const saved = JSON.parse(raw);
        setOnboarded(!!saved.onboarded);
        if (saved.goal) setGoal(saved.goal);
        if (typeof saved.animations === 'boolean') setAnimations(saved.animations);
        if (typeof saved.reminders === 'boolean') setReminders(saved.reminders);
      })
      .catch(() => {})
      .finally(() => setReady(true));
    return () => clearTimeout(rt.current);
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify({ onboarded, goal, animations, reminders })).catch(() => {});
  }, [ready, onboarded, goal, animations, reminders]);

  const poke = useCallback((id: string, mood: Mood) => {
    const lines = REPLIES[mood];
    const n = (pokes.current[id] || 0) + 1;
    pokes.current[id] = n;
    clearTimeout(rt.current);
    rt.current = setTimeout(() => { setReply(null); setBurst(null); }, 2400);
    setReply(lines[n % lines.length]);
    setBurst(id);
  }, []);

  const value = useMemo<Ctx>(() => ({
    ready, onboarded, goal, steps, reply, burst,
    mood: preview ?? moodFor(steps, goal),
    setGoal,
    setSteps: s => { setPreview(null); setSteps(s); },
    setMoodPreview: m => { setPreview(m); setSteps(DATA[m].steps); },
    finishOnboarding: g => { setGoal(g); setOnboarded(true); },
    resetOnboarding: () => setOnboarded(false),
    animations, setAnimations, reminders, setReminders,
    poke,
  }), [ready, onboarded, goal, steps, preview, reply, burst, poke, animations, reminders]);

  return <SiglaContext.Provider value={value}>{children}</SiglaContext.Provider>;
}

export function useSigla() {
  const ctx = useContext(SiglaContext);
  if (!ctx) throw new Error('useSigla must be used inside SiglaProvider');
  return ctx;
}
