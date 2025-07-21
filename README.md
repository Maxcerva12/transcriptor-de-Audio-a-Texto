# 🎙️ transcriptor

**Transcriptor de audio a texto gratuito usando OpenAI Whisper**

Una aplicación web completa que permite transcribir archivos de audio a texto de forma gratuita, perfecta para estudiantes, investigadores y profesionales que necesiten convertir grabaciones de reuniones, conferencias o entrevistas a texto.

## 🚀 Características

- ✅ **Transcripción precisa** con modelos Whisper de OpenAI
- ✅ **Múltiples formatos** de audio soportados (MP3, WAV, FLAC, M4A, OGG, WMA, AAC)
- ✅ **Interfaz drag & drop** intuitiva y moderna
- ✅ **9 modelos diferentes** para equilibrar velocidad y calidad (tiny → turbo)
- ✅ **Detección automática** de idioma
- ✅ **Traducción** al inglés disponible
- ✅ **Cancelación en tiempo real** de transcripciones en proceso
- ✅ **Tiempos estimados** sin límites de timeout
- ✅ **Modelos pre-instalados** para despliegue rápido
- ✅ **Descarga de resultados** en texto plano
- ✅ **Segmentos detallados** con timestamps
- ✅ **Totalmente gratuito** y open source

## 🏗️ Arquitectura

- **Frontend**: Next.js 15 + React 18 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python + OpenAI Whisper
- **Transcripción**: OpenAI Whisper (modelos tiny, base, small, medium, large, turbo)

## 📋 Prerrequisitos

- **Node.js** 18 o superior
- **Python** 3.8 o superior
- **FFmpeg** (para procesamiento de audio)

### Instalar FFmpeg en Windows:

```powershell
# Con Chocolatey
choco install ffmpeg

# Con Scoop
scoop install ffmpeg
```

## 🚀 Instalación Completa

### 1. Clonar el proyecto

```bash
cd c:\Users\tu_usuario\tu_carpeta
# El proyecto ya está en transcriptor/
```

### 2. Configurar Backend

```bash
cd c:\backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python run.py
```

El backend estará disponible en: http://localhost:8000

### 3. Configurar Frontend

```bash
cd c:\frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## 📖 Uso

1. **Accede** a http://localhost:3000
2. **Arrastra** un archivo de audio o haz clic para seleccionar
3. **Configura** las opciones:
   - **Modelo**: Elige entre velocidad y calidad
   - **Idioma**: Detección automática o manual
   - **Tarea**: Transcribir o traducir al inglés
4. **Haz clic** en "Transcribir Audio"
5. **Espera** el procesamiento
6. **Copia** o **descarga** el resultado

## 🎯 Modelos Disponibles

| Modelo    | Nivel | Tiempo Estimado | Parámetros | Recomendado para              |
|-----------|-------|----------------|------------|-------------------------------|
| tiny      | 1     | ~3 min         | 39M        | ⚡ Pruebas rápidas           |
| base      | 2     | ~5 min         | 74M        | ⚖️ Uso general (recomendado) |
| small     | 3     | ~8 min         | 244M       | 🎯 Buena calidad             |
| medium    | 4     | ~12 min        | 769M       | 🔥 Alta calidad              |
| large-v1  | 5     | ~16 min        | 1550M      | ⭐ Máxima calidad v1         |
| large-v2  | 6     | ~18 min        | 1550M      | ⭐ Máxima calidad v2         |
| large-v3  | 7     | ~20 min        | 1550M      | ⭐ Máxima calidad v3         |
| large     | 8     | ~22 min        | 1550M      | ⭐ Máxima calidad (última)   |
| turbo     | 9     | ~10 min        | 809M       | 🚀 Rápido + calidad         |

## 📁 Estructura del Proyecto

```
transcriptor/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── main.py         # Aplicación principal
│   │   ├── routers/        # Endpoints de API
│   │   ├── models/         # Modelos de datos
│   │   └── utils/          # Servicios Whisper
│   ├── requirements.txt    # Dependencias Python
│   ├── .env               # Variables de entorno
│   └── run.py             # Script de inicio
├── frontend/               # Aplicación Next.js
│   ├── src/
│   │   ├── app/           # Páginas Next.js 15
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios API
│   │   └── types/         # Tipos TypeScript
│   ├── package.json       # Dependencias Node
│   └── .env.local         # Variables de entorno
└── README.md              # Este archivo
```

## 🔧 Configuración Avanzada

### Variables de Entorno

**Backend (.env):**

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
UPLOAD_DIR=uploads
MAX_FILE_SIZE=100
DEFAULT_MODEL=base
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 Solución de Problemas

### Error: "FFmpeg not found"

- Instala FFmpeg y asegúrate de que esté en el PATH

### Error: "Module not found"

- Activa el entorno virtual del backend
- Instala dependencias: `pip install -r requirements.txt`

### Error: "Cannot connect to backend"

- Verifica que el backend esté corriendo en puerto 8000
- Revisa la variable NEXT_PUBLIC_API_URL

### Transcripción lenta

- Usa modelos más pequeños (tiny, base)
- Verifica que tengas GPU disponible para modelos grandes

## 🛠️ Desarrollo

### Comandos útiles

```bash
# Backend
python run.py              # Iniciar servidor
pip install -r requirements.txt  # Instalar dependencias

