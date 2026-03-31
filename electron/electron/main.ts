import { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, nativeImage } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null
let cameraWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createMainWindow() {
  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth } = primaryDisplay.workAreaSize

  mainWindow = new BrowserWindow({
    width: 680,
    height: 600,
    x: Math.floor(screenWidth / 2 - 340),
    y: 100,
    frame: false,
    transparent: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools({ mode: 'detach' })
}

function createCameraWindow() {
  if (cameraWindow) {
    cameraWindow.show()
    return
  }

  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  cameraWindow = new BrowserWindow({
    width: 160,
    height: 160,
    x: width - 200,
    y: height - 200,
    frame: false,
    transparent: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    cameraWindow.loadURL(`${VITE_DEV_SERVER_URL}#/camera`)
  } else {
    cameraWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: '/camera' })
  }

  cameraWindow.on('closed', () => {
    cameraWindow = null
  })
}

function createTray() {
  const iconPath = path.join(__dirname, '../dist/icon.png')
  let trayIcon

  try {
    trayIcon = nativeImage.createFromPath(iconPath)
    if (trayIcon.isEmpty()) {
      trayIcon = nativeImage.createEmpty()
    }
  } catch {
    trayIcon = nativeImage.createEmpty()
  }

  tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Main Panel', click: () => mainWindow?.show() },
    { type: 'separator' },
    { label: 'Toggle Camera', click: () => {
      if (cameraWindow?.isVisible()) {
        cameraWindow.hide()
      } else {
        createCameraWindow()
      }
    }},
    { type: 'separator' },
    { label: 'Quit', click: () => {
      isQuitting = true
      app.quit()
    }}
  ])

  tray.setToolTip('FocusPal')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow?.show()
  })
}

function registerShortcuts() {
  // Ctrl+Space: Toggle main window
  globalShortcut.register('CommandOrControl+Space', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow?.show()
    }
  })

  // Ctrl+Shift+C: Toggle camera
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (cameraWindow?.isVisible()) {
      cameraWindow.hide()
    } else {
      createCameraWindow()
    }
  })
}

// IPC Handlers
ipcMain.handle('window:toggle', () => {
  if (mainWindow?.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow?.show()
  }
})

ipcMain.handle('window:hide', () => {
  mainWindow?.hide()
})

ipcMain.handle('camera:toggle', () => {
  if (cameraWindow?.isVisible()) {
    cameraWindow.hide()
    return false
  } else {
    createCameraWindow()
    return true
  }
})

ipcMain.handle('camera:close', () => {
  cameraWindow?.hide()
})

ipcMain.handle('camera:isOpen', () => {
  return cameraWindow?.isVisible() ?? false
})

ipcMain.handle('app:showStats', () => {
  mainWindow?.webContents.send('show:stats')
})

// App lifecycle
app.whenReady().then(() => {
  createMainWindow()
  createTray()
  registerShortcuts()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
