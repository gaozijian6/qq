import { useEffect, useRef } from 'react'

export function useDraggable(targetWindow: string) {
  const dragRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dragElement = dragRef.current
    if (!dragElement) return

    let isDragging = false
    let startX: number, startY: number

    const onMouseDown = (e: MouseEvent) => {
      // 检查点击的元素是否为可拖拽区域
      if (e.target !== dragElement) return
      isDragging = true
      startX = e.clientX
      startY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const mouseX = e.clientX - startX
      const mouseY = e.clientY - startY
      window.electron.ipcRenderer.invoke(`move-window`, { targetWindow, mouseX, mouseY })
    }

    const onMouseUp = () => {
      isDragging = false
    }

    dragElement.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      dragElement.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return dragRef
}
