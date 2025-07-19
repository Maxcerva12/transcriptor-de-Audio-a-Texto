# transcriptor Frontend

Frontend de la aplicación transcriptor construido con Next.js, React y TypeScript.

## 🚀 Características

- ✅ Interfaz moderna y responsiva
- ✅ Drag & Drop para archivos de audio
- ✅ Múltiples modelos de Whisper
- ✅ Selección de idioma automática o manual
- ✅ Transcripción y traducción
- ✅ Descarga de resultados
- ✅ Segmentos detallados con timestamps

## 🛠️ Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Ejecutar en modo desarrollo:**

```bash
npm run dev
```

4. **Abrir en el navegador:**
   http://localhost:3000

## 📦 Dependencias principales

- **Next.js 15** - Framework React
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **React Dropzone** - Drag & Drop
- **Lucide React** - Iconos

## 🌍 Scripts disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en producción
npm run lint         # Linting
```

## 🎯 Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx         # Página principal
│   ├── layout.tsx       # Layout global
│   └── globals.css      # Estilos globales
├── components/
│   ├── FileDropzone.tsx      # Componente de carga
│   ├── ProgressBar.tsx       # Barra de progreso
│   ├── TranscriptionOptions.tsx  # Opciones
│   ├── TranscriptionResult.tsx   # Resultados
│   └── index.ts         # Exportaciones
├── services/
│   └── transcription.ts # Servicios API
└── types/
    └── index.ts         # Tipos TypeScript
```

## 🎨 Uso de la aplicación

1. **Subir archivo:** Arrastra un archivo de audio o haz clic para seleccionar
2. **Configurar opciones:** Selecciona modelo, idioma y tarea
3. **Transcribir:** Haz clic en "Transcribir Audio"
4. **Ver resultado:** Copia o descarga la transcripción

## 📱 Formatos soportados

- MP3, WAV, FLAC, M4A, OGG, WMA, AAC
- Tamaño máximo: 100MB
