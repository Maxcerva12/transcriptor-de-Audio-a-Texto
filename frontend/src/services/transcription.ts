import axios from "axios";
import {
  TranscriptionRequest,
  TranscriptionResponse,
  ModelInfo,
  UploadProgress,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 300000, // 5 minutos para archivos grandes
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

    try {
      const response = await api.post("/transcribe", formData, {
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

  static async checkHealth(): Promise<{ status: string; [key: string]: any }> {
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
