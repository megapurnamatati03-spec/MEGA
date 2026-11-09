/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  StudentItem,
  ClassItem,
  StaffItem,
  KinerjaGuruItem,
  DailyAttendanceItem,
  HariEfektifItem,
  DeepLearningModuleItem,
  ProtaPromesItem
} from './types';
import {
  loadStudents,
  saveStudents,
  loadClasses,
  saveClasses,
  loadStaff,
  saveStaff,
  loadKinerja,
  saveKinerja,
  loadAttendance,
  saveAttendance,
  loadHariEfektif,
  saveHariEfektif,
  loadModules,
  saveModules,
  loadProtaPromes,
  saveProtaPromes,
  loadAuthSession,
  saveAuthSession,
  AuthSession
} from './utils/storage';

import { Header } from './components/Header';
import { Sidebar, MainNavTab } from './components/Sidebar';
import { AuthModal, ChangePasswordModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { InputDataView } from './components/InputDataView';
import { ClassManagementView } from './components/ClassManagementView';
import { StaffManagementView } from './components/StaffManagementView';
import { AttendanceAgeView } from './components/AttendanceAgeView';
import { TeachingToolsView } from './components/TeachingToolsView';

export default function App() {
  // Authentication State
  const [auth, setAuth] = useState<AuthSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // App Navigation & Responsive Menu
  const [activeTab, setActiveTab] = useState<MainNavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [kinerja, setKinerja] = useState<KinerjaGuruItem[]>([]);
  const [attendance, setAttendance] = useState<DailyAttendanceItem[]>([]);
  const [hariEfektif, setHariEfektif] = useState<HariEfektifItem[]>([]);
  const [modules, setModules] = useState<DeepLearningModuleItem[]>([]);
  const [protaPromes, setProtaPromes] = useState<ProtaPromesItem[]>([]);

  // Initialize and load persistent data from LocalStorage
  const refreshAllData = () => {
    const loadedStudents = loadStudents();
    const loadedClasses = loadClasses();
    const loadedStaff = loadStaff();
    const loadedKinerja = loadKinerja();
    const loadedAttendance = loadAttendance();
    const loadedHariEfektif = loadHariEfektif();
    const loadedModules = loadModules();
    const loadedProtaPromes = loadProtaPromes();

    setStudents(loadedStudents);
    setClasses(loadedClasses);
    setStaff(loadedStaff);
    setKinerja(loadedKinerja);
    setAttendance(loadedAttendance);
    setHariEfektif(loadedHariEfektif);
    setModules(loadedModules);
    setProtaPromes(loadedProtaPromes);
  };

  useEffect(() => {
    refreshAllData();
    const savedAuth = loadAuthSession();
    if (savedAuth && savedAuth.isLoggedIn) {
      setAuth(savedAuth);
    } else {
      setIsAuthModalOpen(true);
    }
  }, []);

  // Handlers for Authentication
  const handleLoginSuccess = (session: AuthSession) => {
    setAuth(session);
    saveAuthSession(session);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setAuth(null);
    saveAuthSession(null);
    setIsAuthModalOpen(true);
  };

  // --- DATA MUTATION HANDLERS ---
  
  // 1. Classes
  const handleAddClass = (newCls: ClassItem) => {
    const updated = [...classes, newCls];
    setClasses(updated);
    saveClasses(updated);
  };

  const handleAddClassesBatch = (newClasses: ClassItem[]) => {
    const updated = [...classes, ...newClasses];
    setClasses(updated);
    saveClasses(updated);
  };

  const handleUpdateClassWali = (classId: string, waliKelasId: string, waliKelasNama: string) => {
    const updated = classes.map(c =>
      c.id === classId ? { ...c, waliKelasId, waliKelasNama } : c
    );
    setClasses(updated);
    saveClasses(updated);
  };

  // 2. Students (Strict NISN Unique Check)
  const handleAddStudent = (std: StudentItem): boolean => {
    const exists = students.some(s => s.nisn.toLowerCase() === std.nisn.toLowerCase());
    if (exists) return false;

    const updated = [std, ...students];
    setStudents(updated);
    saveStudents(updated);
    return true;
  };

  const handleAddStudentsBatch = (newStudents: StudentItem[]) => {
    const duplicates: string[] = [];
    const validToAdd: StudentItem[] = [];
    const existingNisns = new Set(students.map(s => s.nisn.toLowerCase()));

    for (const st of newStudents) {
      const lower = st.nisn.toLowerCase();
      if (existingNisns.has(lower)) {
        duplicates.push(st.nisn);
      } else {
        existingNisns.add(lower);
        validToAdd.push(st);
      }
    }

    if (validToAdd.length > 0) {
      const updated = [...validToAdd, ...students];
      setStudents(updated);
      saveStudents(updated);
    }

    return { added: validToAdd.length, duplicates };
  };

  const handleUpdateStudent = (updatedStudent: StudentItem) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    saveStudents(updated);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updated = students.filter(s => s.id !== studentId);
    setStudents(updated);
    saveStudents(updated);
  };

  const handleBatchDeleteStudents = (studentIds: string[]) => {
    const idSet = new Set(studentIds);
    const updated = students.filter(s => !idSet.has(s.id));
    setStudents(updated);
    saveStudents(updated);
  };

  const handleBatchMoveClass = (studentIds: string[], targetClassId: string) => {
    const idSet = new Set(studentIds);
    const updated = students.map(s => idSet.has(s.id) ? { ...s, kelasId: targetClassId } : s);
    setStudents(updated);
    saveStudents(updated);
  };

  const handleBatchTogglePIP = (studentIds: string[], isPIP: boolean) => {
    const idSet = new Set(studentIds);
    const updated = students.map(s => idSet.has(s.id) ? { ...s, isPIP } : s);
    setStudents(updated);
    saveStudents(updated);
  };

  const handleBatchSetStatus = (studentIds: string[], status: StudentItem['status'], alasan?: string) => {
    const idSet = new Set(studentIds);
    const updated = students.map(s =>
      idSet.has(s.id)
        ? {
            ...s,
            status,
            tanggalKeluar: new Date().toISOString().slice(0, 10),
            alasanKeluar: alasan
          }
        : s
    );
    setStudents(updated);
    saveStudents(updated);
  };

  // 3. Staff
  const handleAddStaff = (member: StaffItem) => {
    const updated = [...staff, member];
    setStaff(updated);
    saveStaff(updated);
  };

  const handleAddStaffBatch = (members: StaffItem[]) => {
    const updated = [...staff, ...members];
    setStaff(updated);
    saveStaff(updated);
  };

  const handleUpdateStaff = (updatedMember: StaffItem) => {
    const updated = staff.map(s => s.id === updatedMember.id ? updatedMember : s);
    setStaff(updated);
    saveStaff(updated);
  };

  const handleDeleteStaff = (staffId: string) => {
    const updated = staff.filter(s => s.id !== staffId);
    setStaff(updated);
    saveStaff(updated);
  };

  // 4. Kinerja Guru
  const handleUpdateKinerja = (item: KinerjaGuruItem) => {
    const exists = kinerja.some(k => k.id === item.id || k.guruId === item.guruId);
    let updated: KinerjaGuruItem[];
    if (exists) {
      updated = kinerja.map(k => (k.id === item.id || k.guruId === item.guruId) ? item : k);
    } else {
      updated = [...kinerja, item];
    }
    setKinerja(updated);
    saveKinerja(updated);
  };

  // 5. Attendance
  const handleAddAttendance = (rec: DailyAttendanceItem) => {
    const existingIdx = attendance.findIndex(a => a.id === rec.id || (a.tanggal === rec.tanggal && a.kelasId === rec.kelasId));
    let updated: DailyAttendanceItem[];
    if (existingIdx !== -1) {
      updated = [...attendance];
      updated[existingIdx] = rec;
    } else {
      updated = [rec, ...attendance];
    }
    setAttendance(updated);
    saveAttendance(updated);
  };

  const handleAddAttendanceBatch = (items: DailyAttendanceItem[]) => {
    const updated = [...items, ...attendance];
    setAttendance(updated);
    saveAttendance(updated);
  };

  // 6. Hari Efektif
  const handleAddHariEfektif = (item: HariEfektifItem) => {
    const updated = [...hariEfektif, item];
    setHariEfektif(updated);
    saveHariEfektif(updated);
  };

  const handleAddHariEfektifBatch = (items: HariEfektifItem[]) => {
    const updated = [...hariEfektif, ...items];
    setHariEfektif(updated);
    saveHariEfektif(updated);
  };

  // 7. Modul Ajar & Prota/Promes
  const handleAddModule = (mod: DeepLearningModuleItem) => {
    const updated = [mod, ...modules];
    setModules(updated);
    saveModules(updated);
  };

  const handleAddProtaPromes = (item: ProtaPromesItem) => {
    const updated = [...protaPromes, item];
    setProtaPromes(updated);
    saveProtaPromes(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Authentication Modal Gate */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Change Password Dialog */}
      {auth && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          userId={auth.userId}
          userName={auth.userName}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}

      {/* Official Header */}
      {auth && (
        <Header
          auth={auth}
          onLogout={handleLogout}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onDataRefresh={refreshAllData}
        />
      )}

      {/* Main Workspace Body */}
      {auth ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          
          {/* Responsive Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            totalStudents={students.length}
            totalStaff={staff.length}
            totalClasses={classes.filter(c => c.tipe === 'utama').length}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            
            {activeTab === 'dashboard' && (
              <DashboardView
                students={students}
                classes={classes}
                staff={staff}
                kinerja={kinerja}
                attendance={attendance}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'input_data' && (
              <InputDataView
                classes={classes}
                students={students}
                staff={staff}
                onAddClass={handleAddClass}
                onAddClassesBatch={handleAddClassesBatch}
                onAddStudent={handleAddStudent}
                onAddStudentsBatch={handleAddStudentsBatch}
                onAddStaff={handleAddStaff}
                onAddStaffBatch={handleAddStaffBatch}
              />
            )}

            {activeTab === 'manajemen_kelas' && (
              <ClassManagementView
                students={students}
                classes={classes}
                staff={staff}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onBatchDeleteStudents={handleBatchDeleteStudents}
                onBatchMoveClass={handleBatchMoveClass}
                onBatchTogglePIP={handleBatchTogglePIP}
                onBatchSetStatus={handleBatchSetStatus}
                onUpdateClassWali={handleUpdateClassWali}
              />
            )}

            {activeTab === 'kepegawaian' && (
              <StaffManagementView
                staff={staff}
                classes={classes}
                kinerja={kinerja}
                onUpdateStaff={handleUpdateStaff}
                onDeleteStaff={handleDeleteStaff}
                onUpdateKinerja={handleUpdateKinerja}
                currentRole={auth.role}
              />
            )}

            {activeTab === 'absensi_rekap' && (
              <AttendanceAgeView
                attendance={attendance}
                classes={classes}
                students={students}
                onAddAttendance={handleAddAttendance}
                onAddAttendanceBatch={handleAddAttendanceBatch}
              />
            )}

            {activeTab === 'perangkat_ajar' && (
              <TeachingToolsView
                hariEfektif={hariEfektif}
                modules={modules}
                protaPromes={protaPromes}
                staff={staff}
                classes={classes}
                onAddHariEfektif={handleAddHariEfektif}
                onAddHariEfektifBatch={handleAddHariEfektifBatch}
                onAddModule={handleAddModule}
                onAddProtaPromes={handleAddProtaPromes}
              />
            )}

          </main>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-slate-400 text-xs">
          Silakan masuk melalui portal otentikasi SIPANTAU SDN Nambo 03...
        </div>
      )}

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            SIPANTAU Nambo 03 · Sistem Informasi & Pengawasan Tata Kelola SD Negeri Nambo 03
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            NPSN: 20200352 · Kab. Bogor · TP 2026/2027
          </div>
        </div>
      </footer>

    </div>
  );
}
