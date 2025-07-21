from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import Optional
import logging
import os
import uuid
import asyncio

from ..models.schemas import TranscriptionResponse, ErrorResponse, WhisperModel
from ..utils.whisper_service import whisper_service
from ..utils.file_handler import save_uploaded_file, cleanup_file

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Archivo de audio a transcribir"),
    model: Optional[str] = Form("base", description="Modelo de Whisper a usar"),
    language: Optional[str] = Form(None, description="Idioma del audio (opcional)"),
    task: Optional[str] = Form("transcribe", description="Tarea: transcribe o translate"),
    task_id: Optional[str] = Form(None, description="ID único para la tarea (opcional)")
):
    """
    Transcribe un archivo de audio a texto usando Whisper
    """
    file_path = None
    # Usar el task_id proporcionado o generar uno nuevo
    if not task_id:
        task_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Iniciando transcripción - Archivo: {file.filename}, Modelo: {model}, Task ID: {task_id}")
        
        # Validar modelo
        available_models = whisper_service.get_available_models()
        if model not in available_models:
            raise HTTPException(
                status_code=400,
                detail=f"Modelo no válido. Modelos disponibles: {', '.join(available_models)}"
            )
        
        # Validar tarea
        if task not in ["transcribe", "translate"]:
            raise HTTPException(
                status_code=400,
                detail="La tarea debe ser 'transcribe' o 'translate'"
            )
        
        # Guardar archivo
        upload_dir = os.getenv("UPLOAD_DIR", "uploads")
        file_path = await save_uploaded_file(file, upload_dir)
        
        # Transcribir de forma asíncrona con ID de tarea
        result = await whisper_service.transcribe_audio_async(
            audio_path=file_path,
            model_name=model,
            language=language,
            task=task,
            task_id=task_id
        )
        
        # Programar limpieza del archivo
        background_tasks.add_task(cleanup_file, file_path)
        
        return TranscriptionResponse(
            text=result["text"],
            language=result["language"],
            duration=result["duration"],
            segments=result.get("segments"),
            task_id=task_id  # Incluir el task_id en la respuesta
        )
        
    except HTTPException:
        # Re-lanzar errores HTTP
        if file_path:
            cleanup_file(file_path)
        raise
    except asyncio.CancelledError:
        # Manejar cancelación específicamente
        logger.info(f"Transcripción {task_id} fue cancelada por el usuario")
        if file_path:
            cleanup_file(file_path)
        raise HTTPException(status_code=499, detail="Transcripción cancelada por el usuario")
    except Exception as e:
        logger.error(f"Error en transcripción: {str(e)}")
        if file_path:
            cleanup_file(file_path)
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.delete("/transcribe/{task_id}")
async def cancel_transcription(task_id: str):
    """
    Cancela una transcripción en progreso
    """
    try:
        success = whisper_service.cancel_transcription(task_id)
        if success:
            return {"message": f"Transcripción {task_id} cancelada exitosamente"}
        else:
            raise HTTPException(
                status_code=404, 
                detail=f"Tarea {task_id} no encontrada o ya completada"
            )
    except Exception as e:
        logger.error(f"Error cancelando transcripción {task_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error cancelando transcripción: {str(e)}")

@router.get("/models")
async def get_available_models():
    """
    Obtiene la lista de modelos disponibles ordenados por eficiencia
    """
    try:
        models = whisper_service.get_available_models()
        return {
            "models": models,
            "default": "base",
            "recommended": {
                "fastest": "tiny",
                "balanced": "base", 
                "quality": "small",
                "high_quality": "medium",
                "best": "large"
            },
            "order_info": "Modelos ordenados de menor a mayor eficiencia (tiny → large/turbo)"
        }
    except Exception as e:
        logger.error(f"Error obteniendo modelos: {str(e)}")
        raise HTTPException(status_code=500, detail="Error obteniendo modelos disponibles")

@router.get("/health")
async def health_check():
    """
    Verificación de salud del servicio
    """
    try:
        # Verificar que Whisper funcione
        models = whisper_service.get_available_models()
        return {
            "status": "healthy",
            "whisper_available": True,
            "models_count": len(models),
            "device": whisper_service.device
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
