import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Users,
  FileSpreadsheet,
  Printer,
  Download,
  Upload,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Filter,
  BarChart2
} from 'lucide-react';
import { DailyAttendanceItem, ClassItem, StudentItem } from '../types';
import { exportToExcel, downloadTemplateAbsensi, parseExcelFile } from '../utils/excelHelper';

interface AttendanceAgeViewProps {
  attendance: DailyAttendanceItem[];
  classes: ClassItem[];
  students: StudentItem[];
  onAddAttendance: (item: DailyAttendanceItem) => void;
  onAddAttendanceBatch: (items: DailyAttendanceItem[]) => void;
}

type SubTab = 'absensi' | 'rekap_umur';

const BULAN_TAHUN_AJARAN = [
  { id: '2026-07', label: 'Juli 2026' },
  { id: '2026-08', label: 'Agustus 2026' },
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-10', label: 'Oktober 2026' },
  { id: '2026-11', label: 'November 2026' },
  { id: '2026-12', label: 'Desember 2026' },
  { id: '2027-01', label: 'Januari 2027' },
  { id: '2027-02', label: 'Februari 2027' },
  { id: '2027-03', label: 'Maret 2027' },
  { id: '2027-04', label: 'April 2027' },
  { id: '2027-05', label: 'Mei 2027' },
  { id: '2027-06', label: 'Juni 2027' },
];

