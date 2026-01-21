import { NextRequest, NextResponse } from 'next/server'

/**
 * API路由：处理AI聊天请求
 * API keys存储在服务器端环境变量中，不会暴露给客户端
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json()

    if (!prompt || !model) {
      return NextResponse.json(
        { error: 'Missing prompt or model' },
        { status: 400 }
      )
    }

    // 根据模型类型获取对应的API key
    let apiKey: string | undefined
    let apiUrl: string

    if (model === 'gpt') {
      apiKey = process.env.GPT_API_KEY
      apiUrl = 'https://api.openai.com/v1/chat/completions'
    } else if (model === 'gemini') {
      apiKey = process.env.GEMINI_API_KEY
      apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    } else {
      return NextResponse.json(
        { error: 'Invalid model' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: `API key for ${model} not configured` },
        { status: 500 }
      )
    }

    // 这里可以添加实际的API调用逻辑
    // 目前返回模拟响应，后续可以替换为真实的API调用
    return NextResponse.json({
      success: true,
      message: `API key configured for ${model}. Actual API call can be implemented here.`,
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

