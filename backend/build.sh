#!/bin/bash

# Script de build para producción
# Este script prepara el backend para despliegue con modelos pre-instalados

echo "🚀 Iniciando build para producción..."

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
pip install -r requirements.txt

# Pre-instalar modelos
echo "📥 Pre-instalando modelos Whisper..."
python preinstall_models.py

if [ $? -eq 0 ]; then
    echo "✅ Build completado exitosamente"
    echo "🚀 Listo para despliegue en producción"
    echo ""
    echo "Para iniciar en producción:"
    echo "export ENVIRONMENT=production"
    echo "python run.py"
else
    echo "❌ Error durante el build"
    exit 1
fi
