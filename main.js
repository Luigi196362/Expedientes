const { app, BrowserWindow } = require('electron');
const path = require('path');

// Se utiliza para Windows con Squirrel
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Configuraciones recomendadas por seguridad
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.maximize();

  // Ocultar la barra de menú
  win.setMenuBarVisibility(false);

  win.show();

  // Cargar el contenido según el entorno
  if (process.env.NODE_ENV === 'development') {
    // En desarrollo, se carga la URL del servidor de desarrollo
    win.loadURL('http://localhost:3000');
  } else {
    // En producción, se carga el archivo compilado
    win.loadFile(path.join(__dirname, 'dist', 'expedientes', 'browser', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // En macOS es común recrear la ventana al hacer clic en el dock si no hay ninguna abierta
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // En Windows y Linux se cierra la aplicación cuando no quedan ventanas abiertas
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
