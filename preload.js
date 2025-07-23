const { contextBridge, ipcRenderer } = require('electron');

// API segura para comunicación con el proceso principal
contextBridge.exposeInMainWorld('api', {
  // Obtener información de la aplicación
  getAppInfo: () => {
    return {
      appName: 'Transcriptor Audio a Texto',
      version: '1.0.0',
      apiUrl: 'http://localhost:8000', // URL de la API local
      isElectron: true
    };
  },
  
  // Función para mostrar mensajes nativos
  showMessage: (title, message) => {
    ipcRenderer.invoke('show-message', { title, message });
  },
  
  // Función para abrir enlaces externos
  openExternal: (url) => {
    ipcRenderer.invoke('open-external', url);
  }
});

// Exponer algunas utilidades para detectar que estamos en Electron
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  versions: process.versions
});
