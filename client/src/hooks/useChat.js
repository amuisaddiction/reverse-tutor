import { useState, useRef, useCallback } from 'react';

/**
 * Priority 2: ANTI-CRASH SPEECH FLOW & Payloads BYPASS
 * Implements native browser MediaRecorder to stream efficient compressed Opus audio.
 */
export const useChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configure with highly compressed opus codec to reduce transmission size by 80%
      // and prevent Vercel 4.5MB request limit crashes.
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/ogg;codecs=opus';

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start(250); // Collect data in 250ms chunks
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone initialization failed:', err);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current.mimeType;
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        
        // Package data dynamically using Blob and FormData vectors
        const formData = new FormData();
        formData.append('audio', audioBlob, 'session-audio.webm');
        
        // Cleanup MediaStream tracks
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        chunksRef.current = [];
        
        resolve(formData);
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};
