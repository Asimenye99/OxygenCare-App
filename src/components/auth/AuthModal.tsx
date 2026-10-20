import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital, EngineerProfile, UserRole } from '../../types';
import {
  Building2,
  Wrench,
  ShieldCheck,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'hospital_reg' | 'engineer_reg' | 'sign_in';
}

const MALAWI_DISTRICTS = [
  'Lilongwe',
  'Blantyre',
  'Mzimba',
  'Zomba',
  'Salima',
  'Kasungu',
  'Mangochi',
  'Dedza',
  'Karonga',
  'Thyolo',
  'Mulanje',
  'Balaka',
  'Chikwawa',
  'Dowa',
  'Mchinji',
  'Nkhotakota',
  'Ntcheu',
  'Rumphi',
];

const O2_BRANDS = ['AirSep', 'DeVilbiss', 'Philips Respironics', 'Drive Medical', 'Caire', 'Nidek'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'sign_in',
}) => {
  const {
    switchDemoRole,
    registerHospitalUser,
    registerEngineerUser,
    signIn,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sign_in' | 'hospital_reg' | 'engineer_reg'>(
    initialTab
  );

  // Hospital form state
  const [hospForm, setHospForm] = useState({
    userName: '',
    email: '',
    phone: '',
    facilityName: '',
    facilityType: 'district' as Hospital['facilityType'],
    ownership: 'public_moh' as Hospital['ownership'],
    district: 'Lilongwe',
    region: 'Central' as Hospital['region'],
    address: '',
    pamContactName: '',
    pamContactTitle: 'Physical Asset Management (PAM) Officer',
    pamContactPhone: '',
    pamContactEmail: '',
  });

  // Engineer form state
  const [engForm, setEngForm] = useState({
    userName: '',
    email: '',
    phone: '',
    professionalTitle: 'Biomedical Engineering Technologist',
    district: 'Lilongwe',
    region: 'Central' as EngineerProfile['region'],
    serviceRadiusKm: 100,
    qualifications: 'BSc Biomedical Engineering, MUST',
    trainingInstitution: 'Malawi University of Science and Technology (MUST)',
    graduationYear: 2022,
    registrationNumber: 'MOH-BMET-2024-089',
    experienceYears: 4,
    supportedBrands: ['AirSep', 'DeVilbiss', 'Philips Respironics'],
    testingInstruments: ['Maxtec Handi+ O2 Analyzer', 'Digital Multimeter'],
  });

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospForm.facilityName || !hospForm.pamContactName || !hospForm.email) {
      alert('Please fill out all required facility and PAM contact fields.');
      return;
    }
    registerHospitalUser(hospForm);
    setSuccessMsg(`Facility "${hospForm.facilityName}" registered successfully! Your account is ready.`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleEngineerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!engForm.userName || !engForm.email || !engForm.registrationNumber) {
      alert('Please fill out all required engineer profile fields.');
      return;
    }
    registerEngineerUser(engForm);
    setSuccessMsg(`Biomedical Engineer "${engForm.userName}" profile submitted! Verification is pending.`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = signIn(loginEmail.trim());
    if (success) {
      onClose();
    } else {
      setLoginError('No registered account found with that email. Use demo accounts below or register.');
    }
  };

  const handleQuickDemoSwitch = (role: UserRole) => {
    switchDemoRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Tabs */}
        <div className="bg-slate-900 px-6 pt-5 pb-0 text-white">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-white text-sm">
                O₂
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">OxygenCare Malawi Access</h3>
                <p className="text-xs text-slate-400">D-Prize Challenge Biomedical Maintenance Network</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab('sign_in')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === 'sign_in'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In & Demo Switch
            </button>
            <button
              onClick={() => setActiveTab('hospital_reg')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hospital_reg'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Register Hospital
            </button>
            <button
              onClick={() => setActiveTab('engineer_reg')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'engineer_reg'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Join as Engineer
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {successMsg && (
            <div className="mb-4 rounded-xl bg-teal-50 border border-teal-200 p-4 text-sm text-teal-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN & QUICK DEMO SWITCH */}
          {activeTab === 'sign_in' && (
            <div className="space-y-6">
              {/* Instant Switcher for evaluators */}
              <div className="rounded-xl bg-gradient-to-br from-teal-50 to-slate-50 border border-teal-200/80 p-4">
                <div className="flex items-center gap-2 mb-2 text-teal-900 font-semibold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Instant Evaluator Roles (Single Click Switch)</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Test the complete platform with preloaded authentic Malawian hospitals, oxygen concentrators, and work orders:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleQuickDemoSwitch('hospital_user')}
                    className="flex flex-col items-start p-3 rounded-lg border border-teal-200 bg-white hover:border-teal-400 hover:shadow-xs transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
                      <Building2 className="w-4 h-4" />
                      Hospital / PAM
                    </div>
                    <span className="font-semibold text-slate-800 text-xs mt-1">Kamuzu Central</span>
                    <span className="text-[11px] text-slate-500">Tiwonge Banda (PAM)</span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoSwitch('engineer')}
                    className="flex flex-col items-start p-3 rounded-lg border border-teal-200 bg-white hover:border-teal-400 hover:shadow-xs transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
                      <Wrench className="w-4 h-4" />
                      Biomed Engineer
                    </div>
                    <span className="font-semibold text-slate-800 text-xs mt-1">Kondwani Phiri</span>
                    <span className="text-[11px] text-slate-500">MUST BEng (Verified)</span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoSwitch('admin')}
                    className="flex flex-col items-start p-3 rounded-lg border border-teal-200 bg-white hover:border-teal-400 hover:shadow-xs transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                      <ShieldCheck className="w-4 h-4" />
                      Admin / QA Lead
                    </div>
                    <span className="font-semibold text-slate-800 text-xs mt-1">Dr. Chisomo Mwale</span>
                    <span className="text-[11px] text-slate-500">National Coordinator</span>
                  </button>
                </div>
              </div>

              {/* Standard Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. pam@kch.health.gov.mw"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                    required
                  />
                  {loginError && <p className="text-xs text-rose-600 mt-1">{loginError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition cursor-pointer"
                >
                  Sign In with Email
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTER HOSPITAL */}
          {activeTab === 'hospital_reg' && (
            <form onSubmit={handleHospitalSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                Registering a healthcare facility creates an asset registry for oxygen concentrators and enables direct maintenance dispatch to verified biomedical technicians.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Facility Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salima District Hospital"
                    value={hospForm.facilityName}
                    onChange={(e) => setHospForm({ ...hospForm, facilityName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Facility Type *</label>
                  <select
                    value={hospForm.facilityType}
                    onChange={(e) => setHospForm({ ...hospForm, facilityType: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="central">Central / Referral Hospital</option>
                    <option value="district">District Hospital</option>
                    <option value="rural_community">Rural Community Hospital</option>
                    <option value="mission">Mission / CHAM Hospital</option>
                    <option value="private">Private Hospital / Clinic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">District *</label>
                  <select
                    value={hospForm.district}
                    onChange={(e) => setHospForm({ ...hospForm, district: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    {MALAWI_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Region *</label>
                  <select
                    value={hospForm.region}
                    onChange={(e) => setHospForm({ ...hospForm, region: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="Central">Central Region</option>
                    <option value="Southern">Southern Region</option>
                    <option value="Northern">Northern Region</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ownership</label>
                  <select
                    value={hospForm.ownership}
                    onChange={(e) => setHospForm({ ...hospForm, ownership: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="public_moh">Ministry of Health (Public)</option>
                    <option value="mission_chamm">CHAM (Christian Health Assoc)</option>
                    <option value="ngo">NGO / Partner Supported</option>
                    <option value="private">Private Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Facility Address / Directions</label>
                <input
                  type="text"
                  placeholder="e.g. Salima Boma, Lakeshore Road near DHO Office"
                  value={hospForm.address}
                  onChange={(e) => setHospForm({ ...hospForm, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              {/* PAM Contact Section */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Physical Asset Management (PAM) Contact Person
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">PAM Officer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatsani Gondwe"
                      value={hospForm.pamContactName}
                      onChange={(e) =>
                        setHospForm({ ...hospForm, pamContactName: e.target.value, userName: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Designation / Title</label>
                    <input
                      type="text"
                      value={hospForm.pamContactTitle}
                      onChange={(e) => setHospForm({ ...hospForm, pamContactTitle: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. pam@salima.health.gov.mw"
                      value={hospForm.email}
                      onChange={(e) =>
                        setHospForm({ ...hospForm, email: e.target.value, pamContactEmail: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Direct Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+265 999 000 000"
                      value={hospForm.phone}
                      onChange={(e) =>
                        setHospForm({ ...hospForm, phone: e.target.value, pamContactPhone: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition cursor-pointer mt-2"
              >
                Register Facility & Open Asset Register
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER ENGINEER */}
          {activeTab === 'engineer_reg' && (
            <form onSubmit={handleEngineerSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                Join the verified biomedical engineering network. Qualified engineers receive work orders, report repairs, and earn guaranteed disbursements in MWK upon QA verification.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name & Postnominals *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emmanuel Chirwa, BEng"
                    value={engForm.userName}
                    onChange={(e) => setEngForm({ ...engForm, userName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={engForm.professionalTitle}
                    onChange={(e) => setEngForm({ ...engForm, professionalTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. e.chirwa@biomed.mw"
                    value={engForm.email}
                    onChange={(e) => setEngForm({ ...engForm, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+265 888 111 222"
                    value={engForm.phone}
                    onChange={(e) => setEngForm({ ...engForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Base District *</label>
                  <select
                    value={engForm.district}
                    onChange={(e) => setEngForm({ ...engForm, district: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  >
                    {MALAWI_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Service Radius (km)</label>
                  <input
                    type="number"
                    min={20}
                    max={300}
                    value={engForm.serviceRadiusKm}
                    onChange={(e) => setEngForm({ ...engForm, serviceRadiusKm: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Years Experience</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={engForm.experienceYears}
                    onChange={(e) => setEngForm({ ...engForm, experienceYears: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Training Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MUST / MUBAS / Poly"
                    value={engForm.trainingInstitution}
                    onChange={(e) => setEngForm({ ...engForm, trainingInstitution: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">MoH / Board Registration # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MOH-BMET-2024-089"
                    value={engForm.registrationNumber}
                    onChange={(e) => setEngForm({ ...engForm, registrationNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Supported Brands</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {O2_BRANDS.map((brand) => {
                    const isSelected = engForm.supportedBrands.includes(brand);
                    return (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => {
                          if (isSelected) {
                            setEngForm({
                              ...engForm,
                              supportedBrands: engForm.supportedBrands.filter((b) => b !== brand),
                            });
                          } else {
                            setEngForm({
                              ...engForm,
                              supportedBrands: [...engForm.supportedBrands, brand],
                            });
                          }
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {brand} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition cursor-pointer mt-2"
              >
                Submit Engineer Profile for Verification
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
