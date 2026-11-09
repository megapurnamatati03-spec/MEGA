import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Download,
  Printer,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
  Sliders,
  Award
} from 'lucide-react';
import { HariEfektifItem, DeepLearningModuleItem, ProtaPromesItem, StaffItem, ClassItem } from '../types';
import {
  DIMENSI_PROFIL_LULUSAN,
  MATA_PELAJARAN_LIST,
  CAPAIAN_PEMBELAJARAN_DATABASE
} from '../data/initialCurriculum';
import { exportToExcel, downloadTemplateHariEfektif, parseExcelFile } from '../utils/excelHelper';

interface TeachingToolsViewProps {
  hariEfektif: HariEfektifItem[];
  modules: DeepLearningModuleItem[];
  protaPromes: ProtaPromesItem[];
  staff: StaffItem[];
  classes: ClassItem[];
  onAddHariEfektif: (item: HariEfektifItem) => void;
  onAddHariEfektifBatch: (items: HariEfektifItem[]) => void;
  onAddModule: (mod: DeepLearningModuleItem) => void;
  onAddProtaPromes: (item: ProtaPromesItem) => void;
}

type PerangkatTab = 'hari_efektif' | 'jadwal' | 'prota_promes' | 'cp_atp' | 'generator_modul';

export const TeachingToolsView: React.FC<TeachingToolsViewProps> = ({
  hariEfektif,
  modules,
  protaPromes,
  staff,
  classes,
  onAddHariEfektif,
  onAddHariEfektifBatch,
  onAddModule,
  onAddProtaPromes,
}) => {
  const [activeTab, setActiveTab] = useState<PerangkatTab>('generator_modul');

  // Generator Modul Ajar Form State
  const [selectedMapel, setSelectedMapel] = useState<string>('Koding dan Kecerdasan Artifisial');
  const [selectedFase, setSelectedFase] = useState<string>('Fase C (Kelas 5-6)');
  const [selectedKelas, setSelectedKelas] = useState<string>('Kelas 5');
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [alokasiWaktu, setAlokasiWaktu] = useState<string>('2 JP (2 x 35 Menit)');
  const [penyusun, setPenyusun] = useState<string>('Abdul Rohman Wahid, S.Pd');
  const [selectedDPL, setSelectedDPL] = useState<string[]>([
    'Penalaran Kritis & Problem Solving',
    'Kreativitas & Inovasi',
    'Kolaborasi & Gotong Royong',
    'Komunikasi Efektif & Multiliterasi'
  ]);

  // Active module preview (either from saved list or dynamic generator)
  const [activeModule, setActiveModule] = useState<DeepLearningModuleItem>(modules[0]);

  // Selected schedule class
  const [selectedScheduleClass, setSelectedScheduleClass] = useState<string>('cls-1a');

  // Prota Promes Form
  const [protaForm, setProtaForm] = useState({
    mapel: 'Koding dan Kecerdasan Artifisial',
    kelas: 'Kelas 5',
    semester: 1 as 1 | 2,
    tahunAjaran: '2026/2027',
    tujuanPembelajaran: 'Merancang algoritma percabangan visual dan melatih klasifikasi pola AI sederhana',
    alokasiJP: 16,
    bulan: 'Agustus 2026'
  });

  const teachers = staff.filter(s => s.isGuru);
  const mainClasses = classes.filter(c => c.tipe === 'utama');

  // Capaian Pembelajaran Options for selected Mapel
  const availableCPOptions = useMemo(() => {
    return CAPAIAN_PEMBELAJARAN_DATABASE[selectedMapel] || [];
  }, [selectedMapel]);

  // Auto-generate deep learning module based on selections
  const handleGenerateModule = () => {
    const cpData = availableCPOptions.find(c => c.fase === selectedFase) || availableCPOptions[0] || {
      fase: selectedFase,
      elemen: 'Pemahaman Konsep & Keterampilan Proses',
      cp: `Peserta didik mampu memahami dan mengaplikasikan konsep esensial pada mata pelajaran ${selectedMapel} secara mendalam dan kontekstual.`,
      atp: 'Memahami konsep dasar -> Menyelidiki fenomena -> Menerapkan dalam pemecahan masalah nyata.',
      tp: [
        `Peserta didik dapat memahami prinsip dasar materi ${selectedMapel}.`,
        `Peserta didik dapat mempraktikkan keterampilan melalui studi kasus kontekstual.`,
        `Peserta didik mampu merefleksikan makna pembelajaran bagi kehidupan sehari-hari.`
      ]
    };

    const newModul: DeepLearningModuleItem = {
      id: `modul-${Date.now()}`,
      mataPelajaran: selectedMapel,
      fase: selectedFase as any,
      kelas: selectedKelas,
      semester: selectedSemester,
      alokasiWaktu,
      penyusun,
      tahunAjaran: '2026/2027',
      dimensiProfilLulusan: selectedDPL,
      karakteristikPesertaDidik: `Peserta didik ${selectedKelas} memiliki rasa ingin tahu yang tinggi, menyukai aktivitas langsung (hands-on) dan diskusi interaktif, serta membutuhkan stimulus kontekstual yang dekat dengan lingkungan Desa Bantarjati dan Nambo.`,
      elemen: cpData.elemen,
      capaianPembelajaran: cpData.cp,
      alurTujuanPembelajaran: cpData.atp,
      tujuanPembelajaran: cpData.tp,
      pemahamanBermakna: `Pembelajaran mendalam pada materi ${selectedMapel} membantu peserta didik menyadari hubungan antara teori sains/koding dengan solusi permasalahan nyata di sekitar sekolah SDN Nambo 03.`,
      pertanyaanPemantik: [
        `Mengapa konsep ${selectedMapel} penting kita pelajari dalam kehidupan sehari-hari?`,
        `Bagaimana cara kita membuktikan kebenaran dari apa yang kita amati di lingkungan sekolah?`
      ],
      kegiatanAwal: 'Orientasi Berkesadaran (Mindful): Guru menyapa dengan penuh kehangatan, mengajak hening sejenak (mindful breathing) untuk memusatkan perhatian, menayangkan apersepsi video/studi kasus menarik, dan menyampaikan tujuan pembelajaran.',
      kegiatanInti: {
        tahapMemahami: 'Tahap Memahami (Meaningful Learning): Peserta didik berkolaborasi dalam kelompok kecil mencermati lembar stimulus, mendiskusikan konsep kunci, dan mengaitkan dengan pengalaman nyata mereka.',
        tahapMengaplikasi: 'Tahap Mengaplikasi: Peserta didik melakukan investigasi terbimbing / praktik pembuatan proyek mini (koding balok / eksperimen sains) secara gotong royong.',
        tahapMerefleksi: 'Tahap Merefleksi (Metakognisi): Kelompok mempresentasikan hasil karya, menerima umpan balik apresiatif dari teman sebaya, serta menyimpulkan temuan.'
      },
      kegiatanPenutup: 'Joyful Closure: Guru bersama siswa merayakan pencapaian belajar hari ini dengan tepuk apresiasi, menyimpulkan pesan moral, dan memberikan kuis refleksi mandiri ringan.',
      mediaDanBahanAjar: [
        'Chromebook / Lab Komputer SDN Nambo 03',
        'Lembar Kerja Peserta Didik (LKPD) Pembelajaran Mendalam',
        'Bahan Ajar Cetak & Video Interaktif'
      ],
      asesmenAwal: 'Asesmen Diagnostik Kognitif dan Non-Kognitif melalui kuis tanya jawab visual singkat sebelum pembelajaran dimulai.',
      asesmenFormatif: 'Penilaian Proses: Observasi keaktifan diskusi, lembar checklist kolaborasi, dan unjuk kerja praktik per kelompok.',
      asesmenSumatif: 'Penilaian Hasil: Rubrik penilaian produk/proyek dan tes pemahaman tertulis berbasis penalaran kritis (HOTS).',
      rubrikPenilaian: [
        {
          kriteria: 'Penguasaan Konsep & Penalaran',
          perluBimbingan: 'Belum mampu menjelaskan konsep materi pokok meski telah dibimbing intensif.',
          cukup: 'Menjelaskan konsep dasar namun belum mampu mengaitkan dengan contoh nyata.',
          baik: 'Mampu menjelaskan konsep dengan benar dan memberikan contoh kontekstual secara mandiri.',
          sangatBaik: 'Sangat mahir menganalisis konsep dan menghubungkannya dengan gagasan solusi inovatif.'
        },
        {
          kriteria: 'Kolaborasi & Tanggung Jawab',
          perluBimbingan: 'Pasif dan tidak berkontribusi pada penyelesaian tugas kelompok.',
          cukup: 'Menyelesaikan bagian tugas pribadi namun kurang aktif dalam diskusi bersama.',
          baik: 'Aktif berdiskusi, mendengarkan rekan, dan menyelesaikan tanggung jawab bersama tepat waktu.',
          sangatBaik: 'Menjadi teladan kolaborasi, memotivasi teman, dan menghargai keberagaman ide kelompok.'
        }
      ],
      soalIndividu: [
        `Jelaskan dengan bahasamu sendiri kesimpulan utama yang kamu peroleh dari materi ${selectedMapel} hari ini!`,
        `Tuliskan satu contoh tindakan nyata yang bisa kamu terapkan di rumah atau lingkungan sekolah setelah mempelajari materi ini!`
      ],
      tugasKelompok: `Buatlah karya infografis atau purwarupa sederhana secara berkelompok yang menggambarkan solusi kreatif untuk permasalahan lingkungan sekolah berdasarkan materi pembelajaran hari ini.`,
      lembarKerjaSiswa: `LKPD Terstruktur: Eksplorasi Pembelajaran Mendalam Materi ${selectedMapel} - SD Negeri Nambo 03.`
    };

    onAddModule(newModul);
    setActiveModule(newModul);
    alert('Modul Ajar Pembelajaran Mendalam berhasil digenerate lengkap!');
  };

  // Toggle DPL selection
  const handleToggleDPL = (dpl: string) => {
    if (selectedDPL.includes(dpl)) {
      setSelectedDPL(selectedDPL.filter(d => d !== dpl));
    } else {
      setSelectedDPL([...selectedDPL, dpl]);
    }
  };

  // Total Hari Efektif Belajar
  const totalHariEfektifBelajar = useMemo(() => {
    return hariEfektif.reduce((acc, curr) => acc + curr.hariEfektifBelajar, 0);
  }, [hariEfektif]);

  const handleExportHariEfektifExcel = () => {
    const data = hariEfektif.map((h, idx) => ({
      'No': idx + 1,
      'Bulan': h.bulan,
      'Semester': h.semester,
      'Hari Kalender': h.jumlahHariKalender,
      'Hari Efektif Sekolah': h.hariEfektifSekolah,
      'Hari Efektif Belajar': h.hariEfektifBelajar,
      'Hari Minggu': h.hariMinggu,
      'Libur Umum': h.liburUmum,
      'Libur Semester': h.liburKhususSemester,
      'Kegiatan Khusus': h.kegiatanKhusus
    }));

    exportToExcel(data, 'Analisis_Hari_Efektif_SDN_Nambo_03_2026_2027', 'Hari_Efektif');
  };

  const handleImportHariEfektifExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseExcelFile<any>(file);
      const batch: HariEfektifItem[] = rows.map((r, i) => ({
        id: `he-imp-${Date.now()}-${i}`,
        bulan: String(r['Bulan'] || `Bulan ${i + 1}`),
        semester: Number(r['Semester'] || 1) as 1 | 2,
        tahun: Number(r['Tahun'] || 2026),
        jumlahHariKalender: Number(r['Hari_Kalender'] || 30),
        hariEfektifSekolah: Number(r['Hari_Efektif_Sekolah'] || 20),
        hariEfektifBelajar: Number(r['Hari_Efektif_Belajar'] || 18),
        hariMinggu: Number(r['Hari_Minggu'] || 4),
        liburUmum: Number(r['Libur_Umum'] || 1),
        liburKhususSemester: Number(r['Libur_Semester'] || 0),
        kegiatanKhusus: String(r['Kegiatan_Khusus'] || '')
      }));

      onAddHariEfektifBatch(batch);
      alert(`Berhasil mengimpor ${batch.length} data Hari Efektif dari Excel!`);
    } catch (err) {
      alert('Gagal membaca berkas Excel hari efektif.');
    }
  };

  // Sample Schedule Generator for display
  const sampleSchedule = useMemo(() => {
    return [
      { hari: 'Senin', waktu: '07.00 - 07.45', mapel: 'Upacara Bendera', guru: 'Ibu AM. Mega Pt / Guru Kelas' },
      { hari: 'Senin', waktu: '07.45 - 09.05', mapel: 'Koding dan Kecerdasan Artifisial', guru: 'Abdul Rohman Wahid, S.Pd' },
      { hari: 'Senin', waktu: '09.05 - 09.30', mapel: 'Istirahat Pagi', guru: 'Piket Guru' },
      { hari: 'Senin', waktu: '09.30 - 11.15', mapel: 'Pendidikan Pancasila', guru: 'Guru Kelas' },
      { hari: 'Selasa', waktu: '07.00 - 07.30', mapel: 'Pembiasaan Karakter & Literasi', guru: 'Wali Kelas' },
      { hari: 'Selasa', waktu: '07.30 - 09.30', mapel: 'Matematika (Deep Learning)', guru: 'Guru Kelas' },
      { hari: 'Selasa', waktu: '10.00 - 11.45', mapel: 'Bahasa Indonesia', guru: 'Guru Kelas' },
      { hari: 'Rabu', waktu: '07.00 - 07.30', mapel: 'Senam Pagi & Kebersihan', guru: 'Guru PJOK' },
      { hari: 'Rabu', waktu: '07.30 - 09.30', mapel: 'IPAS (Eksperimen)', guru: 'Guru Kelas' },
      { hari: 'Rabu', waktu: '10.00 - 11.45', mapel: 'Bahasa dan Sastra Sunda', guru: 'Guru Mulok' },
      { hari: 'Kamis', waktu: '07.00 - 09.30', mapel: 'Pendidikan Agama Islam (PAI)', guru: 'Siti Mu’arifah, S.Pd' },
      { hari: 'Kamis', waktu: '10.00 - 11.45', mapel: 'Bahasa Inggris / English Club', guru: 'Gina Nabila, S. Pd' },
      { hari: 'Jumat', waktu: '07.00 - 08.00', mapel: 'Shalat Dhuha & Pembinaan Imtaq', guru: 'Dewan Guru' },
      { hari: 'Jumat', waktu: '08.00 - 10.30', mapel: 'Seni Rupa & Kriya Kreatif', guru: 'Guru Kelas' },
      { hari: 'Sabtu', waktu: '07.30 - 11.00', mapel: 'Kegiatan Ekstrakurikuler Wajib Pramuka', guru: 'Asim, S.Pd / Pembina' }
    ];
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Perangkat Pembelajaran Mendalam (Deep Learning) & Koding
            </h2>
            <p className="text-xs text-slate-500">
              Sesuai SK BSKAP 046/H/KR/2025, 8 Dimensi Profil Lulusan (8 DPL), dan Kalender Pendidikan 2026/2027
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-800 rounded-lg">
              Total {totalHariEfektifBelajar} Hari Efektif Belajar
            </span>
          </div>
        </div>

        {/* Tab Submenu */}
        <div className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('generator_modul')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'generator_modul' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generator Modul Ajar & Koding</span>
          </button>

          <button
            onClick={() => setActiveTab('hari_efektif')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hari_efektif' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Analisis Hari Efektif 2026/2027</span>
          </button>

          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'jadwal' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Jadwal Pelajaran Harian</span>
          </button>

          <button
            onClick={() => setActiveTab('prota_promes')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'prota_promes' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Program Tahunan & Semester</span>
          </button>

          <button
            onClick={() => setActiveTab('cp_atp')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cp_atp' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Database CP & ATP 2025</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GENERATOR MODUL AJAR PEMBELAJARAN MENDALAM */}
      {activeTab === 'generator_modul' && (
        <div className="space-y-6">
          
          {/* Controls Box (no-print) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Parameter Pembuatan Modul Ajar Mendalam (4 Blok RPP 2025)
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih Mata Pelajaran (termasuk Koding & AI), Fase, Elemen, dan 8 Dimensi Profil Lulusan
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateModule}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Modul Ajar Lengkap</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={selectedMapel}
                  onChange={(e) => setSelectedMapel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
                >
                  {MATA_PELAJARAN_LIST.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fase Kurikulum</label>
                <select
                  value={selectedFase}
                  onChange={(e) => setSelectedFase(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1 - 2)</option>
                  <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3 - 4)</option>
                  <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5 - 6)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Penyusun</label>
                <select
                  value={penyusun}
                  onChange={(e) => setPenyusun(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.nama}>{t.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 8 Dimensi Profil Lulusan (8 DPL) Checkboxes */}
            <div className="pt-2">
              <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
                Pilih Dimensi Profil Lulusan (8 DPL) yang Disasar:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {DIMENSI_PROFIL_LULUSAN.map(dpl => {
                  const isChecked = selectedDPL.includes(dpl);
                  return (
                    <label
                      key={dpl}
                      onClick={() => handleToggleDPL(dpl)}
                      className={`p-2 rounded-lg border text-[11px] cursor-pointer flex items-center gap-1.5 transition-colors ${
                        isChecked
                          ? 'bg-red-50 border-red-300 text-red-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded-xs text-red-600"
                      />
                      <span className="truncate">{dpl}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PRINTABLE OFFICIAL MODUL AJAR (4 BLOK LENGKAP) */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm print:p-0 print:border-0 space-y-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
              <span className="text-xs font-bold text-slate-700">
                Pratinjau Modul Ajar Siap Cetak / Unduh
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF Modul Ajar</span>
              </button>
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-3 text-center">
              <div className="flex items-center justify-between gap-4 mb-2">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17__1__e4d8a6c0.jpeg"
                  alt="Logo Kabupaten Bogor"
                  className="h-16 w-auto object-contain"
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
                  className="h-16 w-auto object-contain"
                />
              </div>

              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide mt-3">
                MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)
              </h3>
              <p className="text-xs text-slate-600 font-mono">
                Mata Pelajaran: {activeModule.mataPelajaran} · {activeModule.fase} · TA 2026/2027
              </p>
            </div>

            {/* Identitas Modul */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500 block">Penyusun:</span>
                <span className="font-bold text-slate-900">{activeModule.penyusun}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Instansi:</span>
                <span className="font-bold text-slate-900">SDN Nambo 03</span>
              </div>
              <div>
                <span className="text-slate-500 block">Kelas / Semester:</span>
                <span className="font-bold text-slate-900">{activeModule.kelas} / Semester {activeModule.semester}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Alokasi Waktu:</span>
                <span className="font-bold text-slate-900">{activeModule.alokasiWaktu}</span>
              </div>
            </div>

            {/* BLOK 1: IDENTIFIKASI & 8 DPL */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 border-b pb-1 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">1</span>
                BLOK IDENTIFIKASI (8 DIMENSI PROFIL LULUSAN & PESERTA DIDIK)
              </h4>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Dimensi Profil Lulusan (8 DPL) yang Dikembangkan:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.dimensiProfilLulusan.map((d, i) => (
                      <span key={i} className="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Karakteristik & Kesiapan Belajar Peserta Didik:</span>
                  <p className="text-slate-600 leading-relaxed">{activeModule.karakteristikPesertaDidik}</p>
                </div>
              </div>
            </div>

            {/* BLOK 2: CP, ATP, TP & PEMAHAMAN BERMAKNA */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 border-b pb-1 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">2</span>
                BLOK CAPAIAN & TUJUAN PEMBELAJARAN
              </h4>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <div>
                  <span className="font-semibold text-slate-700 block">Elemen:</span>
                  <span className="font-medium text-slate-900">{activeModule.elemen}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Capaian Pembelajaran (CP SK BSKAP 046/2025):</span>
                  <p className="text-slate-600 leading-relaxed italic">{activeModule.capaianPembelajaran}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Alur Tujuan Pembelajaran (ATP):</span>
                  <p className="text-slate-600">{activeModule.alurTujuanPembelajaran}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Tujuan Pembelajaran (TP):</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {activeModule.tujuanPembelajaran.map((tp, idx) => (
                      <li key={idx}>{tp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Pemahaman Bermakna (Meaningful Learning):</span>
                  <p className="text-slate-600">{activeModule.pemahamanBermakna}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Pertanyaan Pemantik:</span>
                  <ul className="list-decimal list-inside space-y-1 text-slate-700">
                    {activeModule.pertanyaanPemantik.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* BLOK 3: DESAIN PENGALAMAN BELAJAR MENDALAM */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 border-b pb-1 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">3</span>
                BLOK PENGALAMAN BELAJAR (MINDFUL, MEANINGFUL, JOYFUL LEARNING)
              </h4>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-3">
                <div className="p-2.5 bg-blue-50/50 rounded border border-blue-100">
                  <span className="font-bold text-blue-900 block mb-1">A. Kegiatan Awal (Mindful Awareness):</span>
                  <p className="text-slate-700 leading-relaxed">{activeModule.kegiatanAwal}</p>
                </div>

                <div className="p-2.5 bg-red-50/40 rounded border border-red-100 space-y-2">
                  <span className="font-bold text-red-950 block">B. Kegiatan Inti (3 Tahap Belajar Mendalam):</span>
                  <div>
                    <span className="font-semibold text-slate-800">1. Tahap Memahami (Penyelidikan Konsep):</span>
                    <p className="text-slate-700">{activeModule.kegiatanInti.tahapMemahami}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">2. Tahap Mengaplikasi (Aktivitas Kontekstual & Proyek):</span>
                    <p className="text-slate-700">{activeModule.kegiatanInti.tahapMengaplikasi}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">3. Tahap Merefleksi (Metakognisi & Umpan Balik):</span>
                    <p className="text-slate-700">{activeModule.kegiatanInti.tahapMerefleksi}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50/50 rounded border border-amber-100">
                  <span className="font-bold text-amber-950 block mb-1">C. Kegiatan Penutup (Joyful Closure):</span>
                  <p className="text-slate-700">{activeModule.kegiatanPenutup}</p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Media, Alat & Bahan Ajar:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.mediaDanBahanAjar.map((m, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                        • {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BLOK 4: ASESMEN & RUBRIK PENILAIAN LENGKAP */}
            <div className="space-y-2 text-xs print-break-inside-avoid">
              <h4 className="font-bold text-slate-900 border-b pb-1 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">4</span>
                BLOK ASESMEN, RUBRIK PENILAIAN & LKPD
              </h4>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="font-bold text-slate-800 block">Asesmen Awal (Diagnostik):</span>
                    <p className="text-[11px] text-slate-600 mt-1">{activeModule.asesmenAwal}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="font-bold text-slate-800 block">Asesmen Formatif:</span>
                    <p className="text-[11px] text-slate-600 mt-1">{activeModule.asesmenFormatif}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="font-bold text-slate-800 block">Asesmen Sumatif:</span>
                    <p className="text-[11px] text-slate-600 mt-1">{activeModule.asesmenSumatif}</p>
                  </div>
                </div>

                {/* Rubrik Penilaian Table */}
                <div>
                  <span className="font-bold text-slate-900 block mb-2">Rubrik Penilaian Berjenjang (4 Kriteria):</span>
                  <table className="w-full text-left text-[11px] border border-slate-300">
                    <thead className="bg-slate-100 font-bold text-slate-800">
                      <tr>
                        <th className="p-2 border border-slate-300 w-1/4">Kriteria Penilaian</th>
                        <th className="p-2 border border-slate-300 text-rose-700">Perlu Bimbingan</th>
                        <th className="p-2 border border-slate-300 text-amber-700">Cukup</th>
                        <th className="p-2 border border-slate-300 text-blue-700">Baik</th>
                        <th className="p-2 border border-slate-300 text-red-800">Sangat Baik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeModule.rubrikPenilaian.map((r, i) => (
                        <tr key={i} className="divide-x divide-slate-200 border-b">
                          <td className="p-2 font-semibold bg-slate-50">{r.kriteria}</td>
                          <td className="p-2">{r.perluBimbingan}</td>
                          <td className="p-2">{r.cukup}</td>
                          <td className="p-2">{r.baik}</td>
                          <td className="p-2 font-medium bg-red-50/30">{r.sangatBaik}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* LKPD & Soal Evaluasi */}
                <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
                  <span className="font-bold text-slate-900 block">Soal Evaluasi Individu & LKPD:</span>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    {activeModule.soalIndividu.map((soal, idx) => (
                      <li key={idx}>{soal}</li>
                    ))}
                  </ol>
                  <p className="text-[11px] text-slate-600 mt-1">
                    <span className="font-semibold">Tugas Kelompok:</span> {activeModule.tugasKelompok}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Signatures */}
            <div className="mt-8 pt-4 flex justify-between items-start text-xs text-slate-800 print-break-inside-avoid">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala Sekolah SD Negeri Nambo 03</p>
                <div className="h-16"></div>
                <p className="font-bold underline">AM. MEGA PURNAMATATI, S. Pd.,M.Pd.</p>
                <p className="text-[11px] text-slate-500 font-mono">NIP. 198607172014062001</p>
              </div>

              <div className="text-right">
                <p>Klapanunggal, Juli 2026</p>
                <p className="font-semibold">Guru Pengampu / Wali Kelas</p>
                <div className="h-16"></div>
                <p className="font-bold underline">{activeModule.penyusun}</p>
                <p className="text-[11px] text-slate-500 font-mono">Guru SD Negeri Nambo 03</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ANALISIS HARI EFEKTIF 2026/2027 */}
      {activeTab === 'hari_efektif' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Analisis Hari Efektif Belajar (HEB) Tahun Ajaran 2026/2027
              </h3>
              <p className="text-xs text-slate-500">
                Sesuai kalender pendidikan resmi: Total {totalHariEfektifBelajar} Hari Efektif Belajar
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadTemplateHariEfektif}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Template Excel</span>
              </button>

              <button
                type="button"
                onClick={handleExportHariEfektifExcel}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ekspor ke Excel</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak PDF</span>
              </button>
            </div>
          </div>

          {/* Table Hari Efektif */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm print:p-0 print:border-0">
            <div className="text-center pb-3 mb-4 border-b">
              <h2 className="text-base font-bold">ANALISIS HARI EFEKTIF DAN HARI LIBUR SEKOLAH</h2>
              <p className="text-xs text-slate-600 font-mono">SD NEGERI NAMBO 03 · TAHUN AJARAN 2026/2027</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200 border border-slate-300">
                <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-800">
                  <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Bulan</th>
                    <th className="p-2 border text-center">Semester</th>
                    <th className="p-2 border text-center">Jml Hari</th>
                    <th className="p-2 border text-center bg-red-50">HE Belajar</th>
                    <th className="p-2 border text-center">Minggu</th>
                    <th className="p-2 border text-center">Libur Umum</th>
                    <th className="p-2 border text-center">Libur Semester</th>
                    <th className="p-2 border">Keterangan / Agenda Khusus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {hariEfektif.map((h, idx) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="p-2 border text-center">{idx + 1}</td>
                      <td className="p-2 border font-sans font-bold text-slate-900">{h.bulan}</td>
                      <td className="p-2 border text-center">Sem {h.semester}</td>
                      <td className="p-2 border text-center">{h.jumlahHariKalender}</td>
                      <td className="p-2 border text-center font-bold text-red-800 bg-red-50">{h.hariEfektifBelajar}</td>
                      <td className="p-2 border text-center">{h.hariMinggu}</td>
                      <td className="p-2 border text-center text-amber-700">{h.liburUmum}</td>
                      <td className="p-2 border text-center text-purple-700">{h.liburKhususSemester}</td>
                      <td className="p-2 border font-sans text-slate-700 text-[11px]">{h.kegiatanKhusus}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-200 font-bold text-slate-900">
                    <td colSpan={4} className="p-2 border text-right uppercase font-sans">
                      TOTAL HARI EFEKTIF BELAJAR SETAHUN:
                    </td>
                    <td className="p-2 border text-center text-sm font-bold bg-red-100 text-red-950">
                      {totalHariEfektifBelajar} Hari
                    </td>
                    <td colSpan={4} className="p-2 border font-sans text-[11px] text-slate-600">
                      (Sem 1: 102 Hari · Sem 2: 75 Hari)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JADWAL PELAJARAN */}
      {activeTab === 'jadwal' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Pilih Rombel:</span>
              <select
                value={selectedScheduleClass}
                onChange={(e) => setSelectedScheduleClass(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold"
              >
                {mainClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.nama} (Wali: {c.waliKelasNama || '-'})</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadwal Pelajaran (PDF)</span>
            </button>
          </div>

          {/* Schedule Table */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm print:p-0 print:border-0">
            <div className="text-center pb-3 mb-4 border-b">
              <h2 className="text-base font-bold">JADWAL PELAJARAN MINGGUAN TAHUN AJARAN 2026/2027</h2>
              <p className="text-xs text-slate-600 font-mono">
                SD NEGERI NAMBO 03 · {mainClasses.find(c => c.id === selectedScheduleClass)?.nama}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200 border border-slate-300">
                <thead className="bg-slate-100 text-[11px] uppercase font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border">Hari</th>
                    <th className="p-2.5 border">Waktu Belajar</th>
                    <th className="p-2.5 border">Mata Pelajaran</th>
                    <th className="p-2.5 border">Guru Pengampu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sampleSchedule.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 border font-bold text-slate-900">{s.hari}</td>
                      <td className="p-2.5 border font-mono text-slate-600">{s.waktu}</td>
                      <td className="p-2.5 border font-semibold text-red-900">{s.mapel}</td>
                      <td className="p-2.5 border text-slate-700">{s.guru}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROTA & PROMES */}
      {activeTab === 'prota_promes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Program Tahunan (Prota) & Program Semester (Promes) 2026/2027
              </h3>
              <p className="text-xs text-slate-500">
                Distribusi alokasi Jam Pelajaran (JP) pada minggu-minggu efektif aktif
              </p>
            </div>

            <button
              onClick={() => {
                const data = protaPromes.map((p, idx) => ({
                  'No': idx + 1,
                  'Mapel': p.mapel,
                  'Kelas': p.kelas,
                  'Semester': p.semester,
                  'Tujuan Pembelajaran': p.tujuanPembelajaran,
                  'Alokasi JP': p.alokasiJP,
                  'Bulan': p.bulan
                }));
                exportToExcel(data, 'Prota_Promes_SDN_Nambo_03_2026_2027', 'Prota_Promes');
              }}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Prota/Promes ke Excel</span>
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200 border border-slate-300">
                <thead className="bg-slate-100 text-[11px] uppercase font-bold text-slate-800">
                  <tr>
                    <th className="p-2.5 border w-10 text-center">No</th>
                    <th className="p-2.5 border">Mata Pelajaran</th>
                    <th className="p-2.5 border">Tingkat</th>
                    <th className="p-2.5 border text-center">Semester</th>
                    <th className="p-2.5 border">Tujuan Pembelajaran (TP)</th>
                    <th className="p-2.5 border text-center">Alokasi JP</th>
                    <th className="p-2.5 border">Bulan Efektif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {protaPromes.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-2.5 border text-center font-mono">{idx + 1}</td>
                      <td className="p-2.5 border font-bold text-slate-900">{item.mapel}</td>
                      <td className="p-2.5 border">{item.kelas}</td>
                      <td className="p-2.5 border text-center font-mono">Sem {item.semester}</td>
                      <td className="p-2.5 border text-slate-700">{item.tujuanPembelajaran}</td>
                      <td className="p-2.5 border text-center font-mono font-bold text-red-800">{item.alokasiJP} JP</td>
                      <td className="p-2.5 border font-semibold">{item.bulan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE CP & ATP 2025 */}
      {activeTab === 'cp_atp' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b">
            <h3 className="text-sm font-bold text-slate-900">
              Database Resmi Capaian Pembelajaran (CP) SK BSKAP 046/H/KR/2025
            </h3>
            <p className="text-xs text-slate-500">
              Termasuk Kurikulum Terbaru Mata Pelajaran Koding dan Kecerdasan Artifisial (Fase A, B, C)
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(CAPAIAN_PEMBELAJARAN_DATABASE).map(([mapelName, fList]) => (
              <div key={mapelName} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    {mapelName}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {fList.map((f, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-800 text-[11px]">{f.fase}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{f.elemen}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">{f.cp}</p>
                      <div className="text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-700">ATP:</span> {f.atp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
