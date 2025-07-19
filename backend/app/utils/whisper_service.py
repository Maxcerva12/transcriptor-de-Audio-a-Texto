import whisper
import torch
import os
import logging
from typing import Optional, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

class WhisperService:
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Usando dispositivo: {self.device}")

    def load_model(self, model_name: str = "base"):
        """Carga un modelo de Whisper si no está ya cargado"""
        if model_name not in self.models:
            logger.info(f"Cargando modelo Whisper: {model_name}")
            try:
                self.models[model_name] = whisper.load_model(model_name, device=self.device)
                logger.info(f"Modelo {model_name} cargado exitosamente")
            except Exception as e:
                logger.error(f"Error cargando modelo {model_name}: {str(e)}")
                raise
        return self.models[model_name]

    def transcribe_audio(
        self, 
        audio_path: str, 
        model_name: str = "base",
        language: Optional[str] = None,
        task: str = "transcribe"
    ) -> Dict[str, Any]:
        """
        Transcribe un archivo de audio usando Whisper
        
        Args:
            audio_path: Ruta al archivo de audio
            model_name: Modelo de Whisper a usar
            language: Idioma del audio (opcional, se detecta automáticamente)
            task: 'transcribe' o 'translate'
        
        Returns:
            Diccionario con el resultado de la transcripción
        """
        try:
            model = self.load_model(model_name)
            
            # Opciones para la transcripción
            options = {
                "task": task,
                "fp16": torch.cuda.is_available(),  # Usar fp16 solo si hay GPU
            }
            
            if language:
                options["language"] = language
            
            logger.info(f"Transcribiendo archivo: {audio_path}")
            logger.info(f"Opciones: {options}")
            
            result = model.transcribe(audio_path, **options)
            
            return {
                "text": result["text"].strip(),
                "language": result.get("language", "unknown"),
                "segments": result.get("segments", []),
                "duration": self._get_audio_duration(result)
            }
            
        except Exception as e:
            logger.error(f"Error en transcripción: {str(e)}")
            raise

    def _get_audio_duration(self, result: Dict[str, Any]) -> float:
        """Extrae la duración del audio del resultado"""
        segments = result.get("segments", [])
        if segments:
            return segments[-1].get("end", 0.0)
        return 0.0

    def get_available_models(self) -> list:
        """Retorna la lista de modelos disponibles"""
        return ["tiny", "base", "small", "medium", "large", "turbo"]

    def cleanup_old_files(self, upload_dir: str, max_age_hours: int = 24):
        """Limpia archivos antiguos del directorio de uploads"""
        try:
            upload_path = Path(upload_dir)
            if not upload_path.exists():
                return
                
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            for file_path in upload_path.iterdir():
                if file_path.is_file():
                    file_age = current_time - file_path.stat().st_mtime
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        logger.info(f"Archivo eliminado: {file_path}")
                        
        except Exception as e:
            logger.error(f"Error limpiando archivos: {str(e)}")

# Instancia global del servicio
whisper_service = WhisperService()
