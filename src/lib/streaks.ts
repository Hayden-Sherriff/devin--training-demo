const STREAK_KEY = 'devin-training-streaks';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  activeDates: string[]; // Array of ISO date strings
  totalActiveDays: number;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getStreakData(): StreakData {
  const stored = localStorage.getItem(STREAK_KEY);
  if (!stored) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      activeDates: [],
      totalActiveDays: 0,
    };
  }
  return JSON.parse(stored);
}

export function recordActivity(): StreakData {
  const data = getStreakData();
  const today = getToday();
  const yesterday = getYesterday();

  if (data.lastActiveDate === today) {
    return data; // Already recorded today
  }

  if (!data.activeDates.includes(today)) {
    data.activeDates.push(today);
  }
  data.totalActiveDays = data.activeDates.length;

  if (data.lastActiveDate === yesterday) {
    data.currentStreak += 1;
  } else if (data.lastActiveDate !== today) {
    data.currentStreak = 1;
  }

  data.lastActiveDate = today;
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);

  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  return data;
}

export function isActiveToday(): boolean {
  const data = getStreakData();
  return data.lastActiveDate === getToday();
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '\uD83D\uDD25'; // fire
  if (streak >= 14) return '\u2B50'; // star
  if (streak >= 7) return '\uD83D\uDCAA'; // muscle
  if (streak >= 3) return '\u26A1'; // lightning
  return '\uD83C\uDF31'; // seedling
}
