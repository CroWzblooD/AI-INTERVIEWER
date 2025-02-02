'use client';

import { useEffect, useState } from 'react';

export function useWebcam(webcamRef, isEnabled) {
  const [metrics, setMetrics] = useState({
    confidence: 0,
    clarity: 0,
    relevance: 0,
    eyeContact: 0
  });

  // Mock implementation for face detection
  const faceDetection = {
    eyeContactSamples: [],
    getAverageEyeContact: () => {
      return Math.floor(Math.random() * 30) + 70; // Random value between 70-100
    },
    getCurrentMetrics: async () => ({
      eyeContact: Math.floor(Math.random() * 30) + 70,
      faceAlignment: Math.random()
    })
  };

  // Mock implementation for expression analysis
  const expressionAnalysis = {
    confidenceSamples: [],
    getConfidenceScore: () => {
      return Math.floor(Math.random() * 30) + 70; // Random value between 70-100
    },
    getCurrentMetrics: async () => ({
      confidence: Math.random(),
      expressions: {
        neutral: Math.random(),
        happy: Math.random(),
        surprised: Math.random()
      }
    })
  };

  useEffect(() => {
    if (!isEnabled || !webcamRef.current) return;

    // Simulate metrics updates
    const updateInterval = setInterval(() => {
      setMetrics({
        confidence: Math.floor(Math.random() * 30) + 70,
        clarity: Math.floor(Math.random() * 30) + 70,
        relevance: Math.floor(Math.random() * 30) + 70,
        eyeContact: Math.floor(Math.random() * 30) + 70
      });
    }, 2000);

    return () => {
      clearInterval(updateInterval);
    };
  }, [isEnabled, webcamRef]);

  return {
    faceDetection,
    expressionAnalysis,
    metrics
  };
} 