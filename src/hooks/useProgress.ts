import { useState, useEffect, useCallback } from 'react';
import { tracks, getAllLessons } from '../data/curriculum';

const STORAGE_KEY = 'devin-training-progress';

export interface ExerciseResult {
  exerciseId: string;
  completed: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  exerciseResults: ExerciseResult[];
  lastAccessed: number;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  currentLessonId: string | null;
}

function loadProgress(): ProgressState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore parse errors
  }
  return { lessons: {}, currentLessonId: null };
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      lessons: {
        ...prev.lessons,
        [lessonId]: {
          ...prev.lessons[lessonId],
          lessonId,
          completed: true,
          exerciseResults: prev.lessons[lessonId]?.exerciseResults || [],
          lastAccessed: Date.now(),
        }
      }
    }));
  }, []);

  const markLessonIncomplete = useCallback((lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      lessons: {
        ...prev.lessons,
        [lessonId]: {
          ...prev.lessons[lessonId],
          lessonId,
          completed: false,
          exerciseResults: prev.lessons[lessonId]?.exerciseResults || [],
          lastAccessed: Date.now(),
        }
      }
    }));
  }, []);

  const saveExerciseResult = useCallback((lessonId: string, result: ExerciseResult) => {
    setProgress(prev => {
      const lesson = prev.lessons[lessonId] || {
        lessonId,
        completed: false,
        exerciseResults: [],
        lastAccessed: Date.now(),
      };
      const existingIdx = lesson.exerciseResults.findIndex(
        r => r.exerciseId === result.exerciseId
      );
      const newResults = [...lesson.exerciseResults];
      if (existingIdx >= 0) {
        newResults[existingIdx] = result;
      } else {
        newResults.push(result);
      }
      return {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            ...lesson,
            exerciseResults: newResults,
            lastAccessed: Date.now(),
          }
        }
      };
    });
  }, []);

  const setCurrentLesson = useCallback((lessonId: string | null) => {
    setProgress(prev => ({ ...prev, currentLessonId: lessonId }));
  }, []);

  const isLessonComplete = useCallback((lessonId: string) => {
    return progress.lessons[lessonId]?.completed || false;
  }, [progress]);

  const getTrackProgress = useCallback((trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return { completed: 0, total: 0, percentage: 0 };
    let total = 0;
    let completed = 0;
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        total++;
        if (progress.lessons[lesson.id]?.completed) {
          completed++;
        }
      }
    }
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [progress]);

  const getOverallProgress = useCallback(() => {
    const allLessons = getAllLessons();
    const total = allLessons.length;
    const completed = allLessons.filter(l => progress.lessons[l.lesson.id]?.completed).length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [progress]);

  const getModuleProgress = useCallback((moduleId: string) => {
    for (const track of tracks) {
      const mod = track.modules.find(m => m.id === moduleId);
      if (mod) {
        const total = mod.lessons.length;
        const completed = mod.lessons.filter(l => progress.lessons[l.id]?.completed).length;
        return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
      }
    }
    return { completed: 0, total: 0, percentage: 0 };
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({ lessons: {}, currentLessonId: null });
  }, []);

  return {
    progress,
    markLessonComplete,
    markLessonIncomplete,
    saveExerciseResult,
    setCurrentLesson,
    isLessonComplete,
    getTrackProgress,
    getOverallProgress,
    getModuleProgress,
    resetProgress,
  };
}
