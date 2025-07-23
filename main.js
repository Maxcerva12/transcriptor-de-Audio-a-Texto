const { app, BrowserWindow, ipcMain, Menu, dialog, protocol } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const fs = require('fs');

// Variables globales
let mainWindow = null;
let pythonProcess = null;
let serverReady = false;
const PORT = 8000;

// Función para iniciar el servidor FastAPI
async function startPythonServer() {
  return new Promise((resolve, reject) => {
    try {
      // Determinar la ruta para Python y el script
      const appPath = app.isPackaged 
        ? path.join(process.resourcesPath, 'app') 
        : path.join(__dirname);
      
      const pythonPath = app.isPackaged
        ? path.join(appPath, 'python-env', process.platform === 'win32' ? 'Scripts\\python.exe' : 'bin/python3')
        : path.join(__dirname, 'python-env', process.platform === 'win32' ? 'Scripts\\python.exe' : 'bin/python3');
      
      const scriptPath = app.isPackaged
        ? path.join(appPath, 'backend', 'run.py')
        : path.join(__dirname, 'backend', 'run.py');
      
      console.log(`Iniciando servidor con Python: ${pythonPath}`);
      console.log(`Script: ${scriptPath}`);
      
      // Comprobar que el archivo existe
      if (!fs.existsSync(pythonPath)) {
        console.error(`Error: No se encontró Python en ${pythonPath}`);
        dialog.showErrorBox('Error al iniciar', 'No se pudo encontrar Python. Por favor reinstale la aplicación.');
        reject(new Error('Python no encontrado'));
        return;
      }
      
      if (!fs.existsSync(scriptPath)) {
        console.error(`Error: No se encontró el script en ${scriptPath}`);
        dialog.showErrorBox('Error al iniciar', 'No se pudo encontrar el script de backend. Por favor reinstale la aplicación.');
        reject(new Error('Script no encontrado'));
        return;
      }
      
      // Iniciar el proceso Python con la variable de entorno PORT
      const env = { ...process.env, PORT: PORT.toString(), ENVIRONMENT: 'electron' };
      pythonProcess = spawn(pythonPath, [scriptPath], { env });
      
      // Manejar salida estándar del proceso Python
      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`FastAPI: ${output}`);
        
        // Detectar cuando el servidor está listo
        if (output.includes('Application startup complete') || output.includes('Uvicorn running') || output.includes('started server process')) {
          serverReady = true;
          console.log('Servidor FastAPI listo');
          resolve();
        }
      });
      
      // Manejar errores
      pythonProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        console.error(`Error FastAPI: ${errorOutput}`);
        
        // Si hay un error crítico durante el inicio, rechazar la promesa
        if (errorOutput.includes('Error') && !serverReady) {
          reject(new Error(`Error en FastAPI: ${errorOutput}`));
        }
      });
      
      // Manejar cierre del proceso
      pythonProcess.on('close', (code) => {
        console.log(`Proceso FastAPI terminado con código ${code}`);
        if (code !== 0 && !serverReady) {
          reject(new Error(`Proceso terminado con código ${code}`));
        }
      });
      
      // Timeout por si el servidor no inicia
      setTimeout(() => {
        if (!serverReady) {
          console.log('Asumiendo que el servidor está listo después del timeout');
          serverReady = true;
          resolve();
        }
      }, 10000); // 10 segundos de timeout
      
    } catch (error) {
      console.error('Error al iniciar servidor:', error);
      reject(error);
    }
  });
}

// Función para crear la ventana principal
async function createWindow() {
  // Mostrar ventana de carga
  const loadingWindow = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  loadingWindow.loadFile(path.join(__dirname, 'loading.html'));
  loadingWindow.center();
  
  try {
    // Iniciar servidor Python
    console.log('Iniciando servidor Python...');
    await startPythonServer();
    
    // Crear ventana principal
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      icon: path.join(__dirname, 'resources', process.platform === 'win32' ? 'icon.ico' : 'icon.png')
    });
    
    // Cargar la interfaz
    const startUrl = isDev 
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'frontend/out/index.html')}`;
    
    console.log(`Cargando URL: ${startUrl}`);
    await mainWindow.loadURL(startUrl);
    
    // Cerrar la ventana de carga y mostrar la principal
    loadingWindow.close();
    mainWindow.show();
    
    // Abrir DevTools en desarrollo
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
    
    // Crear menú
    const menu = Menu.buildFromTemplate([
      {
        label: 'Archivo',
        submenu: [
          { label: 'Salir', role: 'quit' }
        ]
      },
      {
        label: 'Ver',
        submenu: [
          { role: 'reload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Ayuda',
        submenu: [
          {
            label: 'Acerca de',
            click: () => {
              dialog.showMessageBox(mainWindow, {
                title: 'Transcriptor Audio a Texto',
                message: 'Transcriptor Audio a Texto v1.0.0',
                detail: 'Desarrollado por Maxcerva12\nPowered by OpenAI Whisper',
                buttons: ['OK']
              });
            }
          }
        ]
      }
    ]);
    Menu.setApplicationMenu(menu);
    
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    loadingWindow.close();
    dialog.showErrorBox('Error al iniciar', `No se pudo iniciar la aplicación: ${error.message}`);
    app.quit();
  }
}

app.whenReady().then(() => {
  // Registrar protocolo personalizado para archivos estáticos
  if (!isDev) {
    protocol.registerFileProtocol('file', (request, callback) => {
      let pathname = decodeURI(request.url.replace('file:///', ''));
      
      // Manejar rutas de assets de Next.js que empiezan con /_next/
      if (request.url.includes('/_next/')) {
        const frontendPath = path.join(__dirname, 'frontend', 'out');
        const assetPath = request.url.split('/_next/')[1];
        pathname = path.join(frontendPath, '_next', assetPath);
      }
      // Si la URL tiene el patrón de Windows drive (C:/)
      else if (!pathname.includes(':')) {
        pathname = path.join(__dirname, pathname);
      }
      
      console.log(`Cargando archivo: ${pathname}`);
      callback({ path: pathname });
    });
  }
  
  createWindow();
});

// Gestionar cierre de la aplicación
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (pythonProcess) {
      pythonProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Limpiar recursos al salir
app.on('quit', () => {
  if (pythonProcess) {
    // Matar el proceso de Python al cerrar la aplicación
    try {
      if (process.platform === 'win32') {
        // En Windows, usar taskkill para asegurar que muere
        const { execSync } = require('child_process');
        try {
          execSync(`taskkill /pid ${pythonProcess.pid} /f /t`, { timeout: 5000 });
        } catch (killError) {
          console.log('Error al terminar proceso con taskkill, usando kill normal');
          pythonProcess.kill('SIGKILL');
        }
      } else {
        // En macOS/Linux
        pythonProcess.kill('SIGTERM');
        setTimeout(() => {
          if (!pythonProcess.killed) {
            pythonProcess.kill('SIGKILL');
          }
        }, 3000);
      }
    } catch (err) {
      console.error('Error al cerrar el proceso Python:', err);
    }
  }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});
