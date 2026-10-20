import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { OxygenAsset, MaintenanceRequest } from '../../types';
import {
  Building2,
  PlusCircle,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Search,
  Filter,
  Zap,
  ShieldAlert,
  FileText,
  UserCheck,
  ChevronRight,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';

interface HospitalDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSafetyModal: () => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  activeTab,
  setActiveTab,
  onOpenSafetyModal,
}) => {
  const {
    currentHospital,
    assets,
    requests,
    workOrders,
    engineers,
    addAsset,
    updateAsset,
    createMaintenanceRequest,
    acknowledgeServiceReportByHospital,
    addFacilityContact,
  } = useApp();

  // Facility-scoped assets and requests
  const facilityAssets = currentHospital
    ? assets.filter((a) => a.hospitalId === currentHospital.id)
    : assets;

  const facilityRequests = currentHospital
    ? requests.filter((r) => r.hospitalId === currentHospital.id)
    : requests;

  const facilityWorkOrders = currentHospital
    ? workOrders.filter((w) => w.hospitalId === currentHospital.id)
    : workOrders;

  // Filter & Search state for Assets
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState('ALL');

  // Modals
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<OxygenAsset | null>(null);
  const [selectedWorkOrderDetail, setSelectedWorkOrderDetail] = useState<string | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  // New Asset Form State
  const [newAssetForm, setNewAssetForm] = useState({
    assetTag: '',
    manufacturer: 'AirSep',
    model: 'NewLife Intensity 10',
    serialNumber: '',
    wardLocation: 'Pediatric Ward',
    condition: 'operational' as OxygenAsset['condition'],
    hasVoltageProtection: true,
    hasBackupOxygen: true,
    operatingHours: 1200,
    nextServiceDue: '2026-06-15',
    warrantyStatus: 'active' as OxygenAsset['warrantyStatus'],
    notes: '',
  });

  // Request Form State
  const [reqForm, setReqForm] = useState({
    assetId: facilityAssets[0]?.id || '',
    issueCategory: 'routine_pm' as MaintenanceRequest['issueCategory'],
    symptoms: '',
    startedAt: new Date().toISOString().split('T')[0],
    urgency: 'routine' as MaintenanceRequest['urgency'],
    backupConfirmed: false,
    contactPersonName: currentHospital?.contacts[0]?.name || 'PAM Officer',
    contactPersonPhone: currentHospital?.contacts[0]?.phone || '+265 999 000 000',
  });
  const [reqSubmittedMsg, setReqSubmittedMsg] = useState('');

  // New Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    title: 'Biomedical Equipment Assistant',
    phone: '',
    email: '',
    isPrimaryPAM: false,
  });

  // Metrics
  const totalAssets = facilityAssets.length;
  const operationalCount = facilityAssets.filter((a) => a.condition === 'operational').length;
  const degradedCount = facilityAssets.filter((a) => a.condition === 'degraded' || a.condition === 'needs_assessment').length;
  const outOfServiceCount = facilityAssets.filter((a) => a.condition === 'out_of_service').length;
  const operationalRate = totalAssets > 0 ? Math.round((operationalCount / totalAssets) * 100) : 0;
  const activeRequestsCount = facilityRequests.filter((r) => r.status !== 'completed').length;

  // Filtered Assets list
  const filteredAssets = facilityAssets.filter((a) => {
    const matchSearch =
      a.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.wardLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand = selectedBrand === 'ALL' || a.manufacturer === selectedBrand;
    const matchStatus = selectedStatus === 'ALL' || a.condition === selectedStatus;
    const matchWard = selectedWard === 'ALL' || a.wardLocation.includes(selectedWard);
    return matchSearch && matchBrand && matchStatus && matchWard;
  });

  // Extract unique brands & wards for filter dropdowns
  const uniqueBrands = Array.from(new Set(facilityAssets.map((a) => a.manufacturer)));
  const uniqueWards = Array.from(new Set(facilityAssets.map((a) => a.wardLocation)));

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHospital) return;
    if (!newAssetForm.assetTag || !newAssetForm.serialNumber) {
      alert('Asset Tag and Serial Number are required.');
      return;
    }
    addAsset({
      ...newAssetForm,
      hospitalId: currentHospital.id,
      operatingHours: Number(newAssetForm.operatingHours) || 0,
    });
    setShowAddAssetModal(false);
    // Reset form
    setNewAssetForm({
      assetTag: '',
      manufacturer: 'AirSep',
      model: 'NewLife Intensity 10',
      serialNumber: '',
      wardLocation: 'Pediatric Ward',
      condition: 'operational',
      hasVoltageProtection: true,
      hasBackupOxygen: true,
      operatingHours: 0,
      nextServiceDue: '2026-06-15',
      warrantyStatus: 'active',
      notes: '',
    });
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHospital) return;
    if (!reqForm.assetId) {
      alert('Please select an oxygen concentrator from your asset register.');
      return;
    }
    if (!reqForm.backupConfirmed) {
      alert('Clinical Safety Protocol: You must confirm that backup oxygen is prepared before submitting a maintenance request.');
      return;
    }

    createMaintenanceRequest({
      hospitalId: currentHospital.id,
      assetId: reqForm.assetId,
      issueCategory: reqForm.issueCategory,
      symptoms: reqForm.symptoms || 'Scheduled preventive maintenance and filter servicing requested.',
      startedAt: reqForm.startedAt,
      urgency: reqForm.urgency,
      backupConfirmed: reqForm.backupConfirmed,
      contactPersonName: reqForm.contactPersonName,
      contactPersonPhone: reqForm.contactPersonPhone,
    });

    setReqSubmittedMsg('Maintenance request successfully dispatched to the OxygenCare network! An admin will assign a verified biomedical engineer.');
    setTimeout(() => {
      setReqSubmittedMsg('');
      setActiveTab('work_orders');
    }, 1800);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHospital || !contactForm.name || !contactForm.phone) return;
    addFacilityContact(currentHospital.id, contactForm);
    setShowAddContactModal(false);
    setContactForm({
      name: '',
      title: 'Biomedical Equipment Assistant',
      phone: '',
      email: '',
      isPrimaryPAM: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hospital Identity Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentHospital?.name || 'Hospital Asset Registry'}
                </h1>
                <StatusBadge type="verification" value={currentHospital?.verificationStatus || 'verified'} />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {currentHospital?.district} District, {currentHospital?.region}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                MoH Facility ID: <span className="font-mono text-slate-700">{currentHospital?.id}</span> | PAM Desk: {currentHospital?.contacts[0]?.name} ({currentHospital?.contacts[0]?.phone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddAssetModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>Register Concentrator</span>
            </button>
            <button
              onClick={() => setActiveTab('request_new')}
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-white" />
              <span>Request Maintenance</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <div className="text-xs font-medium text-slate-500">Registered Concentrators</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalAssets}</div>
            <div className="text-[11px] text-teal-700 font-medium mt-0.5 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Physical Asset Inventory</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-100">
            <div className="text-xs font-medium text-emerald-800">Operational Uptime</div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{operationalRate}%</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{operationalCount} of {totalAssets} machines ready</span>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-100">
            <div className="text-xs font-medium text-amber-800">Needs Service / Degraded</div>
            <div className="text-2xl font-bold text-amber-900 mt-1">{degradedCount}</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Maintenance due soon</span>
            </div>
          </div>

          <div className="bg-rose-50/70 rounded-xl p-3.5 border border-rose-100">
            <div className="text-xs font-medium text-rose-800">Out of Service / Open Jobs</div>
            <div className="text-2xl font-bold text-rose-900 mt-1">{outOfServiceCount}</div>
            <div className="text-[11px] text-rose-700 font-medium mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{activeRequestsCount} active work orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'assets'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Oxygen Concentrators ({facilityAssets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('request_new')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'request_new'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Maintenance Request</span>
        </button>
        <button
          onClick={() => setActiveTab('work_orders')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'work_orders'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Work Orders & Reports ({facilityWorkOrders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pam_contacts')}
          className={`pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'pam_contacts'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>PAM Contacts & Team</span>
        </button>
      </div>

      {/* TAB 1: ASSET REGISTER */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Tag, Model, Ward, Serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-teal-500"
              >
                <option value="ALL">All Brands</option>
                {uniqueBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-teal-500"
              >
                <option value="ALL">All Conditions</option>
                <option value="operational">Operational</option>
                <option value="degraded">Degraded / Needs PM</option>
                <option value="out_of_service">Out of Service</option>
                <option value="needs_assessment">Needs Assessment</option>
              </select>

              {(searchQuery || selectedBrand !== 'ALL' || selectedStatus !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand('ALL');
                    setSelectedStatus('ALL');
                  }}
                  className="text-xs text-teal-600 hover:text-teal-800 font-medium px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Asset List / Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Asset Tag / ID</th>
                    <th className="py-3 px-4">Brand & Model</th>
                    <th className="py-3 px-4">Ward Location</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Safety Protections</th>
                    <th className="py-3 px-4">PM Due Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No oxygen concentrators matched your query.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                          {asset.assetTag}
                          <div className="text-[11px] font-normal text-slate-400 font-mono">
                            SN: {asset.serialNumber}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800">{asset.manufacturer}</span>
                          <span className="text-slate-500 ml-1">{asset.model}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            {asset.wardLocation}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge type="condition" value={asset.condition} />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 text-[11px]">
                            <span className={asset.hasVoltageProtection ? 'text-teal-700 flex items-center gap-1 font-medium' : 'text-slate-400 flex items-center gap-1'}>
                              <Zap className="w-3 h-3" />
                              {asset.hasVoltageProtection ? 'AVR Stabilizer Active' : 'No Stabilizer'}
                            </span>
                            <span className={asset.hasBackupOxygen ? 'text-teal-700 flex items-center gap-1 font-medium' : 'text-rose-600 flex items-center gap-1'}>
                              <CheckCircle2 className="w-3 h-3" />
                              {asset.hasBackupOxygen ? 'Backup O₂ Cylinder Ready' : 'No Backup O₂'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          {asset.nextServiceDue}
                          {asset.lastServiceDate && (
                            <div className="text-[11px] text-slate-400">Last: {asset.lastServiceDate}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedAssetDetail(asset)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-300 transition cursor-pointer"
                              title="View Full Technical Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setReqForm({
                                  ...reqForm,
                                  assetId: asset.id,
                                  urgency: asset.condition === 'out_of_service' ? 'safety_critical' : 'urgent',
                                });
                                setActiveTab('request_new');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Service</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUEST MAINTENANCE FORM */}
      {activeTab === 'request_new' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-teal-600" />
              Dispatch Maintenance Request to Biomedical Technicians
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              OxygenCare will match your equipment fault with qualified, verified biomedical engineers in your district.
            </p>
          </div>

          {reqSubmittedMsg ? (
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
              <h3 className="font-bold text-lg text-teal-900">Maintenance Request Dispatched!</h3>
              <p className="text-sm text-teal-800 max-w-md mx-auto">{reqSubmittedMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleCreateRequest} className="space-y-5 text-xs sm:text-sm">
              {/* Asset Selector */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  1. Select Oxygen Concentrator from Hospital Registry *
                </label>
                <select
                  required
                  value={reqForm.assetId}
                  onChange={(e) => setReqForm({ ...reqForm, assetId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-teal-500 focus:outline-hidden"
                >
                  <option value="">-- Choose an Equipment Asset --</option>
                  {facilityAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      [{asset.assetTag}] {asset.manufacturer} {asset.model} - {asset.wardLocation} ({asset.condition.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1.5">
                    2. Primary Issue Category *
                  </label>
                  <select
                    value={reqForm.issueCategory}
                    onChange={(e) => setReqForm({ ...reqForm, issueCategory: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="routine_pm">Routine 3-Month Preventive Maintenance</option>
                    <option value="low_purity_alarm">Low O2 Purity Warning (&lt; 85% / Amber Light)</option>
                    <option value="compressor_failure">Compressor Failure / No Pressure</option>
                    <option value="unusual_noise">Unusual Humming / Rattling / Air Leak</option>
                    <option value="power_electrical">Power Issue / Cord Damage / Fuse Blown</option>
                    <option value="physical_damage">Physical Casing or Flowmeter Damage</option>
                    <option value="overheating">Overheating / Thermal Cutoff Triggered</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1.5">
                    3. Urgency Level *
                  </label>
                  <select
                    value={reqForm.urgency}
                    onChange={(e) => setReqForm({ ...reqForm, urgency: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-hidden font-medium"
                  >
                    <option value="routine">Routine (Scheduled within 5-7 days)</option>
                    <option value="urgent">Urgent (Needed within 24-48 hours)</option>
                    <option value="safety_critical">Safety-Critical (Ward machine offline - Immediate)</option>
                  </select>
                </div>
              </div>

              {/* Symptoms Description */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  4. Symptoms Observed by Ward Staff & Fault Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe when the alarm triggered, flow rate setting when issue occurs, unusual sounds, or filter condition..."
                  value={reqForm.symptoms}
                  onChange={(e) => setReqForm({ ...reqForm, symptoms: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Mandatory Clinical Safety Protocol Confirmation */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
                      Mandatory Clinical Oxygen Continuity Confirmation
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Taking a concentrator offline must never interrupt oxygen therapy to a dependent patient.
                    </p>
                    <label className="mt-2.5 flex items-center gap-2 cursor-pointer font-medium text-amber-950 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={reqForm.backupConfirmed}
                        onChange={(e) => setReqForm({ ...reqForm, backupConfirmed: e.target.checked })}
                        className="rounded-sm border-amber-400 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                      />
                      <span>
                        I confirm an active backup cylinder manifold or alternate concentrator is available in the ward.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact Confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    On-Site PAM Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={reqForm.contactPersonName}
                    onChange={(e) => setReqForm({ ...reqForm, contactPersonName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Contact Phone (Mobile / WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    value={reqForm.contactPersonPhone}
                    onChange={(e) => setReqForm({ ...reqForm, contactPersonPhone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition cursor-pointer mt-4"
              >
                Submit Maintenance Request to OxygenCare Dispatch
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: WORK ORDERS & SERVICE REPORTS */}
      {activeTab === 'work_orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Facility Maintenance Work Orders</h3>
                <p className="text-xs text-slate-500">Track engineer arrival, progress, and review technical service reports</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {facilityWorkOrders.length} Total Jobs
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {facilityWorkOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No work orders logged yet. Click &quot;Request Maintenance&quot; to schedule a job.
                </div>
              ) : (
                facilityWorkOrders.map((wo) => {
                  const linkedAsset = assets.find((a) => a.id === wo.assetId);
                  const linkedEngineer = engineers.find((e) => e.id === wo.assignedEngineerId);
                  const isSelected = selectedWorkOrderDetail === wo.id;

                  return (
                    <div key={wo.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-slate-900">{wo.orderNumber}</span>
                            <StatusBadge type="work_order" value={wo.status} />
                            {linkedAsset && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {linkedAsset.assetTag} ({linkedAsset.manufacturer} {linkedAsset.model})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            Location: <span className="text-slate-700 font-medium">{linkedAsset?.wardLocation}</span> | Scheduled: {wo.scheduledDate || 'Awaiting scheduling'}
                          </p>
                          <p className="text-xs text-slate-600">
                            Assigned Engineer: {linkedEngineer ? (
                              <span className="font-semibold text-teal-800">{linkedEngineer.name} ({linkedEngineer.phone})</span>
                            ) : (
                              <span className="text-amber-700 italic">Admin Dispatch in Progress</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {wo.serviceReport && (
                            <button
                              onClick={() => setSelectedWorkOrderDetail(isSelected ? null : wo.id)}
                              className="px-3 py-1.5 rounded-lg border border-teal-300 bg-teal-50 text-teal-800 font-semibold text-xs hover:bg-teal-100 transition cursor-pointer flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-teal-600" />
                              <span>{isSelected ? 'Hide Report' : 'View Service Report'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Service Report Detail Card */}
                      {isSelected && wo.serviceReport && (
                        <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/60 rounded-xl p-4 sm:p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <h4 className="font-bold text-slate-900 text-sm">
                                Biomedical Service Report #{wo.serviceReport.id}
                              </h4>
                            </div>
                            <span className="text-xs text-slate-500">
                              Serviced on: {wo.serviceReport.visitDate}
                            </span>
                          </div>

                          {/* Quantitative Measurements */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                            <div>
                              <div className="text-[11px] text-slate-500 font-medium">O₂ Purity Output</div>
                              <div className="text-lg font-bold text-emerald-600">
                                {wo.serviceReport.measurements.oxygenPurityPercent}%
                              </div>
                              <div className="text-[10px] text-slate-400">Spec: &ge; 90%</div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-500 font-medium">Flow Rate Tested</div>
                              <div className="text-lg font-bold text-slate-800">
                                {wo.serviceReport.measurements.flowRateLitersPerMin} L/min
                              </div>
                              <div className="text-[10px] text-slate-400">Calibrated flowmeter</div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-500 font-medium">Compressor Pressure</div>
                              <div className="text-lg font-bold text-slate-800">
                                {wo.serviceReport.measurements.compressorPressurePsi || 28} PSI
                              </div>
                              <div className="text-[10px] text-slate-400">Operating pressure</div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-500 font-medium">Line Voltage</div>
                              <div className="text-lg font-bold text-slate-800">
                                {wo.serviceReport.measurements.lineVoltageVolts || 230} V
                              </div>
                              <div className="text-[10px] text-slate-400">AVR Stabilized</div>
                            </div>
                          </div>

                          {/* Work performed & Diagnosis */}
                          <div className="text-xs space-y-2 text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                            <div>
                              <strong className="text-slate-900">Fault Diagnosis: </strong>
                              {wo.serviceReport.faultDiagnosis}
                            </div>
                            <div>
                              <strong className="text-slate-900">Actions Taken: </strong>
                              {wo.serviceReport.actionsTaken}
                            </div>
                            {wo.serviceReport.partsUsed.length > 0 && (
                              <div>
                                <strong className="text-slate-900">Parts Replaced: </strong>
                                {wo.serviceReport.partsUsed.map((p) => (
                                  <span key={p.id} className="inline-block bg-slate-100 rounded px-1.5 py-0.5 text-[11px] font-mono mr-1">
                                    {p.partName} (Qty {p.quantity})
                                  </span>
                                ))}
                              </div>
                            )}
                            <div>
                              <strong className="text-slate-900">Recommendations: </strong>
                              {wo.serviceReport.recommendations}
                            </div>
                            <div className="pt-1 text-[11px] text-slate-500 italic">
                              Instrument Used: {wo.serviceReport.testedWithInstrument}
                            </div>
                          </div>

                          {/* Hospital Acknowledgment Button */}
                          <div className="flex items-center justify-between pt-2">
                            {wo.serviceReport.hospitalAcknowledged ? (
                              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Accepted & Certified Back Into Service by Facility PAM</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  acknowledgeServiceReportByHospital(
                                    wo.id,
                                    'Verified operational by PAM officer. Concentrator placed back in ward.'
                                  );
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Accept Machine & Acknowledge Service</span>
                              </button>
                            )}

                            <span className="text-[11px] text-slate-400">
                              Reviewed by QA: {wo.serviceReport.reviewedBy || 'Pending Admin QA'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAM FACILITY CONTACTS */}
      {activeTab === 'pam_contacts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Physical Asset Management (PAM) Contacts</h3>
                <p className="text-xs text-slate-500">Authorized hospital staff who coordinate maintenance visits and sign service job cards</p>
              </div>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Contact Person</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentHospital?.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{contact.name}</span>
                      {contact.isPrimaryPAM && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          Primary PAM Desk
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{contact.title}</p>
                    <p className="text-xs text-slate-500 font-mono">{contact.phone} | {contact.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONCENTRATOR */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base">Register Oxygen Concentrator</h3>
              </div>
              <button
                onClick={() => setShowAddAssetModal(false)}
                className="rounded-full p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Asset Tag / Hospital ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KCH-O2-105"
                    value={newAssetForm.assetTag}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, assetTag: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AS-2024-9910"
                    value={newAssetForm.serialNumber}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, serialNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Manufacturer / Brand *</label>
                  <select
                    value={newAssetForm.manufacturer}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, manufacturer: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="AirSep">AirSep</option>
                    <option value="DeVilbiss">DeVilbiss</option>
                    <option value="Philips Respironics">Philips Respironics</option>
                    <option value="Drive Medical">Drive Medical</option>
                    <option value="Caire">Caire</option>
                    <option value="Nidek">Nidek</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Model Name / Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. NewLife Intensity 10L"
                    value={newAssetForm.model}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, model: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ward / Room Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pediatric HDU - Bed 2"
                    value={newAssetForm.wardLocation}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, wardLocation: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Current Condition *</label>
                  <select
                    value={newAssetForm.condition}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, condition: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="operational">Operational</option>
                    <option value="degraded">Degraded / Needs PM</option>
                    <option value="out_of_service">Out of Service</option>
                    <option value="needs_assessment">Needs Assessment</option>
                  </select>
                </div>
              </div>

              {/* Safety Protection Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAssetForm.hasVoltageProtection}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, hasVoltageProtection: e.target.checked })}
                    className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">AVR Voltage Protection</div>
                    <div className="text-[11px] text-slate-500">Connected to surge stabilizer</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAssetForm.hasBackupOxygen}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, hasBackupOxygen: e.target.checked })}
                    className="rounded-sm text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">Backup Cylinder in Ward</div>
                    <div className="text-[11px] text-slate-500">Emergency backup ready</div>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Operating Hours (Meter)</label>
                  <input
                    type="number"
                    min={0}
                    value={newAssetForm.operatingHours}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, operatingHours: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Next Service Due Date</label>
                  <input
                    type="date"
                    value={newAssetForm.nextServiceDue}
                    onChange={(e) => setNewAssetForm({ ...newAssetForm, nextServiceDue: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Equipment Notes / History</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Donor-funded via UNICEF; intake filter requires bi-weekly sponge wash..."
                  value={newAssetForm.notes}
                  onChange={(e) => setNewAssetForm({ ...newAssetForm, notes: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition cursor-pointer shadow-xs"
                >
                  Save to Asset Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSET DETAIL VIEW */}
      {selectedAssetDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-teal-400 font-bold">{selectedAssetDetail.assetTag}</span>
                <h3 className="font-bold text-lg leading-tight">
                  {selectedAssetDetail.manufacturer} {selectedAssetDetail.model}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssetDetail(null)}
                className="rounded-full p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Condition Status:</span>
                <StatusBadge type="condition" value={selectedAssetDetail.condition} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Serial Number:</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedAssetDetail.serialNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Location / Ward:</span>
                  <span className="font-semibold text-slate-900">{selectedAssetDetail.wardLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Operating Meter Hours:</span>
                  <span className="font-semibold text-slate-900">{selectedAssetDetail.operatingHours || 'N/A'} hrs</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Next PM Due:</span>
                  <span className="font-semibold text-slate-900">{selectedAssetDetail.nextServiceDue}</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Zap className="w-3.5 h-3.5 text-teal-600" />
                    Automatic Voltage Regulator (AVR)
                  </span>
                  <span className={`font-semibold ${selectedAssetDetail.hasVoltageProtection ? 'text-teal-700' : 'text-slate-400'}`}>
                    {selectedAssetDetail.hasVoltageProtection ? 'Installed' : 'Missing'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    Backup O₂ Cylinder in Ward
                  </span>
                  <span className={`font-semibold ${selectedAssetDetail.hasBackupOxygen ? 'text-teal-700' : 'text-rose-600'}`}>
                    {selectedAssetDetail.hasBackupOxygen ? 'Confirmed Available' : 'No Backup'}
                  </span>
                </div>
              </div>

              {selectedAssetDetail.notes && (
                <div>
                  <span className="text-slate-400 block text-xs mb-1">Maintenance & Operational Notes:</span>
                  <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 text-xs">
                    {selectedAssetDetail.notes}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedAssetDetail(null);
                    setReqForm({
                      ...reqForm,
                      assetId: selectedAssetDetail.id,
                      urgency: selectedAssetDetail.condition === 'out_of_service' ? 'safety_critical' : 'urgent',
                    });
                    setActiveTab('request_new');
                  }}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition cursor-pointer text-center text-xs"
                >
                  Create Maintenance Request for this Machine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTACT */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Add Facility Contact Person</h3>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="rounded-full p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="p-6 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kondwani Chirwa"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Designation / Ward Role</label>
                <input
                  type="text"
                  placeholder="e.g. ICU Charge Nurse / PAM Technician"
                  value={contactForm.title}
                  onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+265 999 123 456"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="pam@hospital.mw"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition cursor-pointer shadow-xs"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
