export interface ElectronAPI {
  toggleWindow: () => Promise<void>
  hideWindow: () => Promise<void>
  toggleCamera: () => Promise<boolean>
  closeCamera: () => Promise<void>
  isCameraOpen: () => Promise<boolean>
  showStats: () => Promise<void>
  onShowStats: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
