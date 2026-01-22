"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "@/lib/utils"
import type { Components } from "react-markdown"

interface ChatMessageProps {
  content: string
  className?: string
}

export function ChatMessage({ content, className }: ChatMessageProps) {
  return (
    <div className={cn("prose prose-sm max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        components={{
          // 代码块处理
          code(props) {
            const { className, children, ...rest } = props
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""
            const isInline = !match

            return isInline ? (
              <code
                className={cn(
                  "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
                  className
                )}
                {...rest}
              >
                {children}
              </code>
            ) : (
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  className="rounded-md"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            )
          },
          // 预格式化文本处理
          pre(props) {
            const { children, ...rest } = props
            return (
              <div className="overflow-x-auto" {...(rest as any)}>
                {children}
              </div>
            )
          },
          // 段落处理
          p(props) {
            const { children, ...rest } = props
            return <p className="mb-4 last:mb-0" {...(rest as any)}>{children}</p>
          },
          // 列表处理
          ul(props) {
            const { children, ...rest } = props
            return <ul className="mb-4 list-disc pl-6" {...(rest as any)}>{children}</ul>
          },
          ol(props) {
            const { children, ...rest } = props
            return <ol className="mb-4 list-decimal pl-6" {...(rest as any)}>{children}</ol>
          },
          // 标题处理
          h1(props) {
            const { children, ...rest } = props
            return <h1 className="mb-4 text-2xl font-bold" {...(rest as any)}>{children}</h1>
          },
          h2(props) {
            const { children, ...rest } = props
            return <h2 className="mb-3 text-xl font-bold" {...(rest as any)}>{children}</h2>
          },
          h3(props) {
            const { children, ...rest } = props
            return <h3 className="mb-2 text-lg font-semibold" {...(rest as any)}>{children}</h3>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

