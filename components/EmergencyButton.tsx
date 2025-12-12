import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  onTrigger: () => void;
  isLoading: boolean;
}

export const EmergencyButton: React.FC<Props> = ({ onTrigger, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2 px-4">
        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2">TEST MODE</div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">GUARDIAN LINK</h1>
        <p className="text-xl text-slate-500 font-medium">Are you in an emergency?</p>
      </div>

      <button
        onClick={onTrigger}
        disabled={isLoading}
        className={`
          relative group
          w-64 h-64 sm:w-80 sm:h-80
          rounded-full
          bg-red-600 hover:bg-red-700
          text-white
          shadow-2xl
          flex flex-col items-center justify-center
          transition-all duration-300
          ${isLoading ? 'opacity-80' : 'emergency-pulse hover:scale-105 active:scale-95'}
        `}
      >
        <div className="absolute inset-0 rounded-full border-8 border-red-500 opacity-30 animate-ping"></div>
        <AlertCircle size={84} strokeWidth={1.5} />
        <span className="text-4xl font-bold mt-2 tracking-widest">HELP</span>
        <span className="text-sm font-semibold opacity-80 mt-1 uppercase tracking-wide">Tap for Assistance</span>
      </button>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md mx-4 rounded-r shadow-sm">
        <p className="text-sm text-yellow-800 font-semibold">
          <span className="font-bold">Note:</span> This app coordinates digital alerts. Always dial 911 directly if possible.
        </p>
      </div>
    </div>
  );
};