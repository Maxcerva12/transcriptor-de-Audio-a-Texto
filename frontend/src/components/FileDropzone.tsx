"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X, AlertCircle } from "lucide-react";
import { isAudioFile, formatFileSize } from "@/services/transcription";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  disabled = false,
  selectedFile,
  onRemoveFile,
}) => {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError("");

      if (rejectedFiles.length > 0) {
        setError("Solo se permiten archivos de audio");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      // Validar que sea un archivo de audio
      if (!isAudioFile(file)) {
        setError(
          "Formato de archivo no soportado. Use: MP3, WAV, FLAC, M4A, OGG, WMA, AAC"
        );
        return;
      }

      // Validar tamaño (100MB max)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("El archivo es demasiado grande. Tamaño máximo: 100MB");
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".flac", ".m4a", ".ogg", ".wma", ".aac"],
    },
    multiple: false,
    disabled,
  });

  if (selectedFile) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileAudio className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          {onRemoveFile && (
            <button
              onClick={onRemoveFile}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              disabled={disabled}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />

      <Upload
        className={`w-12 h-12 mx-auto mb-4 ${
          isDragActive ? "text-blue-500" : "text-gray-400"
        }`}
      />

      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900">
          {isDragActive
            ? "Suelta el archivo aquí"
            : "Arrastra un archivo de audio"}
        </p>
        <p className="text-sm text-gray-500">
          o{" "}
          <span className="text-blue-500 font-medium">
            haz clic para seleccionar
          </span>
        </p>
        <p className="text-xs text-gray-400">
          Formatos soportados: MP3, WAV, FLAC, M4A, OGG, WMA, AAC (máx. 100MB)
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};
