'use client';

export interface PointsEvent {
  type: 'lesson_completed' | 'practice_session' | 'pronunciation_practiced' | 'streak_milestone' | 'achievement_unlocked' | 'daily_goal';
  points: number;
  description: string;
  timestamp: number;
}

export const POINTS_VALUES = {
  lesson_completed: 50,
  practice_session: 10,
  pronunciation_practiced: 5,
  streak_milestone: 100,
  achievement_unlocked: 200,
  daily_goal: 25,
} as const;

export class PointsManager {
  private static STORAGE_KEY = 'georgian_learner_points';
  private static HISTORY_KEY = 'georgian_learner_points_history';

  static getPoints(): number {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  static addPoints(type: keyof typeof POINTS_VALUES, description?: string): PointsEvent {
    const points = POINTS_VALUES[type];
    const currentPoints = this.getPoints();
    const newTotal = currentPoints + points;

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, newTotal.toString());

      const event: PointsEvent = {
        type,
        points,
        description: description || this.getDefaultDescription(type),
        timestamp: Date.now(),
      };

      // Store in history
      const history = this.getHistory();
      history.push(event);
      // Keep only last 100 events
      const recentHistory = history.slice(-100);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(recentHistory));

      return event;
    }

    return {
      type,
      points,
      description: description || this.getDefaultDescription(type),
      timestamp: Date.now(),
    };
  }

  static getHistory(): PointsEvent[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static reset(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.HISTORY_KEY);
    }
  }

  private static getDefaultDescription(type: keyof typeof POINTS_VALUES): string {
    const descriptions: Record<keyof typeof POINTS_VALUES, string> = {
      lesson_completed: 'Completed a lesson',
      practice_session: 'Completed practice session',
      pronunciation_practiced: 'Practiced pronunciation',
      streak_milestone: 'Streak milestone reached',
      achievement_unlocked: 'Achievement unlocked',
      daily_goal: 'Daily goal completed',
    };
    return descriptions[type];
  }

  static getLevel(points: number): { level: number; nextLevelPoints: number; progress: number } {
    // Level progression: 0-100 (Level 1), 100-300 (Level 2), 300-600 (Level 3), etc.
    // Formula: level N requires 100 * (N * (N + 1) / 2) points
    let level = 1;
    let levelThreshold = 0;
    let nextThreshold = 100;

    while (points >= nextThreshold) {
      level++;
      levelThreshold = nextThreshold;
      nextThreshold = 100 * (level * (level + 1)) / 2;
    }

    const progress = points >= nextThreshold
      ? 100
      : ((points - levelThreshold) / (nextThreshold - levelThreshold)) * 100;

    return {
      level,
      nextLevelPoints: nextThreshold - points,
      progress: Math.max(0, Math.min(100, progress)),
    };
  }
}

