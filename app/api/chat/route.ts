import { NextRequest } from 'next/server'

/**
 * API路由：处理AI聊天请求（使用 Turing 平台）
 * API keys存储在服务器端环境变量中，不会暴露给客户端
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json()

    if (!prompt || !model) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt or model' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 获取 Turing API 配置
    const turingApiKey = process.env.TURING_API_KEY
    const turingApiBase = process.env.TURING_API_BASE

    if (!turingApiKey || !turingApiBase) {
      return new Response(
        JSON.stringify({ error: 'Turing API key or base URL not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 根据模型类型确定 Turing 模型名称
    let turingModel: string
    if (model === 'gpt') {
      turingModel = 'turing/gpt-5.2' // 可以根据需要修改为其他 GPT 模型
    } else if (model === 'gemini') {
      turingModel = 'turing/gemini-3-flash-latest' // 可以根据需要修改为其他 Gemini 模型
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid model' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 调用 Turing API 流式接口
    const response = await fetch(`${turingApiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${turingApiKey}`,
      },
      body: JSON.stringify({
        model: turingModel,
        messages: [
          {
            role: 'system',
            content: '你是一个礼貌的 AI 助手。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Turing API error:', errorText)
      return new Response(
        JSON.stringify({ error: `Turing API error: ${response.statusText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 返回流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.close()
                  return
                }

                try {
                  const json = JSON.parse(data)
                  const content = json.choices?.[0]?.delta?.content
                  if (content) {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
                    )
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

