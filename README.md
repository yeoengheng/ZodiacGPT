<a>
  <h1 align="center">Zodiac GPT</h1>
</a>


## Overview
With the 2024 Lunar New Year coming, I thought I try my hand at building a Chinese Zodiac Fortune Teller and get familiar with the RAG implementation. A lot of the features I added are an overkill, but why the hell not (: 

## Original Features

- [Next.js](https://nextjs.org) App Router
- React Server Components (RSCs), Suspense, and Server Actions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming chat UI
- Support for OpenAI (default), Anthropic, Cohere, Hugging Face, or custom AI chat models and/or LangChain
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Radix UI](https://radix-ui.com) for headless component primitives
  - Icons from [Phosphor Icons](https://phosphoricons.com)
- Chat History, rate limiting, and session storage with [Vercel KV](https://vercel.com/storage/kv)
- [NextAuth.js](https://github.com/nextauthjs/next-auth) for authentication

## Changes made 
- Added a RAG Pipeline to utilize external knowledge 
- External knowledge = A bunch of Chinese Zodiac articles vectorized and stored in Supabase
- RAG Pipeline has a rephraser, tokenizer to improve prompt quality.
- Add a knowledge graph to enable better multi-hop retrievals. (In progress)
- Remove the need to have users to login before they can try the bot. Will still gate it tho. (In progress) 
- Better UI/UX (In progress) 
