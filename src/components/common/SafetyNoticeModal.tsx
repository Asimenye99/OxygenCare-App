import React from 'react';
import { ShieldAlert, CheckCircle2, AlertOctagon, X, PhoneCall } from 'lucide-react';

interface SafetyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyNoticeModal: React.FC<SafetyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-100" />
            <div>
              <h3 className="font-bold text-lg">Clinical Safety & Oxygen Protocols</h3>
              <p className="text-xs text-rose-100">Ministry of Health & WHO Guidelines for Malawi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-rose-200 hover:bg-rose-700 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-amber-900 leading-relaxed font-medium">
              <strong>OxygenCare is a maintenance coordination platform</strong>, NOT an emergency oxygen delivery or acute clinical response service.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              Mandatory Hospital Continuity Protocol:
            </h4>
            <ul className="space-y-2 text-slate-600 pl-4 border-l-2 border-teal-200 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Before taking any concentrator offline for servicing, verify an active <strong>backup cylinder manifold or reserve concentrator</strong> is connected to the patient.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Ensure physical asset management (PAM) and nursing staff are briefed on scheduled engineer maintenance windows.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Never operate concentrators without <strong>voltage stabilization (AVR)</strong> in wards prone to ESCOM grid surges.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Biomedical Engineer Safety Standards:
            </h4>
            <ul className="space-y-2 text-slate-600 pl-4 border-l-2 border-rose-200 text-xs sm:text-sm">
              <li>Oxygen purity must be measured using a calibrated ultrasonic analyzer (e.g., Maxtec Handi+); self-reporting without measurement is prohibited.</li>
              <li>A concentrator outputting below 85% O₂ must remain tagged <strong>Out of Service</strong> until zeolite sieve beds or filters are replaced.</li>
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-teal-600" />
              <span>National Oxygen Emergency Coordination</span>
            </div>
            <span className="font-mono font-bold text-slate-800">MoH PAM: +265 1 789 400</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
          >
            I Acknowledge & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
