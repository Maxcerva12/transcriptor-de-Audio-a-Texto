"use client";

import { useState } from "react";
import { Mic, Volume2, AlertCircle, CheckCircle } from "lucide-react";
import {
  FileDropzone,
  ProgressBar,
  TranscriptionOptions,
  TranscriptionResult,
} from "@/components";
import { TranscriptionService } from "@/services/transcription";
import { TranscriptionState, TranscriptionRequest } from "@/types";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcriptionState, setTranscriptionState] =
    useState<TranscriptionState>({
      isTranscribing: false,
      progress: null,
      result: null,
      error: null,
    });

  const [options, setOptions] = useState<TranscriptionRequest>({
    model: "base",
    language: "",
    task: "transcribe",
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Reset previous results
    setTranscriptionState((prev) => ({
      ...prev,
      result: null,
      error: null,
    }));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTranscriptionState({
      isTranscribing: false,
      progress: null,
      result: null,
      error: null,
    });
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    setTranscriptionState((prev) => ({
      ...prev,
      isTranscribing: true,
      progress: { loaded: 0, total: 0, percentage: 0 },
      result: null,
      error: null,
    }));

    try {
      const result = await TranscriptionService.transcribeAudio(
        selectedFile,
        options,
        (progress) => {
          setTranscriptionState((prev) => ({
            ...prev,
            progress,
          }));
        }
      );

      setTranscriptionState((prev) => ({
        ...prev,
        isTranscribing: false,
        result,
        progress: null,
      }));
    } catch (error) {
      setTranscriptionState((prev) => ({
        ...prev,
        isTranscribing: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        progress: null,
      }));
    }
  };

  const handleNewTranscription = () => {
    setSelectedFile(null);
    setTranscriptionState({
      isTranscribing: false,
      progress: null,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Transquitor
                </h1>
                <p className="text-sm text-gray-500">
                  Transcripción de audio a texto
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Volume2 className="w-4 h-4" />
              <span>Powered by OpenAI Whisper</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* File Upload */}
          {!transcriptionState.result && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Subir Archivo de Audio
              </h2>

              <FileDropzone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onRemoveFile={handleRemoveFile}
                disabled={transcriptionState.isTranscribing}
              />
            </div>
          )}

          {/* Options */}
          {selectedFile && !transcriptionState.result && (
            <TranscriptionOptions
              options={options}
              onOptionsChange={setOptions}
              disabled={transcriptionState.isTranscribing}
            />
          )}

          {/* Progress */}
          {transcriptionState.isTranscribing && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Transcribiendo Audio...
              </h3>

              {transcriptionState.progress && (
                <div className="space-y-4">
                  <ProgressBar
                    progress={transcriptionState.progress.percentage}
                    label="Subiendo archivo..."
                    showPercentage={true}
                  />

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span>
                      {transcriptionState.progress.percentage < 100
                        ? "Subiendo archivo..."
                        : "Procesando audio con Whisper..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {transcriptionState.error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    Error en la transcripción
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    {transcriptionState.error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {transcriptionState.result && (
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      ¡Transcripción completada exitosamente!
                    </p>
                  </div>
                </div>
              </div>

              <TranscriptionResult
                result={transcriptionState.result}
                fileName={selectedFile?.name}
              />

              <div className="flex justify-center">
                <button
                  onClick={handleNewTranscription}
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Nueva Transcripción
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          {selectedFile &&
            !transcriptionState.result &&
            !transcriptionState.isTranscribing && (
              <div className="flex justify-center">
                <button
                  onClick={handleTranscribe}
                  className="px-8 py-4 bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-colors"
                >
                  Transcribir Audio
                </button>
              </div>
            )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              Creado con ❤️ para transcribir audio a texto de forma gratuita
            </p>
            <p className="mt-2">
              Tecnologías: Next.js + React + TypeScript + FastAPI + OpenAI
              Whisper
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
