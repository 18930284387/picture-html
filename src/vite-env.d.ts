/// <reference types="vite/client" />

declare const __APP_ENV__: string

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
