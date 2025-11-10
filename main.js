const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execFile, exec } = require('child_process');
const os = require('os');

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
      setTimeout(() => app.quit(), 1000);
      return true;

    case '--squirrel-obsolete':
      // Evento raro, solo salir
      app.quit();
      return true;

    case '--squirrel-firstrun':
      // Abrir la UI en firstrun, cambiar a `return false;`
      console.log('[SQUIRREL] First run - no iniciar automáticamente.');
      setTimeout(() => app.quit(), 500);
      return true;

    default:
      return false;
  }
}

// Si detecta evento Squirrel: manejar y salir
if (handleSquirrelEvent()) {
  // IMPORTANT: no ejecutar más código si fue evento Squirrel
  return;
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
    javaProcess = spawn(javaBin, ['-jar', jarPath, '--spring.profiles.active=desktop'], spawnOpts);
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
    win.loadFile(path.join(__dirname, 'dist', 'expedientes', 'browser', 'index.html'));
  }

  win.on('closed', () => {
    stopBackend();
  });
}

// App lifecycle
app.whenReady().then(() => {
  const startedBackend = startBackend();
  if (!startedBackend) {
    console.warn('[APP] No se pudo iniciar backend. La aplicación continuará, pero puede fallar.');
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  stopBackend(true);
});

app.on('window-all-closed', () => {
  stopBackend(true);
  if (process.platform !== 'darwin') app.quit();
});
