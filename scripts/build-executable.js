const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando construcción completa del ejecutable...\n');

// Función para ejecutar comando y manejar errores
function runCommand(command, description, cwd = process.cwd()) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`);
    console.error(error.message);
    process.exit(1);
  }
}

// Función para verificar si un directorio existe
function checkDirectory(dir, name) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Error: No se encontró el directorio ${name}: ${dir}`);
    process.exit(1);
  }
  console.log(`✅ Directorio ${name} encontrado`);
}

// Verificar estructura del proyecto
console.log('🔍 Verificando estructura del proyecto...');
const projectRoot = path.join(__dirname, '..');
const frontendDir = path.join(projectRoot, 'frontend');
const backendDir = path.join(projectRoot, 'backend');

checkDirectory(frontendDir, 'frontend');
checkDirectory(backendDir, 'backend');

// 1. Instalar dependencias de Electron si no están instaladas
console.log('📦 Verificando dependencias de Electron...');
const packageJsonPath = path.join(projectRoot, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json no encontrado en la raíz del proyecto');
  process.exit(1);
}

try {
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    runCommand('npm install', 'Instalando dependencias de Electron', projectRoot);
  } else {
    console.log('✅ Dependencias de Electron ya instaladas\n');
  }
} catch (error) {
  runCommand('npm install', 'Instalando dependencias de Electron', projectRoot);
}

// 2. Construir el frontend
console.log('🎨 Construyendo frontend...');
runCommand('npm install', 'Instalando dependencias del frontend', frontendDir);
runCommand('npm run build', 'Compilando frontend', frontendDir);

// Verificar que se creó la carpeta out
const outDir = path.join(frontendDir, 'out');
if (!fs.existsSync(outDir)) {
  console.error('❌ Error: No se generó la carpeta out del frontend');
  process.exit(1);
}
console.log('✅ Frontend compilado correctamente\n');

// 3. Preparar entorno Python
console.log('🐍 Preparando entorno Python...');
runCommand('node scripts/prepare-python.js', 'Creando entorno Python portable', projectRoot);

// Verificar que se creó el entorno Python
const pythonEnvDir = path.join(projectRoot, 'python-env');
if (!fs.existsSync(pythonEnvDir)) {
  console.error('❌ Error: No se creó el entorno Python');
  process.exit(1);
}
console.log('✅ Entorno Python creado correctamente\n');

// 4. Crear carpeta de recursos si no existe
console.log('📁 Preparando recursos...');
const resourcesDir = path.join(projectRoot, 'resources');
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
  console.log('✅ Carpeta de recursos creada');
  
  // Crear un icono básico de ejemplo
  console.log('⚠️  NOTA: Debes agregar los iconos icon.ico, icon.icns e icon.png en la carpeta resources/');
} else {
  console.log('✅ Carpeta de recursos ya existe');
}

// 5. Construir el ejecutable
console.log('🔨 Construyendo ejecutable...');
const platform = process.platform;
let buildCommand = 'npm run dist';

if (platform === 'win32') {
  buildCommand = 'npm run dist-win';
  console.log('🪟 Construyendo para Windows...');
} else if (platform === 'darwin') {
  buildCommand = 'npm run dist-mac';
  console.log('🍎 Construyendo para macOS...');
} else {
  buildCommand = 'npm run dist-linux';
  console.log('🐧 Construyendo para Linux...');
}

runCommand(buildCommand, 'Empaquetando aplicación', projectRoot);

// 6. Verificar el resultado
console.log('🔍 Verificando resultado...');
const buildDir = path.join(projectRoot, 'build');
if (fs.existsSync(buildDir)) {
  const files = fs.readdirSync(buildDir);
  console.log('✅ Construcción completada exitosamente!');
  console.log('📦 Archivos generados:');
  files.forEach(file => {
    const filePath = path.join(buildDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   📄 ${file} (${sizeInMB} MB)`);
  });
  
  console.log('\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!');
  console.log(`📍 Los archivos de instalación están en: ${buildDir}`);
  console.log('\n📋 Instrucciones para el usuario final:');
  console.log('   1. Descarga el archivo instalador apropiado para tu sistema operativo');
  console.log('   2. Ejecuta el instalador y sigue las instrucciones');
  console.log('   3. Una vez instalado, abre la aplicación desde el menú de inicio o aplicaciones');
  console.log('   4. ¡Disfruta transcribiendo tus audios!');
  
} else {
  console.error('❌ Error: No se encontró el directorio build');
  process.exit(1);
}
