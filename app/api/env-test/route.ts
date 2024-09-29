import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Environment variables:', process.env);
  console.log('YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY);

  return NextResponse.json({ 
    envVars: Object.keys(process.env),
    youtubeApiKey: process.env.YOUTUBE_API_KEY ? 'Set' : 'Not set'
  });
}