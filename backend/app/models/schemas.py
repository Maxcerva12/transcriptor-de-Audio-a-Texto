from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class WhisperModel(str, Enum):
    TINY = "tiny"
    BASE = "base" 
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    TURBO = "turbo"

class TranscriptionRequest(BaseModel):
    model: Optional[WhisperModel] = WhisperModel.BASE
    language: Optional[str] = None
    task: Optional[str] = "transcribe"  # transcribe or translate

class TranscriptionResponse(BaseModel):
    text: str
    language: str
    duration: float
    segments: Optional[List[dict]] = None
    task_id: Optional[str] = None  # ID de la tarea para cancelación

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
