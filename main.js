const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execFile, exec } = require('child_process');
const os = require('os');

// UPDATE: createSetupWindow para usar la ruta de distribución (dist) e IPC
// Esta función crea la ventana de configuración inicial si no existe config.json
function createSetupWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 700,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.setMenuBarVisibility(false);

  if (process.env.NODE_ENV === 'development') {
    // En desarrollo, carga desde el servidor de Angular
    win.loadURL('http://localhost:4200/setup/index.html');
    console.log('[MAIN] Loading setup from: http://localhost:4200/setup/index.html');
  } else {
    // Usar la ruta donde angular.json copia la carpeta de setup
    // En prod: resources/app/dist/expedientes/browser/setup/index.html
    const setupPath = path.join(__dirname, 'dist', 'expedientes', 'browser', 'setup', 'index.html');
    console.log('[MAIN] Loading setup from:', setupPath);
    win.loadFile(setupPath);
  }
}

// Handler IPC para guardar la configuración
// Esto se llama desde el renderer.js de la ventana de setup
ipcMain.handle('save-config', async (event, config) => {
  try {
    // Ruta donde se guardará el archivo de configuración (ej: AppData/Roaming/Expedientes/config.json)
    const configPath = path.join(app.getPath('userData'), 'config.json');

    // Escribir el archivo config.json con los datos recibidos
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('[MAIN] Config saved to:', configPath);

    // Cerrar todas las ventanas (en este caso, la de setup)
    const wins = BrowserWindow.getAllWindows();
    wins.forEach(w => w.close());

    // Iniciar el backend (Java) y crear la ventana principal de la aplicación
    startBackend();
    createWindow();

    return { success: true };
  } catch (err) {
    console.error('[MAIN] Error saving config:', err);
    return { success: false, error: err.message };
  }
});

// Handler IPC para obtener la configuración
ipcMain.handle('get-config', async (event) => {
  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (err) {
    console.error('[MAIN] Error reading config:', err);
    return null;
  }
});


function handleSquirrelEvent() {
  if (process.platform !== 'win32') return false;

  const squirrelEvent = process.argv.slice(1).find(a =>
    ['--squirrel-install', '--squirrel-updated', '--squirrel-uninstall', '--squirrel-obsolete', '--squirrel-firstrun'].includes(a)
  );

  if (!squirrelEvent) return false;

  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
  const exeName = path.basename(process.execPath);

  const spawnUpdate = (args) => {
    if (!fs.existsSync(updateExe)) {
      console.warn('[SQUIRREL] update.exe no encontrado en', updateExe);
      return;
    }
    try {
      const p = spawn(updateExe, args, { detached: true, stdio: 'ignore' });
      p.unref();
    } catch (e) {
      console.error('[SQUIRREL] error ejecutando update.exe', e && e.message ? e.message : e);
    }
  };

  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      console.log('[SQUIRREL] Instalación/Actualización detectada. Creando acceso directo...');
      spawnUpdate(['--createShortcut', exeName]);
      // No iniciar UI ni backend durante instalación
      setTimeout(() => app.quit(), 1000); // Se da un pequeño retraso para asegurar que se complete la creación del acceso directo
      return true;

    case '--squirrel-uninstall':
      console.log('[SQUIRREL] Desinstalación detectada. Eliminando acceso directo...');
      spawnUpdate(['--removeShortcut', exeName]);

      // Eliminar el archivo de configuración al desinstalar
      try {
        const userDataPath = app.getPath('userData');
        const configPath = path.join(userDataPath, 'config.json');
        if (fs.existsSync(configPath)) {
          fs.unlinkSync(configPath);
          console.log('[SQUIRREL] Configuración eliminada.');
        }
      } catch (e) {
        console.error('[SQUIRREL] Error eliminando configuración:', e);
      }

      setTimeout(() => app.quit(), 1000);
      return true;

    case '--squirrel-obsolete':
      // Evento raro, solo salir
      app.quit();
      return true;

    case '--squirrel-firstrun':
      return false;

    default:
      return false;
  }
}

// Si detecta evento Squirrel: manejar y salir
if (handleSquirrelEvent()) {
  // IMPORTANT: no ejecutar más código si fue evento Squirrel
  return;
}

// SINGLE INSTANCE LOCK
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  return;
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    const wins = BrowserWindow.getAllWindows();
    if (wins.length > 0) {
      const win = wins[0];
      if (win.isMinimized()) win.restore();
      win.focus();
    } else {
      // If no windows are open (e.g. closed but app running), create one
      createWindow();
    }
  });
}

let javaProcess = null;
let javaPid = null;

