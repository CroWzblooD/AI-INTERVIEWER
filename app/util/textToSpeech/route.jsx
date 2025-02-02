import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Note: Gemini doesn't support text-to-speech directly
// You'll need to use Google Cloud Text-to-Speech API instead
// For now, returning a mock response
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Break long text into sentences for better speech handling
    const sentences = body.text.match(/[^.!?]+[.!?]+/g) || [body.text];
    
    // Create audio using browser's Speech Synthesis with better settings
    const utterance = new SpeechSynthesisUtterance(body.text);
    
    // Wait for voices to load
    if (speechSynthesis.getVoices().length === 0) {
      await new Promise(resolve => {
        speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
      });
    }
    
    utterance.voice = speechSynthesis.getVoices().find(
      voice => voice.name.includes('Google') || voice.name.includes('English')
    );
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    speechSynthesis.speak(utterance);

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return new Response('Text-to-speech failed', { status: 500 });
  }
}
