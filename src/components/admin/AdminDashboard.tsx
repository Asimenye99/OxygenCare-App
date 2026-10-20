import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { WorkOrder, ServiceReport } from '../../types';
import {
  ShieldCheck,
  Building2,
  Wrench,
  Activity,
  Layers,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  XCircle,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSafetyModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const {
    hospitals,
    engineers,
    assets,
    requests,
    workOrders,
    auditLogs,
    updateHospitalVerification,
    updateEngineerVerification,
    assignEngineerToWorkOrder,
    reviewServiceReport,
    markPayoutDisbursed,
  } = useApp();

  // Dispatch modal state
  const [dispatchWO, setDispatchWO] = useState<WorkOrder | null>(null);
  const [selectedEngineerId, setSelectedEngineerId] = useState(engineers[0]?.id || '');
  const [dispatchScheduledDate, setDispatchScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [dispatchFeeMWK, setDispatchFeeMWK] = useState(50000);
  const [dispatchPartsBudgetMWK, setDispatchPartsBudgetMWK] = useState(30000);

  // QA Review modal state
  const [reviewWO, setReviewWO] = useState<WorkOrder | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'corrections_requested' | 'rejected'>('approved');
  const [reviewNotes, setReviewNotes] = useState('Measurements meet WHO/UNICEF clinical oxygen purity specifications (&ge;90%). Service report approved.');

  // Disbursal modal
  const [disburseWO, setDisburseWO] = useState<WorkOrder | null>(null);
  const [transRef, setTransRef] = useState(`AIRTEL-MO-${Date.now().toString().slice(-6)}`);

  // Impact Calculations (D-Prize KPIs)
  const totalHospitals = hospitals.length;
  const verifiedHospitals = hospitals.filter((h) => h.verificationStatus === 'verified').length;
  const totalAssets = assets.length;
  const operationalAssets = assets.filter((a) => a.condition === 'operational').length;
  const uptimePercent = totalAssets > 0 ? Math.round((operationalAssets / totalAssets) * 100) : 0;
  const totalEngineers = engineers.length;
  const verifiedEngineers = engineers.filter((e) => e.verificationStatus === 'verified').length;
  const completedWorkOrders = workOrders.filter((w) => w.status === 'completed');
  const awaitingReviewWOs = workOrders.filter((w) => w.status === 'awaiting_review');
  const unassignedWOs = workOrders.filter((w) => !w.assignedEngineerId && w.status !== 'completed' && w.status !== 'cancelled');

  // Estimate cost per machine serviced
  const totalSpendMWK = completedWorkOrders.reduce((acc, curr) => acc + curr.agreedFeeMWK, 0);
  const avgCostPerServiceMWK = completedWorkOrders.length > 0 ? Math.round(totalSpendMWK / completedWorkOrders.length) : 47500;

  // CSV Export utility
  const exportToCSV = () => {
    const headers = 'WorkOrder,Hospital,District,AssetTag,Manufacturer,Model,Engineer,Status,FeeMWK,O2PurityPercent\n';
    const rows = workOrders.map((wo) => {
      const h = hospitals.find((hosp) => hosp.id === wo.hospitalId);
      const a = assets.find((ast) => ast.id === wo.assetId);
      const e = engineers.find((eng) => eng.id === wo.assignedEngineerId);
      const purity = wo.serviceReport?.measurements.oxygenPurityPercent || 'N/A';
      return `"${wo.orderNumber}","${h?.name || ''}","${h?.district || ''}","${a?.assetTag || ''}","${a?.manufacturer || ''}","${a?.model || ''}","${e?.name || 'Unassigned'}","${wo.status}","${wo.agreedFeeMWK}","${purity}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `OxygenCare_Malawi_Operational_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchWO || !selectedEngineerId) return;

    assignEngineerToWorkOrder(
      dispatchWO.id,
      selectedEngineerId,
      dispatchScheduledDate,
      Number(dispatchFeeMWK),
      Number(dispatchPartsBudgetMWK)
    );
    setDispatchWO(null);
    alert('Engineer successfully dispatched to facility! Notification recorded.');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewWO) return;

    reviewServiceReport(reviewWO.id, reviewDecision, reviewNotes);
    setReviewWO(null);
    alert(`Service report ${reviewDecision.toUpperCase()}! Updated work order status.`);
  };

  const handleDisburseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disburseWO || !transRef) return;
    markPayoutDisbursed(disburseWO.id, transRef);
    setDisburseWO(null);
    alert(`Payout of MWK ${disburseWO.agreedFeeMWK.toLocaleString()} confirmed and marked as paid!`);
  };

  return (
    <div className="space-y-6">
      {/* Admin Operations Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  National Operations & Quality Assurance Console
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold">
                  D-Prize Pilot Oversight
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Coordination liaison between Ministry of Health PAM units, healthcare facilities, and accredited biomedical engineers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer"
              title="Export operational maintenance dataset to CSV"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('work_orders_board')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Dispatch Board</span>
            </button>
          </div>
        </div>

        {/* 4 D-Prize KPI Impact Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="text-xs font-medium text-slate-500">Facility Network</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {verifiedHospitals} <span className="text-sm font-normal text-slate-500">/ {totalHospitals}</span>
            </div>
            <div className="text-[11px] text-teal-700 font-medium mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span>Verified Health Facilities</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-100">
            <div className="text-xs font-medium text-emerald-800">Operational Uptime</div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{uptimePercent}%</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{operationalAssets} of {totalAssets} concentrators ready</span>
            </div>
          </div>

          <div className="bg-sky-50/70 rounded-xl p-3.5 border border-sky-100">
            <div className="text-xs font-medium text-sky-800">Verified Technicians</div>
            <div className="text-2xl font-bold text-sky-900 mt-1">
              {verifiedEngineers} <span className="text-sm font-normal text-slate-500">/ {totalEngineers}</span>
            </div>
            <div className="text-[11px] text-sky-700 font-medium mt-0.5 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              <span>MUST & MUBAS Accredited</span>
            </div>
          </div>

          <div className="bg-purple-50/70 rounded-xl p-3.5 border border-purple-100">
            <div className="text-xs font-medium text-purple-800">Cost per Concentrator Serviced</div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              MWK {avgCostPerServiceMWK.toLocaleString()}
            </div>
            <div className="text-[11px] text-purple-700 font-medium mt-0.5 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>90% lower than buying new</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>D-Prize Impact Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'verification'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verification Queue ({hospitals.filter((h) => h.verificationStatus === 'pending').length + engineers.filter((e) => e.verificationStatus === 'pending').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('work_orders_board')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'work_orders_board'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dispatch & Work Orders ({workOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('qa_reports')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'qa_reports'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Technical QA Review ({awaitingReviewWOs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('national_assets')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'national_assets'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>National Equipment Registry ({assets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'audit_logs'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: D-PRIZE IMPACT OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Unassigned Maintenance Requests
                </span>
                <span className="font-bold text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  {unassignedWOs.length} Waiting
                </span>
              </div>
              <p className="text-xs text-amber-800 mb-3">
                Facilities have logged requests awaiting engineer dispatch to restore clinical oxygen capacity.
              </p>
              <button
                onClick={() => setActiveTab('work_orders_board')}
                className="text-xs font-semibold text-amber-900 hover:underline"
              >
                Go to Dispatch Board →
              </button>
            </div>

            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Service Reports Requiring QA Audit
                </span>
                <span className="font-bold text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                  {awaitingReviewWOs.length} Pending
                </span>
              </div>
              <p className="text-xs text-purple-800 mb-3">
                Biomedical technicians have submitted purity readings and part replacement logs waiting for sign-off.
              </p>
              <button
                onClick={() => setActiveTab('qa_reports')}
                className="text-xs font-semibold text-purple-900 hover:underline"
              >
                Review Technical Reports →
              </button>
            </div>
          </div>

          {/* Regional Distribution breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Malawi Healthcare Coverage by Region</h3>
            <p className="text-xs text-slate-500 mb-4">Pilot facilities and active oxygen concentrators across Northern, Central, and Southern clusters</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Central Region</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Active Pilot
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Facilities: <strong>2</strong> (Kamuzu Central, Salima District)
                </div>
                <div className="text-xs text-slate-600">
                  Registered Assets: <strong>4</strong> concentrators
                </div>
                <div className="text-xs text-teal-700 font-semibold">
                  Lead Engineer: Kondwani Phiri (MUST)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Southern Region</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Active Pilot
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Facilities: <strong>1</strong> (Queen Elizabeth Central)
                </div>
                <div className="text-xs text-slate-600">
                  Registered Assets: <strong>2</strong> concentrators
                </div>
                <div className="text-xs text-teal-700 font-semibold">
                  Lead Engineer: Grace Chibambo (MUBAS)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Northern Region</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Expansion
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Facilities: <strong>1</strong> (Mzimba District)
                </div>
                <div className="text-xs text-slate-600">
                  Registered Assets: <strong>1</strong> concentrator
                </div>
                <div className="text-xs text-sky-700 font-semibold">
                  Technician: Tione Banda (Under Review)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Section: Hospitals Verification */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Healthcare Facilities Verification</h3>
            <p className="text-xs text-slate-500 mb-4">Validate facility identity, PAM supervisory contact, and public health mandate</p>

            <div className="divide-y divide-slate-100">
              {hospitals.map((hosp) => (
                <div key={hosp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{hosp.name}</span>
                      <StatusBadge type="verification" value={hosp.verificationStatus} />
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {hosp.district} District
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Address: {hosp.address} | Type: {hosp.facilityType.toUpperCase()}
                    </p>
                    <p className="text-slate-500">
                      Primary PAM Contact: <strong className="text-slate-700">{hosp.contacts[0]?.name}</strong> ({hosp.contacts[0]?.title} - {hosp.contacts[0]?.phone})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {hosp.verificationStatus !== 'verified' ? (
                      <button
                        onClick={() => updateHospitalVerification(hosp.id, 'verified', 'Approved by National QA')}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition cursor-pointer"
                      >
                        Verify Facility ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => updateHospitalVerification(hosp.id, 'changes_requested', 'PAM contact phone requires verification')}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs hover:bg-slate-50 transition cursor-pointer"
                      >
                        Request Changes
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Biomedical Engineers Verification */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Biomedical Engineer Accreditation Queue</h3>
            <p className="text-xs text-slate-500 mb-4">Confirm MUST / MUBAS graduation credentials, board registration, and calibrated analyzer possession</p>

            <div className="divide-y divide-slate-100">
              {engineers.map((eng) => (
                <div key={eng.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{eng.name}</span>
                      <StatusBadge type="verification" value={eng.verificationStatus} />
                      <span className="font-mono text-slate-600">Reg: {eng.registrationNumber}</span>
                    </div>
                    <p className="text-slate-700">
                      {eng.qualifications} — {eng.trainingInstitution} ({eng.graduationYear})
                    </p>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>District: {eng.district}</span>
                      <span>Radius: {eng.serviceRadiusKm} km</span>
                      <span className="text-teal-700 font-medium">Doc: {eng.credentialDocName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {eng.verificationStatus !== 'verified' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateEngineerVerification(eng.id, 'verified', 'Degrees and ultrasonic analyzer calibrated')}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition cursor-pointer"
                        >
                          Approve & Verify ✓
                        </button>
                        <button
                          onClick={() => updateEngineerVerification(eng.id, 'changes_requested', 'Please upload calibrated analyzer serial number')}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs hover:bg-slate-50 transition cursor-pointer"
                        >
                          Request Info
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        Accreditation Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WORK ORDERS BOARD & DISPATCH */}
      {activeTab === 'work_orders_board' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">National Work Order Dispatch & Triage</h3>
                <p className="text-xs text-slate-500">Assign verified biomedical technicians, track visit timelines, and monitor job progress</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                {workOrders.length} Total Work Orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Work Order</th>
                    <th className="py-3 px-4">Hospital Facility</th>
                    <th className="py-3 px-4">Concentrator Asset</th>
                    <th className="py-3 px-4">Assigned Engineer</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Labour Fee</th>
                    <th className="py-3 px-4 text-right">Dispatch Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {workOrders.map((wo) => {
                    const hosp = hospitals.find((h) => h.id === wo.hospitalId);
                    const ast = assets.find((a) => a.id === wo.assetId);
                    const eng = engineers.find((e) => e.id === wo.assignedEngineerId);

                    return (
                      <tr key={wo.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {wo.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {hosp?.name}
                          <div className="text-[11px] text-slate-400 font-normal">{hosp?.district}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-medium text-teal-800">{ast?.assetTag}</span>
                          <div className="text-[11px] text-slate-500">{ast?.manufacturer} {ast?.model}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {eng ? (
                            <span className="font-semibold text-sky-800">{eng.name}</span>
                          ) : (
                            <span className="text-amber-700 font-semibold italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge type="work_order" value={wo.status} />
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-800">
                          MWK {wo.agreedFeeMWK.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setDispatchWO(wo);
                                setDispatchFeeMWK(wo.agreedFeeMWK);
                                setDispatchPartsBudgetMWK(wo.approvedPartsBudgetMWK);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-semibold text-xs transition cursor-pointer"
                            >
                              {wo.assignedEngineerId ? 'Reassign' : 'Dispatch'}
                            </button>
                            {wo.serviceReport && (
                              <button
                                onClick={() => {
                                  setReviewWO(wo);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 font-semibold text-xs transition cursor-pointer"
                              >
                                Review QA
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TECHNICAL QA REVIEW & PAYOUTS */}
      {activeTab === 'qa_reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Service Reports & Clinical Compliance Audit</h3>
            <p className="text-xs text-slate-500 mb-4">Inspect measurements, oxygen purity levels, parts used, and authorize disbursements</p>

            <div className="divide-y divide-slate-100">
              {workOrders.filter((w) => w.serviceReport).map((wo) => {
                const rep = wo.serviceReport!;
                const hosp = hospitals.find((h) => h.id === wo.hospitalId);
                const ast = assets.find((a) => a.id === wo.assetId);
                const eng = engineers.find((e) => e.id === wo.assignedEngineerId);

                return (
                  <div key={wo.id} className="py-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{wo.orderNumber}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            Report #{rep.id}
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            rep.reviewStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {rep.reviewStatus === 'approved' ? 'QA Approved' : 'Pending QA Decision'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Facility: <strong>{hosp?.name}</strong> | Machine: {ast?.assetTag} ({ast?.manufacturer} {ast?.model}) | Tech: {eng?.name}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {rep.reviewStatus !== 'approved' ? (
                          <button
                            onClick={() => setReviewWO(wo)}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition cursor-pointer"
                          >
                            Audit & Decide QA
                          </button>
                        ) : wo.paymentStatus !== 'paid' ? (
                          <button
                            onClick={() => setDisburseWO(wo)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                          >
                            Disburse MWK {wo.agreedFeeMWK.toLocaleString()} 💸
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Paid: {wo.paymentReference}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Report Measurements Card */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Oxygen Purity</span>
                        <span className="text-base font-bold text-emerald-700">{rep.measurements.oxygenPurityPercent}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Flow Rate</span>
                        <span className="text-base font-bold text-slate-800">{rep.measurements.flowRateLitersPerMin} L/min</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Testing Instrument</span>
                        <span className="text-slate-800 font-medium">{rep.testedWithInstrument}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Hospital PAM Sign-off</span>
                        <span className={`font-semibold ${rep.hospitalAcknowledged ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {rep.hospitalAcknowledged ? 'Acknowledged' : 'Pending PAM'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div><strong>Diagnosis:</strong> {rep.faultDiagnosis}</div>
                      <div><strong>Actions Taken:</strong> {rep.actionsTaken}</div>
                      {rep.reviewNotes && (
                        <div className="text-indigo-800">
                          <strong>Admin QA Log:</strong> {rep.reviewNotes} (Audited by {rep.reviewedBy})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NATIONAL ASSET REGISTRY */}
      {activeTab === 'national_assets' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">National Oxygen Concentrator Inventory</h3>
            <p className="text-xs text-slate-500 mb-4">Complete registry of healthcare equipment across all participating Malawian hospitals</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Asset Tag</th>
                    <th className="py-3 px-4">Hospital Facility</th>
                    <th className="py-3 px-4">Brand & Model</th>
                    <th className="py-3 px-4">Ward Location</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">AVR Stabilizer</th>
                    <th className="py-3 px-4">Next PM Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {assets.map((asset) => {
                    const hosp = hospitals.find((h) => h.id === asset.hospitalId);
                    return (
                      <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{asset.assetTag}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{hosp?.name} ({hosp?.district})</td>
                        <td className="py-3 px-4">{asset.manufacturer} {asset.model}</td>
                        <td className="py-3 px-4">{asset.wardLocation}</td>
                        <td className="py-3 px-4"><StatusBadge type="condition" value={asset.condition} /></td>
                        <td className="py-3 px-4">
                          <span className={asset.hasVoltageProtection ? 'text-teal-700 font-medium' : 'text-slate-400'}>
                            {asset.hasVoltageProtection ? 'Installed' : 'Missing'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{asset.nextServiceDue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOG */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">System Audit & Compliance Log</h3>
            <p className="text-xs text-slate-500 mb-4">Immutable event trail of verifications, dispatches, status overrides, and disbursements</p>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{log.action}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {log.actorName} ({log.actorRole})
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISPATCH ENGINEER */}
      {dispatchWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-indigo-400 text-xs">{dispatchWO.orderNumber}</span>
                <h3 className="font-bold text-base">Dispatch Biomedical Engineer</h3>
              </div>
              <button onClick={() => setDispatchWO(null)} className="rounded-full p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Accredited Engineer *</label>
                <select
                  required
                  value={selectedEngineerId}
                  onChange={(e) => setSelectedEngineerId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                >
                  {engineers.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} ({eng.district} District) - {eng.qualifications} {eng.verificationStatus === 'verified' ? '✓ Verified' : '⚠ Pending'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Scheduled Visit Date</label>
                <input
                  type="date"
                  required
                  value={dispatchScheduledDate}
                  onChange={(e) => setDispatchScheduledDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Agreed Labour Fee (MWK)</label>
                  <input
                    type="number"
                    step={1000}
                    value={dispatchFeeMWK}
                    onChange={(e) => setDispatchFeeMWK(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Approved Parts Budget (MWK)</label>
                  <input
                    type="number"
                    step={1000}
                    value={dispatchPartsBudgetMWK}
                    onChange={(e) => setDispatchPartsBudgetMWK(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchWO(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer shadow-xs"
                >
                  Dispatch & Notify Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QA REVIEW DECISION */}
      {reviewWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-teal-400 text-xs">{reviewWO.orderNumber}</span>
                <h3 className="font-bold text-base">Technical QA Review & Sign-Off</h3>
              </div>
              <button onClick={() => setReviewWO(null)} className="rounded-full p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-800">
                  Reported O₂ Purity: <span className="text-emerald-700 font-bold">{reviewWO.serviceReport?.measurements.oxygenPurityPercent}%</span> at {reviewWO.serviceReport?.measurements.flowRateLitersPerMin} L/min
                </div>
                <div className="text-slate-600 text-xs mt-1">
                  Tested by: {engineers.find((e) => e.id === reviewWO.assignedEngineerId)?.name} using {reviewWO.serviceReport?.testedWithInstrument}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">QA Decision *</label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-hidden font-semibold"
                >
                  <option value="approved">Approve Report & Release Payout ✓</option>
                  <option value="corrections_requested">Request Corrections / Missing Readings ⚠</option>
                  <option value="rejected">Reject Report (Does not meet clinical specifications) ✕</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Quality Assurance Audit Notes</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewWO(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition cursor-pointer shadow-xs"
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISBURSE PAYOUT */}
      {disburseWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Disburse Technician Payout</h3>
              <button onClick={() => setDisburseWO(null)} className="rounded-full p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDisburseSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-950">
                <div className="text-xs text-emerald-800">Approved Labour Fee</div>
                <div className="text-2xl font-bold font-mono">MWK {disburseWO.agreedFeeMWK.toLocaleString()}</div>
                <div className="text-xs text-emerald-800 mt-1">
                  Payee: {engineers.find((e) => e.id === disburseWO.assignedEngineerId)?.name}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mobile Money / Bank Transaction Reference *</label>
                <input
                  type="text"
                  required
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-hidden font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisburseWO(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                >
                  Confirm Disbursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
