import os
import aiofiles
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException

ALLOWED_EXTENSIONS = {'.mp3', '.wav', '.flac', '.m4a', '.ogg', '.wma', '.aac'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

async def save_uploaded_file(file: UploadFile, upload_dir: str) -> str:
    """
    Guarda un archivo subido y retorna la ruta
    
    Args:
        file: Archivo subido
        upload_dir: Directorio donde guardar el archivo
        
    Returns:
        Ruta del archivo guardado
    """
    # Verificar extensión
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Formato de archivo no soportado. Formatos permitidos: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Crear directorio si no existe
    upload_path = Path(upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)
    
    # Generar nombre único
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = upload_path / unique_filename
    
    # Guardar archivo
    try:
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            
            # Verificar tamaño
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"Archivo demasiado grande. Tamaño máximo: {MAX_FILE_SIZE // 1024 // 1024} MB"
                )
            
            await f.write(content)
            
        return str(file_path)
        
    except Exception as e:
        # Limpiar archivo si hubo error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error guardando archivo: {str(e)}")

def cleanup_file(file_path: str) -> None:
    """Elimina un archivo de forma segura"""
    try:
        path = Path(file_path)
        if path.exists():
            path.unlink()
    except Exception:
        pass  # Ignorar errores de limpieza

def format_file_size(size_bytes: int) -> str:
    """Formatea el tamaño del archivo de forma legible"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
