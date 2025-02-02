import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Note: Gemini doesn't support speech-to-text directly
// You'll need to use Google Cloud Speech-to-Text API instead
// For now, returning a mock response
export async function POST(request) {
  const blob = await request.blob();
  
  // Mock response - you'll need to implement actual speech-to-text
  const answer = "Speech to text transcription is not implemented yet";

  return NextResponse.json({ answer });
}
