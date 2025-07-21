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
        logger.info("🚀 Optimización aplicada: Los modelos se cargarán bajo demanda")
        # No precargamos ningún modelo para ahorrar memoria
    except Exception as e:
        logger.warning(f"Error durante la inicialización: {e}")
    
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

# Configurar CORS - Con corrección para permitir todos los orígenes en desarrollo
is_production = os.getenv("ENVIRONMENT", "development").lower() == "production"

if is_production:
    # En producción, usar los orígenes específicos de la variable de entorno
    allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "https://transcriptor-de-audio-a-texto.vercel.app,http://localhost:3000")
    origins = [origin.strip() for origin in allowed_origins_str.split(",")]
else:
    # En desarrollo, permitir todos los orígenes para facilitar las pruebas
    origins = ["*"]

print(f"Orígenes CORS permitidos: {origins}")  # Para depuración

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

@app.get("/healthz")
async def health_check():
    """Endpoint para health checks de Render"""
    return {"status": "ok"}

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
