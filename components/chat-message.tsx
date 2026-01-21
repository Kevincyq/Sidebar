"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "@/lib/utils"

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
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : ""

            return !inline && match ? (
              <div className="overflow-x-auto">
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  className="rounded-md"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className={cn(
                  "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            )
          },
          // 预格式化文本处理
          pre({ children, ...props }) {
            return (
              <div className="overflow-x-auto" {...props}>
                {children}
              </div>
            )
          },
          // 段落处理
          p({ children, ...props }) {
            return <p className="mb-4 last:mb-0" {...props}>{children}</p>
          },
          // 列表处理
          ul({ children, ...props }) {
            return <ul className="mb-4 list-disc pl-6" {...props}>{children}</ul>
          },
          ol({ children, ...props }) {
            return <ol className="mb-4 list-decimal pl-6" {...props}>{children}</ol>
          },
          // 标题处理
          h1({ children, ...props }) {
            return <h1 className="mb-4 text-2xl font-bold" {...props}>{children}</h1>
          },
          h2({ children, ...props }) {
            return <h2 className="mb-3 text-xl font-bold" {...props}>{children}</h2>
          },
          h3({ children, ...props }) {
            return <h3 className="mb-2 text-lg font-semibold" {...props}>{children}</h3>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

