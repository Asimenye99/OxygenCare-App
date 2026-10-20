import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900/90 text-amber-300 px-3.5 py-2 text-xs font-medium shadow-2xl backdrop-blur-md border border-amber-500/30 animate-pulse">
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Offline Mode — Cached hospital asset data is active.</span>
    </div>
  );
};
