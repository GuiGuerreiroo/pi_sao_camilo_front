import { useCallback, useEffect, useRef, useState } from 'react';
import { db, type IPendingWorkout } from '@/lib/db';
import { apiClient } from '@/services/api';
import type { TrainingInterface } from '@/app/interface/TrainingInterface';

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

export interface UseSyncReturn {
  /** Number of workouts still waiting in the local queue. */
  pendingCount: number;

  /** Whether a sync cycle is currently in progress. */
  isSyncing: boolean;

  /** Manually trigger a sync attempt. */
  syncNow: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

/**
 * `useSync` drains the Dexie `pendingWorkouts` queue whenever the
 * browser goes back online (and once on mount if already online).
 *
 * Each successfully synced row is deleted from IndexedDB; rows that
 * fail remain and will be retried on the next reconnect.
 */
export function useSync(): UseSyncReturn {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Guard against concurrent sync cycles
  const syncingRef = useRef(false);

  /** Refresh the pending count from IndexedDB. */
  const refreshCount = useCallback(async () => {
    const count = await db.pendingWorkouts.count();
    setPendingCount(count);
  }, []);

  /** Attempt to POST every pending workout and remove on success. */
  const syncNow = useCallback(async () => {
    if (syncingRef.current) return;
    if (!navigator.onLine) return;

    syncingRef.current = true;
    setIsSyncing(true);

    try {
      const pending: IPendingWorkout[] =
        await db.pendingWorkouts.toArray();

      for (const workout of pending) {
        try {
          // Strip the local Dexie `id` — backend doesn't expect it
          const {...payload } = workout;
          const response = await apiClient.post('/create-training', payload);

          const workoutDb: TrainingInterface = response.data.training;

          // Success — remove from the local queue
          if (workoutDb.training_id !== undefined) {
            await db.pendingWorkouts.delete(workout.id!);
          }
        } catch (err) {
          // Leave the row in IndexedDB so it is retried later
          console.warn(
            `[useSync] Failed to sync workout id=${workout.id}`,
            err,
          );
        }
      }
    } finally {
      syncingRef.current = false;
      setIsSyncing(false);
      await refreshCount();
    }
  }, [refreshCount]);

  // ── Lifecycle ──────────────────────────────────────────────

  useEffect(() => {
    // Sync on mount if we are already online
    refreshCount().then(() => {
      if (navigator.onLine) {
        syncNow();
      }
    });

    const handleOnline = () => {
      syncNow();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [refreshCount, syncNow]);

  // Keep the count up-to-date when other tabs modify the DB
  useEffect(() => {
    const interval = setInterval(refreshCount, 5_000);
    return () => clearInterval(interval);
  }, [refreshCount]);

  return { pendingCount, isSyncing, syncNow };
}
