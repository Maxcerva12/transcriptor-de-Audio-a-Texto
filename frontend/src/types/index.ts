// Tipos para Electron API
export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
}

export interface WindowAPI {
  api: {
    getAppInfo: () => {
      appName: string;
      version: string;
      apiUrl: string;
      isElectron: boolean;
    };
    showMessage: (title: string, message: string) => void;
    openExternal: (url: string) => void;
  };
}

// Extender la interfaz Window para incluir las APIs de Electron
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    api?: WindowAPI['api'];
  }
}

export interface TranscriptionRequest {
  model?: string;
  language?: string;
  task?: "transcribe" | "translate";
}

export interface TranscriptionResponse {
  text: string;
  language: string;
  duration: number;
  task_id?: string;  // ID de la tarea para cancelación
  segments?: Array<{
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  }>;
}

export interface ModelInfo {
  models: string[];
  default: string;
  recommended: {
    speed: string;
    balanced: string;
    quality: string;
    best: string;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface TranscriptionState {
  isTranscribing: boolean;
  progress: UploadProgress | null;
  result: TranscriptionResponse | null;
  error: string | null;
}
