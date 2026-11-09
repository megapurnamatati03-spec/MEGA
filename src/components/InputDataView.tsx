import React, { useState } from 'react';
import {
  PlusCircle,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  Users,
  GraduationCap,
  Briefcase,
  FileSpreadsheet,
  ArrowRightLeft,
  X,
  Info
} from 'lucide-react';
import { ClassItem, StudentItem, StaffItem } from '../types';
import {
  downloadTemplateKelasEkskul,
  downloadTemplateSiswa,
  downloadTemplateGuru,
  downloadTemplateKepegawaian,
  parseExcelFile
} from '../utils/excelHelper';

interface InputDataViewProps {
  classes: ClassItem[];
  students: StudentItem[];
  staff: StaffItem[];
  onAddClass: (cls: ClassItem) => void;
  onAddClassesBatch: (classes: ClassItem[]) => void;
  onAddStudent: (std: StudentItem) => boolean; // returns false if duplicate
  onAddStudentsBatch: (students: StudentItem[]) => { added: number; duplicates: string[] };
  onAddStaff: (member: StaffItem) => void;
  onAddStaffBatch: (members: StaffItem[]) => void;
}

type InputTab = 'kelas_ekskul' | 'siswa' | 'guru' | 'kepegawaian';

export const InputDataView: React.FC<InputDataViewProps> = ({
  classes,
  students,
  staff,
  onAddClass,
  onAddClassesBatch,
  onAddStudent,
  onAddStudentsBatch,
  onAddStaff,
  onAddStaffBatch,
}) => {
  const [activeTab, setActiveTab] = useState<InputTab>('siswa');
  const [duplicateModalInfo, setDuplicateModalInfo] = useState<{ isOpen: boolean; message: string; duplicateNisns: string[] }>({
    isOpen: false,
    message: '',
    duplicateNisns: []
  });
  const [successToast, setSuccessToast] = useState<string>('');

  // 1. Form State: Kelas & Ekskul
  const [classForm, setClassForm] = useState({
    nama: '',
    tipe: 'utama' as 'utama' | 'ekskul',
    tingkat: 1,
    ruangan: '',
    deskripsi: '',
    tahunAjaran: '2026/2027'
  });

  // 2. Form State: Siswa (Reguler vs Pindahan)
  const [isSiswaPindahan, setIsSiswaPindahan] = useState(false);
  const [studentForm, setStudentForm] = useState({
    nisn: '',
    nis: '',
    nama: '',
    tempatLahir: 'Bogor',
    tanggalLahir: '2018-05-15',
    agama: 'Islam' as 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu',
    jk: 'L' as 'L' | 'P',
    nik: '',
    alamat: 'Kp. Bantarkopo RT 001/004 Desa Bantarjati',
    tinggiBadan: '',
    beratBadan: '',
    kelasId: classes[0]?.id || 'cls-1a',
    // Pindahan fields
    sekolahAsal: '',
    tanggalPindah: '2026-08-01',
    alasanPindah: 'Mengikuti orang tua pindah dinas kerja'
  });

  // 3. Form State: Guru
  const [guruForm, setGuruForm] = useState({
    nip: '',
    nama: '',
    jk: 'L' as 'L' | 'P',
    status: 'PNS' as 'PNS' | 'PPPK' | 'Honor',
    jabatan: 'Guru Kelas',
    pangkatGol: 'IIIa',
    programStudi: 'S1 – PGSD',
    telepon: '',
    email: '',
    waliKelasRombel: ''
  });

  // 4. Form State: Kepegawaian (Tendik / Non-Guru)
  const [tendikForm, setTendikForm] = useState({
    nip: '-',
    nama: '',
    jk: 'L' as 'L' | 'P',
    status: 'Honor' as 'PNS' | 'PPPK' | 'Honor',
    jabatan: 'Tendik / TU',
    pangkatGol: '-',
    programStudi: 'SMA / SMK',
    telepon: '',
    email: ''
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // HANDLERS: Kelas & Ekskul
  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.nama.trim()) return;

    const newId = `cls-${Date.now().toString().slice(-6)}`;
    const newClass: ClassItem = {
      id: newId,
      nama: classForm.nama,
      tipe: classForm.tipe,
      tingkat: classForm.tipe === 'utama' ? Number(classForm.tingkat) : 0,
      ruangan: classForm.ruangan || 'Ruang Standar',
      deskripsi: classForm.deskripsi,
      tahunAjaran: classForm.tahunAjaran
    };

    onAddClass(newClass);
    showToast(`Berhasil menambahkan ${classForm.tipe === 'utama' ? 'Kelas' : 'Ekskul'}: ${classForm.nama}`);
    setClassForm({
      nama: '',
      tipe: 'utama',
      tingkat: 1,
      ruangan: '',
      deskripsi: '',
      tahunAjaran: '2026/2027'
    });
  };

  const handleImportClassesExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile<any>(file);
      const imported: ClassItem[] = rows.map((r, i) => ({
        id: `cls-imp-${Date.now()}-${i}`,
        nama: r['Nama_Kelas'] || r['nama'] || `Kelas Tambahan ${i + 1}`,
        tipe: (r['Tipe'] || r['tipe'] || 'utama').toLowerCase() === 'ekskul' ? 'ekskul' : 'utama',
        tingkat: Number(r['Tingkat'] || r['tingkat'] || 1),
        ruangan: r['Ruangan'] || r['ruangan'] || 'Ruang Kelas',
        tahunAjaran: r['Tahun_Ajaran'] || r['tahunAjaran'] || '2026/2027',
        deskripsi: r['Deskripsi'] || r['deskripsi'] || ''
      }));

      onAddClassesBatch(imported);
      showToast(`Berhasil mengimpor ${imported.length} data Kelas/Ekskul dari Excel!`);
    } catch (err) {
      alert('Gagal membaca file Excel. Pastikan format sesuai template.');
    }
  };

  // HANDLERS: Siswa (Single & Batch with strict NISN check)
  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNisn = studentForm.nisn.trim();
    if (!cleanNisn) {
      alert('NISN wajib diisi!');
      return;
    }

    // Check duplicate NISN
    const isDuplicate = students.some(s => s.nisn.toLowerCase() === cleanNisn.toLowerCase());
    if (isDuplicate) {
      setDuplicateModalInfo({
        isOpen: true,
        message: `PERINGATAN: NISN "${cleanNisn}" SUDAH TERDAFTAR dalam sistem SIPANTAU!`,
        duplicateNisns: [cleanNisn]
      });
      return;
    }

    const newStudent: StudentItem = {
      id: cleanNisn,
      nisn: cleanNisn,
      nis: studentForm.nis.trim() || cleanNisn.slice(-6),
      nama: studentForm.nama.trim(),
      tempatLahir: studentForm.tempatLahir.trim(),
      tanggalLahir: studentForm.tanggalLahir,
      agama: studentForm.agama,
      jk: studentForm.jk,
      nik: studentForm.nik.trim() || `320124${cleanNisn.slice(0, 10)}`,
      alamat: studentForm.alamat.trim(),
      tinggiBadan: studentForm.tinggiBadan ? Number(studentForm.tinggiBadan) : undefined,
      beratBadan: studentForm.beratBadan ? Number(studentForm.beratBadan) : undefined,
      kelasId: studentForm.kelasId,
      status: isSiswaPindahan ? 'pindahan' : 'aktif',
      isPIP: false,
      ekskulIds: ['ekskul-01'], // Pramuka Wajib
      sekolahAsal: isSiswaPindahan ? studentForm.sekolahAsal.trim() : undefined,
      tanggalPindah: isSiswaPindahan ? studentForm.tanggalPindah : undefined,
      alasanPindah: isSiswaPindahan ? studentForm.alasanPindah : undefined
    };

    const success = onAddStudent(newStudent);
    if (success) {
      showToast(`Data Siswa ${newStudent.nama} (${newStudent.nisn}) berhasil disimpan!`);
      // Reset form
      setStudentForm({
        nisn: '',
        nis: '',
        nama: '',
        tempatLahir: 'Bogor',
        tanggalLahir: '2018-05-15',
        agama: 'Islam',
        jk: 'L',
        nik: '',
        alamat: 'Kp. Bantarkopo RT 001/004 Desa Bantarjati',
        tinggiBadan: '',
        beratBadan: '',
        kelasId: classes[0]?.id || 'cls-1a',
        sekolahAsal: '',
        tanggalPindah: '2026-08-01',
        alasanPindah: 'Mengikuti kepindahan orang tua'
      });
    }
  };

  const handleImportStudentsExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile<any>(file);
      const newItems: StudentItem[] = [];

      for (const r of rows) {
        const rawNisn = String(r['NISN'] || r['nisn'] || '').trim();
        if (!rawNisn) continue;

        // Resolve target class
        const targetClassName = String(r['Nama_Kelas'] || r['kelas'] || '').trim();
        const matchedClass = classes.find(c => c.nama.toLowerCase() === targetClassName.toLowerCase());
        const kelasId = matchedClass ? matchedClass.id : (classes[0]?.id || 'cls-1a');

        const isPip = String(r['Penerima_PIP'] || '').toUpperCase() === 'YA';

        newItems.push({
          id: rawNisn,
          nisn: rawNisn,
          nis: String(r['NIS'] || r['nis'] || rawNisn.slice(-6)),
          nama: String(r['Nama_Lengkap'] || r['nama'] || 'Siswa Baru').trim(),
          tempatLahir: String(r['Tempat_Lahir'] || 'Bogor').trim(),
          tanggalLahir: String(r['Tanggal_Lahir'] || '2018-01-01').trim(),
          agama: (r['Agama'] || 'Islam') as any,
          jk: (String(r['Jenis_Kelamin'] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L'),
          nik: String(r['NIK'] || `320124${rawNisn}`),
          alamat: String(r['Alamat'] || 'Desa Bantarjati Klapanunggal').trim(),
          tinggiBadan: r['Tinggi_Badan_cm'] ? Number(r['Tinggi_Badan_cm']) : undefined,
          beratBadan: r['Berat_Badan_kg'] ? Number(r['Berat_Badan_kg']) : undefined,
          kelasId,
          status: 'aktif',
          isPIP: isPip,
          ekskulIds: ['ekskul-01']
        });
      }

      const result = onAddStudentsBatch(newItems);
      if (result.duplicates.length > 0) {
        setDuplicateModalInfo({
          isOpen: true,
          message: `Sistem menemukan ${result.duplicates.length} data dengan NISN yang sudah terdaftar (double). Data duplikat ditolak otomatis demi validitas!`,
          duplicateNisns: result.duplicates
        });
      }

      if (result.added > 0) {
        showToast(`Berhasil menambahkan ${result.added} siswa baru dari template Excel.`);
      }
    } catch (err) {
      alert('Gagal memproses file template Excel siswa. Pastikan format data valid.');
    }
  };

  // HANDLERS: Guru
  const handleSubmitGuru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruForm.nama.trim()) return;

    const newStaff: StaffItem = {
      id: `staff-${Date.now().toString().slice(-6)}`,
      nip: guruForm.nip.trim() || '-',
      nama: guruForm.nama.trim(),
      jk: guruForm.jk,
      status: guruForm.status,
      jabatan: guruForm.jabatan.trim(),
      pangkatGol: guruForm.pangkatGol.trim() || '-',
      programStudi: guruForm.programStudi.trim(),
      isGuru: true,
      isAktif: true,
      telepon: guruForm.telepon.trim(),
      email: guruForm.email.trim(),
      waliKelasRombel: guruForm.waliKelasRombel || undefined
    };

    onAddStaff(newStaff);
    showToast(`Data Guru ${newStaff.nama} berhasil ditambahkan!`);
    setGuruForm({
      nip: '',
      nama: '',
      jk: 'L',
      status: 'PNS',
      jabatan: 'Guru Kelas',
      pangkatGol: 'IIIa',
      programStudi: 'S1 – PGSD',
      telepon: '',
      email: '',
      waliKelasRombel: ''
    });
  };

  const handleImportGuruExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile<any>(file);
      const batch: StaffItem[] = rows.map((r, i) => ({
        id: `staff-imp-${Date.now()}-${i}`,
        nip: String(r['NIP'] || '-').trim(),
        nama: String(r['Nama_Lengkap'] || r['nama'] || 'Pendidik').trim(),
        jk: (String(r['Jenis_Kelamin'] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L'),
        status: (r['Status'] || 'Honor') as any,
        jabatan: String(r['Jabatan'] || 'Guru').trim(),
        pangkatGol: String(r['Pangkat_Golongan'] || '-').trim(),
        programStudi: String(r['Program_Studi'] || 'S1 - PGSD').trim(),
        isGuru: true,
        isAktif: true,
        telepon: String(r['No_HP'] || '').trim()
      }));

      onAddStaffBatch(batch);
      showToast(`Berhasil mengimpor ${batch.length} data Guru dari Excel!`);
    } catch (err) {
      alert('Gagal memproses file template guru.');
    }
  };

  // HANDLERS: Kepegawaian (Tendik)
  const handleSubmitTendik = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tendikForm.nama.trim()) return;

    const newTendik: StaffItem = {
      id: `staff-${Date.now().toString().slice(-6)}`,
      nip: tendikForm.nip.trim() || '-',
      nama: tendikForm.nama.trim(),
      jk: tendikForm.jk,
      status: tendikForm.status,
      jabatan: tendikForm.jabatan.trim(),
      pangkatGol: tendikForm.pangkatGol.trim() || '-',
      programStudi: tendikForm.programStudi.trim(),
      isGuru: false,
      isAktif: true,
      telepon: tendikForm.telepon.trim(),
      email: tendikForm.email.trim()
    };

    onAddStaff(newTendik);
    showToast(`Data Pegawai ${newTendik.nama} berhasil ditambahkan!`);
    setTendikForm({
      nip: '-',
      nama: '',
      jk: 'L',
      status: 'Honor',
      jabatan: 'Tendik / TU',
      pangkatGol: '-',
      programStudi: 'SMA / SMK',
      telepon: '',
      email: ''
    });
  };

  const handleImportTendikExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile<any>(file);
      const batch: StaffItem[] = rows.map((r, i) => ({
        id: `staff-imp-tendik-${Date.now()}-${i}`,
        nip: String(r['NIP'] || '-').trim(),
        nama: String(r['Nama_Lengkap'] || r['nama'] || 'Pegawai').trim(),
        jk: (String(r['Jenis_Kelamin'] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L'),
        status: (r['Status'] || 'Honor') as any,
        jabatan: String(r['Jabatan'] || 'Staff').trim(),
        pangkatGol: String(r['Pangkat_Golongan'] || '-').trim(),
        programStudi: String(r['Pendidikan'] || 'SMA').trim(),
        isGuru: false,
        isAktif: true,
        telepon: String(r['No_HP'] || '').trim()
      }));

      onAddStaffBatch(batch);
      showToast(`Berhasil mengimpor ${batch.length} data Kepegawaian dari Excel!`);
    } catch (err) {
      alert('Gagal membaca file kepegawaian.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-red-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* NISN Duplicate Alert Modal */}
      {duplicateModalInfo.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-rose-200 p-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2 bg-rose-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Peringatan NISN Duplikat (Double)
              </h3>
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed">
              {duplicateModalInfo.message}
            </p>

            <div className="mt-3 bg-rose-50 p-3 rounded-lg border border-rose-100 max-h-32 overflow-y-auto">
              <div className="text-[11px] font-semibold text-rose-800 mb-1">
                Daftar NISN yang Terdeteksi Double:
              </div>
              <ul className="text-xs font-mono text-rose-900 list-disc list-inside space-y-0.5">
                {duplicateModalInfo.duplicateNisns.map((nisn, idx) => (
                  <li key={idx}>{nisn}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setDuplicateModalInfo({ isOpen: false, message: '', duplicateNisns: [] })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Tutup & Periksa Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Title & Tab Navigation */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Input Data Terpadu SDN Nambo 03
            </h2>
            <p className="text-xs text-slate-500">
              Formulir input manual & sistem import berkas Excel (.xlsx) dengan proteksi duplikasi NISN
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('siswa')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'siswa'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Input Siswa ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kelas_ekskul')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kelas_ekskul'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Input Kelas & Ekskul ({classes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guru')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'guru'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Input Guru ({staff.filter(s => s.isGuru).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kepegawaian')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kepegawaian'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Input Kepegawaian TU/Tendik ({staff.filter(s => !s.isGuru).length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INPUT SISWA */}
      {activeTab === 'siswa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Form Input Siswa */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isSiswaPindahan ? 'Formulir Siswa Baru Pindahan' : 'Formulir Siswa Baru / Reguler'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  NISN dijadikan sebagai ID unik (tidak boleh double)
                </p>
              </div>

              {/* Toggle: Siswa Baru Pindahan */}
              <button
                type="button"
                onClick={() => setIsSiswaPindahan(!isSiswaPindahan)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSiswaPindahan
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{isSiswaPindahan ? 'Mode: Siswa Pindahan' : 'Pilih: Siswa Baru Pindahan'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmitStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* NISN */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN <span className="text-rose-500">* (ID Unik 10 Digit)</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={studentForm.nisn}
                    onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value.replace(/\D/g, '') })}
                    placeholder="Contoh: 3195501001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* NIS */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIS (Nomor Induk Sekolah)
                  </label>
                  <input
                    type="text"
                    value={studentForm.nis}
                    onChange={(e) => setStudentForm({ ...studentForm, nis: e.target.value })}
                    placeholder="Contoh: 20260401"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Nama Lengkap */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.nama}
                    onChange={(e) => setStudentForm({ ...studentForm, nama: e.target.value })}
                    placeholder="Nama sesuai akta kelahiran..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                {/* Tempat Lahir */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={studentForm.tempatLahir}
                    onChange={(e) => setStudentForm({ ...studentForm, tempatLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    required
                    value={studentForm.tanggalLahir}
                    onChange={(e) => setStudentForm({ ...studentForm, tanggalLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={studentForm.jk}
                    onChange={(e) => setStudentForm({ ...studentForm, jk: e.target.value as 'L' | 'P' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                {/* Agama */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agama
                  </label>
                  <select
                    value={studentForm.agama}
                    onChange={(e) => setStudentForm({ ...studentForm, agama: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                {/* NIK */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIK Siswa / KK
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={studentForm.nik}
                    onChange={(e) => setStudentForm({ ...studentForm, nik: e.target.value.replace(/\D/g, '') })}
                    placeholder="16 digit NIK..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Kelas Tujuan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Kelas Masuk <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={studentForm.kelasId}
                    onChange={(e) => setStudentForm({ ...studentForm, kelasId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    {classes.filter(c => c.tipe === 'utama').map(c => {
                      const currentCount = students.filter(s => s.kelasId === c.id).length;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.nama} ({currentCount} Siswa)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Alamat */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Tempat Tinggal
                  </label>
                  <input
                    type="text"
                    value={studentForm.alamat}
                    onChange={(e) => setStudentForm({ ...studentForm, alamat: e.target.value })}
                    placeholder="Contoh: Kp. Bantarkopo RT 001/004 Desa Bantarjati..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Tinggi & Berat (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tinggi Badan (cm) <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    value={studentForm.tinggiBadan}
                    onChange={(e) => setStudentForm({ ...studentForm, tinggiBadan: e.target.value })}
                    placeholder="Contoh: 120"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Berat Badan (kg) <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    value={studentForm.beratBadan}
                    onChange={(e) => setStudentForm({ ...studentForm, beratBadan: e.target.value })}
                    placeholder="Contoh: 24"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

              </div>

              {/* Special Form Section for Siswa Pindahan */}
              {isSiswaPindahan && (
                <div className="mt-4 p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                    <span>Data Riwayat Mutasi Masuk (Siswa Pindahan)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Sekolah Asal <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={isSiswaPindahan}
                        value={studentForm.sekolahAsal}
                        onChange={(e) => setStudentForm({ ...studentForm, sekolahAsal: e.target.value })}
                        placeholder="Contoh: SD Negeri Klapanunggal 01"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Tanggal Pindah Masuk
                      </label>
                      <input
                        type="date"
                        value={studentForm.tanggalPindah}
                        onChange={(e) => setStudentForm({ ...studentForm, tanggalPindah: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-700 mb-1">
                        Alasan Kepindahan
                      </label>
                      <input
                        type="text"
                        value={studentForm.alasanPindah}
                        onChange={(e) => setStudentForm({ ...studentForm, alasanPindah: e.target.value })}
                        placeholder="Contoh: Mengikuti domisili baru orang tua..."
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  Ekskul dipilih nanti di menu Manajemen Kelas
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Data Siswa</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Excel Template & Import Area */}
          <div className="space-y-4">
            
            {/* Template Download Box */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 bg-red-100 text-red-800 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Template Excel Siswa (.xlsx)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Dilengkapi 10 data dummy realistis
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Unduh format resmi Excel bukan CSV untuk menginput atau mengimpor data peserta didik secara massal.
              </p>

              <button
                type="button"
                onClick={downloadTemplateSiswa}
                className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-red-600" />
                <span>Unduh Template_Import_Siswa.xlsx</span>
              </button>
            </div>

            {/* Import Box */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Unggah Berkas Excel (.xlsx / .xls)
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Sistem akan memvalidasi setiap baris NISN agar tidak terjadi data ganda (duplikat).
              </p>

              <label className="block w-full border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-red-50/30 transition-all">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Pilih Berkas Excel Siswa
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Format .xlsx dengan 10 baris atau lebih
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportStudentsExcel}
                  className="hidden"
                />
              </label>
            </div>

            {/* Safety Information Box */}
            <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200/80 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Kebijakan Keamanan Data Siswa</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Fitur penghapusan siswa dinonaktifkan di menu input data ini untuk mencegah ketidaksengajaan. Penghapusan dan mutasi hanya dapat dilakukan di Menu Manajemen Kelas dengan otorisasi.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: INPUT KELAS & EKSKUL */}
      {activeTab === 'kelas_ekskul' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Tambah Kelas Utama atau Ekstrakurikuler
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ada 2 tipe: Kelas Utama (Rombel Pembelajaran 1-6) dan Ekstrakurikuler
            </p>

            <form onSubmit={handleSubmitClass} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tipe */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipe Kelas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={classForm.tipe}
                    onChange={(e) => setClassForm({ ...classForm, tipe: e.target.value as 'utama' | 'ekskul' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500 font-semibold"
                  >
                    <option value="utama">Kelas Utama (Rombel 1-6)</option>
                    <option value="ekskul">Ekstrakurikuler</option>
                  </select>
                </div>

                {/* Nama Kelas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Rombel / Ekskul <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={classForm.nama}
                    onChange={(e) => setClassForm({ ...classForm, nama: e.target.value })}
                    placeholder={classForm.tipe === 'utama' ? 'Contoh: Kelas 1C' : 'Contoh: Robotika & Koding Anak'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Tingkat (Hanya untuk Kelas Utama) */}
                {classForm.tipe === 'utama' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tingkat Kelas (1 - 6)
                    </label>
                    <select
                      value={classForm.tingkat}
                      onChange={(e) => setClassForm({ ...classForm, tingkat: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                    >
                      <option value={1}>Kelas 1 (Fase A)</option>
                      <option value={2}>Kelas 2 (Fase A)</option>
                      <option value={3}>Kelas 3 (Fase B)</option>
                      <option value={4}>Kelas 4 (Fase B)</option>
                      <option value={5}>Kelas 5 (Fase C)</option>
                      <option value={6}>Kelas 6 (Fase C)</option>
                    </select>
                  </div>
                )}

                {/* Ruangan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruangan / Lokasi
                  </label>
                  <input
                    type="text"
                    value={classForm.ruangan}
                    onChange={(e) => setClassForm({ ...classForm, ruangan: e.target.value })}
                    placeholder="Contoh: Gedung A Ruang 105"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Deskripsi */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keterangan Tambahan
                  </label>
                  <input
                    type="text"
                    value={classForm.deskripsi}
                    onChange={(e) => setClassForm({ ...classForm, deskripsi: e.target.value })}
                    placeholder="Deskripsi kegiatan atau rombel..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Kelas / Ekskul</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Template & Import */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Template Import Kelas (.xlsx)
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Berisi 10 data dummy kelas dan ekstrakurikuler.
              </p>
              <button
                type="button"
                onClick={downloadTemplateKelasEkskul}
                className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-red-600" />
                <span>Unduh Template_Kelas_Ekskul.xlsx</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Unggah Berkas Excel
              </h4>
              <label className="block w-full border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-red-50/30 transition-all">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Pilih Berkas Excel Kelas
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportClassesExcel}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INPUT GURU */}
      {activeTab === 'guru' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Tambah Data Guru Pendidik
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Data guru terintegrasi dengan penugasan Wali Kelas, Pembina Ekskul, dan E-Kinerja 2026
            </p>

            <form onSubmit={handleSubmitGuru} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Guru <span className="text-slate-400 font-normal">(Isi '-' jika belum ber-NIP)</span>
                  </label>
                  <input
                    type="text"
                    value={guruForm.nip}
                    onChange={(e) => setGuruForm({ ...guruForm, nip: e.target.value })}
                    placeholder="Contoh: 198203152022212019"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guruForm.nama}
                    onChange={(e) => setGuruForm({ ...guruForm, nama: e.target.value })}
                    placeholder="Contoh: Abdul Rohman Wahid, S.Pd"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={guruForm.jk}
                    onChange={(e) => setGuruForm({ ...guruForm, jk: e.target.value as 'L' | 'P' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Kepegawaian
                  </label>
                  <select
                    value={guruForm.status}
                    onChange={(e) => setGuruForm({ ...guruForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Honor">Guru Honorer / Non-ASN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tugas / Jabatan Utama
                  </label>
                  <input
                    type="text"
                    required
                    value={guruForm.jabatan}
                    onChange={(e) => setGuruForm({ ...guruForm, jabatan: e.target.value })}
                    placeholder="Contoh: Guru Kelas 1A / Guru PAI"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pangkat / Golongan
                  </label>
                  <input
                    type="text"
                    value={guruForm.pangkatGol}
                    onChange={(e) => setGuruForm({ ...guruForm, pangkatGol: e.target.value })}
                    placeholder="Contoh: IIIb / IX / -"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Program Studi / Ijazah
                  </label>
                  <input
                    type="text"
                    value={guruForm.programStudi}
                    onChange={(e) => setGuruForm({ ...guruForm, programStudi: e.target.value })}
                    placeholder="Contoh: S1 - PGSD / S1 - PAI"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={guruForm.telepon}
                    onChange={(e) => setGuruForm({ ...guruForm, telepon: e.target.value })}
                    placeholder="Contoh: 081287654321"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:bg-white"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Data Guru</span>
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Template Import Guru (.xlsx)
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Memuat 10 dummy data guru berformat Excel.
              </p>
              <button
                type="button"
                onClick={downloadTemplateGuru}
                className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-red-600" />
                <span>Unduh Template_Import_Guru.xlsx</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Unggah Berkas Excel Guru
              </h4>
              <label className="block w-full border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-red-50/30 transition-all">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Pilih Berkas Excel Guru
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportGuruExcel}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INPUT KEPEGAWAIAN (TU / Tendik) */}
      {activeTab === 'kepegawaian' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Tambah Data Kepegawaian Non-Guru (TU, Kebersihan, Penjaga)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mencakup Tenaga Administrasi Sekolah, Tata Usaha, Petugas Kebersihan, dan Penjaga Keamanan
            </p>

            <form onSubmit={handleSubmitTendik} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tendikForm.nama}
                    onChange={(e) => setTendikForm({ ...tendikForm, nama: e.target.value })}
                    placeholder="Contoh: Nurvi Latifah"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={tendikForm.jk}
                    onChange={(e) => setTendikForm({ ...tendikForm, jk: e.target.value as 'L' | 'P' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tugas / Posisi
                  </label>
                  <select
                    value={tendikForm.jabatan}
                    onChange={(e) => setTendikForm({ ...tendikForm, jabatan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  >
                    <option value="Tendik / TU">Tenaga Kependidikan / Tata Usaha (TU)</option>
                    <option value="Operator Dapodik">Operator Dapodik & IT</option>
                    <option value="Bendahara Sekolah">Bendahara BOS & Keuangan</option>
                    <option value="Pengelola Perpustakaan">Pengelola Perpustakaan</option>
                    <option value="Petugas Kebersihan">Petugas Kebersihan</option>
                    <option value="Penjaga Sekolah">Penjaga Sekolah / Keamanan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={tendikForm.status}
                    onChange={(e) => setTendikForm({ ...tendikForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  >
                    <option value="Honor">Tenaga Honorer / Kontrak</option>
                    <option value="PPPK">PPPK</option>
                    <option value="PNS">PNS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={tendikForm.programStudi}
                    onChange={(e) => setTendikForm({ ...tendikForm, programStudi: e.target.value })}
                    placeholder="Contoh: SMA / SMK / D3 / S1"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={tendikForm.telepon}
                    onChange={(e) => setTendikForm({ ...tendikForm, telepon: e.target.value })}
                    placeholder="Contoh: 085799887711"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:bg-white"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Data Kepegawaian</span>
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Template Kepegawaian (.xlsx)
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Memuat 10 dummy data staff tata usaha dan penunjang.
              </p>
              <button
                type="button"
                onClick={downloadTemplateKepegawaian}
                className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-red-600" />
                <span>Unduh Template_Kepegawaian.xlsx</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                Unggah Berkas Excel Kepegawaian
              </h4>
              <label className="block w-full border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-red-50/30 transition-all">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block">
                  Pilih Berkas Excel Kepegawaian
                </span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportTendikExcel}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
