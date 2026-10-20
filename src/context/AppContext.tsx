import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Hospital,
  OxygenAsset,
  EngineerProfile,
  MaintenanceRequest,
  WorkOrder,
  ServiceReport,
  AuditLog,
  VerificationStatus,
  WorkOrderStatus,
  FacilityContact,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_HOSPITALS,
  INITIAL_ASSETS,
  INITIAL_ENGINEERS,
  INITIAL_REQUESTS,
  INITIAL_WORK_ORDERS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole;
  hospitals: Hospital[];
  assets: OxygenAsset[];
  engineers: EngineerProfile[];
  requests: MaintenanceRequest[];
  workOrders: WorkOrder[];
  auditLogs: AuditLog[];
  currentHospital: Hospital | null;
  currentEngineer: EngineerProfile | null;
  
  // Auth & Roles
  switchDemoRole: (role: UserRole) => void;
  signIn: (email: string) => boolean;
  signOut: () => void;
  registerHospitalUser: (data: {
    userName: string;
    email: string;
    phone: string;
    facilityName: string;
    facilityType: Hospital['facilityType'];
    ownership: Hospital['ownership'];
    district: string;
    region: Hospital['region'];
    address: string;
    pamContactName: string;
    pamContactTitle: string;
    pamContactPhone: string;
    pamContactEmail: string;
  }) => void;
  registerEngineerUser: (data: {
    userName: string;
    email: string;
    phone: string;
    professionalTitle: string;
    district: string;
    region: EngineerProfile['region'];
    serviceRadiusKm: number;
    qualifications: string;
    trainingInstitution: string;
    graduationYear: number;
    registrationNumber: string;
    experienceYears: number;
    supportedBrands: string[];
    testingInstruments: string[];
  }) => void;

  // Hospital & Asset Register
  addAsset: (asset: Omit<OxygenAsset, 'id' | 'createdAt'>) => void;
  updateAsset: (id: string, updates: Partial<OxygenAsset>) => void;
  deleteAsset: (id: string) => void;
  addFacilityContact: (hospitalId: string, contact: Omit<FacilityContact, 'id'>) => void;
  updateHospitalVerification: (hospitalId: string, status: VerificationStatus, notes?: string) => void;

  // Maintenance Workflow
  createMaintenanceRequest: (req: {
    hospitalId: string;
    assetId: string;
    issueCategory: MaintenanceRequest['issueCategory'];
    symptoms: string;
    startedAt: string;
    urgency: MaintenanceRequest['urgency'];
    backupConfirmed: boolean;
    contactPersonName: string;
    contactPersonPhone: string;
  }) => void;
  assignEngineerToWorkOrder: (
    workOrderId: string,
    engineerId: string,
    scheduledDate: string,
    agreedFeeMWK: number,
    approvedPartsBudgetMWK: number
  ) => void;
  updateWorkOrderStatus: (workOrderId: string, status: WorkOrderStatus, notes?: string) => void;
  submitServiceReport: (
    workOrderId: string,
    reportData: Omit<ServiceReport, 'id' | 'workOrderId' | 'completedAt' | 'reviewStatus' | 'hospitalAcknowledged'>
  ) => void;
  reviewServiceReport: (
    workOrderId: string,
    decision: 'approved' | 'corrections_requested' | 'rejected',
    notes?: string
  ) => void;
  acknowledgeServiceReportByHospital: (workOrderId: string, hospitalNotes?: string) => void;
  markPayoutDisbursed: (workOrderId: string, transactionRef: string) => void;

  // Engineer verification
  updateEngineerVerification: (engineerId: string, status: VerificationStatus, notes?: string) => void;

  // Utilities
  resetToDemoData: () => void;
  logAction: (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => void;
}

