#!/usr/bin/env python3
"""
Script para pre-instalar todos los modelos Whisper
Útil para preparar el contenedor Docker o el entorno de producción
"""

import whisper
import logging
import sys

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lista de todos los modelos a pre-instalar
MODELS_TO_PREINSTALL = [
    "tiny",
    "base", 
    "small",
    "medium",
    "large-v1",
    "large-v2", 
    "large-v3",
    "large"
]

def preinstall_models():
    """Pre-instala todos los modelos Whisper"""
    logger.info("🚀 Iniciando pre-instalación de modelos Whisper...")
    
    # Verificar si turbo está disponible
    try:
        available = whisper.available_models()
        if "turbo" in available:
            MODELS_TO_PREINSTALL.append("turbo")
            logger.info("✅ Modelo 'turbo' detectado y agregado a la lista")
    except Exception as e:
        logger.warning(f"⚠️  Error verificando disponibilidad de modelos: {e}")
    
    success_count = 0
    total_count = len(MODELS_TO_PREINSTALL)
    
    for model_name in MODELS_TO_PREINSTALL:
        try:
            logger.info(f"📥 Descargando modelo: {model_name}")
            whisper.load_model(model_name)
            logger.info(f"✅ {model_name} descargado exitosamente")
            success_count += 1
        except Exception as e:
            logger.error(f"❌ Error descargando {model_name}: {e}")
    
    logger.info(f"🎉 Pre-instalación completada: {success_count}/{total_count} modelos descargados")
    
    if success_count == total_count:
        logger.info("🚀 ¡Todos los modelos están listos para producción!")
        return True
    else:
        logger.warning(f"⚠️  Solo {success_count} de {total_count} modelos se descargaron correctamente")
        return False

if __name__ == "__main__":
    try:
        success = preinstall_models()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("⏹️  Pre-instalación cancelada por el usuario")
        sys.exit(1)
    except Exception as e:
        logger.error(f"💥 Error fatal durante pre-instalación: {e}")
        sys.exit(1)
