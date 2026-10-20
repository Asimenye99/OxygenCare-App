import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  WorkOrder,
  WorkOrderStatus,
  ServiceChecklist,
  ServiceMeasurements,
  PartReplaced,
  ConcentratorCondition,
} from '../../types';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  Phone,
  CheckSquare,
  Sparkles,
  X,
  Gauge,
  Layers,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface EngineerDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSafetyModal: () => void;
}

export const EngineerDashboard: React.FC<EngineerDashboardProps> = ({
  activeTab,
  setActiveTab,
  onOpenSafetyModal,
}) => {
  const {
    currentEngineer,
    workOrders,
    assets,
    hospitals,
    requests,
    updateWorkOrderStatus,
    submitServiceReport,
  } = useApp();

  // Filter work orders assigned to this engineer
  const myWorkOrders = currentEngineer
    ? workOrders.filter((w) => w.assignedEngineerId === currentEngineer.id)
    : workOrders;

  // Unassigned open work orders in the engineer's district or region
  const availableWorkOrders = workOrders.filter(
    (w) =>
      !w.assignedEngineerId &&
      (w.status === 'submitted' || w.status === 'approved')
  );

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'awaiting_review' | 'completed'>('ALL');
  const [activeReportWO, setActiveReportWO] = useState<WorkOrder | null>(null);

  // Service Report Builder Form State
  const [checklist, setChecklist] = useState<ServiceChecklist>({
    cabinetPreFilterCleaned: true,
    intakeHEPAFilterReplaced: true,
    compressorPressureTested: true,
    sieveBedsZeoliteChecked: true,
    valveManifoldFunctional: true,
    coolingFanOperational: true,
    voltageStabilizerVerified: true,
    alarmBatteryAndBuzzerTested: true,
    flowMeterCalibrated: true,
    electricalGroundingChecked: true,
  });

  const [measurements, setMeasurements] = useState<ServiceMeasurements>({
    oxygenPurityPercent: 94.5,
    flowRateLitersPerMin: 5.0,
    compressorPressurePsi: 28.0,
    lineVoltageVolts: 228,
    operatingHoursCounter: 6540,
  });

  const [faultDiagnosis, setFaultDiagnosis] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [postCondition, setPostCondition] = useState<ConcentratorCondition>('operational');
  const [recommendations, setRecommendations] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('2026-06-15');
  const [testingTool, setTestingTool] = useState('Maxtec Handi+ Ultrasonic Oxygen Analyzer');
  const [engineerAttestation, setEngineerAttestation] = useState(false);

  // Parts used
  const [parts, setParts] = useState<PartReplaced[]>([
    {
      id: 'p1',
      partName: 'Intake HEPA Bacteria Filter Disc',
      partNumber: 'FH-012',
      quantity: 1,
      unitCostMWK: 25000,
    },
  ]);
  const [newPartName, setNewPartName] = useState('');
  const [newPartCost, setNewPartCost] = useState(15000);

  // Metrics
  const activeJobs = myWorkOrders.filter(
    (w) => w.status !== 'completed' && w.status !== 'cancelled'
  ).length;
  const awaitingReviewJobs = myWorkOrders.filter((w) => w.status === 'awaiting_review').length;
  const completedJobs = myWorkOrders.filter((w) => w.status === 'completed').length;
  const totalEarnedMWK = currentEngineer?.totalEarningsMWK || 0;

  // Filtered jobs list
  const filteredMyJobs = myWorkOrders.filter((w) => {
    if (statusFilter === 'active') {
      return w.status === 'assigned' || w.status === 'en_route' || w.status === 'arrived' || w.status === 'in_progress' || w.status === 'parts_required';
    }
    if (statusFilter === 'awaiting_review') return w.status === 'awaiting_review';
    if (statusFilter === 'completed') return w.status === 'completed';
    return true;
  });

  const handleOpenReportModal = (wo: WorkOrder) => {
    setActiveReportWO(wo);
    const linkedAsset = assets.find((a) => a.id === wo.assetId);
    setFaultDiagnosis(`Serviced ${linkedAsset?.manufacturer || 'concentrator'} ${linkedAsset?.model || ''}. Evaluated filter permeability, valve cycling, and purity output.`);
    setActionsTaken('Disassembled cabinet; vacuumed cooling ducts; replaced internal intake HEPA filter; washed foam pre-filter; verified 4-way valve operation; measured O2 concentration across 2L, 5L, and max flow.');
    setRecommendations('Ensure adequate wall clearance in ward. Clean coarse pre-filter weekly with warm water.');
    setMeasurements((prev) => ({
      ...prev,
      operatingHoursCounter: (linkedAsset?.operatingHours || 6000) + 120,
    }));
  };

  const handleAddPart = () => {
    if (!newPartName) return;
    setParts([
      ...parts,
      {
        id: `p_${Date.now()}`,
        partName: newPartName,
        quantity: 1,
        unitCostMWK: Number(newPartCost) || 0,
      },
    ]);
    setNewPartName('');
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReportWO) return;
    if (!engineerAttestation) {
      alert('You must check the attestation box confirming measurements were gathered with a calibrated instrument.');
      return;
    }

    submitServiceReport(activeReportWO.id, {
      assetId: activeReportWO.assetId,
      engineerId: currentEngineer?.id || 'eng_unknown',
      visitDate: new Date().toISOString().split('T')[0],
      checklist,
      measurements,
      faultDiagnosis,
      actionsTaken,
      partsUsed: parts,
      postServiceCondition: postCondition,
      recommendations,
      nextServiceDate,
      testedWithInstrument: testingTool,
      engineerAttestation: true,
    });

    setActiveReportWO(null);
    alert('Service report submitted for National QA Technical Review! Status updated to Awaiting Review.');
  };

  return (
    <div className="space-y-6">
      {/* Engineer Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentEngineer?.name || 'Biomedical Engineer Console'}
                </h1>
                <StatusBadge type="verification" value={currentEngineer?.verificationStatus || 'verified'} />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {currentEngineer?.district} District (Radius: {currentEngineer?.serviceRadiusKm} km)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentEngineer?.professionalTitle} | Reg: <span className="font-mono text-slate-700">{currentEngineer?.registrationNumber}</span> | {currentEngineer?.qualifications}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Verified Earnings</span>
              <span className="text-lg font-bold text-slate-900">
                MWK {totalEarnedMWK.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Unverified Warning if applicable */}
        {currentEngineer?.verificationStatus !== 'verified' && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Account Pending QA Verification: </strong>
              Your biomedical credentials and registration details are currently under review by OxygenCare Operations. You can view available jobs, but cannot accept safety-critical work orders until verified.
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="text-xs font-medium text-slate-500">Active Work Orders</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{activeJobs}</div>
            <div className="text-[11px] text-sky-700 font-medium mt-0.5 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              <span>In service or en route</span>
            </div>
          </div>

          <div className="bg-purple-50/70 rounded-xl p-3.5 border border-purple-100">
            <div className="text-xs font-medium text-purple-800">Awaiting QA Review</div>
            <div className="text-2xl font-bold text-purple-900 mt-1">{awaitingReviewJobs}</div>
            <div className="text-[11px] text-purple-700 font-medium mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Submitted reports</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-100">
            <div className="text-xs font-medium text-emerald-800">Completed Jobs</div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{completedJobs}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified & disbursed</span>
            </div>
          </div>

          <div className="bg-sky-50/70 rounded-xl p-3.5 border border-sky-100">
            <div className="text-xs font-medium text-sky-800">Open Dispatch Board</div>
            <div className="text-2xl font-bold text-sky-900 mt-1">{availableWorkOrders.length}</div>
            <div className="text-[11px] text-sky-700 font-medium mt-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Available in district</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('work_orders')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'work_orders'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>My Assigned Jobs ({myWorkOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('available_jobs')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'available_jobs'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Available Dispatch Queue ({availableWorkOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('service_reports')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'service_reports'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Submitted Reports</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-sky-600 text-sky-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Credentials & Instruments</span>
        </button>
      </div>

      {/* TAB 1: MY ASSIGNED JOBS */}
      {activeTab === 'work_orders' && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                statusFilter === 'ALL'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Jobs ({myWorkOrders.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                statusFilter === 'active'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              In Progress ({activeJobs})
            </button>
            <button
              onClick={() => setStatusFilter('awaiting_review')}
              className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                statusFilter === 'awaiting_review'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Awaiting QA ({awaitingReviewJobs})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                statusFilter === 'completed'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Completed ({completedJobs})
            </button>
          </div>

          {/* Work Orders List */}
          <div className="space-y-3">
            {filteredMyJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                No work orders in this category. Check the Available Dispatch Queue to accept incoming requests.
              </div>
            ) : (
              filteredMyJobs.map((wo) => {
                const linkedHospital = hospitals.find((h) => h.id === wo.hospitalId);
                const linkedAsset = assets.find((a) => a.id === wo.assetId);
                const linkedReq = requests.find((r) => r.id === wo.requestId);

                return (
                  <div
                    key={wo.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-300 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Job Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-slate-900 text-sm">{wo.orderNumber}</span>
                          <StatusBadge type="work_order" value={wo.status} />
                          {linkedReq && (
                            <StatusBadge type="urgency" value={linkedReq.urgency} />
                          )}
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            Fee: MWK {wo.agreedFeeMWK.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                          <div className="flex items-center gap-1 font-semibold text-slate-800">
                            <Building2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>{linkedHospital?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{linkedAsset?.wardLocation}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Scheduled: {wo.scheduledDate || 'Today'}</span>
                          </div>
                        </div>

                        {/* Machine Details & Symptoms */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                          <div className="font-semibold text-slate-800">
                            Target Machine: <span className="font-mono font-bold text-teal-800">{linkedAsset?.assetTag}</span> ({linkedAsset?.manufacturer} {linkedAsset?.model} - SN: {linkedAsset?.serialNumber})
                          </div>
                          {linkedReq?.symptoms && (
                            <p className="mt-1 text-slate-600 italic">
                              &quot;{linkedReq.symptoms}&quot;
                            </p>
                          )}
                          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                            <span>PAM Contact: {linkedReq?.contactPersonName || 'PAM Desk'}</span>
                            <span>Phone: <a href={`tel:${linkedReq?.contactPersonPhone}`} className="text-sky-700 font-mono font-semibold underline">{linkedReq?.contactPersonPhone}</a></span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Progression Controls */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0">
                        {wo.status === 'assigned' && (
                          <button
                            onClick={() => updateWorkOrderStatus(wo.id, 'en_route', 'Technician en route from base')}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-700 transition cursor-pointer"
                          >
                            Mark En Route 🚗
                          </button>
                        )}

                        {wo.status === 'en_route' && (
                          <button
                            onClick={() => updateWorkOrderStatus(wo.id, 'arrived', 'Arrived at facility PAM workshop')}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition cursor-pointer"
                          >
                            Mark Arrived On Site 🏥
                          </button>
                        )}

                        {wo.status === 'arrived' && (
                          <button
                            onClick={() => updateWorkOrderStatus(wo.id, 'in_progress', 'Began disassembly and diagnostic testing')}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition cursor-pointer"
                          >
                            Start Work / Inspection 🔧
                          </button>
                        )}

                        {wo.status === 'in_progress' && (
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => updateWorkOrderStatus(wo.id, 'parts_required', 'Sieve beds saturated; Zeolite canisters required')}
                              className="px-3 py-2 rounded-xl border border-orange-300 bg-orange-50 text-orange-800 font-semibold text-xs hover:bg-orange-100 transition cursor-pointer"
                            >
                              Parts Required
                            </button>
                            <button
                              onClick={() => handleOpenReportModal(wo)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition cursor-pointer shadow-xs flex items-center gap-1.5"
                            >
                              <CheckSquare className="w-4 h-4" />
                              <span>Complete Service Report</span>
                            </button>
                          </div>
                        )}

                        {wo.status === 'parts_required' && (
                          <button
                            onClick={() => handleOpenReportModal(wo)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition cursor-pointer"
                          >
                            Parts Procured & Complete Report
                          </button>
                        )}

                        {wo.status === 'awaiting_review' && (
                          <div className="text-right">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                              Report Submitted — In QA Review
                            </span>
                            <div className="text-[11px] text-slate-400 mt-1">Fee: MWK {wo.agreedFeeMWK.toLocaleString()} (Pending QA)</div>
                          </div>
                        )}

                        {wo.status === 'completed' && (
                          <div className="text-right">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              ✓ Verified by National QA
                            </span>
                            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                              Payment: {wo.paymentStatus === 'paid' ? `Disbursed (${wo.paymentReference})` : 'Approved for Disbursal'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AVAILABLE DISPATCH QUEUE */}
      {activeTab === 'available_jobs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Available Work Orders in Region</h3>
                <p className="text-xs text-slate-500">Unassigned hospital requests ready for dispatch to verified biomedical technicians</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                {availableWorkOrders.length} Open Jobs
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {availableWorkOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  All work orders are currently assigned. Check back shortly for new hospital requests.
                </div>
              ) : (
                availableWorkOrders.map((wo) => {
                  const linkedHospital = hospitals.find((h) => h.id === wo.hospitalId);
                  const linkedAsset = assets.find((a) => a.id === wo.assetId);
                  const linkedReq = requests.find((r) => r.id === wo.requestId);

                  return (
                    <div key={wo.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">{wo.orderNumber}</span>
                          {linkedReq && <StatusBadge type="urgency" value={linkedReq.urgency} />}
                          <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            Labour Fee: MWK {wo.agreedFeeMWK.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-slate-800 font-semibold text-sm">
                          {linkedHospital?.name} — {linkedHospital?.district} District
                        </div>
                        <p className="text-slate-600">
                          Asset: <span className="font-mono font-medium">{linkedAsset?.assetTag}</span> ({linkedAsset?.manufacturer} {linkedAsset?.model}) in {linkedAsset?.wardLocation}
                        </p>
                        {linkedReq?.symptoms && (
                          <p className="text-slate-500 italic">&quot;{linkedReq.symptoms}&quot;</p>
                        )}
                      </div>

                      <div>
                        <button
                          onClick={() => {
                            if (currentEngineer?.verificationStatus !== 'verified') {
                              alert('Your engineer profile must be verified by an administrator before accepting jobs.');
                              return;
                            }
                            updateWorkOrderStatus(wo.id, 'assigned');
                            alert(`You accepted work order ${wo.orderNumber}! Moved to My Assigned Jobs.`);
                            setActiveTab('work_orders');
                          }}
                          className="px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-700 transition cursor-pointer shadow-xs"
                        >
                          Accept & Dispatch Job
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUBMITTED REPORTS */}
      {activeTab === 'service_reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">My Submitted Technical Reports</h3>
            <p className="text-xs text-slate-500 mb-4">Service records audited against WHO and UNICEF biomedical standards</p>

            <div className="divide-y divide-slate-100">
              {myWorkOrders.filter((w) => w.serviceReport).length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No service reports submitted yet. Complete an assigned work order to file a report.
                </div>
              ) : (
                myWorkOrders.filter((w) => w.serviceReport).map((wo) => {
                  const rep = wo.serviceReport!;
                  const linkedAsset = assets.find((a) => a.id === wo.assetId);
                  const linkedHospital = hospitals.find((h) => h.id === wo.hospitalId);

                  return (
                    <div key={wo.id} className="py-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">{wo.orderNumber}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              Report #{rep.id}
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              rep.reviewStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {rep.reviewStatus === 'approved' ? 'QA Approved' : 'Under QA Review'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {linkedHospital?.name} | Asset: {linkedAsset?.assetTag} ({linkedAsset?.model})
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-700 block">
                            Purity: {rep.measurements.oxygenPurityPercent}% at {rep.measurements.flowRateLitersPerMin} L/M
                          </span>
                          <span className="text-[11px] text-slate-400">Tested: {rep.visitDate}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                        <div><strong className="text-slate-900">Diagnosis: </strong>{rep.faultDiagnosis}</div>
                        <div><strong className="text-slate-900">Work Done: </strong>{rep.actionsTaken}</div>
                        <div><strong className="text-slate-900">Next PM: </strong>{rep.nextServiceDate}</div>
                        {rep.reviewNotes && (
                          <div className="text-indigo-800 pt-1">
                            <strong>QA Note: </strong>{rep.reviewNotes} (Reviewed by {rep.reviewedBy})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE & CREDENTIALS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Biomedical Engineer Credentials & Licensing</h3>
              <p className="text-xs text-slate-500">Government and institutional registration documents maintained on file</p>
            </div>
            <StatusBadge type="verification" value={currentEngineer?.verificationStatus || 'verified'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-semibold text-slate-900">Professional Qualifications</div>
              <p className="text-slate-700">{currentEngineer?.qualifications}</p>
              <p className="text-slate-500 text-xs">Institution: {currentEngineer?.trainingInstitution} ({currentEngineer?.graduationYear})</p>
              <p className="text-slate-500 text-xs font-mono">Reg #: {currentEngineer?.registrationNumber}</p>
              <div className="pt-2 text-xs text-teal-700 font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Uploaded: {currentEngineer?.credentialDocName}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-semibold text-slate-900">Calibrated Testing Instruments Owned</div>
              <ul className="space-y-1 text-slate-700 text-xs list-disc pl-4">
                {currentEngineer?.testingInstruments.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
              <div className="pt-2">
                <span className="font-semibold text-slate-900 block mb-1">Supported Brands:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentEngineer?.supportedBrands.map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE REPORT BUILDER MODAL */}
      {activeReportWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-teal-400 font-bold text-xs">{activeReportWO.orderNumber}</span>
                <h3 className="font-bold text-base">Biomedical Technical Service Report</h3>
              </div>
              <button
                onClick={() => setActiveReportWO(null)}
                className="rounded-full p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-6 space-y-5 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
              {/* Section 1: 10-Point Technical Checklist */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-teal-600" />
                  1. Comprehensive 10-Point Maintenance Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.cabinetPreFilterCleaned}
                      onChange={(e) => setChecklist({ ...checklist, cabinetPreFilterCleaned: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Cabinet pre-filter cleaned & dried</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.intakeHEPAFilterReplaced}
                      onChange={(e) => setChecklist({ ...checklist, intakeHEPAFilterReplaced: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Intake HEPA bacteria filter replaced</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.compressorPressureTested}
                      onChange={(e) => setChecklist({ ...checklist, compressorPressureTested: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Compressor output pressure tested</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.sieveBedsZeoliteChecked}
                      onChange={(e) => setChecklist({ ...checklist, sieveBedsZeoliteChecked: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Sieve beds Zeolite dry & inspected</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.valveManifoldFunctional}
                      onChange={(e) => setChecklist({ ...checklist, valveManifoldFunctional: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>4-way valve manifold cycle verified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.coolingFanOperational}
                      onChange={(e) => setChecklist({ ...checklist, coolingFanOperational: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Cooling fan & airflow unobstructed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.voltageStabilizerVerified}
                      onChange={(e) => setChecklist({ ...checklist, voltageStabilizerVerified: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>AVR stabilizer tested at outlet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.alarmBatteryAndBuzzerTested}
                      onChange={(e) => setChecklist({ ...checklist, alarmBatteryAndBuzzerTested: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Power fail buzzer & 9V battery tested</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.flowMeterCalibrated}
                      onChange={(e) => setChecklist({ ...checklist, flowMeterCalibrated: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Flowmeter calibrated & ball floating smoothly</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.electricalGroundingChecked}
                      onChange={(e) => setChecklist({ ...checklist, electricalGroundingChecked: e.target.checked })}
                      className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Earth ground & chassis leakage tested</span>
                  </label>
                </div>
              </div>

              {/* Section 2: Quantitative Measurements */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-teal-600" />
                  2. Quantitative Test Measurements (Calibrated Instrument)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      O₂ Concentration (%) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min={70}
                      max={99.9}
                      value={measurements.oxygenPurityPercent}
                      onChange={(e) => setMeasurements({ ...measurements, oxygenPurityPercent: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-bold text-emerald-700 bg-white focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400">WHO target &ge; 90%</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Test Flow (L/min) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={measurements.flowRateLitersPerMin}
                      onChange={(e) => setMeasurements({ ...measurements, flowRateLitersPerMin: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-bold text-slate-800 bg-white focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400">At standard flow</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Pressure (PSI)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={measurements.compressorPressurePsi || 28}
                      onChange={(e) => setMeasurements({ ...measurements, compressorPressurePsi: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 bg-white focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400">Normal: 24-32 PSI</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Mains Voltage (V)
                    </label>
                    <input
                      type="number"
                      value={measurements.lineVoltageVolts || 230}
                      onChange={(e) => setMeasurements({ ...measurements, lineVoltageVolts: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-800 bg-white focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400">220-240V ESCOM</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Diagnosis & Actions */}
              <div className="space-y-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Fault Diagnosis Observed *</label>
                  <textarea
                    rows={2}
                    required
                    value={faultDiagnosis}
                    onChange={(e) => setFaultDiagnosis(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Actions Taken & Work Performed *</label>
                  <textarea
                    rows={2}
                    required
                    value={actionsTaken}
                    onChange={(e) => setActionsTaken(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Section 4: Parts Replaced */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">3. Parts & Consumables Replaced</h4>
                <div className="space-y-2">
                  {parts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-medium text-slate-800">{p.partName}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-600">MWK {p.unitCostMWK.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePart(p.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add another part (e.g. Sieve Canister Pair)"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-hidden"
                    />
                    <input
                      type="number"
                      placeholder="MWK Cost"
                      value={newPartCost}
                      onChange={(e) => setNewPartCost(Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddPart}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 5: Recommendations & Post condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Post-Service Machine Condition *</label>
                  <select
                    value={postCondition}
                    onChange={(e) => setPostCondition(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-hidden"
                  >
                    <option value="operational">Operational (&ge; 90% O2 Purity)</option>
                    <option value="degraded">Degraded (85-89% O2 - Schedule follow-up)</option>
                    <option value="out_of_service">Out of Service (Failed purity / Sieve bed failed)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Testing Instrument Model *</label>
                  <input
                    type="text"
                    required
                    value={testingTool}
                    onChange={(e) => setTestingTool(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Attestation Checkbox */}
              <div className="rounded-xl bg-teal-50 border border-teal-200 p-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-teal-950 font-medium">
                  <input
                    type="checkbox"
                    required
                    checked={engineerAttestation}
                    onChange={(e) => setEngineerAttestation(e.target.checked)}
                    className="mt-0.5 rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <span>
                    I attest under professional biomedical ethics that the measurements above are truthful, accurate, and gathered using a calibrated oxygen analyzer.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReportWO(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                >
                  Submit Service Report for National QA Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
