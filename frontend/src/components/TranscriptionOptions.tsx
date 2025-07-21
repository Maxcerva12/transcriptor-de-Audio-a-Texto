"use client";

import { useState, useEffect } from "react";
import { ModelInfo } from "@/types";
import { TranscriptionService } from "@/services/transcription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
// Eliminamos la importación de los componentes Form ya que los estamos reemplazando por HTML nativo
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

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
  { code: "auto", name: "Detectar automáticamente" },
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

  // Función eliminada ya que no se utiliza

  if (loading) {
    return (
      <Card className="p-4">
        <CardContent className="pt-4">
          <p className="text-muted-foreground">Cargando opciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opciones de Transcripción</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Modelo */}
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium leading-none mb-2 block">
                Modelo Whisper
              </label>
              <Select
                value={options.model}
                onValueChange={(value) => handleChange("model", value)}
                disabled={disabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {modelInfo?.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {options.model === "tiny" &&
                  "⚡ Nivel 1 - Más rápido pero menos preciso (⏱️ ~3 minutos)"}
                {options.model === "base" &&
                  "⚖️ Nivel 2 - Equilibrado entre velocidad y calidad (⏱️ ~5 minutos)"}
                {options.model === "small" &&
                  "🎯 Nivel 3 - Buena calidad (⏱️ ~8 minutos)"}
                {options.model === "medium" &&
                  "🔥 Nivel 4 - Alta calidad (⏱️ ~12 minutos)"}
                {options.model === "large-v1" &&
                  "⭐ Nivel 5 - Máxima calidad v1 (⏱️ ~16 minutos)"}
                {options.model === "large-v2" &&
                  "⭐ Nivel 6 - Máxima calidad v2 (⏱️ ~18 minutos)"}
                {options.model === "large-v3" &&
                  "⭐ Nivel 7 - Máxima calidad v3 (⏱️ ~20 minutos)"}
                {options.model === "large" &&
                  "⭐ Nivel 8 - Máxima calidad (última versión) (⏱️ ~22 minutos)"}
                {options.model === "turbo" &&
                  "🚀 Nivel 9 - Optimizado de large-v3, rápido con excelente calidad (⏱️ ~10 minutos)"}
              </p>
            </div>
          </div>

          {/* Idioma */}
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium leading-none mb-2 block">
                Idioma del Audio
              </label>
              <Select
                value={options.language}
                onValueChange={(value) => handleChange("language", value)}
                disabled={disabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {COMMON_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                La detección automática funciona bien en la mayoría de casos
              </p>
            </div>
          </div>

          {/* Tarea */}
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium leading-none mb-2 block">
                Tarea
              </label>
              <Select
                value={options.task}
                onValueChange={(value) => handleChange("task", value as "transcribe" | "translate")}
                disabled={disabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tarea" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="transcribe">Transcribir</SelectItem>
                    <SelectItem value="translate">Traducir al Inglés</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {options.task === "transcribe"
                  ? "Convierte audio a texto en el mismo idioma"
                  : "Convierte audio a texto en inglés"}
              </p>
            </div>
          </div>
        </div>

      {/* Advertencia importante para turbo con traducción */}
      {options.model === "turbo" && options.task === "translate" && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>⚠️ Importante:</strong> El modelo turbo{" "}
            <strong>NO está entrenado para traducción</strong>. Para
            traducir a inglés, usa los modelos <strong>medium</strong> o{" "}
            <strong>large</strong>{" "}
            que sí soportan la tarea de traducción.
          </AlertDescription>
        </Alert>
      )}

      {/* Información sobre tiempos estimados para modelos avanzados */}
      {(options.model === "medium" ||
        options.model === "large-v1" ||
        options.model === "large-v2" ||
        options.model === "large-v3" ||
        options.model === "large") && (
        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
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
          </AlertDescription>
        </Alert>
      )}
      </CardContent>
    </Card>
  );
};
