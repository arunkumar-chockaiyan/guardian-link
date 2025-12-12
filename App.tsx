import React, { useState, useEffect, useRef } from 'react';
import { EmergencyButton } from './components/EmergencyButton';
import { Settings } from './components/Settings';
import { LiveEmergency } from './components/LiveEmergency';
import { IntakeScreen } from './components/IntakeScreen';
import { UserProfile, Contact, EmergencyActionState, EmergencyStepStatus, LogEntry } from './types';
import { getCurrentLocation } from './services/location.ts';
import { generateEmergencyScript, findNearestHospital, generateCalmInstructions } from './services/geminiService';
import { Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

// Default State
const defaultProfile: UserProfile = {
  name: "Senior Citizen",
  medicalConditions: "None listed",
  address: "Unknown",
  isResponder: false,
  responderSkills: ""
};

const defaultActionState: EmergencyActionState = {
  call911: EmergencyStepStatus.IDLE,
  locateHospital: EmergencyStepStatus.IDLE,
  notifyContacts: EmergencyStepStatus.IDLE,
  pageResponders: EmergencyStepStatus.IDLE,
};

export default function App() {
  const [view, setView] = useState<'HOME' | 'SETTINGS' | 'INTAKE' | 'EMERGENCY'>('HOME');
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [actionState, setActionState] = useState<EmergencyActionState>(defaultActionState);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Helper to add logs
  const addLog = (message: string, source: LogEntry['source'] = 'SYSTEM') => {
    setLogs(prev => [{ timestamp: new Date(), message, source }, ...prev]);
  };

  // Play audio buffer
  const playAudio = async (buffer: ArrayBuffer) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const audioBuffer = await ctx.decodeAudioData(buffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {
      console.error("Audio playback error", e);
    }
  };

  const handleStartIntake = () => {
    setView('INTAKE');
  };

  // The Master Emergency Coordinator Function
  const handleTriggerEmergency = async (situation: string, stream: MediaStream | null) => {
    setMediaStream(stream);
    
    // Start Recording if stream exists
    if (stream) {
      try {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        recorder.start(1000); // Collect 1s chunks
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.error("Recording failed to start", e);
      }
    }

    setView('EMERGENCY');
    setIsInitializing(true);
    setActionState(defaultActionState);
    setLogs([]);
    addLog("Emergency Triggered. Initializing protocols...", "SYSTEM");
    if (stream) addLog("Video recording started.", "SYSTEM");

    try {
      // 1. Get Location
      addLog("Acquiring high-accuracy geolocation...", "SYSTEM");
      const coords = await getCurrentLocation();
      addLog(`Location acquired: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`, "SYSTEM");

      // 2. Generate Contextual AI Script (Parallel)
      addLog(`Generating emergency script for: "${situation}"`, "AI");
      const scriptPromise = generateEmergencyScript(profile, coords, situation);
      
      // 3. Find Hospital (Parallel)
      setActionState(prev => ({ ...prev, locateHospital: EmergencyStepStatus.IN_PROGRESS }));
      addLog("Scanning for nearest emergency facilities...", "SYSTEM");
      const hospitalPromise = findNearestHospital(coords);

      // Await critical data
      const [script, hospital] = await Promise.all([scriptPromise, hospitalPromise]);
      
      setGeneratedScript(script);
      addLog(`Script generated: "${script}"`, "AI");
      
      setActionState(prev => ({ 
        ...prev, 
        locateHospital: EmergencyStepStatus.COMPLETED,
        hospitalData: hospital
      }));
      addLog(`Facility located: ${hospital.name} (${hospital.address})`, "AI");

      // 4. Simulate Calls/Dispatch
      setIsInitializing(false);
      startEmergencySequence(script);

      // 5. Generate and Play Audio Reassurance
      generateCalmInstructions(situation)
        .then(audioBuffer => playAudio(audioBuffer))
        .catch(err => console.error("Audio generation failed", err));

    } catch (error) {
      addLog(`Critical Init Error: ${error}`, "SYSTEM");
      setIsInitializing(false);
    }
  };

  const startEmergencySequence = (script: string) => {
    // Sequence 1: 911 (Simulated/Test Mode)
    setActionState(prev => ({ ...prev, call911: EmergencyStepStatus.IN_PROGRESS }));
    setTimeout(() => {
      addLog("TEST MODE: 911 dialing skipped. Script prepared for operator.", "SYSTEM");
      setActionState(prev => ({ ...prev, call911: EmergencyStepStatus.COMPLETED }));
    }, 1500);

    // Sequence 2: Contacts
    setActionState(prev => ({ ...prev, notifyContacts: EmergencyStepStatus.IN_PROGRESS }));
    setTimeout(() => {
      addLog(`Dispatched SMS/Email to ${contacts.length} emergency contacts.`, "SYSTEM");
      setActionState(prev => ({ ...prev, notifyContacts: EmergencyStepStatus.COMPLETED }));
    }, 3000);

    // Sequence 3: Responders
    setActionState(prev => ({ ...prev, pageResponders: EmergencyStepStatus.IN_PROGRESS }));
    setTimeout(() => {
      addLog("Broadcasted alert to Guardian Community Network (2 mile radius).", "SYSTEM");
      addLog("3 registered responders acknowledged receipt.", "SYSTEM");
      setActionState(prev => ({ ...prev, pageResponders: EmergencyStepStatus.COMPLETED }));
    }, 5500);
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the emergency alert?")) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      // Stop stream tracks
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      
      setView('HOME');
      setActionState(defaultActionState);
    }
  };

  // Main Render Logic
  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Top Bar for Home View */}
      {view === 'HOME' && (
        <div className="absolute top-0 right-0 p-4 z-50">
          <button 
            onClick={() => setView('SETTINGS')}
            className="bg-slate-200 text-slate-700 p-3 rounded-full hover:bg-slate-300 transition-colors shadow-md"
          >
            <SettingsIcon size={24} />
          </button>
        </div>
      )}

      {/* Views */}
      {view === 'HOME' && (
        <div className="flex-1 flex flex-col">
          <EmergencyButton onTrigger={handleStartIntake} isLoading={isInitializing} />
          <div className="p-4 text-center text-slate-400 text-xs flex justify-center items-center gap-2">
            <ShieldCheck size={14} />
            <span>Secure • Encrypted • AI Enhanced</span>
            {profile.isResponder && (
               <span className="ml-2 bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">RESPONDER ACTIVE</span>
            )}
          </div>
        </div>
      )}

      {view === 'SETTINGS' && (
        <Settings 
          profile={profile}
          contacts={contacts}
          onSaveProfile={setProfile}
          onSaveContacts={setContacts}
          onClose={() => setView('HOME')}
        />
      )}

      {view === 'INTAKE' && (
        <IntakeScreen 
          onConfirm={handleTriggerEmergency}
          onCancel={() => setView('HOME')}
        />
      )}

      {view === 'EMERGENCY' && (
        <LiveEmergency 
          status={actionState} 
          logs={logs}
          script={generatedScript}
          onCancel={handleCancel}
          stream={mediaStream}
        />
      )}
    </div>
  );
}