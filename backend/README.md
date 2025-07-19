# transcriptor Backend

API backend para transcripción de audio a texto usando OpenAI Whisper.

## 🚀 Instalación

### Prerrequisitos

1. **Python 3.8 o superior**
2. **FFmpeg** - Requerido para procesamiento de audio

#### Instalar FFmpeg en Windows:

```powershell
# Con Chocolatey
choco install ffmpeg

# Con Scoop
scoop install ffmpeg
```

### Instalación del proyecto

1. **Crear entorno virtual:**

```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. **Instalar dependencias:**

```bash
pip install -r requirements.txt
```

## 🏃‍♂️ Ejecutar el servidor

```bash
python run.py
```

O directamente con uvicorn:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## 📚 Documentación

Una vez iniciado el servidor:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Configuración

Edita el archivo `.env` para cambiar la configuración:

```env
HOST=127.0.0.1
PORT=8000
DEBUG=True
UPLOAD_DIR=uploads
MAX_FILE_SIZE=100
DEFAULT_MODEL=base
```

## 🎯 Endpoints principales

### POST /api/v1/transcribe

Transcribe un archivo de audio a texto.

**Parámetros:**

- `file`: Archivo de audio (mp3, wav, flac, etc.)
- `model`: Modelo Whisper (tiny, base, small, medium, large, turbo)
- `language`: Idioma (opcional, se detecta automáticamente)
- `task`: transcribe o translate

### GET /api/v1/models

Lista los modelos disponibles.

### GET /api/v1/health

Verifica el estado del servicio.

## 🎙️ Formatos de audio soportados

- MP3
- WAV
- FLAC
- M4A
- OGG
- WMA
- AAC

## 💡 Modelos disponibles

| Modelo | Parámetros | VRAM requerida | Velocidad |
| ------ | ---------- | -------------- | --------- |
| tiny   | 39M        | ~1 GB          | ~10x      |
| base   | 74M        | ~1 GB          | ~7x       |
| small  | 244M       | ~2 GB          | ~4x       |
| medium | 769M       | ~5 GB          | ~2x       |
| large  | 1550M      | ~10 GB         | 1x        |
| turbo  | 809M       | ~6 GB          | ~8x       |
