import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Download,
  Printer,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { StaffItem, KinerjaGuruItem, ClassItem } from '../types';
import { exportToExcel } from '../utils/excelHelper';

interface StaffManagementViewProps {
  staff: StaffItem[];
  classes: ClassItem[];
  kinerja: KinerjaGuruItem[];
  onUpdateStaff: (member: StaffItem) => void;
  onDeleteStaff: (staffId: string) => void;
  onUpdateKinerja: (item: KinerjaGuruItem) => void;
  currentRole: string;
}

type StaffTab = 'data_pegawai' | 'jam_mengajar' | 'kinerja';
type KinerjaSubTab = 'praktik' | 'berakhlak' | 'tugas_tambahan' | 'penilaian_ks';

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  staff,
  classes,
  kinerja,
  onUpdateStaff,
  onDeleteStaff,
  onUpdateKinerja,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<StaffTab>('kinerja');
  const [kinerjaSubTab, setKinerjaSubTab] = useState<KinerjaSubTab>('praktik');
  
  // Selected teacher for Kinerja evaluation
  const teachers = staff.filter(s => s.isGuru && s.jabatan !== 'Ka.Sekolah');
  const [selectedGuruId, setSelectedGuruId] = useState<string>(teachers[0]?.id || 'staff-02');

  // Edit Staff Modal
  const [editStaffModal, setEditStaffModal] = useState<StaffItem | null>(null);

  // Active teacher's Kinerja record
  const currentKinerja = kinerja.find(k => k.guruId === selectedGuruId) || {
    id: `kinerja-${selectedGuruId}-2026`,
    guruId: selectedGuruId,
    guruNama: staff.find(s => s.id === selectedGuruId)?.nama || 'Guru SDN Nambo 03',
    tahun: 2026,
    periode: 'Tahunan' as const,
    praktikKinerja: {
      indikatorPilihan: 'Penerapan Disiplin Positif',
      targetPerilaku: 'Guru mengajak peserta didik menyepakati keyakinan kelas dan menyelesaikan konflik secara restitusi.',
      perencanaan: 'Menyusun perangkat ajar berdiferensiasi dan instrumen asesmen diagnostik.',
      pelaksanaan: 'Mempraktikkan pembelajaran aktif dengan interaksi positif tanpa merendahkan siswa.',
      umpanBalik: 'Peserta didik antusias, suasana kelas kondusif, dan partisipasi belajar meningkat.',
      statusObservasi: true,
      nilaiObservasi: 100,
      catatanKS: 'Sangat baik, komunikasi dua arah berjalan alami.',
      tanggalObservasi: '2026-08-25'
    },
    perilakuBerakhlak: {
      berorientasiPelayanan: { sudah: true, refleksi: 'Ramah dan solutif menanggapi kendala belajar siswa.', nilai: 95 },
      akuntabel: { sudah: true, refleksi: 'Melaksanakan tugas piket dan administrasi tepat waktu.', nilai: 96 },
      kompeten: { sudah: true, refleksi: 'Meningkatkan kompetensi koding dan kurikulum merdeka.', nilai: 95 },
      harmonis: { sudah: true, refleksi: 'Menghargai keragaman latar belakang siswa.', nilai: 98 },
      loyal: { sudah: true, refleksi: 'Menjaga nama baik SDN Nambo 03.', nilai: 97 },
      adaptif: { sudah: true, refleksi: 'Menerapkan teknologi Chromebook dalam pembelajaran.', nilai: 94 },
      kolaboratif: { sudah: true, refleksi: 'Bersinergi dengan rekan sejawat dan wali murid.', nilai: 98 },
      skorRataRata: 96.1
    },
    tugasTambahan: {
      namaTugas: 'Wali Kelas & Pembina Ekskul',
      skPenugasan: 'SK-KS/SDN03/VII/2026',
      refleksi: 'Telah mendampingi seluruh siswa dalam kegiatan ekstrakurikuler mingguan secara tertib.',
      statusPelaksanaan: 'Terlaksana Penuh' as const,
      buktiDukung: 'Laporan dan Jurnal Kegiatan',
      nilai: 95
    },
    predikatAkhir: 'Sangat Baik' as const,
    catatanKepalaSekolah: 'Kinerja prima, pertahankan inovasi pembelajaran mendalam.',
    tanggalPenilaian: '2026-10-15',
    namaPenilai: 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.',
    nipPenilai: '198607172014062001'
  };

  // Handlers for Staff toggle & delete
  const handleToggleAktif = (item: StaffItem) => {
    onUpdateStaff({ ...item, isAktif: !item.isAktif });
  };

  const handleDeleteStaff = (item: StaffItem) => {
    if (confirm(`Yakin ingin menghapus pegawai ${item.nama}?`)) {
      onDeleteStaff(item.id);
    }
  };

  // Handlers for Kinerja Updates
  const handleToggleObservasi = (observed: boolean) => {
    const updated: KinerjaGuruItem = {
      ...currentKinerja,
      praktikKinerja: {
        ...currentKinerja.praktikKinerja,
        statusObservasi: observed,
        nilaiObservasi: observed ? 100 : 80 // if observed, 100 points
      }
    };
    onUpdateKinerja(updated);
  };

  const handleUpdatePraktik = (field: string, val: any) => {
    const updated: KinerjaGuruItem = {
      ...currentKinerja,
      praktikKinerja: {
        ...currentKinerja.praktikKinerja,
        [field]: val
      }
    };
    onUpdateKinerja(updated);
  };

  const handleUpdateBerakhlak = (key: string, field: 'sudah' | 'refleksi' | 'nilai', val: any) => {
    const prevSection = (currentKinerja.perilakuBerakhlak as any)[key] || { sudah: true, refleksi: '', nilai: 90 };
    const updatedSection = { ...prevSection, [field]: val };
    const newBerakhlak = {
      ...currentKinerja.perilakuBerakhlak,
      [key]: updatedSection
    };
    
    // Recalculate average
    const keys = ['berorientasiPelayanan', 'akuntabel', 'kompeten', 'harmonis', 'loyal', 'adaptif', 'kolaboratif'];
    const total = keys.reduce((acc, k) => acc + (newBerakhlak[k as keyof typeof newBerakhlak] as any).nilai, 0);
    newBerakhlak.skorRataRata = parseFloat((total / keys.length).toFixed(1));

    onUpdateKinerja({
      ...currentKinerja,
      perilakuBerakhlak: newBerakhlak
    });
  };

  const handleUpdateTugasTambahan = (field: string, val: any) => {
    onUpdateKinerja({
      ...currentKinerja,
      tugasTambahan: {
        ...currentKinerja.tugasTambahan,
        [field]: val
      }
    });
  };

  const handleUpdatePenilaianKS = (predikat: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang', catatan: string) => {
    onUpdateKinerja({
      ...currentKinerja,
      predikatAkhir: predikat,
      catatanKepalaSekolah: catatan,
      tanggalPenilaian: new Date().toISOString().slice(0, 10)
    });
  };

  const handlePrintSKP = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Manajemen Kepegawaian & Pengelolaan Kinerja Guru 2026
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi kinerja GTK, pembagian jam mengajar, praktik observasi kelas 100 poin, perilaku BerAKHLAK, dan penetapan SKP
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-800 rounded-lg">
              Kepala Sekolah: AM. MEGA PURNAMATATI, S.Pd.,M.Pd.
            </span>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('kinerja')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kinerja' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Pengelolaan Kinerja Guru (E-Kinerja 2026)</span>
          </button>

          <button
            onClick={() => setActiveTab('data_pegawai')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'data_pegawai' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Data Kepegawaian ({staff.length} Pegawai)</span>
          </button>

          <button
            onClick={() => setActiveTab('jam_mengajar')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'jam_mengajar' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pembagian Jam Mengajar</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PENGELOLAAN KINERJA GURU 2026 */}
      {activeTab === 'kinerja' && (
        <div className="space-y-6">
          
          {/* Guru Selector & Kinerja Overview Bar (no-print) */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-800 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                  Pilih Guru Yang Dinilai:
                </label>
                <select
                  value={selectedGuruId}
                  onChange={(e) => setSelectedGuruId(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
                >
                  {teachers.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nama} ({g.jabatan}) - {g.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Print & Status Badges */}
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <div className="text-[11px] text-slate-500">Predikat Kinerja 2026:</div>
                <div className="text-xs font-bold text-red-800 font-mono">
                  {currentKinerja.predikatAkhir} (Skor Observasi: {currentKinerja.praktikKinerja.nilaiObservasi})
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrintSKP}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar SKP 2026 (PDF)</span>
              </button>
            </div>
          </div>

          {/* Subtabs for Kinerja (no-print) */}
          <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-xs no-print flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setKinerjaSubTab('praktik')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                kinerjaSubTab === 'praktik' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Praktik Kinerja & Observasi Kelas (Point 100)</span>
            </button>

            <button
              onClick={() => setKinerjaSubTab('berakhlak')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                kinerjaSubTab === 'berakhlak' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Perilaku BerAKHLAK (7 Indikator)</span>
            </button>

            <button
              onClick={() => setKinerjaSubTab('tugas_tambahan')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                kinerjaSubTab === 'tugas_tambahan' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>3. Tugas Tambahan & Refleksi</span>
            </button>

            <button
              onClick={() => setKinerjaSubTab('penilaian_ks')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                kinerjaSubTab === 'penilaian_ks' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>4. Penilaian Akhir Kepala Sekolah</span>
            </button>
          </div>

          {/* KINERJA SUBTAB 1: PRAKTIK KINERJA OBSERVASI KELAS */}
          {kinerjaSubTab === 'praktik' && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Praktik Kinerja Pembelajaran (Alur: Perencanaan, Pelaksanaan & Umpan Balik)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jika sudah diobservasi langsung oleh Kepala Sekolah, skor kinerja guru otomatis bernilai 100 poin
                  </p>
                </div>

                {/* Status Observasi Switcher */}
                <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">
                    Status Observasi KS:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleObservasi(!currentKinerja.praktikKinerja.statusObservasi)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentKinerja.praktikKinerja.statusObservasi
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {currentKinerja.praktikKinerja.statusObservasi ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>SUDAH DIOBSERVASI (POIN: 100)</span>
                      </>
                    ) : (
                      <span>BELUM DIOBSERVASI</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Form Input Praktik Kinerja */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pilihan Indikator Kinerja Guru (Dapat Dipilih Manual)
                  </label>
                  <select
                    value={currentKinerja.praktikKinerja.indikatorPilihan}
                    onChange={(e) => handleUpdatePraktik('indikatorPilihan', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium"
                  >
                    <option value="Penerapan Disiplin Positif">Penerapan Disiplin Positif (Kesepakatan Kelas & Restitusi)</option>
                    <option value="Keteraturan Suasana Kelas">Keteraturan Suasana Kelas (Manajemen Waktu & Fokus Siswa)</option>
                    <option value="Umpan Balik Konstruktif">Umpan Balik Konstruktif (Respon Aktif & Apresiasi)</option>
                    <option value="Ekspektasi pada Peserta Didik">Ekspektasi pada Peserta Didik (Motivasi & Standar Tinggi)</option>
                    <option value="Aktivitas Interaktif">Aktivitas Interaktif (Pembelajaran Kolaboratif Berdiferensiasi)</option>
                    <option value="Instruksi Pembelajaran">Instruksi Pembelajaran (Penyampaian Materi Jelas & Runtut)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Perilaku Spesifik
                  </label>
                  <input
                    type="text"
                    value={currentKinerja.praktikKinerja.targetPerilaku}
                    onChange={(e) => handleUpdatePraktik('targetPerilaku', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                {/* 3 Tahap Alur: Perencanaan, Pelaksanaan, Umpan Balik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      1. Tahap Perencanaan
                    </span>
                    <textarea
                      rows={3}
                      value={currentKinerja.praktikKinerja.perencanaan}
                      onChange={(e) => handleUpdatePraktik('perencanaan', e.target.value)}
                      placeholder="Uraian persiapan perangkat ajar dan media..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      2. Tahap Pelaksanaan Kelas
                    </span>
                    <textarea
                      rows={3}
                      value={currentKinerja.praktikKinerja.pelaksanaan}
                      onChange={(e) => handleUpdatePraktik('pelaksanaan', e.target.value)}
                      placeholder="Uraian jalannya observasi interaksi di kelas..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      3. Umpan Balik Observasi
                    </span>
                    <textarea
                      rows={3}
                      value={currentKinerja.praktikKinerja.umpanBalik}
                      onChange={(e) => handleUpdatePraktik('umpanBalik', e.target.value)}
                      placeholder="Refleksi tindak lanjut dan respon peserta didik..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Supervisi Kepala Sekolah (AM. MEGA PURNAMATATI, S.Pd.,M.Pd.)
                  </label>
                  <input
                    type="text"
                    value={currentKinerja.praktikKinerja.catatanKS}
                    onChange={(e) => handleUpdatePraktik('catatanKS', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* KINERJA SUBTAB 2: PERILAKU BERAKHLAK */}
          {kinerjaSubTab === 'berakhlak' && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 no-print">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Evaluasi 7 Dimensi Perilaku BerAKHLAK Guru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">Rata-rata Nilai:</span>
                  <span className="text-sm font-mono font-bold text-red-800 ml-1">
                    {currentKinerja.perilakuBerakhlak.skorRataRata}
                  </span>
                </div>
              </div>

              {/* 7 Indikator Rows */}
              <div className="space-y-3 text-xs">
                {[
                  { key: 'berorientasiPelayanan', label: '1. Berorientasi Pelayanan', q: 'Apakah guru memberikan bimbingan ramah, responsif, dan mengutamakan kebutuhan belajar siswa di sekolah?' },
                  { key: 'akuntabel', label: '2. Akuntabel', q: 'Apakah guru melaksanakan tugas mengajar, memeriksa tugas, dan mengelola sarana sekolah secara jujur dan bertanggung jawab?' },
                  { key: 'kompeten', label: '3. Kompeten', q: 'Apakah guru aktif meningkatkan kompetensi diri, mengikuti pelatihan Koding/PMM, dan membantu rekan sejawat?' },
                  { key: 'harmonis', label: '4. Harmonis', q: 'Apakah guru menghargai setiap perbedaan latar belakang siswa/rekan dan membangun suasana kerja yang kondusif?' },
                  { key: 'loyal', label: '5. Loyal', q: 'Apakah guru memegang teguh ideologi Pancasila, menjaga nama baik sekolah SDN Nambo 03, dan patuh pada arahan kedinasan?' },
                  { key: 'adaptif', label: '6. Adaptif', q: 'Apakah guru cepat menyesuaikan diri menghadapi perubahan kurikulum merdeka dan bertindak proaktif dalam teknologi?' },
                  { key: 'kolaboratif', label: '7. Kolaboratif', q: 'Apakah guru terbuka bekerja sama dengan sesama pendidik, orang tua murid, dan lingkungan sekitar?' }
                ].map((item) => {
                  const state = (currentKinerja.perilakuBerakhlak as any)[item.key] || { sudah: true, refleksi: '', nilai: 95 };
                  return (
                    <div key={item.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="md:w-1/3">
                        <span className="font-bold text-slate-900 block">{item.label}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.q}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium text-red-800 bg-red-50 px-2 py-1 rounded-md">
                          <input
                            type="checkbox"
                            checked={state.sudah}
                            onChange={(e) => handleUpdateBerakhlak(item.key, 'sudah', e.target.checked)}
                            className="rounded-xs text-red-600"
                          />
                          <span>Terpenuhi</span>
                        </label>
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          value={state.refleksi}
                          onChange={(e) => handleUpdateBerakhlak(item.key, 'refleksi', e.target.value)}
                          placeholder="Bukti perilaku / refleksi guru..."
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs"
                        />
                      </div>

                      <div className="w-20 shrink-0 text-right">
                        <input
                          type="number"
                          min={70}
                          max={100}
                          value={state.nilai}
                          onChange={(e) => handleUpdateBerakhlak(item.key, 'nilai', Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-center"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* KINERJA SUBTAB 3: TUGAS TAMBAHAN */}
          {kinerjaSubTab === 'tugas_tambahan' && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 no-print">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b">
                Pelaksanaan Tugas Tambahan Guru SDN Nambo 03
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Penugasan Tambahan
                  </label>
                  <input
                    type="text"
                    value={currentKinerja.tugasTambahan.namaTugas}
                    onChange={(e) => handleUpdateTugasTambahan('namaTugas', e.target.value)}
                    placeholder="Contoh: Wali Kelas 1A / Pembina Pramuka / Bendahara BOS..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Pelaksanaan
                  </label>
                  <select
                    value={currentKinerja.tugasTambahan.statusPelaksanaan}
                    onChange={(e) => handleUpdateTugasTambahan('statusPelaksanaan', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold"
                  >
                    <option value="Terlaksana Penuh">Terlaksana Penuh (100%)</option>
                    <option value="Sebagian">Sebagian</option>
                    <option value="Belum">Belum Terlaksana</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Refleksi Guru Terhadap Pelaksanaan Tugas Tambahan
                  </label>
                  <textarea
                    rows={3}
                    value={currentKinerja.tugasTambahan.refleksi}
                    onChange={(e) => handleUpdateTugasTambahan('refleksi', e.target.value)}
                    placeholder="Tuliskan kendala, solusi, dan pencapaian selama menjalankan tugas tambahan..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bukti Dukung Kegiatan (Laporan / SK / Foto)
                  </label>
                  <input
                    type="text"
                    value={currentKinerja.tugasTambahan.buktiDukung}
                    onChange={(e) => handleUpdateTugasTambahan('buktiDukung', e.target.value)}
                    placeholder="Contoh: Laporan Mingguan Pembina Ekskul terlampir"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nilai Tugas Tambahan
                  </label>
                  <input
                    type="number"
                    min={70}
                    max={100}
                    value={currentKinerja.tugasTambahan.nilai}
                    onChange={(e) => handleUpdateTugasTambahan('nilai', Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* KINERJA SUBTAB 4: PENILAIAN AKHIR KEPALA SEKOLAH */}
          {kinerjaSubTab === 'penilaian_ks' && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 no-print">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b">
                Penetapan Predikat Kinerja 2026 oleh Kepala Sekolah
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Predikat Kinerja Akhir Tahun 2026
                  </label>
                  <select
                    value={currentKinerja.predikatAkhir}
                    onChange={(e) => handleUpdatePenilaianKS(e.target.value as any, currentKinerja.catatanKepalaSekolah)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-bold text-sm text-red-800"
                  >
                    <option value="Sangat Baik">Sangat Baik (Istimewa)</option>
                    <option value="Baik">Baik (Memenuhi Ekspektasi Pimpinan)</option>
                    <option value="Cukup">Cukup (Perlu Pembinaan Lanjut)</option>
                    <option value="Kurang">Kurang (Di Bawah Ekspektasi)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama & NIP Kepala Sekolah Penilai
                  </label>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900">AM. MEGA PURNAMATATI, S. Pd.,M.Pd.</div>
                    <div className="text-[11px] text-slate-500 font-mono">NIP. 198607172014062001</div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan & Rekomendasi Resmi Kepala Sekolah
                  </label>
                  <textarea
                    rows={3}
                    value={currentKinerja.catatanKepalaSekolah}
                    onChange={(e) => handleUpdatePenilaianKS(currentKinerja.predikatAkhir, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRINTABLE OFFICIAL SKP 2026 FORM (Clean print layout) */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm print:p-0 print:border-0">
            <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
              <div className="flex items-center justify-between gap-4 mb-2">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17__1__e4d8a6c0.jpeg"
                  alt="Logo Kab Bogor"
                  className="h-16 w-auto object-contain shrink-0"
                />
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-700">
                    PEMERINTAH KABUPATEN BOGOR · DINAS PENDIDIKAN
                  </h4>
                  <h2 className="text-lg font-black text-slate-900">
                    SD NEGERI NAMBO 03 KLAPANUNGGAL
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    NPSN: 20200352 · Jl. Raya Nambo Bantarkopo RT 001/004 Desa Bantarjati
                  </p>
                </div>
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17_94b6fe75.jpeg"
                  alt="Logo SDN Nambo 03"
                  className="h-16 w-auto object-contain shrink-0"
                />
              </div>

              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mt-3">
                LEMBAR EVALUASI & PREDIKAT KINERJA GURU TAHUN 2026
              </h3>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-4 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-500 block">Pegawai yang Dinilai:</span>
                <span className="font-bold text-sm text-slate-900 block">{currentKinerja.guruNama}</span>
                <span className="text-slate-600 font-mono">
                  NIP: {staff.find(s => s.id === currentKinerja.guruId)?.nip || '-'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Pejabat Penilai Kinerja:</span>
                <span className="font-bold text-sm text-slate-900 block">AM. MEGA PURNAMATATI, S. Pd.,M.Pd.</span>
                <span className="text-slate-600 font-mono">NIP. 198607172014062001 (Kepala Sekolah)</span>
              </div>
            </div>

            {/* Summary Table */}
            <table className="w-full text-left text-xs divide-y divide-slate-200 border border-slate-200 mb-4">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="p-2.5">Komponen Penilaian</th>
                  <th className="p-2.5">Rincian / Indikator</th>
                  <th className="p-2.5 text-center">Status / Capaian</th>
                  <th className="p-2.5 text-center">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold">1. Praktik Kinerja</td>
                  <td className="p-2.5">{currentKinerja.praktikKinerja.indikatorPilihan}</td>
                  <td className="p-2.5 text-center font-semibold text-red-800">
                    {currentKinerja.praktikKinerja.statusObservasi ? 'Terobservasi Kepala Sekolah' : 'Belum Diobservasi'}
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                    {currentKinerja.praktikKinerja.nilaiObservasi}
                  </td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold">2. Perilaku BerAKHLAK</td>
                  <td className="p-2.5">7 Dimensi Nilai Inti ASN BerAKHLAK Terpenuhi</td>
                  <td className="p-2.5 text-center font-semibold text-red-800">Sesuai Ekspektasi</td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                    {currentKinerja.perilakuBerakhlak.skorRataRata}
                  </td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold">3. Tugas Tambahan</td>
                  <td className="p-2.5">{currentKinerja.tugasTambahan.namaTugas}</td>
                  <td className="p-2.5 text-center font-semibold text-red-800">
                    {currentKinerja.tugasTambahan.statusPelaksanaan}
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                    {currentKinerja.tugasTambahan.nilai}
                  </td>
                </tr>

                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="p-2.5 text-right uppercase">
                    PREDIKAT KINERJA AKHIR TAHUN 2026:
                  </td>
                  <td className="p-2.5 text-center font-mono text-sm text-red-800 uppercase">
                    {currentKinerja.predikatAkhir}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-6">
              <span className="font-bold text-slate-800 block mb-0.5">Catatan Kepala Sekolah:</span>
              <p className="text-slate-600 italic">"{currentKinerja.catatanKepalaSekolah}"</p>
            </div>

            {/* Official Signatures */}
            <div className="flex justify-between items-start text-xs text-slate-800 print-break-inside-avoid">
              <div>
                <p>Pegawai yang Dinilai,</p>
                <div className="h-16"></div>
                <p className="font-bold underline">{currentKinerja.guruNama}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  NIP: {staff.find(s => s.id === currentKinerja.guruId)?.nip || '-'}
                </p>
              </div>

              <div className="text-right">
                <p>Klapanunggal, 20 Desember 2026</p>
                <p className="font-semibold">Kepala Sekolah SD Negeri Nambo 03</p>
                <div className="h-16"></div>
                <p className="font-bold underline">AM. MEGA PURNAMATATI, S. Pd.,M.Pd.</p>
                <p className="text-[11px] text-slate-500 font-mono">NIP. 198607172014062001</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DATA KEPEGAWAIAN (16 GTK SDN NAMBO 03) */}
      {activeTab === 'data_pegawai' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden no-print">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Tenaga Pendidik & Kependidikan (GTK)
              </h3>
              <p className="text-xs text-slate-500">
                Total 16 Pegawai sesuai data sekolah resmi SD Negeri Nambo 03
              </p>
            </div>

            <button
              onClick={() => {
                const data = staff.map((s, idx) => ({
                  'No': idx + 1,
                  'Nama Guru / GTK': s.nama,
                  'L/P': s.jk,
                  'Status': s.status,
                  'Jabatan': s.jabatan,
                  'Pangkat/Gol': s.pangkatGol,
                  'Program Studi': s.programStudi,
                  'No HP': s.telepon || '-',
                  'Status Aktif': s.isAktif ? 'Aktif' : 'Non-Aktif'
                }));
                exportToExcel(data, 'Data_GTK_SDN_Nambo_03', 'GTK');
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor GTK ke Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3">Nama Pegawai / Guru</th>
                  <th className="p-3 text-center">L/P</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Jabatan</th>
                  <th className="p-3">Pangkat/Gol</th>
                  <th className="p-3">Program Studi</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {staff.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.nama}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NIP: {s.nip}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        s.jk === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {s.jk}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'PNS' ? 'bg-red-100 text-red-800' :
                        s.status === 'PPPK' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{s.jabatan}</td>
                    <td className="p-3 font-mono text-slate-600">{s.pangkatGol}</td>
                    <td className="p-3 text-slate-600">{s.programStudi}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleAktif(s)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          s.isAktif ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {s.isAktif ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditStaffModal(s)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-700"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {s.jabatan !== 'Ka.Sekolah' && (
                          <button
                            onClick={() => handleDeleteStaff(s)}
                            className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PEMBAGIAN JAM MENGAJAR */}
      {activeTab === 'jam_mengajar' && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4 no-print">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Alokasi Beban Jam Mengajar Mingguan Guru (Tahun Ajaran 2026/2027)
              </h3>
              <p className="text-xs text-slate-500">
                Standar beban mengajar 24 - 37 Jam Pelajaran (JP) per minggu per pendidik
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-800 rounded-md">
              12 Rombongan Belajar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {teachers.map((g, idx) => {
              const baseJP = 24 + ((idx * 3) % 10);
              return (
                <div key={g.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-red-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 truncate pr-2">{g.nama}</span>
                    <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full shrink-0">
                      {baseJP} JP / Minggu
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mb-1">
                    <span className="font-semibold text-slate-700">Tugas:</span> {g.jabatan}
                  </div>
                  <div className="text-[11px] text-slate-600 mb-1">
                    <span className="font-semibold text-slate-700">Wali Kelas:</span> {g.waliKelasRombel || '-'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">Ekskul:</span> {g.pembinaEkskul || '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Edit Data GTK: {editStaffModal.nama}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateStaff(editStaffModal);
                setEditStaffModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editStaffModal.nama}
                  onChange={(e) => setEditStaffModal({ ...editStaffModal, nama: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP</label>
                <input
                  type="text"
                  value={editStaffModal.nip}
                  onChange={(e) => setEditStaffModal({ ...editStaffModal, nip: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={editStaffModal.jabatan}
                  onChange={(e) => setEditStaffModal({ ...editStaffModal, jabatan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                <input
                  type="text"
                  value={editStaffModal.pangkatGol}
                  onChange={(e) => setEditStaffModal({ ...editStaffModal, pangkatGol: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No WhatsApp / HP</label>
                <input
                  type="tel"
                  value={editStaffModal.telepon || ''}
                  onChange={(e) => setEditStaffModal({ ...editStaffModal, telepon: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditStaffModal(null)}
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

    </div>
  );
};
