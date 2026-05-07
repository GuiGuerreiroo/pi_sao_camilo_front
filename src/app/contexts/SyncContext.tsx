import { createContext, useContext, type ReactNode } from 'react';
import { useSync, type UseSyncReturn } from '@/hooks/useSync';

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

const SyncContext = createContext<UseSyncReturn | null>(null);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export function SyncProvider({ children }: { children: ReactNode }) {
  const sync = useSync();

  return (
    <SyncContext.Provider value={sync}>
      {children}
    </SyncContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Consumer hook
// ─────────────────────────────────────────────────────────────

/**
 * Access the sync state (`pendingCount`, `isSyncing`, `syncNow`)
 * from anywhere inside the `<SyncProvider>` tree.
 */
export function useSyncContext(): UseSyncReturn {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSyncContext must be used within a <SyncProvider>');
  }
  return ctx;
}
