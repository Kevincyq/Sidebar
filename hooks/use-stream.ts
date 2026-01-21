import { useState, useCallback, useRef } from "react"

export interface StreamState {
  content: string
  isStreaming: boolean
  error: string | null
}

export interface UseStreamReturn {
  content: string
  isStreaming: boolean
  error: string | null
  startStream: (prompt: string) => Promise<void>
  stopStream: () => void
  reset: () => void
}

/**
 * 模拟流式响应的自定义Hook
 * 使用setInterval模拟打字效果
 * 后续可以轻松替换为真实的fetch SSE调用
 */
export function useStream(): UseStreamReturn {
  const [state, setState] = useState<StreamState>({
    content: "",
    isStreaming: false,
    error: null,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * 模拟流式响应生成
   * 实际使用时，这里应该替换为真实的fetch SSE调用
   */
  const mockStreamResponse = useCallback(
    async (prompt: string): Promise<string> => {
      // 模拟API响应延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 模拟的完整响应文本
      const mockResponse = `这是对"${prompt}"的模拟回答。\n\n在实际应用中，这里会通过Server-Sent Events (SSE)从后端API接收流式数据。\n\n你可以轻松地将此函数替换为真实的fetch调用，例如：\n\n\`\`\`typescript\nconst response = await fetch('/api/stream', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ prompt }),\n})\n\nconst reader = response.body?.getReader()\nconst decoder = new TextDecoder()\n\nwhile (true) {\n  const { done, value } = await reader.read()\n  if (done) break\n  const chunk = decoder.decode(value)\n  // 处理chunk...\n}\n\`\`\``

      return mockResponse
    },
    []
  )

  const startStream = useCallback(
    async (prompt: string) => {
      // 如果已经在流式传输，先停止
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // 创建新的AbortController
      abortControllerRef.current = new AbortController()

      setState({
        content: "",
        isStreaming: true,
        error: null,
      })

      try {
        // 获取完整响应（模拟）
        const fullResponse = await mockStreamResponse(prompt)

        // 检查是否已中止
        if (abortControllerRef.current?.signal.aborted) {
          return
        }

        // 模拟逐字符流式输出
        let currentIndex = 0
        const characters = fullResponse.split("")

        intervalRef.current = setInterval(() => {
          if (abortControllerRef.current?.signal.aborted) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            return
          }

          if (currentIndex < characters.length) {
            setState((prev) => ({
              ...prev,
              content: prev.content + characters[currentIndex],
            }))
            currentIndex++
          } else {
            // 流式传输完成
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setState((prev) => ({
              ...prev,
              isStreaming: false,
            }))
          }
        }, 20) // 每20ms输出一个字符，模拟打字效果
      } catch (error) {
        if (!abortControllerRef.current?.signal.aborted) {
          setState({
            content: "",
            isStreaming: false,
            error: error instanceof Error ? error.message : "未知错误",
          })
        }
      }
    },
    [mockStreamResponse]
  )

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    setState((prev) => ({
      ...prev,
      isStreaming: false,
    }))
  }, [])

  const reset = useCallback(() => {
    stopStream()
    setState({
      content: "",
      isStreaming: false,
      error: null,
    })
  }, [stopStream])

  return {
    content: state.content,
    isStreaming: state.isStreaming,
    error: state.error,
    startStream,
    stopStream,
    reset,
  }
}

