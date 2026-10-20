export type UserRole = 'hospital_user' | 'engineer' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'changes_requested' | 'rejected' | 'suspended';

export type ConcentratorCondition = 'operational' | 'degraded' | 'out_of_service' | 'needs_assessment';

export type RequestUrgency = 'routine' | 'urgent' | 'safety_critical';

export type WorkOrderStatus = 
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'parts_required'
  | 'awaiting_review'
  | 'completed'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  hospitalId?: string; // If role === 'hospital_user'
  engineerId?: string; // If role === 'engineer'
  avatarUrl?: string;
  createdAt: string;
}

export interface FacilityContact {
  id: string;
  name: string;
  title: string; // e.g. "Physical Asset Management (PAM) Officer", "Chief Medical Officer"
  phone: string;
  email: string;
  isPrimaryPAM: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  facilityType: 'central' | 'district' | 'rural_community' | 'mission' | 'private';
  ownership: 'public_moh' | 'mission_chamm' | 'private' | 'ngo';
  district: string; // e.g. "Lilongwe", "Blantyre", "Mzimba", "Zomba", "Salima"
  region: 'Northern' | 'Central' | 'Southern';
  address: string;
  phone: string;
  email: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  contacts: FacilityContact[];
  createdAt: string;
}

export interface OxygenAsset {
  id: string;
  hospitalId: string;
  assetTag: string; // e.g. "KCH-O2-042"
  manufacturer: string; // e.g. "AirSep", "DeVilbiss", "Philips Respironics", "Drive Medical", "Nidek"
  model: string; // e.g. "NewLife Intensity 10", "525DS 5L", "EverFlo 5L", "Nuvo 8"
  serialNumber: string;
  wardLocation: string; // e.g. "Pediatric High Dependency Unit (HDU)", "Maternity Ward", "ICU Room 2"
  condition: ConcentratorCondition;
  hasVoltageProtection: boolean; // Voltage stabilizer / surge protector installed
  hasBackupOxygen: boolean; // Backup cylinder manifold available
  operatingHours?: number;
  lastServiceDate?: string;
  nextServiceDue: string;
  warrantyStatus: 'active' | 'expired' | 'unknown';
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  requestCode: string; // e.g. "REQ-2026-089"
  hospitalId: string;
  assetId: string;
  issueCategory: 
    | 'routine_pm'
    | 'low_purity_alarm'
    | 'compressor_failure'
    | 'unusual_noise'
    | 'power_electrical'
    | 'physical_damage'
    | 'overheating';
  symptoms: string;
  startedAt: string;
  urgency: RequestUrgency;
  backupConfirmed: boolean; // Safety confirmation that clinical backup is active
  contactPersonName: string;
  contactPersonPhone: string;
  status: 'pending_dispatch' | 'dispatched' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ServiceChecklist {
  cabinetPreFilterCleaned: boolean;
  intakeHEPAFilterReplaced: boolean;
  compressorPressureTested: boolean;
  sieveBedsZeoliteChecked: boolean;
  valveManifoldFunctional: boolean;
  coolingFanOperational: boolean;
  voltageStabilizerVerified: boolean;
  alarmBatteryAndBuzzerTested: boolean;
  flowMeterCalibrated: boolean;
  electricalGroundingChecked: boolean;
}

export interface ServiceMeasurements {
  oxygenPurityPercent: number; // e.g. 93.8%
  flowRateLitersPerMin: number; // e.g. 5.0 L/min
  compressorPressurePsi?: number; // e.g. 28.5 psi
  lineVoltageVolts?: number; // e.g. 232 V
  operatingHoursCounter?: number; // e.g. 8420 hrs
}

export interface PartReplaced {
  id: string;
  partName: string; // e.g. "Intake Bacteria Filter HEPA", "Zeolite Sieve Canister Pair"
  partNumber?: string;
  quantity: number;
  unitCostMWK: number;
}

export interface ServiceReport {
  id: string;
  workOrderId: string;
  assetId: string;
  engineerId: string;
  visitDate: string;
  checklist: ServiceChecklist;
  measurements: ServiceMeasurements;
  faultDiagnosis: string;
  actionsTaken: string;
  partsUsed: PartReplaced[];
  postServiceCondition: ConcentratorCondition;
  unresolvedIssues?: string;
  recommendations: string;
  nextServiceDate: string;
  testedWithInstrument: string; // e.g. "Ultrasonic Oxygen Analyzer Maxtec Handi+"
  engineerAttestation: boolean;
  hospitalAcknowledged: boolean;
  hospitalNotes?: string;
  reviewStatus: 'pending_review' | 'approved' | 'corrections_requested' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  completedAt: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string; // e.g. "WO-2026-031"
  requestId: string;
  hospitalId: string;
  assetId: string;
  assignedEngineerId?: string;
  status: WorkOrderStatus;
  scheduledDate?: string;
  agreedFeeMWK: number;
  approvedPartsBudgetMWK: number;
  paymentStatus: 'unpaid' | 'pending_approval' | 'approved_for_payout' | 'paid';
  paymentReference?: string;
  serviceReport?: ServiceReport;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EngineerProfile {
  id: string;
  userId: string;
  name: string;
  professionalTitle: string; // e.g. "Senior Biomedical Engineering Technologist"
  email: string;
  phone: string;
  district: string;
  region: 'Northern' | 'Central' | 'Southern';
  serviceRadiusKm: number;
  qualifications: string; // e.g. "BSc Biomedical Engineering, MUST"
  trainingInstitution: string; // e.g. "Malawi University of Science & Technology (MUST)"
  graduationYear: number;
  registrationNumber: string; // e.g. "MOH-BMET-2021-044"
  experienceYears: number;
  supportedBrands: string[]; // e.g. ["AirSep", "DeVilbiss", "Philips", "Drive"]
  testingInstruments: string[]; // e.g. ["Maxtec Handi+ O2 Analyzer", "Digital Flowmeter", "Fluke Multimeter"]
  availability: 'available' | 'busy' | 'unavailable';
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  credentialDocName?: string;
  completedJobsCount: number;
  totalEarningsMWK: number;
  rating: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'hospital' | 'engineer' | 'asset' | 'request' | 'work_order' | 'service_report';
  entityId: string;
  details: string;
}
