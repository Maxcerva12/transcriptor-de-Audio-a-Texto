const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Generando aplicación portable sin firmar...');

try {
  // Limpiar caché de electron-builder para evitar problemas de permisos
  const cacheDir = path.join(require('os').homedir(), 'AppData', 'Local', 'electron-builder', 'Cache');
  if (fs.existsSync(cacheDir)) {
    console.log('🧹 Limpiando caché de electron-builder...');
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Caché limpiado');
    } catch (err) {
      console.log('⚠️ No se pudo limpiar completamente el caché, continuando...');
    }
  }

  // Configurar variables de entorno para evitar la firma
  process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
  process.env.WIN_CSC_LINK = '';
  process.env.WIN_CSC_KEY_PASSWORD = '';

  console.log('📦 Generando aplicación portable...');
  
  // Usar electron-builder con configuración específica para evitar firmado
  execSync('npx electron-builder --win --config.win.sign=false --config.win.target=portable', {
    stdio: 'inherit',
    env: {
      ...process.env,
      CSC_IDENTITY_AUTO_DISCOVERY: 'false',
      ELECTRON_BUILDER_CACHE: 'false'
    }
  });

  console.log('✅ Aplicación portable generada exitosamente');
  console.log('📍 Ubicación: build/');
  
  // Mostrar archivos generados
  const buildDir = path.join(__dirname, '..', 'build');
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    console.log('📋 Archivos generados:');
    files.forEach(file => {
      const filePath = path.join(buildDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   📄 ${file} (${sizeInMB} MB)`);
      } else {
        console.log(`   📁 ${file}/`);
      }
    });
  }

} catch (error) {
  console.error('❌ Error al generar aplicación portable:', error.message);
  
  // Sugerencias específicas
  console.error('\n💡 Sugerencias para resolver el problema:');
  console.error('1. Ejecuta PowerShell como Administrador');
  console.error('2. Si el problema persiste, usa: npm run pack');
  console.error('3. Alternativamente, distribuye la carpeta build/win-unpacked/');
  
  process.exit(1);
}
