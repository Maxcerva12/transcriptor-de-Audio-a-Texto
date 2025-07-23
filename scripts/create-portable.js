const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Creando aplicación portable sin firma...');

try {
  // Configurar variables de entorno para deshabilitar completamente la firma
  const env = {
    ...process.env,
    CSC_IDENTITY_AUTO_DISCOVERY: 'false'
  };
  
  // Eliminar cualquier variable relacionada con firma
  delete env.CSC_LINK;
  delete env.CSC_KEY_PASSWORD;
  delete env.WIN_CSC_LINK;
  delete env.WIN_CSC_KEY_PASSWORD;

  console.log('📦 Generando aplicación portable...');
  
  // Usar solo --dir para crear la carpeta sin intentar firmar
  execSync('npx electron-builder --dir --win --config.forceCodeSigning=false', {
    stdio: 'inherit',
    env: env,
    cwd: path.join(__dirname, '..')
  });

  const buildDir = path.join(__dirname, '..', 'build', 'win-unpacked');
  
  if (fs.existsSync(buildDir)) {
    console.log('✅ Aplicación portable creada exitosamente');
    console.log('📍 Ubicación: build/win-unpacked/');
    
    // Mostrar el tamaño de la aplicación
    const getDirectorySize = (dirPath) => {
      let totalSize = 0;
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          totalSize += getDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      });
      
      return totalSize;
    };
    
    const totalSize = getDirectorySize(buildDir);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`📏 Tamaño total: ${sizeInMB} MB`);
    
    // Verificar que el ejecutable principal existe
    const exePath = path.join(buildDir, 'Transcriptor Audio a Texto.exe');
    if (fs.existsSync(exePath)) {
      console.log('✅ Ejecutable principal encontrado');
      console.log('🎉 ¡Aplicación lista para distribuir!');
      console.log('');
      console.log('📋 Para distribuir:');
      console.log('   1. Comprime la carpeta build/win-unpacked/');
      console.log('   2. Distribuye el archivo ZIP a los usuarios');
      console.log('   3. Los usuarios deben extraer y ejecutar "Transcriptor Audio a Texto.exe"');
    } else {
      console.log('⚠️ No se encontró el ejecutable principal');
    }
  } else {
    console.log('❌ No se pudo crear la aplicación');
  }

} catch (error) {
  console.error('❌ Error al crear aplicación portable:', error.message);
  process.exit(1);
}
