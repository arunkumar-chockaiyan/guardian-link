import React, { useEffect, useRef, useState } from 'react';
import { Mic, Video, Send, StopCircle, AlertTriangle } from 'lucide-react';

interface Props {
  onConfirm: (situation: string, stream: MediaStream | null) => void;
  onCancel: () => void;
}

export const IntakeScreen: React.FC<Props> = ({ onConfirm, onCancel }) => {
  const [situation, setSituation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: true 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Camera access failed", err);
        setCameraError(true);
      }
    };
    initCamera();
    
    return () => {
      // Don't stop tracks here, we want to pass them to the next screen
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setSituation(prev => {
            const separator = prev ? ' ' : '';
            return prev + separator + finalTranscript;
          });
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleConfirm = () => {
    onConfirm(situation || "General Emergency", stream);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative">
      {/* Camera Feed Background */}
      <div className="flex-1 relative overflow-hidden flex justify-center bg-black">
        {stream ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 h-full w-full">
            <Video size={48} className="mb-2" />
            <p>Initializing Camera...</p>
            {cameraError && <p className="text-red-500 text-sm">Camera unavailable</p>}
          </div>
        )}
        
        {/* Overlay Instructions */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-2xl font-black text-red-500 flex items-center gap-2">
            <AlertTriangle className="animate-pulse" />
            DESCRIBE EMERGENCY
          </h2>
          <p className="text-slate-300 text-sm mt-1">We are recording. Tell us what is happening.</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 p-4 rounded-t-3xl shadow-2xl z-10 border-t border-slate-700">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Dictate or type here (e.g., 'Chest pain', 'I fell')..."
              className="w-full bg-slate-700 border border-slate-600 rounded-xl p-4 pr-12 text-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-red-500 outline-none resize-none h-24"
            />
            <div className={`absolute top-3 right-3 p-2 rounded-full ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-500'}`}>
              <Mic size={20} />
            </div>
          </div>

          <div className="flex gap-3">
             <button 
              onClick={onCancel}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-[2] bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg shadow-red-900/20 transition-all active:scale-95"
            >
              <Send size={20} />
              SEND ALERT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};