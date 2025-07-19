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
  onOptionsChange: (options: any) => void;
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
      tiny: "Más rápido, menos preciso",
      base: "Equilibrado (recomendado)",
      small: "Buena calidad",
      medium: "Alta calidad",
      large: "Máxima calidad",
      turbo: "Rápido con buena calidad",
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
            {options.model === "tiny" && "⚡ Más rápido pero menos preciso"}
            {options.model === "base" &&
              "⚖️ Equilibrado entre velocidad y calidad"}
            {options.model === "small" && "🎯 Buena calidad de transcripción"}
            {options.model === "medium" && "🔥 Alta calidad, más lento"}
            {options.model === "large" && "⭐ Máxima calidad, muy lento"}
            {options.model === "turbo" && "🚀 Rápido con buena calidad"}
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

      {/* Advertencia para turbo con traducción */}
      {options.model === "turbo" && options.task === "translate" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Nota:</strong> El modelo turbo no está optimizado para
                traducción. Para mejores resultados de traducción, usa los
                modelos medium o large.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
