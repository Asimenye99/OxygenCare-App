import React from 'react';
import {
  Building2,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuthModal: (tab?: 'hospital_reg' | 'engineer_reg' | 'sign_in') => void;
  onOpenSafetyModal: () => void;
  onEnterRole: (role: 'hospital_user' | 'engineer' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuthModal,
  onOpenSafetyModal,
  onEnterRole,
}) => {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>D-Prize Challenge Pilot — Healthcare Equipment Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none">
            Keep oxygen equipment ready when hospitals need it.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            OxygenCare connects Malawian healthcare facilities with accredited biomedical engineering technologists for scheduled preventive maintenance, rapid fault triage, and transparent service records.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
            <button
              onClick={() => onEnterRole('hospital_user')}
              className="px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm shadow-lg hover:bg-teal-400 transition cursor-pointer flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-950" />
              <span>Hospital Console</span>
            </button>

            <button
              onClick={() => onEnterRole('engineer')}
              className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-sm shadow-lg hover:bg-sky-500 transition cursor-pointer flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Biomedical Engineer</span>
            </button>

            <button
              onClick={() => onEnterRole('admin')}
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Admin QA & KPIs</span>
            </button>
          </div>

          <div className="pt-4 flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            <button
              onClick={onOpenSafetyModal}
              className="flex items-center gap-1.5 text-rose-300 hover:text-white underline cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Mandatory Clinical Continuity Protocol</span>
            </button>
            <span>•</span>
            <span>Progressive Web App (PWA) with Offline Cache</span>
          </div>
        </div>
      </section>

      {/* 4-Step Maintenance Workflow */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How OxygenCare Works in Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A closed-loop quality coordination model built around Ministry of Health Physical Asset Management (PAM) standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-black text-teal-700 text-sm mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Asset Register</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Facilities register their oxygen concentrators with asset tag, ward location, AVR stabilizer status, and service history.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-black text-sky-700 text-sm mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Service Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              PAM officers log maintenance requests with symptom descriptions, urgency, and confirmation that patient backup O₂ is in place.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-indigo-700 text-sm mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Accredited Tech</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified engineers with MUST/MUBAS degrees and ultrasonic purity analyzers arrive on site to perform the 10-point PM checklist.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-black text-emerald-700 text-sm mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Report & QA Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The technician submits purity % and pressure logs. National QA reviews the report, the hospital accepts, and payment is disbursed.
            </p>
          </div>
        </div>
      </section>

      {/* Hospital vs Engineer Dual Value Proposition */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">For Healthcare Facilities & PAM Officers</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Full asset inventory of all concentrators with serial numbers and ward locations.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Preventive maintenance reminders before machines degrade below clinical standards.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Direct access to vetted, accredited biomedical technicians without lengthy tender delays.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Verifiable digital service reports with calibrated oxygen purity percentages.</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={() => onEnterRole('hospital_user')}
              className="text-teal-700 font-bold text-xs hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Hospital Asset Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100/70 text-sky-800 flex items-center justify-center font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">For Biomedical Engineers & Technologists</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Consistent, dignified paid work orders near your district base location.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Transparent labour fees and approved spare parts budgets in MWK.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Professional mobile-first digital service reporting tool with WHO checklists.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Guaranteed disbursement upon National QA technical report approval.</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={() => onEnterRole('engineer')}
              className="text-sky-700 font-bold text-xs hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Biomedical Engineer Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* D-Prize Target Goals Banner */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white border border-slate-800">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            D-Prize Distribution Challenge Objectives
          </span>
          <h3 className="text-2xl font-bold text-white">
            Transforming Hospital Oxygen Resilience Across Malawi
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Concentrators frequently break down due to voltage spikes and clogged HEPA filters. By creating an organized maintenance network with local Malawian biomedical graduates, we aim to extend equipment life by 400% at a fraction of the cost of new procurement.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-400">100+</div>
            <div className="text-xs text-slate-400 mt-1">Hospitals by Year 3</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-400">&ge; 90%</div>
            <div className="text-xs text-slate-400 mt-1">Uptime Standard</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-400">&lt; 48 hrs</div>
            <div className="text-xs text-slate-400 mt-1">Response Window</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-400">MWK 47k</div>
            <div className="text-xs text-slate-400 mt-1">Average Service Cost</div>
          </div>
        </div>
      </section>
    </div>
  );
};