const STORAGE_KEYS = {
  USERS: 'oxygencare_users',
  CURRENT_USER_ID: 'oxygencare_current_user_id',
  HOSPITALS: 'oxygencare_hospitals',
  ASSETS: 'oxygencare_assets',
  ENGINEERS: 'oxygencare_engineers',
  REQUESTS: 'oxygencare_requests',
  WORK_ORDERS: 'oxygencare_work_orders',
  AUDIT_LOGS: 'oxygencare_audit_logs',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'usr_hosp_1';
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOSPITALS);
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [assets, setAssets] = useState<OxygenAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [engineers, setEngineers] = useState<EngineerProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENGINEERS);
    return saved ? JSON.parse(saved) : INITIAL_ENGINEERS;
  });

  const [requests, setRequests] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(hospitals));
  }, [hospitals]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENGINEERS, JSON.stringify(engineers));
  }, [engineers]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(workOrders));
  }, [workOrders]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || null;
  const currentRole = currentUser?.role || 'hospital_user';

  const currentHospital = currentUser?.hospitalId
    ? hospitals.find((h) => h.id === currentUser.hospitalId) || null
    : null;

  const currentEngineer = currentUser?.engineerId
    ? engineers.find((e) => e.id === currentUser.engineerId) || null
    : null;

  const logAction = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser?.id || 'sys',
      actorName: currentUser?.name || 'System',
      actorRole: currentRole,
      action,
      entityType,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchDemoRole = (role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUserId(target.id);
    }
  };

  const signIn = (email: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUserId(user.id);
      return true;
    }
    return false;
  };

  const signOut = () => {
    // Return to public landing view or default hospital
    const defaultUser = users.find((u) => u.role === 'hospital_user') || users[0];
    if (defaultUser) setCurrentUserId(defaultUser.id);
  };

  const registerHospitalUser = (data: {
    userName: string;
    email: string;
    phone: string;
    facilityName: string;
    facilityType: Hospital['facilityType'];
    ownership: Hospital['ownership'];
    district: string;
    region: Hospital['region'];
    address: string;
    pamContactName: string;
    pamContactTitle: string;
    pamContactPhone: string;
    pamContactEmail: string;
  }) => {
    const newHospitalId = `hosp_${Date.now()}`;
    const newUserId = `usr_hosp_${Date.now()}`;

    const newContact: FacilityContact = {
      id: `c_${Date.now()}`,
      name: data.pamContactName,
      title: data.pamContactTitle,
      phone: data.pamContactPhone,
      email: data.pamContactEmail,
      isPrimaryPAM: true,
    };

    const newHospital: Hospital = {
      id: newHospitalId,
      name: data.facilityName,
      facilityType: data.facilityType,
      ownership: data.ownership,
      district: data.district,
      region: data.region,
      address: data.address,
      phone: data.phone,
      email: data.email,
      verificationStatus: 'pending',
      contacts: [newContact],
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: newUserId,
      name: data.userName,
      email: data.email,
      phone: data.phone,
      role: 'hospital_user',
      hospitalId: newHospitalId,
      createdAt: new Date().toISOString(),
    };

    setHospitals((prev) => [newHospital, ...prev]);
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUserId);

    logAction('REGISTER_HOSPITAL', 'hospital', newHospitalId, `Hospital "${data.facilityName}" registered and submitted for verification.`);
  };

  const registerEngineerUser = (data: {
    userName: string;
    email: string;
    phone: string;
    professionalTitle: string;
    district: string;
    region: EngineerProfile['region'];
    serviceRadiusKm: number;
    qualifications: string;
    trainingInstitution: string;
    graduationYear: number;
    registrationNumber: string;
    experienceYears: number;
    supportedBrands: string[];
    testingInstruments: string[];
  }) => {
    const newEngineerId = `eng_${Date.now()}`;
    const newUserId = `usr_eng_${Date.now()}`;

    const newEngineer: EngineerProfile = {
      id: newEngineerId,
      userId: newUserId,
      name: data.userName,
      professionalTitle: data.professionalTitle,
      email: data.email,
      phone: data.phone,
      district: data.district,
      region: data.region,
      serviceRadiusKm: data.serviceRadiusKm,
      qualifications: data.qualifications,
      trainingInstitution: data.trainingInstitution,
      graduationYear: data.graduationYear,
      registrationNumber: data.registrationNumber,
      experienceYears: data.experienceYears,
      supportedBrands: data.supportedBrands,
      testingInstruments: data.testingInstruments,
      availability: 'available',
      verificationStatus: 'pending',
      credentialDocName: `${data.userName.replace(/\s+/g, '_')}_Credentials.pdf`,
      completedJobsCount: 0,
      totalEarningsMWK: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: newUserId,
      name: data.userName,
      email: data.email,
      phone: data.phone,
      role: 'engineer',
      engineerId: newEngineerId,
      createdAt: new Date().toISOString(),
    };

    setEngineers((prev) => [newEngineer, ...prev]);
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUserId);

    logAction('REGISTER_ENGINEER', 'engineer', newEngineerId, `Biomedical engineer "${data.userName}" registered and submitted credentials for admin review.`);
  };

  // Hospital & Asset Register methods
  const addAsset = (assetData: Omit<OxygenAsset, 'id' | 'createdAt'>) => {
    const newAsset: OxygenAsset = {
      ...assetData,
      id: `ast_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAssets((prev) => [newAsset, ...prev]);
    logAction('ADD_ASSET', 'asset', newAsset.id, `Added concentrator ${newAsset.assetTag} (${newAsset.manufacturer} ${newAsset.model}) to inventory.`);
  };

  const updateAsset = (id: string, updates: Partial<OxygenAsset>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    logAction('UPDATE_ASSET', 'asset', id, `Updated asset specs / condition.`);
  };

  const deleteAsset = (id: string) => {
    const target = assets.find((a) => a.id === id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
    logAction('DELETE_ASSET', 'asset', id, `Removed asset ${target?.assetTag || id} from registry.`);
  };

  const addFacilityContact = (hospitalId: string, contactData: Omit<FacilityContact, 'id'>) => {
    const newContact: FacilityContact = {
      ...contactData,
      id: `c_${Date.now()}`,
    };
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          return {
            ...h,
            contacts: [...h.contacts, newContact],
          };
        }
        return h;
      })
    );
    logAction('ADD_FACILITY_CONTACT', 'hospital', hospitalId, `Added contact ${contactData.name} (${contactData.title})`);
  };

  const updateHospitalVerification = (hospitalId: string, status: VerificationStatus, notes?: string) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, verificationStatus: status, verificationNotes: notes } : h))
    );
    logAction('VERIFY_HOSPITAL', 'hospital', hospitalId, `Hospital verification changed to ${status}. Notes: ${notes || 'None'}`);
  };

  const updateEngineerVerification = (engineerId: string, status: VerificationStatus, notes?: string) => {
    setEngineers((prev) =>
      prev.map((e) => (e.id === engineerId ? { ...e, verificationStatus: status, verificationNotes: notes } : e))
    );
    logAction('VERIFY_ENGINEER', 'engineer', engineerId, `Engineer verification changed to ${status}. Notes: ${notes || 'None'}`);
  };

  // Maintenance Workflow methods
  const createMaintenanceRequest = (req: {
    hospitalId: string;
    assetId: string;
    issueCategory: MaintenanceRequest['issueCategory'];
    symptoms: string;
    startedAt: string;
    urgency: MaintenanceRequest['urgency'];
    backupConfirmed: boolean;
    contactPersonName: string;
    contactPersonPhone: string;
  }) => {
    const reqCode = `REQ-2026-${String(requests.length + 101).padStart(3, '0')}`;
    const newReqId = `req_${Date.now()}`;
    const newWorkOrderId = `wo_${Date.now()}`;
    const orderNumber = `WO-2026-${String(workOrders.length + 101).padStart(3, '0')}`;

    const newRequest: MaintenanceRequest = {
      ...req,
      id: newReqId,
      requestCode: reqCode,
      status: 'pending_dispatch',
      createdAt: new Date().toISOString(),
    };

    // Automatically initialize linked Work Order in draft/submitted state
    const newWorkOrder: WorkOrder = {
      id: newWorkOrderId,
      orderNumber,
      requestId: newReqId,
      hospitalId: req.hospitalId,
      assetId: req.assetId,
      status: 'submitted',
      agreedFeeMWK: req.urgency === 'safety_critical' ? 65000 : req.urgency === 'urgent' ? 50000 : 40000,
      approvedPartsBudgetMWK: 30000,
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update asset condition to degraded or out of service if not already
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === req.assetId) {
          return {
            ...a,
            condition: req.urgency === 'safety_critical' ? 'out_of_service' : 'degraded',
          };
        }
        return a;
      })
    );

    setRequests((prev) => [newRequest, ...prev]);
    setWorkOrders((prev) => [newWorkOrder, ...prev]);

    logAction('CREATE_REQUEST', 'request', newReqId, `Logged ${req.urgency.toUpperCase()} request ${reqCode}. Work order ${orderNumber} created.`);
  };

  const assignEngineerToWorkOrder = (
    workOrderId: string,
    engineerId: string,
    scheduledDate: string,
    agreedFeeMWK: number,
    approvedPartsBudgetMWK: number
  ) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          return {
            ...wo,
            assignedEngineerId: engineerId,
            scheduledDate,
            agreedFeeMWK,
            approvedPartsBudgetMWK,
            status: 'assigned',
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );

    // Update request status to dispatched
    const wo = workOrders.find((w) => w.id === workOrderId);
    if (wo) {
      setRequests((prev) =>
        prev.map((r) => (r.id === wo.requestId ? { ...r, status: 'dispatched' } : r))
      );
    }

    const assignedEng = engineers.find((e) => e.id === engineerId);
    logAction('ASSIGN_ENGINEER', 'work_order', workOrderId, `Dispatched engineer ${assignedEng?.name || engineerId} for scheduled date ${scheduledDate}.`);
  };

  const updateWorkOrderStatus = (workOrderId: string, status: WorkOrderStatus, notes?: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          return {
            ...wo,
            status,
            notes: notes ? `${wo.notes ? wo.notes + ' | ' : ''}${notes}` : wo.notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );
    logAction('UPDATE_WORK_ORDER_STATUS', 'work_order', workOrderId, `Status updated to ${status}. Notes: ${notes || 'None'}`);
  };

  const submitServiceReport = (
    workOrderId: string,
    reportData: Omit<ServiceReport, 'id' | 'workOrderId' | 'completedAt' | 'reviewStatus' | 'hospitalAcknowledged'>
  ) => {
    const reportId = `rep_${Date.now()}`;
    const newReport: ServiceReport = {
      ...reportData,
      id: reportId,
      workOrderId,
      completedAt: new Date().toISOString(),
      reviewStatus: 'pending_review',
      hospitalAcknowledged: false,
    };

    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          return {
            ...wo,
            status: 'awaiting_review',
            serviceReport: newReport,
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );

    // Update asset condition and next service date
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === reportData.assetId) {
          return {
            ...a,
            condition: reportData.postServiceCondition,
            lastServiceDate: reportData.visitDate,
            nextServiceDue: reportData.nextServiceDate,
            operatingHours: reportData.measurements.operatingHoursCounter || a.operatingHours,
          };
        }
        return a;
      })
    );

    logAction('SUBMIT_SERVICE_REPORT', 'service_report', reportId, `Service report submitted with O2 purity ${reportData.measurements.oxygenPurityPercent}%. Status set to Awaiting Review.`);
  };

  const reviewServiceReport = (
    workOrderId: string,
    decision: 'approved' | 'corrections_requested' | 'rejected',
    notes?: string
  ) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId && wo.serviceReport) {
          const isApproved = decision === 'approved';
          const updatedReport: ServiceReport = {
            ...wo.serviceReport,
            reviewStatus: decision,
            reviewedBy: currentUser?.name || 'Administrator',
            reviewNotes: notes,
          };
          return {
            ...wo,
            status: isApproved ? 'completed' : decision === 'corrections_requested' ? 'in_progress' : 'cancelled',
            paymentStatus: isApproved ? 'approved_for_payout' : wo.paymentStatus,
            serviceReport: updatedReport,
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );

    // If approved, update request to completed and engineer stats
    if (decision === 'approved') {
      const wo = workOrders.find((w) => w.id === workOrderId);
      if (wo) {
        setRequests((prev) =>
          prev.map((r) => (r.id === wo.requestId ? { ...r, status: 'completed' } : r))
        );

        if (wo.assignedEngineerId) {
          setEngineers((prev) =>
            prev.map((e) => {
              if (e.id === wo.assignedEngineerId) {
                return {
                  ...e,
                  completedJobsCount: e.completedJobsCount + 1,
                  totalEarningsMWK: e.totalEarningsMWK + wo.agreedFeeMWK,
                };
              }
              return e;
            })
          );
        }
      }
    }

    logAction('REVIEW_SERVICE_REPORT', 'service_report', workOrderId, `Service report review decision: ${decision.toUpperCase()}. Notes: ${notes || 'None'}`);
  };

  const acknowledgeServiceReportByHospital = (workOrderId: string, hospitalNotes?: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId && wo.serviceReport) {
          return {
            ...wo,
            serviceReport: {
              ...wo.serviceReport,
              hospitalAcknowledged: true,
              hospitalNotes,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );
    logAction('ACKNOWLEDGE_SERVICE_REPORT', 'service_report', workOrderId, `Hospital acknowledged work order completion.`);
  };

  const markPayoutDisbursed = (workOrderId: string, transactionRef: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          return {
            ...wo,
            paymentStatus: 'paid',
            paymentReference: transactionRef,
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );
    logAction('DISBURSE_PAYOUT', 'work_order', workOrderId, `Payout marked as paid. Ref: ${transactionRef}`);
  };

  const resetToDemoData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUserId('usr_hosp_1');
    setHospitals(INITIAL_HOSPITALS);
    setAssets(INITIAL_ASSETS);
    setEngineers(INITIAL_ENGINEERS);
    setRequests(INITIAL_REQUESTS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        hospitals,
        assets,
        engineers,
        requests,
        workOrders,
        auditLogs,
        currentHospital,
        currentEngineer,
        switchDemoRole,
        signIn,
        signOut,
        registerHospitalUser,
        registerEngineerUser,
        addAsset,
        updateAsset,
        deleteAsset,
        addFacilityContact,
        updateHospitalVerification,
        createMaintenanceRequest,
        assignEngineerToWorkOrder,
        updateWorkOrderStatus,
        submitServiceReport,
        reviewServiceReport,
        acknowledgeServiceReportByHospital,
        markPayoutDisbursed,
        updateEngineerVerification,
        resetToDemoData,
        logAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
