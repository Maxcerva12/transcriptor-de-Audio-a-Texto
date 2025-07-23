const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🐍 Preparando entorno Python portable...');

// Crear directorio para el entorno Python si no existe
const pythonEnvDir = path.join(__dirname, '..', 'python-env');
if (!fs.existsSync(pythonEnvDir)) {
  fs.mkdirSync(pythonEnvDir, { recursive: true });
}

// Detectar sistema operativo
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

console.log(`📋 Sistema operativo detectado: ${process.platform}`);

try {
  // Verificar que Python está disponible
  console.log('🔍 Verificando instalación de Python...');
  try {
    const pythonCmd = isWin ? 'python' : 'python3';
    const pythonVersion = execSync(`${pythonCmd} --version`, { encoding: 'utf8' });
    console.log(`✅ Python encontrado: ${pythonVersion.trim()}`);
  } catch (error) {
    console.error('❌ Error: Python no está instalado o no se encuentra en el PATH');
    console.error('Por favor instala Python desde https://python.org');
    process.exit(1);
  }

  // Eliminar entorno existente si existe
  if (fs.existsSync(pythonEnvDir)) {
    console.log('🧹 Limpiando entorno anterior...');
    fs.rmSync(pythonEnvDir, { recursive: true, force: true });
    fs.mkdirSync(pythonEnvDir, { recursive: true });
  }

  // Crear entorno virtual
  console.log('📦 Creando entorno virtual...');
  if (isWin) {
    execSync('python -m venv python-env', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } else {
    execSync('python3 -m venv python-env', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }

  // Determinar rutas del entorno virtual
  const pipPath = isWin 
    ? path.join(pythonEnvDir, 'Scripts', 'pip.exe')
    : path.join(pythonEnvDir, 'bin', 'pip');

  console.log('⬆️ Actualizando pip...');
  try {
    // En Windows, usar python -m pip en lugar de pip directamente
    if (isWin) {
      const pythonPath = path.join(pythonEnvDir, 'Scripts', 'python.exe');
      execSync(`"${pythonPath}" -m pip install --upgrade pip`, { stdio: 'inherit' });
    } else {
      execSync(`"${pipPath}" install --upgrade pip`, { stdio: 'inherit' });
    }
  } catch (pipError) {
    console.log('⚠️ Warning: No se pudo actualizar pip, continuando con la versión actual...');
  }

  // Instalar dependencias desde requirements.txt
  const requirementsPath = path.join(__dirname, '..', 'backend', 'requirements.txt');
  if (fs.existsSync(requirementsPath)) {
    console.log('📋 Instalando dependencias desde requirements.txt...');
    execSync(`"${pipPath}" install -r "${requirementsPath}"`, { 
      stdio: 'inherit',
      timeout: 300000 // 5 minutos de timeout para Whisper
    });
  } else {
    // Instalar dependencias manualmente si no existe requirements.txt
    console.log('📋 Instalando dependencias básicas...');
    const packages = [
      'fastapi==0.104.1',
      'uvicorn[standard]==0.24.0',
      'python-multipart==0.0.6',
      'openai-whisper==20231117',
      'torch>=2.0.0',
      'torchaudio>=2.0.0',
      'python-dotenv==1.0.0',
      'pydantic==2.5.0',
      'aiofiles==23.2.0'
    ];
    
    for (const pkg of packages) {
      console.log(`📦 Instalando ${pkg}...`);
      execSync(`"${pipPath}" install "${pkg}"`, { stdio: 'inherit' });
    }
  }

  // Verificar instalación
  console.log('🔍 Verificando instalación...');
  const pythonPath = isWin 
    ? path.join(pythonEnvDir, 'Scripts', 'python.exe')
    : path.join(pythonEnvDir, 'bin', 'python3');

  const installedPackages = execSync(`"${pythonPath}" -m pip list`, { encoding: 'utf8' });
  console.log('📋 Paquetes instalados:');
  console.log(installedPackages);

  console.log('✅ Entorno Python portable creado correctamente');
  console.log(`📍 Ubicación: ${pythonEnvDir}`);

} catch (error) {
  console.error('❌ Error al crear entorno Python:', error.message);
  console.error('💡 Sugerencias:');
  console.error('   - Asegúrate de tener Python instalado');
  console.error('   - Verifica que tienes conexión a internet');
  console.error('   - Ejecuta el terminal como administrador (Windows)');
  console.error('   - Asegúrate de tener suficiente espacio en disco');
  process.exit(1);
}
