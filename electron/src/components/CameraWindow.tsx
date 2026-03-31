import { useEffect, useRef } from 'react'
import { useCamera } from '../hooks/useCamera'
import { X } from 'lucide-react'
import { Button } from './ui/button'

export function CameraWindow() {
  const { videoRef, isActive, startCamera, stopCamera, error } = useCamera()

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const handleClose = async () => {
    stopCamera()
    await window.electronAPI.closeCamera()
  }

  return (
    <div className="relative w-[160px] h-[160px] rounded-full overflow-hidden border-2 border-border shadow-lg bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${isActive ? '' : 'hidden'}`}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <p className="text-[10px] text-center text-text-secondary px-2">
            {error}
          </p>
        </div>
      )}

      {!isActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <p className="text-xs text-text-secondary">Camera off</p>
        </div>
      )}

      {/* Close button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
        onClick={handleClose}
      >
        <X className="w-3 h-3" />
      </Button>

      {/* Border ring when active */}
      {isActive && (
        <div className="absolute inset-0 rounded-full border-2 border-primary/50 pointer-events-none" />
      )}
    </div>
  )
}
