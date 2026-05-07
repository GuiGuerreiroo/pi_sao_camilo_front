import Dexie, { type Table } from 'dexie';
import type { MODALITY, URINE_COLOR, SYMPTOMS } from '@/app/interface/TrainingInterface';

// ─────────────────────────────────────────────────────────────
// IPendingWorkout — shape of a workout queued locally for sync
// ─────────────────────────────────────────────────────────────

/**
 * A workout entry stored in IndexedDB while offline.
 * Mirrors the backend `create-training` payload exactly.
 */
export interface IPendingWorkout {
  /** Auto-incremented local key managed by Dexie. */
  id?: number;

  /** Sport modality (e.g. "CORRIDA", "NATACAO", "ACADEMIA"). */
  modality: MODALITY;

  /** Epoch timestamp in ms — when the training started. */
  start_date: number;

  /** Epoch timestamp in ms — when the training ended. */
  end_date: number;

  /** Duration in minutes. */
  duration: number;

  /** Environment temperature in °C. */
  environment_temperature: number;

  /** Environment humidity in %. */
  environment_humidity: number;

  /** Weight before training in kg. */
  pre_training_weight: number;

  /** Weight after training in kg. */
  post_training_weight: number;

  /** Hydration before training in ml. */
  pre_training_hydration: number;

  /** Hydration during training in ml. */
  during_training_hydration: number;

  /** Urine eliminated during training in ml. */
  during_training_urine_elimination: number;

  /** Urine color indicator. */
  urine_color: URINE_COLOR;

  /** Whether clothes were soaked after training. */
  soaked_clothes: boolean;

  /** Perceived intensity from 0 to 10. */
  training_intensity: number;

  /** Symptoms reported before training. */
  pre_training_symptoms: SYMPTOMS[];

  /** Symptoms reported after training. */
  post_training_symptoms: SYMPTOMS[];
}

// ─────────────────────────────────────────────────────────────
// Database singleton
// ─────────────────────────────────────────────────────────────

class AppDatabase extends Dexie {
  pendingWorkouts!: Table<IPendingWorkout, number>;

  constructor() {
    super('PnescOfflineDB');

    this.version(1).stores({
      // ++id  → auto-increment primary key
      // start_date → indexed for chronological queries
      pendingWorkouts: '++id, start_date',
    });
  }
}

/** Singleton database instance used throughout the application. */
export const db = new AppDatabase();
