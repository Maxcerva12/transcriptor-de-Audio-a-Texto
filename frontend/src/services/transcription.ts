import axios from "axios";
import {
  TranscriptionRequest,
  TranscriptionResponse,
  ModelInfo,
  UploadProgress,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Tiempos estimados de procesamiento basados en el modelo (en minutos)
const MODEL_ESTIMATED_TIMES = {
  tiny: 3, // 3 minutos - Nivel 1 (más rápido)
  base: 5, // 5 minutos - Nivel 2 (equilibrado)
  small: 8, // 8 minutos - Nivel 3 (buena calidad)
  medium: 12, // 12 minutos - Nivel 4 (alta calidad)
  "large-v1": 16, // 16 minutos - Nivel 5 (máxima calidad v1)
  "large-v2": 18, // 18 minutos - Nivel 6 (máxima calidad v2)
  "large-v3": 20, // 20 minutos - Nivel 7 (máxima calidad v3)
  large: 22, // 22 minutos - Nivel 8 (máxima calidad última)
  turbo: 10, // 10 minutos - Nivel 9 (optimizado, más rápido que large)
};

// Función para obtener tiempo estimado según el modelo (en minutos)
const getEstimatedTimeForModel = (model?: string): number => {
  if (!model) return MODEL_ESTIMATED_TIMES.base; // Tiempo estimado por defecto
  return (
    MODEL_ESTIMATED_TIMES[model as keyof typeof MODEL_ESTIMATED_TIMES] ||
    MODEL_ESTIMATED_TIMES.base
  );
};

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 0, // Sin timeout - permitir que la transcripción tome el tiempo que necesite
});

export class TranscriptionService {
  static async transcribeAudio(
    file: File,
    options: TranscriptionRequest = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append("file", file);

    if (options.model) {
      formData.append("model", options.model);
    }

    if (options.language) {
      formData.append("language", options.language);
    }

    if (options.task) {
      formData.append("task", options.task);
    }

    // Obtener tiempo estimado según el modelo
    const estimatedTime = getEstimatedTimeForModel(options.model);

    console.log(
      `🕒 Tiempo estimado para modelo "${
        options.model || "base"
      }": ${estimatedTime} minutos`
    );

    try {
      const response = await api.post("/transcribe", formData, {
        // No establecemos timeout para permitir que la transcripción tome el tiempo necesario
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const loaded = progressEvent.loaded;
            const total = progressEvent.total;
            const percentage = Math.round((loaded * 100) / total);

            onProgress({
              loaded,
              total,
              percentage,
            });
          }
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  static async getAvailableModels(): Promise<ModelInfo> {
    try {
      const response = await api.get("/models");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  static async checkHealth(): Promise<{
    status: string;
    [key: string]: unknown;
  }> {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
}

// Utilidades
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const isAudioFile = (file: File): boolean => {
  const audioTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/flac",
    "audio/m4a",
    "audio/ogg",
    "audio/wma",
    "audio/aac",
  ];

  return (
    audioTypes.includes(file.type) ||
    /\.(mp3|wav|flac|m4a|ogg|wma|aac)$/i.test(file.name)
  );
};

// Nueva función utilitaria para obtener información de tiempo estimado
export const getModelTimeoutInfo = (
  model: string
): { estimatedTime: number; minutes: number } => {
  const minutes = getEstimatedTimeForModel(model);
  return {
    estimatedTime: minutes * 60000, // Convertir a milisegundos para mantener compatibilidad
    minutes,
  };
};
