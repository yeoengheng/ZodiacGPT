import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Set a cookie in a Route Handler
export async function GET(req:NextRequest, res:NextResponse) {
console.log('cookies set')
 const cook = await cookies().set('credit', '5', { /* options */ });
 return Response.json({message:'credits added'},{status:200})
}