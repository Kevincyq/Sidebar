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
  startStream: (prompt: string, model: 'gpt' | 'gemini') => Promise<void>
  stopStream: () => void
  reset: () => void
}

/**
 * 流式响应的自定义Hook
 * 使用 Turing 平台的流式 API
 */
export function useStream(): UseStreamReturn {
  const [state, setState] = useState<StreamState>({
    content: "",
    isStreaming: false,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const startStream = useCallback(
    async (prompt: string, model: 'gpt' | 'gemini') => {
      // 如果已经在流式传输，先停止
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // 创建新的AbortController
      abortControllerRef.current = new AbortController()

      setState({
        content: "",
        isStreaming: true,
        error: null,
      })

      try {
        // 调用后端 API 获取流式响应
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, model }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        // 处理流式响应
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('No response body')
        }

        while (true) {
          // 检查是否已中止
          if (abortControllerRef.current?.signal.aborted) {
            reader.cancel()
            return
          }

          const { done, value } = await reader.read()

          if (done) {
            setState((prev) => ({
              ...prev,
              isStreaming: false,
            }))
            break
          }

          // 解析 SSE 数据
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setState((prev) => ({
                  ...prev,
                  isStreaming: false,
                }))
                return
              }

              try {
                const json = JSON.parse(data)
                if (json.content) {
                  setState((prev) => ({
                    ...prev,
                    content: prev.content + json.content,
                  }))
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
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
    []
  )

  const stopStream = useCallback(() => {
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

