'use client';

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export class StreakManager {
  private static STORAGE_KEY = 'georgian_learner_streak';

  static getStreak(): StreakData {
    if (typeof window === 'undefined') {
      return { current: 0, longest: 0, lastActiveDate: '' };
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return { current: 0, longest: 0, lastActiveDate: '' };
    }

    return JSON.parse(stored);
  }

  static updateStreak(): { updated: boolean; streak: StreakData; isNewRecord: boolean } {
    if (typeof window === 'undefined') {
      return {
        updated: false,
        streak: { current: 0, longest: 0, lastActiveDate: '' },
        isNewRecord: false,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const currentStreak = this.getStreak();
    let updated = false;
    let isNewRecord = false;

    // If last active date is today, no update needed
    if (currentStreak.lastActiveDate === today) {
      return { updated: false, streak: currentStreak, isNewRecord: false };
    }

    // If last active date is yesterday, increment streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (currentStreak.lastActiveDate === yesterdayStr) {
      currentStreak.current += 1;
      updated = true;
    } else if (!currentStreak.lastActiveDate || currentStreak.lastActiveDate < yesterdayStr) {
      // Streak broken, start over
      currentStreak.current = 1;
      updated = true;
    } else if (!currentStreak.lastActiveDate) {
      // First time
      currentStreak.current = 1;
      updated = true;
    }

    // Update longest streak if needed
    if (currentStreak.current > currentStreak.longest) {
      currentStreak.longest = currentStreak.current;
      isNewRecord = true;
    }

    currentStreak.lastActiveDate = today;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentStreak));

    return { updated, streak: currentStreak, isNewRecord };
  }

  static resetStreak(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
