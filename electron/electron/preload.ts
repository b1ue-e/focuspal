import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  toggleWindow: () => ipcRenderer.invoke('window:toggle'),
  hideWindow: () => ipcRenderer.invoke('window:hide'),

  // Camera
  toggleCamera: () => ipcRenderer.invoke('camera:toggle'),
  closeCamera: () => ipcRenderer.invoke('camera:close'),
  isCameraOpen: () => ipcRenderer.invoke('camera:isOpen'),

  // App
  showStats: () => ipcRenderer.invoke('app:showStats'),

  // Events
  onShowStats: (callback: () => void) => {
    ipcRenderer.on('show:stats', callback)
    return () => ipcRenderer.removeListener('show:stats', callback)
  }
})

declare global {
  interface Window {
    electronAPI: {
      toggleWindow: () => Promise<void>
      hideWindow: () => Promise<void>
      toggleCamera: () => Promise<boolean>
      closeCamera: () => Promise<void>
      isCameraOpen: () => Promise<boolean>
      showStats: () => Promise<void>
      onShowStats: (callback: () => void) => () => void
    }
  }
}
