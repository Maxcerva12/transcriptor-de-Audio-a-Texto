# 🚀 Guía de Inicio Rápido - Ejecutable

## Para crear el ejecutable (una sola vez):

### ✅ Opción Recomendada: Script Simplificado
```bash
npm install
npm run create-portable
```

### Opción 2: Script Automatizado Completo 🎯
```bash
npm install
node scripts/build-executable.js
```

### Opción 3: Pasos Manuales
```bash
# 1. Instalar dependencias principales
npm install

# 2. Preparar Python
node scripts/prepare-python.js

# 3. Construir frontend
cd frontend && npm install && npm run build && cd ..

# 4. Crear ejecutable portable
npm run create-portable
```

## Para probar en desarrollo:
```bash
npm run dev-start
```

## Ubicación del ejecutable final:
📁 `build/win-unpacked/` - Carpeta con la aplicación completa
📄 `Transcriptor Audio a Texto.exe` - Ejecutable principal

## Para distribuir:
1. **Comprime** la carpeta `build/win-unpacked/` completa
2. **Distribuye** el archivo ZIP a los usuarios
3. **Instrucciones para usuarios**:
   - Extraer el ZIP en cualquier ubicación
   - Ejecutar `Transcriptor Audio a Texto.exe`
   - ¡Listo para transcribir!

## Comandos útiles:
- `npm run clean` - Limpiar archivos generados
- `npm run setup` - Configuración inicial completa
- `npm run dev` - Modo desarrollo de Electron
- `npm run create-portable` - ⭐ Crear aplicación portable

---
🎉 **¡Tu aplicación está lista para distribuir!**
💾 **Tamaño aproximado: ~3.3 GB** (incluye Python + Whisper + PyTorch)