export const AttendanceAgeView: React.FC<AttendanceAgeViewProps> = ({
  attendance,
  classes,
  students,
  onAddAttendance,
  onAddAttendanceBatch,
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('absensi');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [inputDate, setInputDate] = useState<string>('2026-07-20');
  
  // Single Entry Form
  const [targetClassInput, setTargetClassInput] = useState<string>(classes[0]?.id || 'cls-1a');
  const [sakitInput, setSakitInput] = useState<number>(0);
  const [izinInput, setIzinInput] = useState<number>(0);
  const [alfaInput, setAlfaInput] = useState<number>(0);
  const [catatanInput, setCatatanInput] = useState<string>('');

  const mainClasses = classes.filter(c => c.tipe === 'utama');

  // Compute total students in selected input class
  const classStudentCount = useMemo(() => {
    return students.filter(s => s.kelasId === targetClassInput && (s.status === 'aktif' || s.status === 'pindahan')).length || 33;
  }, [students, targetClassInput]);

  const computedHadir = Math.max(0, classStudentCount - (sakitInput + izinInput + alfaInput));
  const attendanceRate = classStudentCount > 0 ? ((computedHadir / classStudentCount) * 100).toFixed(1) : '100';

  // Handle Submit Single Attendance
  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DailyAttendanceItem = {
      id: `att-${targetClassInput}-${inputDate}`,
      tanggal: inputDate,
      kelasId: targetClassInput,
      sakit: sakitInput,
      izin: izinInput,
      alfa: alfaInput,
      hadir: computedHadir,
      totalSiswa: classStudentCount,
      catatan: catatanInput.trim() || undefined
    };

    onAddAttendance(newRecord);
    alert(`Data absensi tanggal ${inputDate} berhasil disimpan!`);
    setSakitInput(0);
    setIzinInput(0);
    setAlfaInput(0);
    setCatatanInput('');
  };

  // Handle Import Attendance Excel
  const handleImportAttendanceExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile<any>(file);
      const batch: DailyAttendanceItem[] = [];

      for (const r of rows) {
        const tgl = String(r['Tanggal'] || '').trim();
        if (!tgl) continue;

        const clsName = String(r['Nama_Kelas'] || '').trim();
        const matched = mainClasses.find(c => c.nama.toLowerCase() === clsName.toLowerCase());
        const kId = matched ? matched.id : targetClassInput;

        const s = Number(r['Sakit'] || 0);
        const i = Number(r['Izin'] || 0);
        const a = Number(r['Alfa'] || 0);
        const h = Number(r['Hadir'] || 0);
        const total = h + s + i + a || 33;

        batch.push({
          id: `att-${kId}-${tgl}`,
          tanggal: tgl,
          kelasId: kId,
          sakit: s,
          izin: i,
          alfa: a,
          hadir: h,
          totalSiswa: total,
          catatan: r['Catatan'] || undefined
        });
      }

      onAddAttendanceBatch(batch);
      alert(`Berhasil mengimpor ${batch.length} baris absensi dari Excel!`);
    } catch (err) {
      alert('Gagal membaca template Excel absensi.');
    }
  };

  // Filtered Attendance Records for view
  const filteredAttendance = useMemo(() => {
    return attendance.filter(rec => {
      const matchesMonth = rec.tanggal.startsWith(selectedMonth);
      const matchesClass = selectedClassId === 'all' || rec.kelasId === selectedClassId;
      return matchesMonth && matchesClass;
    });
  }, [attendance, selectedMonth, selectedClassId]);

  // Aggregate Attendance Statistics
  const aggregateStats = useMemo(() => {
    let totHadir = 0;
    let totSakit = 0;
    let totIzin = 0;
    let totAlfa = 0;
    let totSiswa = 0;

    for (const item of filteredAttendance) {
      totHadir += item.hadir;
      totSakit += item.sakit;
      totIzin += item.izin;
      totAlfa += item.alfa;
      totSiswa += item.totalSiswa;
    }

    const persentase = totSiswa > 0 ? ((totHadir / totSiswa) * 100).toFixed(1) : '100';
    return { totHadir, totSakit, totIzin, totAlfa, totSiswa, persentase };
  }, [filteredAttendance]);

  // REKAPITULASI UMUR SISWA PER KELAS PER BULAN
  // Age reference date: End of selected month (e.g. 2026-07-31)
  const ageReferenceDate = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return new Date(year, month - 1, lastDay);
  }, [selectedMonth]);

  // Calculate age distribution per class
  const ageDistribution = useMemo(() => {
    return mainClasses.map(cls => {
      const classStudents = students.filter(s => s.kelasId === cls.id && (s.status === 'aktif' || s.status === 'pindahan'));
      
      const counts = {
        under7: { L: 0, P: 0 },
        age7: { L: 0, P: 0 },
        age8: { L: 0, P: 0 },
        age9: { L: 0, P: 0 },
        age10: { L: 0, P: 0 },
        age11: { L: 0, P: 0 },
        age12: { L: 0, P: 0 },
        over12: { L: 0, P: 0 },
        totalL: 0,
        totalP: 0,
        grandTotal: classStudents.length
      };

      for (const st of classStudents) {
        const birthDate = new Date(st.tanggalLahir);
        let age = ageReferenceDate.getFullYear() - birthDate.getFullYear();
        const m = ageReferenceDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && ageReferenceDate.getDate() < birthDate.getDate())) {
          age--;
        }

        const isMale = st.jk === 'L';
        if (isMale) counts.totalL++;
        else counts.totalP++;

        if (age < 7) {
          isMale ? counts.under7.L++ : counts.under7.P++;
        } else if (age === 7) {
          isMale ? counts.age7.L++ : counts.age7.P++;
        } else if (age === 8) {
          isMale ? counts.age8.L++ : counts.age8.P++;
        } else if (age === 9) {
          isMale ? counts.age9.L++ : counts.age9.P++;
        } else if (age === 10) {
          isMale ? counts.age10.L++ : counts.age10.P++;
        } else if (age === 11) {
          isMale ? counts.age11.L++ : counts.age11.P++;
        } else if (age === 12) {
          isMale ? counts.age12.L++ : counts.age12.P++;
        } else {
          isMale ? counts.over12.L++ : counts.over12.P++;
        }
      }

      return {
        classId: cls.id,
        className: cls.nama,
        waliKelas: cls.waliKelasNama || '-',
        counts
      };
    });
  }, [mainClasses, students, ageReferenceDate]);

  // Export Rekap Umur to Excel
  const handleExportAgeExcel = () => {
    const data = ageDistribution.map((row, idx) => ({
      'No': idx + 1,
      'Rombel': row.className,
      'Wali Kelas': row.waliKelas,
      '< 7 Th (L)': row.counts.under7.L,
      '< 7 Th (P)': row.counts.under7.P,
      '7 Th (L)': row.counts.age7.L,
      '7 Th (P)': row.counts.age7.P,
      '8 Th (L)': row.counts.age8.L,
      '8 Th (P)': row.counts.age8.P,
      '9 Th (L)': row.counts.age9.L,
      '9 Th (P)': row.counts.age9.P,
      '10 Th (L)': row.counts.age10.L,
      '10 Th (P)': row.counts.age10.P,
      '11 Th (L)': row.counts.age11.L,
      '11 Th (P)': row.counts.age11.P,
      '12 Th (L)': row.counts.age12.L,
      '12 Th (P)': row.counts.age12.P,
      '> 12 Th (L)': row.counts.over12.L,
      '> 12 Th (P)': row.counts.over12.P,
      'Total L': row.counts.totalL,
      'Total P': row.counts.totalP,
      'Total Siswa': row.counts.grandTotal
    }));

    exportToExcel(data, `Rekapitulasi_Umur_Siswa_${selectedMonth}_SDN_Nambo_03`, 'Rekap_Umur');
  };

  // Export Absensi to Excel
  const handleExportAttendanceExcel = () => {
    const data = filteredAttendance.map((rec, idx) => {
      const clsName = mainClasses.find(c => c.id === rec.kelasId)?.nama || '-';
      const pct = rec.totalSiswa > 0 ? ((rec.hadir / rec.totalSiswa) * 100).toFixed(1) : '100';
      return {
        'No': idx + 1,
        'Tanggal': rec.tanggal,
        'Kelas': clsName,
        'Total Siswa': rec.totalSiswa,
        'Hadir': rec.hadir,
        'Sakit': rec.sakit,
        'Izin': rec.izin,
        'Alfa': rec.alfa,
        '% Kehadiran': `${pct}%`,
        'Catatan': rec.catatan || '-'
      };
    });

    exportToExcel(data, `Rekap_Absensi_SDN_Nambo_03_${selectedMonth}`, 'Absensi');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Absensi Global Harian & Rekapitulasi Umur Siswa
            </h2>
            <p className="text-xs text-slate-500">
              Tahun Ajaran 2026/2027 (Juli 2026 – Juni 2027) terintegrasi dengan perhitungan umur akurat per bulan per kelas
            </p>
          </div>

          {/* Month Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Pilih Bulan Aktif:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
            >
              {BULAN_TAHUN_AJARAN.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('absensi')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'absensi' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Absensi Harian & Bulanan 2026/2027</span>
          </button>

          <button
            onClick={() => setActiveTab('rekap_umur')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'rekap_umur' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rekapitulasi Umur Siswa (L/P per Rombel)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ABSENSI HARIAN & BULANAN */}
      {activeTab === 'absensi' && (
        <div className="space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 no-print">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Rata-rata Kehadiran</span>
              <span className="text-xl font-bold font-mono text-red-800">{aggregateStats.persentase}%</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Total Hadir</span>
              <span className="text-xl font-bold font-mono text-blue-600">{aggregateStats.totHadir}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Sakit</span>
              <span className="text-xl font-bold font-mono text-amber-600">{aggregateStats.totSakit}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Izin</span>
              <span className="text-xl font-bold font-mono text-purple-600">{aggregateStats.totIzin}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Alfa / Tanpa Ket</span>
              <span className="text-xl font-bold font-mono text-rose-600">{aggregateStats.totAlfa}</span>
            </div>
          </div>

          {/* Form Input Manual & Excel Import Strip (no-print) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
            
            {/* Input Manual Box */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b">
                <h3 className="text-sm font-bold text-slate-900">
                  Input Rekap Absensi Harian per Kelas
                </h3>
                <span className="text-xs font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-sm">
                  Kehadiran: {attendanceRate}%
                </span>
              </div>

              <form onSubmit={handleSubmitAttendance} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rombongan Belajar</label>
                    <select
                      value={targetClassInput}
                      onChange={(e) => setTargetClassInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold"
                    >
                      {mainClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Absensi</label>
                    <input
                      type="date"
                      required
                      value={inputDate}
                      onChange={(e) => setInputDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Siswa Terdaftar</label>
                    <input
                      type="number"
                      disabled
                      value={classStudentCount}
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sakit (S)</label>
                    <input
                      type="number"
                      min={0}
                      value={sakitInput}
                      onChange={(e) => setSakitInput(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Izin (I)</label>
                    <input
                      type="number"
                      min={0}
                      value={izinInput}
                      onChange={(e) => setIzinInput(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Alfa / Tanpa Ket (A)</label>
                    <input
                      type="number"
                      min={0}
                      value={alfaInput}
                      onChange={(e) => setAlfaInput(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    value={catatanInput}
                    onChange={(e) => setCatatanInput(e.target.value)}
                    placeholder="Contoh: 1 siswa sakit DBD dirawat di RS..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Simpan Absensi Harian</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Excel Download & Import Area */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Template Import Absensi (.xlsx)
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  Format Excel resmi dengan 10 baris data dummy
                </p>
                <button
                  type="button"
                  onClick={downloadTemplateAbsensi}
                  className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-red-600" />
                  <span>Unduh Template_Absensi.xlsx</span>
                </button>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Import Berkas Excel Absensi
                </h4>
                <label className="block w-full border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-3 text-center cursor-pointer bg-slate-50/50 hover:bg-red-50/30 transition-all">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-700 block">
                    Pilih Berkas Excel
                  </span>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImportAttendanceExcel}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          </div>

          {/* Table Attendance Data & Actions (Printable) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Filter Rombel:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-medium"
                >
                  <option value="all">Semua Kelas (1A - 6B)</option>
                  {mainClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportAttendanceExcel}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Unduh Rekap Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF</span>
                </button>
              </div>
            </div>

            {/* Print Document Header */}
            <div className="hidden print:block p-4 border-b text-center">
              <h2 className="text-base font-bold">REKAPITULASI ABSENSI HARIAN SISWA SD NEGERI NAMBO 03</h2>
              <p className="text-xs text-slate-600">Bulan: {selectedMonth} · Tahun Ajaran 2026/2027</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Rombel</th>
                    <th className="p-3 text-center">Total Siswa</th>
                    <th className="p-3 text-center">Hadir</th>
                    <th className="p-3 text-center">Sakit</th>
                    <th className="p-3 text-center">Izin</th>
                    <th className="p-3 text-center">Alfa</th>
                    <th className="p-3 text-center">% Kehadiran</th>
                    <th className="p-3">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400">
                        Belum ada data absensi pada bulan {selectedMonth}.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((rec, idx) => {
                      const clsName = mainClasses.find(c => c.id === rec.kelasId)?.nama || '-';
                      const pct = rec.totalSiswa > 0 ? ((rec.hadir / rec.totalSiswa) * 100).toFixed(1) : '100';
                      return (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-mono font-medium text-slate-900">{rec.tanggal}</td>
                          <td className="p-3 font-bold text-slate-800">{clsName}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-900">{rec.totalSiswa}</td>
                          <td className="p-3 text-center font-mono font-bold text-red-800">{rec.hadir}</td>
                          <td className="p-3 text-center font-mono text-amber-600">{rec.sakit}</td>
                          <td className="p-3 text-center font-mono text-purple-600">{rec.izin}</td>
                          <td className="p-3 text-center font-mono text-rose-600">{rec.alfa}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-800">{pct}%</td>
                          <td className="p-3 text-[11px] text-slate-600">{rec.catatan || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: REKAPITULASI UMUR SISWA PER KELAS PER BULAN */}
      {activeTab === 'rekap_umur' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tabel Rekapitulasi Rentang Usia Peserta Didik (L/P)
              </h3>
              <p className="text-xs text-slate-500">
                Dihitung secara akurat berdasarkan Tanggal Lahir siswa per cut-off {selectedMonth}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportAgeExcel}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh Rekap Usia Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap Usia (PDF)</span>
              </button>
            </div>
          </div>

          {/* Official Printable Table */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm print:p-0 print:border-0">
            
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
              <div className="flex items-center justify-between gap-4 mb-2">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17__1__e4d8a6c0.jpeg"
                  alt="Logo Pemkab Bogor"
                  className="h-14 w-auto object-contain"
                />
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-700">
                    PEMERINTAH KABUPATEN BOGOR · DINAS PENDIDIKAN
                  </h4>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    SD NEGERI NAMBO 03 KLAPANUNGGAL
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    NPSN: 20200352 · Desa Bantarjati, Klapanunggal, Kabupaten Bogor
                  </p>
                </div>
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17_94b6fe75.jpeg"
                  alt="Logo SDN Nambo 03"
                  className="h-14 w-auto object-contain"
                />
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide mt-2">
                REKAPITULASI KEADAAN UMUR PESERTA DIDIK PER KELAS
              </h3>
              <p className="text-[11px] text-slate-600 font-mono">
                Bulan Acuan: {selectedMonth} · Tahun Ajaran 2026/2027
              </p>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse border border-slate-300">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-800 uppercase">
                  <tr>
                    <th rowSpan={2} className="border border-slate-300 p-2 w-8">No</th>
                    <th rowSpan={2} className="border border-slate-300 p-2 text-left w-24">Rombel</th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-slate-200">&lt; 7 Thn</th>
                    <th colSpan={2} className="border border-slate-300 p-1">7 Thn</th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-slate-200">8 Thn</th>
                    <th colSpan={2} className="border border-slate-300 p-1">9 Thn</th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-slate-200">10 Thn</th>
                    <th colSpan={2} className="border border-slate-300 p-1">11 Thn</th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-slate-200">12 Thn</th>
                    <th colSpan={2} className="border border-slate-300 p-1">&gt; 12 Thn</th>
                    <th colSpan={3} className="border border-slate-300 p-1 bg-red-100 text-red-900">Total</th>
                  </tr>
                  <tr>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">L</th>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">P</th>
                    <th className="border border-slate-300 p-1 w-6">L</th>
                    <th className="border border-slate-300 p-1 w-6">P</th>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">L</th>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">P</th>
                    <th className="border border-slate-300 p-1 w-6">L</th>
                    <th className="border border-slate-300 p-1 w-6">P</th>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">L</th>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">P</th>
                    <th className="border border-slate-300 p-1 w-6">L</th>
                    <th className="border border-slate-300 p-1 w-6">P</th>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">L</th>
                    <th className="border border-slate-300 p-1 w-6 bg-slate-200">P</th>
                    <th className="border border-slate-300 p-1 w-6">L</th>
                    <th className="border border-slate-300 p-1 w-6">P</th>
                    <th className="border border-slate-300 p-1 w-8 bg-red-100 font-bold">L</th>
                    <th className="border border-slate-300 p-1 w-8 bg-red-100 font-bold">P</th>
                    <th className="border border-slate-300 p-1 w-10 bg-red-200 font-bold">Jml</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-[11px] font-mono">
                  {ageDistribution.map((row, idx) => (
                    <tr key={row.classId} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-1.5">{idx + 1}</td>
                      <td className="border border-slate-300 p-1.5 text-left font-sans font-bold">{row.className}</td>
                      
                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.under7.L}</td>
                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.under7.P}</td>

                      <td className="border border-slate-300 p-1">{row.counts.age7.L}</td>
                      <td className="border border-slate-300 p-1">{row.counts.age7.P}</td>

                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.age8.L}</td>
                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.age8.P}</td>

                      <td className="border border-slate-300 p-1">{row.counts.age9.L}</td>
                      <td className="border border-slate-300 p-1">{row.counts.age9.P}</td>

                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.age10.L}</td>
                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.age10.P}</td>

                      <td className="border border-slate-300 p-1">{row.counts.age11.L}</td>
                      <td className="border border-slate-300 p-1">{row.counts.age11.P}</td>

                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.age12.L}</td>
                      <td className="border border-slate-300 p-1 bg-slate-50">{row.counts.age12.P}</td>

                      <td className="border border-slate-300 p-1">{row.counts.over12.L}</td>
                      <td className="border border-slate-300 p-1">{row.counts.over12.P}</td>

                      <td className="border border-slate-300 p-1 font-bold text-blue-700 bg-red-50">{row.counts.totalL}</td>
                      <td className="border border-slate-300 p-1 font-bold text-pink-700 bg-red-50">{row.counts.totalP}</td>
                      <td className="border border-slate-300 p-1 font-bold bg-red-100">{row.counts.grandTotal}</td>
                    </tr>
                  ))}
                  
                  {/* Total Row */}
                  <tr className="bg-slate-200 font-bold text-slate-900">
                    <td colSpan={2} className="border border-slate-300 p-2 text-center uppercase">
                      TOTAL KESELURUHAN:
                    </td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.under7.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.under7.P, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age7.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age7.P, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age8.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age8.P, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age9.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age9.P, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age10.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age10.P, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age11.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age11.P, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age12.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.age12.P, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.over12.L, 0)}</td>
                    <td className="border border-slate-300 p-1">{ageDistribution.reduce((a, b) => a + b.counts.over12.P, 0)}</td>
                    
                    <td className="border border-slate-300 p-1 text-blue-800 bg-red-100">
                      {ageDistribution.reduce((a, b) => a + b.counts.totalL, 0)}
                    </td>
                    <td className="border border-slate-300 p-1 text-pink-800 bg-red-100">
                      {ageDistribution.reduce((a, b) => a + b.counts.totalP, 0)}
                    </td>
                    <td className="border border-slate-300 p-1 bg-red-200 text-sm">
                      {students.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Area */}
            <div className="mt-8 pt-4 flex justify-between items-start text-xs text-slate-800 print-break-inside-avoid">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold">Petugas Tata Usaha</p>
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

    </div>
  );
};
