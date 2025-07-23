const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando Transcriptor en modo desarrollo...\n');

// Función para ejecutar comando
function runCommand(command, description, cwd = process.cwd()) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    return false;
  }
  return true;
}

// Verificar estructura del proyecto
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const backendDir = path.join(projectRoot, 'backend');

// 1. Verificar e instalar dependencias
console.log('📦 Verificando dependencias...');

// Dependencias de Electron (raíz)
const electronNodeModules = path.join(projectRoot, 'node_modules');
if (!fs.existsSync(electronNodeModules)) {
  runCommand('npm install', 'Instalando dependencias de Electron', projectRoot);
}

// Dependencias del frontend
const frontendNodeModules = path.join(frontendDir, 'node_modules');
if (!fs.existsSync(frontendNodeModules)) {
  runCommand('npm install', 'Instalando dependencias del frontend', frontendDir);
}

// 2. Verificar entorno Python
console.log('🐍 Verificando entorno Python...');
const pythonEnvDir = path.join(projectRoot, 'python-env');
if (!fs.existsSync(pythonEnvDir)) {
  console.log('⚠️  Entorno Python no encontrado. Creándolo...');
  if (!runCommand('node scripts/prepare-python.js', 'Creando entorno Python', projectRoot)) {
    console.error('❌ No se pudo crear el entorno Python. Revisa los errores anteriores.');
    process.exit(1);
  }
}

// 3. Iniciar la aplicación en modo desarrollo
console.log('🔥 Iniciando aplicación en modo desarrollo...');
console.log('📱 Esto abrirá una ventana de Electron con tu aplicación');
console.log('🔧 Los cambios en el frontend requerirán reconstruir');
console.log('🐍 El backend se ejecutará dentro de Electron\n');

try {
  // Iniciar Electron en modo desarrollo
  const electronProcess = spawn('npm', ['run', 'dev'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  // Manejar cierre
  process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando aplicación...');
    electronProcess.kill();
    process.exit(0);
  });

  electronProcess.on('close', (code) => {
    console.log(`\n📱 Aplicación cerrada con código ${code}`);
    process.exit(code);
  });

} catch (error) {
  console.error('❌ Error al iniciar la aplicación:', error.message);
  process.exit(1);
}
