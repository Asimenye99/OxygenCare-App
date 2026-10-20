import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop install flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition active:scale-95 cursor-pointer"
        title="Install OxygenCare PWA on your device for offline use"
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-teal-700" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                    O₂
                  </div>
                  <h3 className="font-semibold text-slate-900">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                    1
                  </span>
                  <span>
                    Tap the <strong className="text-slate-800">Share</strong> icon <Share2 className="w-4 h-4 inline-block text-blue-600 mx-1" /> in Safari's bottom toolbar.
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong className="text-slate-800">Add to Home Screen</strong> <PlusSquare className="w-4 h-4 inline-block text-slate-700 mx-1" />.
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                    3
                  </span>
                  <span>
                    Confirm <strong className="text-slate-800">Add</strong>. You can now access OxygenCare offline directly from your home screen.
                  </span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Standalone or browser that does not fire prompt yet: show subtle badge
  return (
    <button
      onClick={() => alert("OxygenCare PWA is ready. In your browser's menu (⋮ or Share), tap 'Add to Home Screen' or 'Install App' to install.")}
      className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
      title="PWA Ready"
    >
      <Download className="w-3.5 h-3.5 text-teal-600" />
      <span>Install PWA</span>
    </button>
  );
};
