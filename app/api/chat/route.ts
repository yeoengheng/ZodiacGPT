import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import supabase from '@/lib/supabase/client'
import { encodingForModel } from "js-tiktoken";


import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const length = messages.length

  const embeddingResponse = await openai.embeddings.create({
    model:'text-embedding-ada-002',
    input:messages[length-1].content
  })
  const [{embedding}] = embeddingResponse.data
  const {data:docs} = await supabase.rpc('match_zodiac',{
    query_embedding: embedding,
    match_threshold: 0.78,
    match_count: 10
  })
  const tokenizer = encodingForModel('gpt-3.5-turbo')
  let tokenCount = 0 
  let contentText = ''
  if (docs){
    for (let i = 0; i< docs.length; i++){
      const doc = docs[i]
      const content = doc.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.length

      if (tokenCount> 1500){
        break 
      }
      contentText += `${content.trim()}\n---\n`
    }  
  }

  const SysMessages = [{
    "role": "system", 
    "content": `You are a Chinese Zodiac Fortune Teller. This year is the year of the Wood Dragon.
    Always ask for their Zodiac sign and birth year
    Do apply the given context to enrich your answers: ${contentText}
    `
  }
  ]

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [...SysMessages, ...messages],
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}
