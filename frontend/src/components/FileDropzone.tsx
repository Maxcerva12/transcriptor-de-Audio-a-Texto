"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, FileAudio, X, AlertCircle } from "lucide-react";
import { isAudioFile, formatFileSize } from "@/services/transcription";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
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
      <Card className="border-2 border-dashed p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileAudio className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          {onRemoveFile && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onRemoveFile}
              disabled={disabled}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Eliminar archivo</span>
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
        isDragActive 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50",
        disabled ? "cursor-not-allowed opacity-50" : ""
      )}
    >
      <input {...getInputProps()} />

      <Upload
        className={cn(
          "w-12 h-12 mx-auto mb-4",
          isDragActive ? "text-primary" : "text-muted-foreground"
        )}
      />

      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground">
          {isDragActive
            ? "Suelta el archivo aquí"
            : "Arrastra un archivo de audio"}
        </p>
        <p className="text-sm text-muted-foreground">
          o{" "}
          <span className="text-primary font-medium">
            haz clic para seleccionar
          </span>
        </p>
        <p className="text-xs text-muted-foreground/70">
          Formatos soportados: MP3, WAV, FLAC, M4A, OGG, WMA, AAC (máx. 100MB)
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};
