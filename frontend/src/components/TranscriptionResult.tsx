"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { TranscriptionResponse } from "@/types";
import { formatDuration } from "@/services/transcription";

interface TranscriptionResultProps {
  result: TranscriptionResponse;
  fileName?: string;
}

export const TranscriptionResult: React.FC<TranscriptionResultProps> = ({
  result,
  fileName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription_${fileName || "audio"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Transcripción Completada
            </h3>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <span>Idioma: {result.language}</span>
              <span>Duración: {formatDuration(result.duration)}</span>
              {fileName && <span>Archivo: {fileName}</span>}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono leading-relaxed">
            {result.text}
          </pre>
        </div>
      </div>

      {/* Segments (if available) */}
      {result.segments && result.segments.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
              Ver segmentos detallados
              <span className="ml-2 transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>

            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {result.segments.map((segment, index) => (
                <div
                  key={segment.id || index}
                  className="flex items-start space-x-3 text-xs"
                >
                  <div className="flex-shrink-0 text-gray-500 font-mono">
                    {formatDuration(segment.start)} -{" "}
                    {formatDuration(segment.end)}
                  </div>
                  <div className="flex-1 text-gray-700">
                    {segment.text.trim()}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
