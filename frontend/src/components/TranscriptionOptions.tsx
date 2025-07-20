"use client";

import { useState, useEffect } from "react";
import { ModelInfo } from "@/types";
import { TranscriptionService } from "@/services/transcription";

interface TranscriptionOptionsProps {
  options: {
    model: string;
    language: string;
    task: "transcribe" | "translate";
  };
  onOptionsChange: (options: {
    model: string;
    language: string;
    task: "transcribe" | "translate";
  }) => void;
  disabled?: boolean;
}

const COMMON_LANGUAGES = [
  { code: "", name: "Detectar automáticamente" },
  { code: "es", name: "Español" },
  { code: "en", name: "Inglés" },
  { code: "fr", name: "Francés" },
  { code: "de", name: "Alemán" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Portugués" },
  { code: "ru", name: "Ruso" },
  { code: "ja", name: "Japonés" },
  { code: "ko", name: "Coreano" },
  { code: "zh", name: "Chino" },
];

export const TranscriptionOptions: React.FC<TranscriptionOptionsProps> = ({
  options,
  onOptionsChange,
  disabled = false,
}) => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const info = await TranscriptionService.getAvailableModels();
        setModelInfo(info);
      } catch (error) {
        console.error("Error loading models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleChange = (field: string, value: string) => {
    onOptionsChange({
      ...options,
      [field]: value,
    });
  };

  const getModelDescription = (model: string) => {
    if (!modelInfo) return "";

    const descriptions: Record<string, string> = {
      tiny: "Nivel 1: Más rápido, menos preciso (⏱️ Listo en ~3 min)",
      base: "Nivel 2: Equilibrado (recomendado) (⏱️ Listo en ~5 min)",
      small: "Nivel 3: Buena calidad (⏱️ Listo en ~8 min)",
      medium: "Nivel 4: Alta calidad (⏱️ Listo en ~12 min)",
      "large-v1": "Nivel 5: Máxima calidad (v1) (⏱️ Listo en ~16 min)",
      "large-v2": "Nivel 6: Máxima calidad (v2) (⏱️ Listo en ~18 min)",
      "large-v3": "Nivel 7: Máxima calidad (v3) (⏱️ Listo en ~20 min)",
      large: "Nivel 8: Máxima calidad (última versión) (⏱️ Listo en ~22 min)",
      turbo:
        "Nivel 9: Optimizado de large-v3 (más rápido) (⏱️ Listo en ~10 min)",
    };

    return descriptions[model] || "";
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">Cargando opciones...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Opciones de Transcripción
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modelo */}
        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Modelo Whisper
          </label>
          <select
            id="model"
            value={options.model}
            onChange={(e) => handleChange("model", e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {modelInfo?.models.map((model) => (
              <option key={model} value={model}>
                {model} - {getModelDescription(model)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {options.model === "tiny" &&
              "⚡ Nivel 1 - Más rápido pero menos preciso (⏱️ Su transcripción estará lista en ~3 minutos)"}
            {options.model === "base" &&
              "⚖️ Nivel 2 - Equilibrado entre velocidad y calidad (⏱️ Su transcripción estará lista en ~5 minutos)"}
            {options.model === "small" &&
              "🎯 Nivel 3 - Buena calidad de transcripción (⏱️ Su transcripción estará lista en ~8 minutos)"}
            {options.model === "medium" &&
              "🔥 Nivel 4 - Alta calidad, más lento (⏱️ Su transcripción estará lista en ~12 minutos)"}
            {options.model === "large-v1" &&
              "⭐ Nivel 5 - Máxima calidad v1, muy lento (⏱️ Su transcripción estará lista en ~16 minutos)"}
            {options.model === "large-v2" &&
              "⭐ Nivel 6 - Máxima calidad v2, muy lento (⏱️ Su transcripción estará lista en ~18 minutos)"}
            {options.model === "large-v3" &&
              "⭐ Nivel 7 - Máxima calidad v3, muy lento (⏱️ Su transcripción estará lista en ~20 minutos)"}
            {options.model === "large" &&
              "⭐ Nivel 8 - Máxima calidad (última versión), muy lento (⏱️ Su transcripción estará lista en ~22 minutos)"}
            {options.model === "turbo" &&
              "🚀 Nivel 9 - Optimizado de large-v3, rápido con excelente calidad (⏱️ Su transcripción estará lista en ~10 minutos)"}
          </p>
        </div>

        {/* Idioma */}
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Idioma del Audio
          </label>
          <select
            id="language"
            value={options.language}
            onChange={(e) => handleChange("language", e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {COMMON_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            La detección automática funciona bien en la mayoría de casos
          </p>
        </div>

        {/* Tarea */}
        <div>
          <label
            htmlFor="task"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tarea
          </label>
          <select
            id="task"
            value={options.task}
            onChange={(e) =>
              handleChange("task", e.target.value as "transcribe" | "translate")
            }
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="transcribe">Transcribir</option>
            <option value="translate">Traducir al Inglés</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {options.task === "transcribe"
              ? "Convierte audio a texto en el mismo idioma"
              : "Convierte audio a texto en inglés"}
          </p>
        </div>
      </div>

      {/* Advertencia importante para turbo con traducción */}
      {options.model === "turbo" && options.task === "translate" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>⚠️ Importante:</strong> El modelo turbo{" "}
                <strong>NO está entrenado para traducción</strong>. Para
                traducir a inglés, usa los modelos <strong>medium</strong> o{" "}
                <strong>large</strong>
                que sí soportan la tarea de traducción.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información sobre tiempos estimados para modelos avanzados */}
      {(options.model === "medium" ||
        options.model === "large-v1" ||
        options.model === "large-v2" ||
        options.model === "large-v3" ||
        options.model === "large") && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>🕒 Tiempo de procesamiento estimado:</strong> Has
                seleccionado un modelo de alta calidad. La transcripción se
                completará en aproximadamente{" "}
                <strong>
                  {options.model === "medium" && "12 minutos"}
                  {options.model === "large-v1" && "16 minutos"}
                  {options.model === "large-v2" && "18 minutos"}
                  {options.model === "large-v3" && "20 minutos"}
                  {options.model === "large" && "22 minutos"}
                </strong>{" "}
                dependiendo del tamaño y la complejidad del archivo de audio. No
                hay tiempo límite, el proceso continuará hasta completarse.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
