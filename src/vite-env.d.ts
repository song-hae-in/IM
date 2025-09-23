/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_AI_API_KEY: string;
  // 여기에 추가로 사용하는 환경 변수를 선언하세요
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
