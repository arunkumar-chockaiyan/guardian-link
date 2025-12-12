import React, { useEffect, useRef } from 'react';
import { EmergencyActionState, EmergencyStepStatus, LogEntry } from '../types';
import { PhoneCall, Ambulance, Users, Radio, CheckCircle2, Loader2, XCircle, Video, Activity } from 'lucide-react';

interface Props {
  status: EmergencyActionState;
  logs: LogEntry[];
  script: string;
  onCancel: () => void;
  stream: MediaStream | null;
}

const StepCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  status: EmergencyStepStatus;
  detail?: string;
  isPrimary?: boolean;
}> = ({ title, icon, status, detail, isPrimary }) => {
  const getStatusColor = () => {
    switch (status) {
      case EmergencyStepStatus.COMPLETED: return 'bg-green-100 border-green-500 text-green-900';
      case EmergencyStepStatus.IN_PROGRESS: return 'bg-blue-50 border-blue-500 text-blue-900';
      case EmergencyStepStatus.FAILED: return 'bg-red-50 border-red-500 text-red-900';
      default: return 'bg-slate-50 border-slate-200 text-slate-400';
    }
  };

  return (
    <div className={`border-l-4 rounded-r-xl p-4 shadow-sm transition-all duration-500 ${getStatusColor()} ${isPrimary ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-white bg-opacity-60`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {detail && <p className="text-sm opacity-80 font-medium mt-1">{detail}</p>}
          </div>
        </div>
        <div className="pt-1">
          {status === EmergencyStepStatus.IN_PROGRESS && <Loader2 className="animate-spin text-blue-600" />}
          {status === EmergencyStepStatus.COMPLETED && <CheckCircle2 className="text-green-600" />}
          {status === EmergencyStepStatus.FAILED && <XCircle className="text-red-600" />}
        </div>
      </div>
    </div>
  );
};

export const LiveEmergency: React.FC<Props> = ({ status, logs, script, onCancel, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 shadow-lg shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <span className="font-black tracking-widest uppercase">Emergency Active (Test)</span>
        </div>
        <button 
          onClick={onCancel}
          className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-50"
        >
          CANCEL ALERT
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Live Video Monitor */}
        {stream && (
          <div className="bg-black rounded-xl overflow-hidden shadow-lg relative h-48 border-2 border-slate-800">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              REC
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-xs">
              <span className="flex items-center gap-1 font-mono"><Activity size={10} /> Live vital monitoring (Simulated)</span>
            </div>
          </div>
        )}

        {/* 4 Key Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StepCard 
            title="911 Logic" 
            icon={<PhoneCall />} 
            status={status.call911} 
            detail="Preparing location script..."
            isPrimary={true}
          />
          <StepCard 
            title="Local Hospital" 
            icon={<Ambulance />} 
            status={status.locateHospital}
            detail={status.hospitalData ? status.hospitalData.name : "Scanning nearby facilities..."} 
          />
          <StepCard 
            title="Notifying Family" 
            icon={<Users />} 
            status={status.notifyContacts}
            detail="Sending automated SMS" 
          />
          <StepCard 
            title="Community Responders" 
            icon={<Radio />} 
            status={status.pageResponders}
            detail="Paging verified volunteers in 2mi radius" 
          />
        </div>

        {/* AI Script Display */}
        {script && (
           <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 ring-2 ring-red-100">
             <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">911 Operator Script (READ THIS)</h4>
             <p className="text-2xl font-bold text-slate-800 leading-snug">"{script}"</p>
             <p className="text-slate-400 text-sm mt-2">Read this exactly to the operator. This info is also sent to contacts.</p>
           </div>
        )}

        {/* Live Logs */}
        <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm h-48 overflow-y-auto shadow-inner">
          <div className="sticky top-0 bg-slate-900 pb-2 mb-2 border-b border-slate-800 font-bold text-slate-500 flex justify-between">
            <span>SYSTEM LOG</span>
            <span className="text-xs animate-pulse">● LIVE</span>
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-500">[{log.timestamp.toLocaleTimeString()}]</span>
                <span className={log.source === 'AI' ? 'text-blue-400' : 'text-green-400'}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};