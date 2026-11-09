import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit,
  ArrowRightLeft,
  HeartHandshake,
  UserX,
  FileSpreadsheet,
  Printer,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { StudentItem, ClassItem, StaffItem } from '../types';
import { exportToExcel } from '../utils/excelHelper';

interface ClassManagementViewProps {
  students: StudentItem[];
  classes: ClassItem[];
  staff: StaffItem[];
  onUpdateStudent: (std: StudentItem) => void;
  onDeleteStudent: (studentId: string) => void;
  onBatchDeleteStudents: (studentIds: string[]) => void;
  onBatchMoveClass: (studentIds: string[], targetClassId: string) => void;
  onBatchTogglePIP: (studentIds: string[], isPIP: boolean) => void;
  onBatchSetStatus: (studentIds: string[], status: StudentItem['status'], alasan?: string) => void;
  onUpdateClassWali: (classId: string, waliKelasId: string, waliKelasNama: string) => void;
}

type SubTab = 'aktif' | 'non_aktif' | 'pip' | 'agama' | 'ekskul' | 'wali_kelas' | 'laporan';

export const ClassManagementView: React.FC<ClassManagementViewProps> = ({
  students,
  classes,
  staff,
  onUpdateStudent,
  onDeleteStudent,
  onBatchDeleteStudents,
  onBatchMoveClass,
  onBatchTogglePIP,
  onBatchSetStatus,
  onUpdateClassWali,
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('aktif');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  // Modals state
  const [editModalStudent, setEditModalStudent] = useState<StudentItem | null>(null);
  const [moveModal, setMoveModal] = useState<{ isOpen: boolean; studentIds: string[]; targetClassId: string }>({
    isOpen: false,
    studentIds: [],
    targetClassId: classes[0]?.id || ''
  });
  const [mutasiModal, setMutasiModal] = useState<{
    isOpen: boolean;
    studentIds: string[];
    actionType: 'mutasi_keluar' | 'do';
    alasan: string;
    tanggal: string;
  }>({
    isOpen: false,
    studentIds: [],
    actionType: 'mutasi_keluar',
    alasan: '',
    tanggal: new Date().toISOString().slice(0, 10)
  });
  const [assignEkskulModal, setAssignEkskulModal] = useState<{
    isOpen: boolean;
    student: StudentItem | null;
    selectedEkskuls: string[];
  }>({
    isOpen: false,
    student: null,
    selectedEkskuls: []
  });

  // Laporan Multi-Filter State
  const [reportFilters, setReportFilters] = useState<{
    classes: string[]; // e.g. ['cls-1a', 'cls-1b']
    statuses: string[]; // ['aktif', 'pindahan', 'mutasi_keluar', 'do']
    pipOnly: boolean;
    gender: 'all' | 'L' | 'P';
    agama: string;
  }>({
    classes: [],
    statuses: ['aktif', 'pindahan'],
    pipOnly: false,
    gender: 'all',
    agama: 'all'
  });

  const mainClasses = classes.filter(c => c.tipe === 'utama');
  const ekskulClasses = classes.filter(c => c.tipe === 'ekskul');
  const teachers = staff.filter(s => s.isGuru);

  // Filtered Students according to current tab & criteria
  const filteredStudents = useMemo(() => {
    let list = students;

    // Filter by Tab
    if (activeTab === 'aktif') {
      list = list.filter(s => s.status === 'aktif' || s.status === 'pindahan');
    } else if (activeTab === 'non_aktif') {
      list = list.filter(s => s.status === 'mutasi_keluar' || s.status === 'do');
    } else if (activeTab === 'pip') {
      list = list.filter(s => s.isPIP);
    } else if (activeTab === 'agama') {
      // Show all with religious grouping
    }

    // Filter by Class dropdown
    if (selectedClassFilter !== 'all') {
      list = list.filter(s => s.kelasId === selectedClassFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        s =>
          s.nama.toLowerCase().includes(q) ||
          s.nisn.includes(q) ||
          s.nis.includes(q) ||
          s.nik.includes(q) ||
          s.alamat.toLowerCase().includes(q)
      );
    }

    return list;
  }, [students, activeTab, selectedClassFilter, searchQuery]);

  // Pagination calculation
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Bulk Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(paginatedStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(item => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const isAllPaginatedSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every(s => selectedStudentIds.includes(s.id));

  // Single Action Handlers
  const handleToggleSinglePIP = (student: StudentItem) => {
    onUpdateStudent({ ...student, isPIP: !student.isPIP });
  };

  const handleDeleteSingle = (student: StudentItem) => {
    if (confirm(`Apakah Anda yakin ingin menghapus siswa ${student.nama} (NISN: ${student.nisn})? Tindakan ini tidak dapat dibatalkan.`)) {
      onDeleteStudent(student.id);
    }
  };

  // Mass Actions
  const handleMassDelete = () => {
    if (selectedStudentIds.length === 0) return;
    if (confirm(`Yakin ingin menghapus ${selectedStudentIds.length} data siswa terpilih?`)) {
      onBatchDeleteStudents(selectedStudentIds);
      setSelectedStudentIds([]);
    }
  };

  const handleMassTogglePIP = (isPIP: boolean) => {
    if (selectedStudentIds.length === 0) return;
    onBatchTogglePIP(selectedStudentIds, isPIP);
    setSelectedStudentIds([]);
  };

  const handleExecuteMoveClass = () => {
    if (!moveModal.targetClassId || moveModal.studentIds.length === 0) return;
    onBatchMoveClass(moveModal.studentIds, moveModal.targetClassId);
    setMoveModal({ isOpen: false, studentIds: [], targetClassId: '' });
    setSelectedStudentIds([]);
  };

  const handleExecuteMutasi = () => {
    if (mutasiModal.studentIds.length === 0) return;
    onBatchSetStatus(
      mutasiModal.studentIds,
      mutasiModal.actionType,
      mutasiModal.alasan || (mutasiModal.actionType === 'mutasi_keluar' ? 'Pindah domisili' : 'Mengundurkan diri / DO')
    );
    setMutasiModal({ isOpen: false, studentIds: [], actionType: 'mutasi_keluar', alasan: '', tanggal: '' });
    setSelectedStudentIds([]);
  };

  // Laporan Export Functions
  const generateReportData = () => {
    let reportList = students;

    // Filter classes
    if (reportFilters.classes.length > 0) {
      reportList = reportList.filter(s => reportFilters.classes.includes(s.kelasId));
    }

    // Filter statuses
    if (reportFilters.statuses.length > 0) {
      reportList = reportList.filter(s => reportFilters.statuses.includes(s.status));
    }

    // Filter PIP
    if (reportFilters.pipOnly) {
      reportList = reportList.filter(s => s.isPIP);
    }

    // Filter Gender
    if (reportFilters.gender !== 'all') {
      reportList = reportList.filter(s => s.jk === reportFilters.gender);
    }

    // Filter Agama
    if (reportFilters.agama !== 'all') {
      reportList = reportList.filter(s => s.agama === reportFilters.agama);
    }

    return reportList;
  };

  const handleExportLaporanExcel = () => {
    const data = generateReportData().map((s, idx) => {
      const clsName = classes.find(c => c.id === s.kelasId)?.nama || '-';
      return {
        'No': idx + 1,
        'NISN': s.nisn,
        'NIS': s.nis,
        'Nama Siswa': s.nama,
        'Kelas': clsName,
        'L/P': s.jk,
        'Tempat Lahir': s.tempatLahir,
        'Tanggal Lahir': s.tanggalLahir,
        'Agama': s.agama,
        'Status': s.status.toUpperCase(),
        'Penerima PIP': s.isPIP ? 'YA' : 'TIDAK',
        'Alamat': s.alamat,
        'Keterangan': s.alasanKeluar || s.sekolahAsal || '-'
      };
    });

    exportToExcel(data, `Laporan_Data_Siswa_SDN_Nambo_03_${new Date().toISOString().slice(0, 10)}`, 'Data_Siswa');
  };

  const handlePrintLaporanPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Manajemen Kelas & Data Peserta Didik
            </h2>
            <p className="text-xs text-slate-500">
              Kelola status siswa aktif, non-aktif, mutasi, bantuan PIP, penugasan wali kelas, dan ekstrakurikuler
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-800 rounded-lg border border-red-200">
              {students.length} Siswa Terdaftar
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              {mainClasses.length} Rombel Utama
            </span>
          </div>
        </div>

        {/* Tab Submenu */}
        <div className="mt-4 flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('aktif'); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'aktif' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Siswa Aktif ({students.filter(s => s.status === 'aktif' || s.status === 'pindahan').length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('non_aktif'); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'non_aktif' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Siswa Non-Aktif (DO/Mutasi: {students.filter(s => s.status === 'mutasi_keluar' || s.status === 'do').length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('pip'); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pip' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Siswa PIP ({students.filter(s => s.isPIP).length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('agama'); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'agama' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Data Agama</span>
          </button>

          <button
            onClick={() => { setActiveTab('ekskul'); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ekskul' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Ekstrakurikuler</span>
          </button>

          <button
            onClick={() => { setActiveTab('wali_kelas'); }}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wali_kelas' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Wali Kelas & Pembina</span>
          </button>

          <button
            onClick={() => { setActiveTab('laporan'); }}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'laporan' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Laporan Fleksibel (PDF/Excel)</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1, 2, 3: STUDENT DATA TABLES WITH MASS ACTIONS */}
      {(activeTab === 'aktif' || activeTab === 'non_aktif' || activeTab === 'pip' || activeTab === 'agama') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden no-print">
          
          {/* Filter Bar & Search */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Class Filter Dropdown */}
              <select
                value={selectedClassFilter}
                onChange={(e) => { setSelectedClassFilter(e.target.value); setCurrentPage(1); }}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Semua Rombel (1A - 6B)</option>
                {mainClasses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>

              {/* Items per page */}
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value={15}>15 baris</option>
                <option value={25}>25 baris</option>
                <option value={50}>50 baris</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari Nama, NISN, NIK..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Mass Actions Toolbar (when rows selected) */}
          {selectedStudentIds.length > 0 && (
            <div className="p-3 bg-red-50 border-b border-red-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-900">
                <CheckSquare className="w-4 h-4 text-red-600" />
                <span>{selectedStudentIds.length} Siswa Terpilih:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => setMoveModal({ isOpen: true, studentIds: selectedStudentIds, targetClassId: mainClasses[0]?.id || '' })}
                  className="px-2.5 py-1 bg-white border border-red-300 hover:bg-red-100 text-red-800 rounded-md font-medium cursor-pointer flex items-center gap-1"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Pindahkan Kelas</span>
                </button>

                <button
                  onClick={() => handleMassTogglePIP(true)}
                  className="px-2.5 py-1 bg-white border border-red-300 hover:bg-red-100 text-red-800 rounded-md font-medium cursor-pointer flex items-center gap-1"
                >
                  <HeartHandshake className="w-3 h-3 text-amber-600" />
                  <span>Set Aktif PIP</span>
                </button>

                <button
                  onClick={() => setMutasiModal({
                    isOpen: true,
                    studentIds: selectedStudentIds,
                    actionType: 'mutasi_keluar',
                    alasan: '',
                    tanggal: new Date().toISOString().slice(0, 10)
                  })}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md font-medium cursor-pointer"
                >
                  <span>Mutasi Keluar</span>
                </button>

                <button
                  onClick={handleMassDelete}
                  className="px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-md font-medium cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Terpilih</span>
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllPaginatedSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded-sm border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">NISN / NIS</th>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">L/P</th>
                  <th className="p-3">TTL</th>
                  <th className="p-3">Agama</th>
                  <th className="p-3">PIP</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      Tidak ada data siswa yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((std) => {
                    const isSelected = selectedStudentIds.includes(std.id);
                    const classItem = classes.find(c => c.id === std.kelasId);

                    return (
                      <tr
                        key={std.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-red-50/40' : ''
                        }`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOne(std.id)}
                            className="rounded-sm border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          />
                        </td>
                        
                        <td className="p-3 font-mono">
                          <div className="font-bold text-slate-900">{std.nisn}</div>
                          <div className="text-[10px] text-slate-600">NIS: {std.nis}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{std.nama}</div>
                          <div className="text-[10px] text-slate-600 truncate max-w-xs">{std.alamat}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-sm">
                            {classItem?.nama || 'Unassigned'}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={`font-bold px-1.5 py-0.5 rounded-xs text-[10px] ${
                            std.jk === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {std.jk}
                          </span>
                        </td>

                        <td className="p-3 text-slate-600">
                          <div>{std.tempatLahir}</div>
                          <div className="text-[10px] font-mono">{std.tanggalLahir}</div>
                        </td>

                        <td className="p-3">
                          <span className="text-slate-700">{std.agama}</span>
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleSinglePIP(std)}
                            title="Klik untuk ubah status PIP"
                            className={`px-2 py-0.5 rounded-sm text-[10px] font-bold cursor-pointer transition-colors ${
                              std.isPIP
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {std.isPIP ? 'PIP Aktif' : 'Bukan'}
                          </button>
                        </td>

                        <td className="p-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-sm font-semibold capitalize ${
                            std.status === 'aktif' ? 'bg-green-100 text-green-800' :
                            std.status === 'pindahan' ? 'bg-blue-100 text-blue-800' :
                            std.status === 'mutasi_keluar' ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {std.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            
                            {/* Pindah Kelas Single */}
                            <button
                              onClick={() => setMoveModal({ isOpen: true, studentIds: [std.id], targetClassId: std.kelasId })}
                              title="Pindahkan Kelas"
                              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Siswa */}
                            <button
                              onClick={() => setEditModalStudent(std)}
                              title="Edit Data Siswa"
                              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-red-700 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Mutasi / DO */}
                            <button
                              onClick={() => setMutasiModal({
                                isOpen: true,
                                studentIds: [std.id],
                                actionType: 'mutasi_keluar',
                                alasan: '',
                                tanggal: new Date().toISOString().slice(0, 10)
                              })}
                              title="Mutasi Keluar / DO"
                              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-purple-700 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>

                            {/* Hapus Siswa */}
                            <button
                              onClick={() => handleDeleteSingle(std)}
                              title="Hapus Siswa"
                              className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <div>
              Menampilkan {Math.min((currentPage - 1) * pageSize + 1, totalItems)} - {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} siswa
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-md disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              
              <span className="font-mono font-medium">
                Hal {currentPage} dari {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-md disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 4: EKSTRAKURIKULER ASSIGNMENT */}
      {activeTab === 'ekskul' && (
        <div className="space-y-6 no-print">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Daftar Ekstrakurikuler SDN Nambo 03
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Data kegiatan ekskul yang terhubung dengan pembina dari guru dan diikuti peserta didik
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ekskulClasses.map((ek) => {
                const enrolledCount = students.filter(s => s.ekskulIds?.includes(ek.id)).length;
                return (
                  <div key={ek.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-red-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{ek.nama}</span>
                      <span className="text-[10px] font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                        {enrolledCount} Siswa
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mb-1">
                      <span className="font-medium text-slate-500">Pembina:</span> {ek.waliKelasNama || 'Belum Ditunjuk'}
                    </div>
                    <div className="text-[11px] text-slate-600 mb-2">
                      <span className="font-medium text-slate-500">Lokasi:</span> {ek.ruangan}
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      {ek.deskripsi}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: WALI KELAS & PEMBINA ASSIGNMENT */}
      {activeTab === 'wali_kelas' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs no-print">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Penetapan Wali Kelas & Pembina Ekstrakurikuler
            </h3>
            <p className="text-xs text-slate-500">
              Data guru diambil secara otomatis dari database GTK SD Negeri Nambo 03
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3">Nama Rombel / Ekskul</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3">Ruangan</th>
                  <th className="p-3">Wali Kelas / Pembina Saat Ini</th>
                  <th className="p-3">Ubah Penugasan Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">{cls.nama}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm font-semibold uppercase ${
                        cls.tipe === 'utama' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {cls.tipe}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{cls.ruangan}</td>
                    <td className="p-3 font-semibold text-slate-800">
                      {cls.waliKelasNama || 'Belum ditentukan'}
                    </td>
                    <td className="p-3">
                      <select
                        value={cls.waliKelasId || ''}
                        onChange={(e) => {
                          const staffId = e.target.value;
                          const selectedStaff = staff.find(s => s.id === staffId);
                          if (selectedStaff) {
                            onUpdateClassWali(cls.id, selectedStaff.id, selectedStaff.nama);
                          }
                        }}
                        className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-red-500"
                      >
                        <option value="">-- Pilih Guru Penanggung Jawab --</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.nama} ({t.status})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 6: LAPORAN FLEKSIBEL (PDF / EXCEL) */}
      {activeTab === 'laporan' && (
        <div className="space-y-6">
          
          {/* Controls Box (no-print) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs no-print space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Generator Laporan Data Siswa Fleksibel
                </h3>
                <p className="text-xs text-slate-500">
                  Dapat difilter multi-kriteria sesuai kebutuhan pengawas dan dinas pendidikan
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportLaporanExcel}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Unduh Format Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintLaporanPDF}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
              </div>
            </div>

            {/* Filter Multi-Choice Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Filter Rombel */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Filter Rombel (Bisa Pilih Banyak):
                </label>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 max-h-36 overflow-y-auto space-y-1">
                  {mainClasses.map(c => {
                    const isChecked = reportFilters.classes.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded-sm">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportFilters({ ...reportFilters, classes: [...reportFilters.classes, c.id] });
                            } else {
                              setReportFilters({ ...reportFilters, classes: reportFilters.classes.filter(id => id !== c.id) });
                            }
                          }}
                          className="rounded-xs text-red-600"
                        />
                        <span>{c.nama}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter Status */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Filter Status Siswa:
                </label>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                  {[
                    { id: 'aktif', label: 'Siswa Aktif' },
                    { id: 'pindahan', label: 'Siswa Pindahan Masuk' },
                    { id: 'mutasi_keluar', label: 'Mutasi Keluar' },
                    { id: 'do', label: 'Berhenti / Drop Out (DO)' }
                  ].map(st => {
                    const isChecked = reportFilters.statuses.includes(st.id);
                    return (
                      <label key={st.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded-sm">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportFilters({ ...reportFilters, statuses: [...reportFilters.statuses, st.id] });
                            } else {
                              setReportFilters({ ...reportFilters, statuses: reportFilters.statuses.filter(id => id !== st.id) });
                            }
                          }}
                          className="rounded-xs text-red-600"
                        />
                        <span>{st.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter Tambahan (PIP, Gender, Agama) */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={reportFilters.pipOnly}
                    onChange={(e) => setReportFilters({ ...reportFilters, pipOnly: e.target.checked })}
                    className="rounded-xs text-red-600"
                  />
                  <span>Hanya Siswa Penerima PIP</span>
                </label>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Kelamin:
                  </label>
                  <select
                    value={reportFilters.gender}
                    onChange={(e) => setReportFilters({ ...reportFilters, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <option value="all">Semua (L & P)</option>
                    <option value="L">Laki-laki Saja</option>
                    <option value="P">Perempuan Saja</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Agama:
                  </label>
                  <select
                    value={reportFilters.agama}
                    onChange={(e) => setReportFilters({ ...reportFilters, agama: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <option value="all">Semua Agama</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Printable Report Output Area (Clean styling for PDF print) */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm print:p-0 print:border-0">
            
            {/* Official Report Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
              <div className="flex items-center justify-between gap-4 mb-2">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17__1__e4d8a6c0.jpeg"
                  alt="Logo Pemkab Bogor"
                  className="h-16 w-auto object-contain shrink-0"
                />
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-700 tracking-wider">
                    PEMERINTAH KABUPATEN BOGOR · DINAS PENDIDIKAN
                  </h4>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    SD NEGERI NAMBO 03 KECAMATAN KLAPANUNGGAL
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    NPSN: 20200352 · Jl. Raya Nambo Bantarkopo RT 001/004 Desa Bantarjati, Klapanunggal, Bogor
                  </p>
                </div>
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17_94b6fe75.jpeg"
                  alt="Logo SDN Nambo 03"
                  className="h-16 w-auto object-contain shrink-0"
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mt-3">
                LAPORAN KELOLA DATA PESERTA DIDIK
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Tahun Ajaran 2026/2027 · Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
              </p>
            </div>

            {/* Report Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800 divide-y divide-slate-300">
                <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700">
                  <tr>
                    <th className="p-2 w-8 text-center">No</th>
                    <th className="p-2">NISN</th>
                    <th className="p-2">Nama Peserta Didik</th>
                    <th className="p-2">Kelas</th>
                    <th className="p-2 text-center">L/P</th>
                    <th className="p-2">TTL</th>
                    <th className="p-2">Agama</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">PIP</th>
                    <th className="p-2">Alamat / Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {generateReportData().slice(0, 100).map((s, idx) => {
                    const cName = classes.find(c => c.id === s.kelasId)?.nama || '-';
                    return (
                      <tr key={s.id} className="text-[11px]">
                        <td className="p-2 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 font-mono font-medium">{s.nisn}</td>
                        <td className="p-2 font-bold">{s.nama}</td>
                        <td className="p-2 font-medium">{cName}</td>
                        <td className="p-2 text-center font-bold">{s.jk}</td>
                        <td className="p-2">{s.tempatLahir}, {s.tanggalLahir}</td>
                        <td className="p-2">{s.agama}</td>
                        <td className="p-2 text-center capitalize">{s.status.replace('_', ' ')}</td>
                        <td className="p-2 text-center font-bold">{s.isPIP ? 'YA' : 'TIDAK'}</td>
                        <td className="p-2 text-[10px] text-slate-600">{s.alasanKeluar || s.sekolahAsal || s.alamat}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Official Signature Footer */}
            <div className="mt-8 pt-4 flex justify-between items-start text-xs text-slate-800 print-break-inside-avoid">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold">Operator / Pengelola Data</p>
                <div className="h-16"></div>
                <p className="font-bold underline">NURVI LATIFAH</p>
                <p className="text-[11px] text-slate-500 font-mono">Tendik SDN Nambo 03</p>
              </div>

              <div className="text-right">
                <p>Klapanunggal, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                <p className="font-semibold">Kepala Sekolah SD Negeri Nambo 03</p>
                <div className="h-16"></div>
                <p className="font-bold underline">AM. MEGA PURNAMATATI, S. Pd.,M.Pd.</p>
                <p className="text-[11px] text-slate-500 font-mono">NIP. 198607172014062001</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* EDIT MODAL */}
      {editModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Data Siswa: {editModalStudent.nama}
              </h3>
              <button
                onClick={() => setEditModalStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateStudent(editModalStudent);
                setEditModalStudent(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NISN (ID)</label>
                  <input
                    type="text"
                    disabled
                    value={editModalStudent.nisn}
                    className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIS</label>
                  <input
                    type="text"
                    value={editModalStudent.nis}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, nis: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editModalStudent.nama}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, nama: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={editModalStudent.tempatLahir}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, tempatLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={editModalStudent.tanggalLahir}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, tanggalLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={editModalStudent.jk}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, jk: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Agama</label>
                  <select
                    value={editModalStudent.agama}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, agama: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Alamat</label>
                  <input
                    type="text"
                    value={editModalStudent.alamat}
                    onChange={(e) => setEditModalStudent({ ...editModalStudent, alamat: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditModalStudent(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE CLASS MODAL */}
      {moveModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Pindahkan {moveModal.studentIds.length} Siswa Terpilih
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pilih kelas tujuan baru dalam rombel SD Negeri Nambo 03
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kelas Tujuan
              </label>
              <select
                value={moveModal.targetClassId}
                onChange={(e) => setMoveModal({ ...moveModal, targetClassId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium"
              >
                {mainClasses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nama} ({students.filter(s => s.kelasId === c.id).length} Siswa)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMoveModal({ isOpen: false, studentIds: [], targetClassId: '' })}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteMoveClass}
                className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
              >
                Konfirmasi Pindah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MUTASI KELUAR / DO MODAL */}
      {mutasiModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Status Mutasi Keluar / Berhenti DO
            </h3>

            <div className="space-y-3 text-xs mb-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Tindakan</label>
                <select
                  value={mutasiModal.actionType}
                  onChange={(e) => setMutasiModal({ ...mutasiModal, actionType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                >
                  <option value="mutasi_keluar">Mutasi Keluar (Pindah Sekolah)</option>
                  <option value="do">Berhenti / Drop Out (DO)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={mutasiModal.tanggal}
                  onChange={(e) => setMutasiModal({ ...mutasiModal, tanggal: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alasan / Sekolah Tujuan</label>
                <input
                  type="text"
                  value={mutasiModal.alasan}
                  onChange={(e) => setMutasiModal({ ...mutasiModal, alasan: e.target.value })}
                  placeholder="Contoh: Pindah mengikuti orang tua..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMutasiModal({ isOpen: false, studentIds: [], actionType: 'mutasi_keluar', alasan: '', tanggal: '' })}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteMutasi}
                className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold"
              >
                Simpan Status
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
