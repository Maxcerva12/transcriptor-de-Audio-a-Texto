# 🎵 Transcriptor Audio a Texto - Versión Ejecutable

## Descripción

Esta es la versión ejecutable de la aplicación Transcriptor Audio a Texto, empaquetada con Electron para que los usuarios finales puedan instalarla y usarla localmente sin necesidad de configurar Python o dependencias.

## Características

- ✅ **Aplicación completa independiente** - No requiere instalación de Python ni dependencias
- ✅ **Procesamiento local** - Utiliza los recursos del dispositivo del usuario
- ✅ **Interfaz nativa** - Se ejecuta como una aplicación de escritorio
- ✅ **Multiplataforma** - Funciona en Windows, macOS y Linux
- ✅ **Motor Whisper incluido** - Transcripción de alta calidad powered by OpenAI

## Requisitos del Sistema

### Para los usuarios finales:
- **Windows**: Windows 10 o superior
- **macOS**: macOS 10.14 o superior  
- **Linux**: Distribuciones modernas de 64 bits
- **RAM**: Mínimo 4GB, recomendado 8GB o más
- **Espacio en disco**: Al menos 2GB libres

### Para desarrolladores (construcción):
- Node.js 18+ 
- Python 3.8+
- Git

## 🚀 Construcción del Ejecutable

### Opción 1: Script Automatizado (Recomendado)

```bash
# Instalar dependencias principales
npm install

# Ejecutar script de construcción automatizada
node scripts/build-executable.js
```

### Opción 2: Construcción Manual

1. **Instalar dependencias de Electron:**
```bash
npm install
```

2. **Construir el frontend:**
```bash
cd frontend
npm install
npm run build
cd ..
```

3. **Preparar entorno Python:**
```bash
node scripts/prepare-python.js
```

4. **Empaquetar aplicación:**
```bash
# Para Windows
npm run dist-win

# Para macOS
npm run dist-mac

# Para Linux
npm run dist-linux

# Para todas las plataformas
npm run dist
```

## 📁 Estructura del Proyecto

```
transcriptor-app/
├── package.json          # Configuración de Electron
├── main.js              # Proceso principal de Electron
├── preload.js           # Script de precarga
├── loading.html         # Pantalla de carga
├── frontend/           # Código Next.js/React
├── backend/            # Código FastAPI/Python
├── python-env/         # Entorno Python portable (generado)
├── resources/          # Iconos y recursos
├── scripts/            # Scripts de construcción
└── build/              # Ejecutables generados
```

## 🎨 Personalización

### Iconos de la Aplicación

Crea los siguientes iconos en la carpeta `resources/`:

- **Windows**: `icon.ico` (256x256 px)
- **macOS**: `icon.icns` 
- **Linux**: `icon.png` (512x512 px)

Puedes usar herramientas en línea para convertir una imagen PNG a estos formatos.

### Información de la Aplicación

Modifica los siguientes campos en `package.json`:

```json
{
  "name": "tu-app-nombre",
  "productName": "Tu App Nombre",
  "description": "Descripción de tu aplicación",
  "author": "Tu Nombre",
  "version": "1.0.0"
}
```

## 🔧 Configuración Avanzada

### Configuración de Electron Builder

El archivo `package.json` contiene la configuración de `electron-builder`. Puedes personalizar:

- Formatos de instalador
- Firmas de código
- Configuraciones específicas por plataforma
- Assets adicionales

### Variables de Entorno

La aplicación detecta automáticamente si está ejecutándose en Electron y ajusta su configuración:

- `ENVIRONMENT=electron` - Configuración automática para Electron
- `PORT=8000` - Puerto del servidor FastAPI interno

## 📦 Distribución

### Archivos Generados

Después de la construcción, encontrarás en la carpeta `build/`:

- **Windows**: `Transcriptor Audio a Texto Setup 1.0.0.exe`
- **macOS**: `Transcriptor Audio a Texto-1.0.0.dmg`
- **Linux**: `Transcriptor Audio a Texto-1.0.0.AppImage`

### Tamaño de los Instaladores

Los instaladores serán grandes (~200-500MB) porque incluyen:
- Runtime de Electron
- Entorno Python completo
- Modelos de Whisper
- Todas las dependencias

## 🎯 Experiencia del Usuario Final

1. **Descarga**: El usuario descarga el instalador apropiado
2. **Instalación**: Ejecuta el instalador y sigue las instrucciones estándar
3. **Uso**: Abre la aplicación desde el menú de inicio/aplicaciones
4. **Transcripción**: Arrastra archivos de audio y obtiene transcripciones localmente

## 🛠️ Solución de Problemas

### Error: "Python no encontrado"
- Asegúrate de que el script `prepare-python.js` se ejecutó correctamente
- Verifica que Python esté instalado en tu sistema de desarrollo

### Error de construcción del frontend
- Ejecuta `npm run build` manualmente en la carpeta `frontend/`
- Verifica que se genere la carpeta `frontend/out/`

### Ejecutable muy grande
- Esto es normal debido a que incluye Python y todas las dependencias
- Considera usar modelos Whisper más pequeños por defecto

### Problemas de CORS
- La configuración de CORS se ajusta automáticamente para Electron
- El backend detecta cuando se ejecuta en Electron

## 📚 Recursos Adicionales

- [Documentación de Electron](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [OpenAI Whisper](https://github.com/openai/whisper)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado por Maxcerva12** 🚀
