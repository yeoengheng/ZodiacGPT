import OpenAI from 'openai'
import supabase from '@/lib/supabase/client'
import { Stream } from 'stream';

// export const runtime = 'edge'

async function extractTextFromFile(file:any) {
  if (!file) {
    throw new Error('No file provided');
  }

  // If the environment supports the text() method
  if (typeof file.text === 'function') {
    return await file.text();
  }

  // Fallback method if file is a readable stream (Node.js)
  let chunk;
  let textValue=''
  while ((chunk = await file.read()) !== null) {
   textValue += chunk;
  }
  }


export async function POST(req: Request) {
  const data = await req.formData();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  try {
    const file = data.get('file')
    if (file){
      const textValue = await extractTextFromFile(file)
      const embeddingResponses = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: textValue
      })
      const [{embedding}] = embeddingResponses.data
      await supabase.from('zodiac').insert({
        content: textValue,
        embedding
      })

    }
    
  } catch (error) {
    console.log(error)
  }
  // try {
  //   if (file && file instanceof File){
  //     console.log('hello')
  //     const textValue = await file.text()
  //     const embeddingResponses = await openai.embeddings.create({
  //       model: 'text-embedding-ada-002',
  //       input: textValue
  //     })
  //     console.log('No file received or not a File instance')
  //     // const [{ embedding }] = embeddingResponses.data
  //     // await supabase.from('zodiac').insert({
  //     //   content: textValue, 
  //     //   embedding,
  //     // })
  //   }
  //   else{console.log('norgibg')}
  // } catch (error) {
  // }

  return Response.json({message:data},{status:200})
}
