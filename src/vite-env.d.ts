/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: Error) => void
  }

  export function registerSW(
    options?: RegisterSWOptions,
  ): (reloadPage?: boolean) => Promise<void>
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_MSS_API_URL: string
  readonly VITE_STAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
