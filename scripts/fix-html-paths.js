const fs = require('fs');
const path = require('path');

// Función para arreglar las rutas en archivos HTML
function fixHtmlPaths() {
  const outDir = path.join(__dirname, '..', 'frontend', 'out');
  const indexPath = path.join(outDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Reemplazar rutas absolutas por rutas relativas para CSS y JS
    content = content.replace(/href="\/_next\//g, 'href="./_next/');
    content = content.replace(/src="\/_next\//g, 'src="./_next/');
    
    fs.writeFileSync(indexPath, content);
    console.log('✅ Rutas HTML corregidas en index.html');
  }
  
  // Buscar otros archivos HTML en el directorio
  const htmlFiles = fs.readdirSync(outDir)
    .filter(file => file.endsWith('.html') && file !== 'index.html');
  
  htmlFiles.forEach(file => {
    const filePath = path.join(outDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/href="\/_next\//g, 'href="./_next/');
    content = content.replace(/src="\/_next\//g, 'src="./_next/');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Rutas HTML corregidas en ${file}`);
  });
}

if (require.main === module) {
  fixHtmlPaths();
}

module.exports = { fixHtmlPaths };
