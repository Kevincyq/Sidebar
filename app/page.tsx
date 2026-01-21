"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { useStream } from "@/hooks/use-stream"

interface Message {
  id: string
  content: string
  timestamp: Date
}

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

  // 两个模型的流式状态
  const gptStream = useStream()
  const geminiStream = useStream()

  const gptScrollRef = useRef<HTMLDivElement>(null)
  const geminiScrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (gptScrollRef.current) {
      gptScrollRef.current.scrollTop = gptScrollRef.current.scrollHeight
    }
  }, [gptStream.content])

  useEffect(() => {
    if (geminiScrollRef.current) {
      geminiScrollRef.current.scrollTop = geminiScrollRef.current.scrollHeight
    }
  }, [geminiStream.content])

  // 处理发送消息
  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // 同时启动两个模型的流式响应（并发）
    await Promise.all([
      gptStream.startStream(input, 'gpt'),
      geminiStream.startStream(input, 'gemini'),
    ])
  }

  // 处理停止生成
  const handleStop = () => {
    gptStream.stopStream()
    geminiStream.stopStream()
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isGenerating = gptStream.isStreaming || geminiStream.isStreaming

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* 顶部栏 */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-xl font-bold">AI Model Arena</h1>
      </header>

      {/* 主要内容区域 - 上下堆叠布局（适合Sidebar） */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* GPT-5.2 区域 */}
        <div className="flex h-1/2 flex-col border-b">
          <CardHeader className="border-b bg-green-50/50 dark:bg-green-950/20">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              GPT-5.2
            </CardTitle>
          </CardHeader>
          <div
            ref={gptScrollRef}
            className="flex-1 overflow-y-auto p-4"
          >
            <CardContent className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    用户
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    {msg.content}
                  </div>
                </div>
              ))}
              {gptStream.content && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">
                    GPT-5.2
                  </div>
                  <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-950/20">
                    <ChatMessage content={gptStream.content} />
                    {gptStream.isStreaming && (
                      <span className="inline-block h-4 w-1 animate-pulse bg-green-500"></span>
                    )}
                  </div>
                </div>
              )}
              {gptStream.error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  错误: {gptStream.error}
                </div>
              )}
            </CardContent>
          </div>
        </div>

        {/* Gemini 3 Pro 区域 */}
        <div className="flex h-1/2 flex-col">
          <CardHeader className="border-b bg-blue-50/50 dark:bg-blue-950/20">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              Gemini 3 Flash
            </CardTitle>
          </CardHeader>
          <div
            ref={geminiScrollRef}
            className="flex-1 overflow-y-auto p-4"
          >
            <CardContent className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    用户
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    {msg.content}
                  </div>
                </div>
              ))}
              {geminiStream.content && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Gemini 3 Pro
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                    <ChatMessage content={geminiStream.content} />
                    {geminiStream.isStreaming && (
                      <span className="inline-block h-4 w-1 animate-pulse bg-blue-500"></span>
                    )}
                  </div>
                </div>
              )}
              {geminiStream.error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  错误: {geminiStream.error}
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </div>

      {/* 底部输入栏 - 固定位置 */}
      <div className="border-t bg-background p-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题..."
            disabled={isGenerating}
            className="flex-1"
          />
          {isGenerating ? (
            <Button onClick={handleStop} variant="destructive" size="icon">
              <Square className="h-5 w-5" />
              <span className="sr-only">停止生成</span>
            </Button>
          ) : (
            <Button onClick={handleSend} disabled={!input.trim()} size="icon">
              <Send className="h-5 w-5" />
              <span className="sr-only">发送</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

