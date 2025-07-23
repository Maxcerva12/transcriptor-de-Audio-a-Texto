#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para iniciar el servidor Transquitor
Optimizado para ejecutables con Electron
"""
import uvicorn
import os
import sys
from dotenv import load_dotenv

# Configurar codificación UTF-8 para Windows
if sys.platform.startswith('win'):
    import locale
    # Intentar establecer codificación UTF-8
    try:
        locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    except:
        try:
            locale.setlocale(locale.LC_ALL, 'C.UTF-8')
        except:
            pass

def main():
    """Función principal para iniciar el servidor"""
    load_dotenv()
    
    # Configuración específica para Electron
    environment = os.getenv("ENVIRONMENT", "development")
    is_electron = environment == "electron"
    
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    
    # En Electron, siempre usar modo producción
    debug = False if is_electron else os.getenv("DEBUG", "True").lower() == "true"
    
    print("Iniciando Transcriptor API...")
    print(f"Servidor: http://{host}:{port}")
    if not is_electron:
        print(f"Documentacion: http://{host}:{port}/docs")
    print(f"Entorno: {environment}")
    print(f"Modo debug: {debug}")
    
    # Configuración específica para Electron
    if is_electron:
        print("Modo Electron detectado - Configuracion optimizada")
        # Redirigir stdout para que Electron pueda detectar el inicio
        sys.stdout.flush()
    
    try:
        uvicorn.run(
            "app.main:app",
            host=host,
            port=port,
            reload=debug,
            log_level="info" if is_electron else "debug",
            access_log=not is_electron  # Reducir logs en Electron
        )
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")
        if is_electron:
            # En Electron, esperar un poco antes de salir para que se vea el error
            import time
            time.sleep(2)
        sys.exit(1)

if __name__ == "__main__":
    main()
