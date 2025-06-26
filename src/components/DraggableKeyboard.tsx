
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Move, Maximize2, Minimize2 } from 'lucide-react'
import EnhancedVirtualKeyboard from './EnhancedVirtualKeyboard'

interface DraggableKeyboardProps {
  onKeyPress: (char: string) => void
  onClose: () => void
  isOpen: boolean
}

const DraggableKeyboard = ({ onKeyPress, onClose, isOpen }: DraggableKeyboardProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('')
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 650, height: 450 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  
  const keyboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        
        // Boundary checks
        const maxX = window.innerWidth - size.width
        const maxY = window.innerHeight - size.height
        
        setPosition({
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(0, Math.min(maxY, newY))
        })
      }
      
      if (isResizing && resizeDirection) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        
        let newWidth = size.width
        let newHeight = size.height
        let newX = position.x
        let newY = position.y

        // Handle different resize directions
        if (resizeDirection.includes('right')) {
          newWidth = Math.max(400, resizeStart.width + deltaX)
        }
        if (resizeDirection.includes('left')) {
          newWidth = Math.max(400, resizeStart.width - deltaX)
          newX = Math.min(position.x, resizeStart.x + resizeStart.width - 400)
          if (newWidth > 400) {
            newX = position.x + deltaX
          }
        }
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(350, resizeStart.height + deltaY)
        }
        if (resizeDirection.includes('top')) {
          newHeight = Math.max(350, resizeStart.height - deltaY)
          newY = Math.min(position.y, resizeStart.y + resizeStart.height - 350)
          if (newHeight > 350) {
            newY = position.y + deltaY
          }
        }

        // Boundary checks
        const maxX = window.innerWidth - newWidth
        const maxY = window.innerHeight - newHeight
        
        setSize({ width: newWidth, height: newHeight })
        setPosition({
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(0, Math.min(maxY, newY))
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection('')
      document.body.style.cursor = 'default'
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeDirection, resizeStart, size, position])

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true)
      const rect = keyboardRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
    
    // Set cursor based on direction
    const cursors: {[key: string]: string} = {
      'top': 'n-resize',
      'bottom': 's-resize',
      'left': 'w-resize',
      'right': 'e-resize',
      'top-left': 'nw-resize',
      'top-right': 'ne-resize',
      'bottom-left': 'sw-resize',
      'bottom-right': 'se-resize'
    }
    document.body.style.cursor = cursors[direction] || 'default'
  }

  if (!isOpen) return null

  return (
    <div
      ref={keyboardRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-lg shadow-2xl overflow-hidden select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        minWidth: 400,
        minHeight: isMinimized ? 'auto' : 350
      }}
    >
      {/* Header dengan drag handle */}
      <div
        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-move drag-handle"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-2 pointer-events-none">
          <Move className="w-4 h-4" />
          <span className="text-sm font-medium">Virtual Keyboard Jepang (Draggable)</span>
          <div className="text-xs opacity-75">
            {size.width}x{size.height}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-6 w-6 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 overflow-auto" style={{ height: size.height - 60 }}>
          <EnhancedVirtualKeyboard onKeyPress={onKeyPress} />
        </div>
      )}

      {/* Resize handles - hanya tampil jika tidak diminimize */}
      {!isMinimized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-3 h-3 bg-blue-500 cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 bg-blue-500 cursor-ne-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 cursor-sw-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-3 right-3 h-2 cursor-n-resize bg-transparent hover:bg-blue-200 dark:hover:bg-blue-700 opacity-0 hover:opacity-50 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-2 cursor-s-resize bg-transparent hover:bg-blue-200 dark:hover:bg-blue-700 opacity-0 hover:opacity-50 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div
            className="absolute top-3 bottom-3 left-0 w-2 cursor-w-resize bg-transparent hover:bg-blue-200 dark:hover:bg-blue-700 opacity-0 hover:opacity-50 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <div
            className="absolute top-3 bottom-3 right-0 w-2 cursor-e-resize bg-transparent hover:bg-blue-200 dark:hover:bg-blue-700 opacity-0 hover:opacity-50 transition-opacity"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
        </>
      )}

      {/* Resize instruction tooltip */}
      {!isMinimized && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Hover pada tepi/sudut untuk resize
        </div>
      )}
    </div>
  )
}

export default DraggableKeyboard
