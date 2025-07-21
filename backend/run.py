#!/usr/bin/env python3
"""
Script para iniciar el servidor Transquitor
"""
import uvicorn
import os
from dotenv import load_dotenv

def main():
    """Función principal para iniciar el servidor"""
    load_dotenv()
    
    host = os.getenv("HOST", "127.0.0.1")
    
    # Manejo seguro de la variable PORT
    port_env = os.getenv("PORT", "")
    port = int(port_env) if port_env.strip() else 8000
    
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print("🎙️  Iniciando Transquitor API...")
    print(f"🌐 Servidor: http://{host}:{port}")
    print(f"📚 Documentación: http://{host}:{port}/docs")
    print(f"🔧 Modo debug: {debug}")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug
    )

if __name__ == "__main__":
    main()