function resolveJarPath() {
  const jarFile = 'api-expedientes-0.0.1-SNAPSHOT.jar';
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'api', jarFile);
  } else {
    return path.join(__dirname, 'api', jarFile);
  }
}

function startBackend() {
  if (javaProcess) {
    console.log('[APP] Backend ya está corriendo.');
    return true;
  }

  const jarFile = 'api-expedientes-0.0.1-SNAPSHOT.jar';
  const jarPath = app.isPackaged
    ? path.join(process.resourcesPath, 'api', jarFile)
    : path.join(__dirname, 'api', jarFile);

  const javaBin = app.isPackaged
    ? path.join(process.resourcesPath, 'api', 'jre', 'bin', 'java.exe')
    : path.join(__dirname, 'api', 'jre', 'bin', 'java.exe');

  console.log('[APP] Ruta Java embebido ->', javaBin);
  console.log('[APP] Ruta JAR ->', jarPath);

  if (!fs.existsSync(javaBin)) {
    console.error('[APP] ERROR: No se encontró el Java embebido en', javaBin);
    return false;
  }
  if (!fs.existsSync(jarPath)) {
    console.error('[APP] ERROR: No se encontró el JAR en', jarPath);
    return false;
  }

  const spawnOpts = {
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false
  };

  try {
    const configPath = path.join(app.getPath('userData'), 'config.json');
    javaProcess = spawn(javaBin, ['-jar', jarPath, '--spring.profiles.active=desktop', `--app.config.path=${configPath}`], spawnOpts);
  } catch (e) {
    console.error('[APP] Error al iniciar backend:', e.message);
    return false;
  }

  javaPid = javaProcess.pid;
  console.log('[APP] Backend iniciado con PID:', javaPid);

  javaProcess.stdout.on('data', d => process.stdout.write(`[API] ${d}`));
  javaProcess.stderr.on('data', d => process.stderr.write(`[API ERROR] ${d}`));
  javaProcess.on('close', (c, s) => {
    console.log(`[APP] Backend cerrado (code=${c}, signal=${s})`);
    javaProcess = null;
    javaPid = null;
  });

  return true;
}


function stopBackend(force = false) {
  if (!javaPid) {
    console.log('[APP] No hay backend para detener.');
    return;
  }

  const pid = javaPid;
  const isWin = os.platform().startsWith('win');

  console.log(`[APP] Intentando detener backend PID=${pid} (force=${force})`);

  if (isWin) {
    const cmd = `taskkill /PID ${pid} /T ${force ? '/F' : ''}`.trim();
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error('[APP] taskkill error:', err.message || err);
      } else {
        console.log('[APP] taskkill stdout:', stdout);
        if (stderr && stderr.length) console.error('[APP] taskkill stderr:', stderr);
      }
      javaProcess = null;
      javaPid = null;
    });
  } else {
    try {
      try { process.kill(-pid, 'SIGTERM'); } catch (e) {
        try { process.kill(pid, 'SIGTERM'); } catch (e2) {
          console.warn('[APP] No se pudo enviar SIGTERM:', e2 && e2.message ? e2.message : e2);
        }
      }
      setTimeout(() => {
        try {
          process.kill(pid, 0);
          try { process.kill(-pid, 'SIGKILL'); } catch (e) { process.kill(pid, 'SIGKILL'); }
          console.log('[APP] Forzado SIGKILL al proceso', pid);
        } catch (e) {
          console.log('[APP] Proceso ya terminado');
        } finally {
          javaProcess = null;
          javaPid = null;
        }
      }, 1200);
    } catch (e) {
      console.error('[APP] Error deteniendo en Unix:', e && e.message ? e.message : e);
      javaProcess = null;
      javaPid = null;
    }
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.maximize();
  win.setMenuBarVisibility(false);
  win.show();

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:4200');
  } else {
    // Use hash location strategy in Angular to avoid issues with file:// protocol
    win.loadFile(path.join(__dirname, 'dist', 'expedientes', 'browser', 'index.html'));
  }

  // REMOVED: win.on('closed', ...) calling stopBackend(). 
  // We want the backend to persist if the window is closed but app is running,
  // OR we rely on window-all-closed to stop it.
}

app.whenReady().then(() => {
  const configPath = path.join(app.getPath('userData'), 'config.json');

  if (!fs.existsSync(configPath)) {
    createSetupWindow();
  } else {
    startBackend();
    createWindow();
  }
});




app.on('before-quit', () => {
  stopBackend(true);
});

app.on('window-all-closed', () => {
  stopBackend(true);
  if (process.platform !== 'darwin') app.quit();
});
