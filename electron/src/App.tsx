import { useEffect } from 'react'
import { MainPanel } from './components/MainPanel'
import { ChatSidebar } from './components/ChatSidebar'
import { CameraWindow } from './components/CameraWindow'
import { StatsModal } from './components/StatsModal'
import { useAppStore } from './stores/appStore'

function App() {
  const { setStatsModalOpen, setCameraWindowOpen } = useAppStore()

  // Check if this is the camera window
  const isCameraWindow = window.location.hash === '#/camera'

  useEffect(() => {
    // Listen for show stats event from main process
    const cleanup = window.electronAPI.onShowStats(() => {
      setStatsModalOpen(true)
    })

    return cleanup
  }, [setStatsModalOpen])

  // Camera window renders only CameraWindow
  if (isCameraWindow) {
    return (
      <div className="w-screen h-screen bg-transparent">
        <CameraWindow />
      </div>
    )
  }

  // Main window
  return (
    <div className="w-screen bg-background flex flex-col items-center">
      {/* 搜索栏固定在顶部 */}
      <div className="w-[680px] mt-4">
        <MainPanel />
      </div>
      {/* 聊天侧边栏在搜索栏下方展开 */}
      <div className="w-[680px] mt-2 px-4">
        <ChatSidebar />
      </div>
      {/* 统计弹窗覆盖整个窗口 */}
      <StatsModal />
    </div>
  )
}

export default App
