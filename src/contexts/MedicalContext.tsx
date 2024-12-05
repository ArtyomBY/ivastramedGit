import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  MedicalRecord, 
  LabTest, 
  Prescription, 
  Visit, 
  Patient, 
  Diagnosis, 
  MedicalHistory, 
  VitalSigns, 
  MedicalFile 
} from '../types/medical';

interface MedicalContextType {
  medicalRecords: MedicalRecord[];
  labTests: LabTest[];
  prescriptions: Prescription[];
  visits: Visit[];
  patients: Patient[];
  diagnoses: Diagnosis[];
  medicalHistory: MedicalHistory | null;
  vitalSigns: VitalSigns[];
  files: MedicalFile[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<MedicalRecord>;
  updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
  addLabTest: (test: Omit<LabTest, 'id'>) => Promise<LabTest>;
  updateLabTest: (id: string, test: Partial<LabTest>) => Promise<void>;
  deleteLabTest: (id: string) => Promise<void>;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Promise<Prescription>;
  updatePrescription: (id: string, prescription: Partial<Prescription>) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;
  addVisit: (visit: Omit<Visit, 'id'>) => Promise<Visit>;
  updateVisit: (id: string, visit: Partial<Visit>) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
  addDiagnosis: (diagnosis: Omit<Diagnosis, 'id'>) => Promise<Diagnosis>;
  updateDiagnosis: (id: string, diagnosis: Partial<Diagnosis>) => Promise<void>;
  deleteDiagnosis: (id: string) => Promise<void>;
  updateMedicalHistory: (history: Partial<MedicalHistory>) => Promise<void>;
  addVitalSigns: (signs: Omit<VitalSigns, 'id'>) => Promise<VitalSigns>;
  updateVitalSigns: (id: string, signs: Partial<VitalSigns>) => Promise<void>;
  addFile: (file: Omit<MedicalFile, 'id'>) => Promise<MedicalFile>;
  deleteFile: (id: string) => Promise<void>;
  getPatientRecords: (patientId: string) => {
    records: MedicalRecord[];
    tests: LabTest[];
    prescriptions: Prescription[];
    visits: Visit[];
    diagnoses: Diagnosis[];
    medicalHistory: MedicalHistory | null;
    vitalSigns: VitalSigns[];
    files: MedicalFile[];
  };
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const useMedical = () => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
};

export const MedicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [files, setFiles] = useState<MedicalFile[]>([]);

  const addMedicalRecord = useCallback(async (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMedicalRecords((prev) => [...prev, newRecord]);
    return newRecord;
  }, []);

  const updateMedicalRecord = useCallback(async (id: string, record: Partial<MedicalRecord>) => {
    setMedicalRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...record } : r))
    );
  }, []);

  const deleteMedicalRecord = useCallback(async (id: string) => {
    setMedicalRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addLabTest = useCallback(async (test: Omit<LabTest, 'id'>) => {
    const newTest: LabTest = {
      ...test,
      id: Math.random().toString(36).substr(2, 9),
    };
    setLabTests((prev) => [...prev, newTest]);
    return newTest;
  }, []);

  const updateLabTest = useCallback(async (id: string, test: Partial<LabTest>) => {
    setLabTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...test } : t))
    );
  }, []);

  const deleteLabTest = useCallback(async (id: string) => {
    setLabTests((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addPrescription = useCallback(async (prescription: Omit<Prescription, 'id'>) => {
    const newPrescription: Prescription = {
      ...prescription,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPrescriptions((prev) => [...prev, newPrescription]);
    return newPrescription;
  }, []);

  const updatePrescription = useCallback(async (id: string, prescription: Partial<Prescription>) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...prescription } : p))
    );
  }, []);

  const deletePrescription = useCallback(async (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addVisit = useCallback(async (visit: Omit<Visit, 'id'>) => {
    const newVisit: Visit = {
      ...visit,
      id: Math.random().toString(36).substr(2, 9),
    };
    setVisits((prev) => [...prev, newVisit]);
    return newVisit;
  }, []);

  const updateVisit = useCallback(async (id: string, visit: Partial<Visit>) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...visit } : v))
    );
  }, []);

  const deleteVisit = useCallback(async (id: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const addDiagnosis = useCallback(async (diagnosis: Omit<Diagnosis, 'id'>) => {
    const newDiagnosis: Diagnosis = {
      ...diagnosis,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDiagnoses((prev) => [...prev, newDiagnosis]);
    return newDiagnosis;
  }, []);

  const updateDiagnosis = useCallback(async (id: string, diagnosis: Partial<Diagnosis>) => {
    setDiagnoses((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...diagnosis } : d))
    );
  }, []);

  const deleteDiagnosis = useCallback(async (id: string) => {
    setDiagnoses((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateMedicalHistory = useCallback(async (history: Partial<MedicalHistory>) => {
    setMedicalHistory((prev) => (prev ? { ...prev, ...history } : history as MedicalHistory));
  }, []);

  const addVitalSigns = useCallback(async (signs: Omit<VitalSigns, 'id'>) => {
    const newSigns: VitalSigns = {
      ...signs,
      id: Math.random().toString(36).substr(2, 9),
    };
    setVitalSigns((prev) => [...prev, newSigns]);
    return newSigns;
  }, []);

  const updateVitalSigns = useCallback(async (id: string, signs: Partial<VitalSigns>) => {
    setVitalSigns((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...signs } : s))
    );
  }, []);

  const addFile = useCallback(async (file: Omit<MedicalFile, 'id'>) => {
    const newFile: MedicalFile = {
      ...file,
      id: Math.random().toString(36).substr(2, 9),
    };
    setFiles((prev) => [...prev, newFile]);
    return newFile;
  }, []);

  const deleteFile = useCallback(async (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const getPatientRecords = useCallback(
    (patientId: string) => {
      return {
        records: medicalRecords.filter((r) => r.patientId === patientId),
        tests: labTests.filter((t) => t.patientId === patientId),
        prescriptions: prescriptions.filter((p) => p.patientId === patientId),
        visits: visits.filter((v) => v.patientId === patientId),
        diagnoses: diagnoses.filter((d) => d.patientId === patientId),
        medicalHistory: medicalHistory,
        vitalSigns: vitalSigns.filter((s) => s.patientId === patientId),
        files: files.filter((f) => f.patientId === patientId),
      };
    },
    [
      medicalRecords,
      labTests,
      prescriptions,
      visits,
      diagnoses,
      medicalHistory,
      vitalSigns,
      files,
    ]
  );

  const value = {
    medicalRecords,
    labTests,
    prescriptions,
    visits,
    patients,
    diagnoses,
    medicalHistory,
    vitalSigns,
    files,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    addLabTest,
    updateLabTest,
    deleteLabTest,
    addPrescription,
    updatePrescription,
    deletePrescription,
    addVisit,
    updateVisit,
    deleteVisit,
    addDiagnosis,
    updateDiagnosis,
    deleteDiagnosis,
    updateMedicalHistory,
    addVitalSigns,
    updateVitalSigns,
    addFile,
    deleteFile,
    getPatientRecords,
  };

  return (
    <MedicalContext.Provider value={value}>{children}</MedicalContext.Provider>
  );
};

export default MedicalContext;