# Frontend
npm run dev                # Desarrollo
npm run build              # Construir
npm run lint               # Linting
```

## 🚀 Despliegue en Producción

### Nuevas funcionalidades implementadas:

#### ✅ Cancelación de Transcripción
- Botón "X" para cancelar transcripción en tiempo real
- API endpoint para cancelación (`DELETE /api/v1/transcribe/{task_id}`)
- Manejo seguro de tareas asíncronas

#### ✅ Modelos Pre-instalados
- Todos los modelos Whisper descargados durante el build
- Sin esperas de descarga para usuarios finales
- Configuración automática según entorno

#### ✅ Tiempos Estimados (Sin Timeouts)
- Información de tiempo estimado por modelo
- Sin límites que interrumpan la transcripción
- Proceso continúa hasta completarse

### Backend (Render/Railway/Fly.io)

**Variables de entorno requeridas:**
```bash
ENVIRONMENT=production  # Ambiente de producción
ALLOWED_ORIGINS=https://tu-frontend.vercel.app
PORT=8000
DEBUG=False
```

**Pasos para desplegar:**

1. **Render/Railway:** 
   - Conecta tu repositorio GitHub
   - Configura las variables de entorno
   - El servicio ejecutará automáticamente `python run.py`

2. **Modelos bajo demanda:**
   ```bash
   # Los modelos se cargarán automáticamente cuando sean necesarios
   # y se liberarán después de su uso para ahorrar memoria
   ```

   Esto descarga todos los modelos Whisper y los deja listos para usar.

**Archivo de configuración para servicios (render.yaml):**
```yaml
services:
  - type: web
    name: transcriptor-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python run.py"
    envVars:
      - key: ENVIRONMENT
        value: production
```

### Frontend (Vercel/Netlify)

**Variables de entorno:**
```bash
NEXT_PUBLIC_API_URL=https://tu-backend.render.com
```

### Modelos y tiempos estimados:

| Modelo | Nivel | Tiempo Estimado | Descripción |
|--------|-------|----------------|-------------|
| tiny | 1 | ~3 min | Más rápido, menos preciso |
| base | 2 | ~5 min | Equilibrado (recomendado) |
| small | 3 | ~8 min | Buena calidad |
| medium | 4 | ~12 min | Alta calidad |
| large-v1 | 5 | ~16 min | Máxima calidad v1 |
| large-v2 | 6 | ~18 min | Máxima calidad v2 |
| large-v3 | 7 | ~20 min | Máxima calidad v3 |
| large | 8 | ~22 min | Máxima calidad (última) |
| turbo | 9 | ~10 min | Optimizado, rápido |


## 📝 Licencia

MIT License - Uso libre para proyectos educativos y comerciales.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la branch (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📧 Soporte

Si tienes problemas o preguntas, puedes:

- Crear un issue en el repositorio
- Revisar la documentación de Whisper: https://github.com/openai/whisper
- Consultar la documentación de FastAPI: https://fastapi.tiangolo.com/
- Revisar la documentación de Next.js: https://nextjs.org/docs

---

**¿Te resultó útil transcriptor?** ⭐ Dale una estrella al proyecto y compártelo con otros estudiantes y profesionales que puedan necesitarlo.

**Creado con ❤️ para hacer la transcripción de audio accesible para todos.**
