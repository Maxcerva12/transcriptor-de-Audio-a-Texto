export interface TranscriptionRequest {
  model?: string;
  language?: string;
  task?: "transcribe" | "translate";
}

export interface TranscriptionResponse {
  text: string;
  language: string;
  duration: number;
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
