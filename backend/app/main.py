from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from .routers import transcription
from .utils.whisper_service import whisper_service

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestión del ciclo de vida de la aplicación"""
    # Startup
    logger.info("Iniciando aplicación Transquitor")
    try:
        # Verificar si estamos en producción (despliegue) o en Electron
        is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"
        is_electron = os.getenv("ENVIRONMENT", "development").lower() == "electron"
        
        if is_production:
            logger.info("Modo producción detectado - Pre-cargando todos los modelos...")
            whisper_service.preload_all_models()
        elif is_electron:
            logger.info("Modo Electron detectado - Pre-cargando modelo base...")
            whisper_service.load_model("base")
        else:
            # En desarrollo, solo pre-cargar modelo base
            whisper_service.load_model("base")
            logger.info("Modelo base pre-cargado (modo desarrollo)")
    except Exception as e:
        logger.warning(f"Error durante la pre-carga de modelos: {e}")
    
    yield
    
    # Shutdown
    logger.info("Cerrando aplicación Transquitor")
    try:
        whisper_service.shutdown()
        logger.info("Servicio Whisper cerrado correctamente")
    except Exception as e:
        logger.error(f"Error al cerrar servicio Whisper: {e}")

# Crear aplicación
app = FastAPI(
    title="Transquitor API",
    description="API para transcripción de audio a texto usando Whisper",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS - Permitir conexiones desde Electron
origins = ["http://localhost:3000", "file://", "http://localhost:*"]

# Si estamos en Electron, permitir cualquier origen local
if os.getenv("ENVIRONMENT", "development").lower() == "electron":
    origins = ["*"]  # Permitir todos los orígenes en Electron
else:
    # En desarrollo web normal, usar los orígenes configurados
    origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(
    transcription.router,
    prefix="/api/v1",
    tags=["transcription"]
)

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "Bienvenido a Transquitor API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint no encontrado"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Error interno: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Error interno del servidor"}
    )

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug
    )
