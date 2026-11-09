export type RoleType = 'kepala_sekolah' | 'guru' | 'tu';

export interface ClassItem {
  id: string;
  nama: string; // e.g. "Kelas 1A", "Pramuka Siaga"
  tingkat: number; // 1 - 6 for classes, 0 for ekskul
  tipe: 'utama' | 'ekskul';
  ruangan: string;
  waliKelasId?: string; // Links to staff ID
  waliKelasNama?: string;
  deskripsi?: string;
  tahunAjaran: string; // e.g. "2026/2027"
}

export interface StudentItem {
  id: string; // NISN as primary unique ID
  nisn: string; // Unique
  nis: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  jk: 'L' | 'P';
  nik: string;
  alamat: string;
  tinggiBadan?: number; // cm
  beratBadan?: number; // kg
  kelasId: string; // references ClassItem.id
  status: 'aktif' | 'pindahan' | 'mutasi_keluar' | 'do';
  isPIP: boolean;
  ekskulIds: string[]; // array of ekskul class IDs
  // Fields for Siswa Pindahan
  sekolahAsal?: string;
  tanggalPindah?: string;
  alasanPindah?: string;
  // Fields for Mutasi/DO
  tanggalKeluar?: string;
  alasanKeluar?: string;
  keterangan?: string;
}

export interface StaffItem {
  id: string;
  nip: string;
  nama: string;
  jk: 'L' | 'P';
  status: 'PNS' | 'PPPK' | 'Honor';
  jabatan: string; // "Ka.Sekolah", "Guru Kelas", "Guru PAI", "Guru B. Inggris", "Tendik", "Petugas Kebersihan", "Penjaga"
  pangkatGol: string; // "IIIb", "IX", "-"
  programStudi: string; // "S2 – Pendas", "S1 – PGSD", "S1 – PAI", "SMA", "SMP"
  isGuru: boolean; // true for educators, false for TU/kebersihan/penjaga
  isAktif: boolean;
  telepon?: string;
  email?: string;
  waliKelasRombel?: string; // e.g. "Kelas 1A"
  pembinaEkskul?: string; // e.g. "Pramuka"
}

export interface TeachingHoursItem {
  id: string;
  guruId: string;
  guruNama: string;
  mapel: string;
  kelasId: string;
  kelasNama: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulai: string;
  jamSelesai: string;
  jumlahJam: number;
}

export interface KinerjaGuruItem {
  id: string;
  guruId: string;
  guruNama: string;
  tahun: number; // 2026
  periode: 'Semester 1' | 'Semester 2' | 'Tahunan';
  praktikKinerja: {
    indikatorPilihan: string;
    targetPerilaku: string;
    perencanaan: string;
    pelaksanaan: string;
    umpanBalik: string;
    statusObservasi: boolean; // If true, score is 100
    nilaiObservasi: number; // 100 if observed, otherwise 0 - 90
    catatanKS: string;
    tanggalObservasi?: string;
  };
  perilakuBerakhlak: {
    berorientasiPelayanan: { sudah: boolean; refleksi: string; nilai: number };
    akuntabel: { sudah: boolean; refleksi: string; nilai: number };
    kompeten: { sudah: boolean; refleksi: string; nilai: number };
    harmonis: { sudah: boolean; refleksi: string; nilai: number };
    loyal: { sudah: boolean; refleksi: string; nilai: number };
    adaptif: { sudah: boolean; refleksi: string; nilai: number };
    kolaboratif: { sudah: boolean; refleksi: string; nilai: number };
    skorRataRata: number;
  };
  tugasTambahan: {
    namaTugas: string; // "Wali Kelas 1A", "Pembina Pramuka", "Bendahara BOS", "Operator Dapodik"
    skPenugasan?: string;
    refleksi: string;
    statusPelaksanaan: 'Terlaksana Penuh' | 'Sebagian' | 'Belum';
    buktiDukung: string;
    nilai: number;
  };
  predikatAkhir: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  catatanKepalaSekolah: string;
  tanggalPenilaian: string;
  namaPenilai: string;
  nipPenilai: string;
}

export interface DailyAttendanceItem {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelasId: string;
  sakit: number;
  izin: number;
  alfa: number;
  hadir: number;
  totalSiswa: number;
  catatan?: string;
}

export interface HariEfektifItem {
  id: string;
  bulan: string; // "Juli 2026", "Agustus 2026", ...
  semester: 1 | 2;
  tahun: number;
  jumlahHariKalender: number;
  hariEfektifSekolah: number;
  hariEfektifBelajar: number;
  hariMinggu: number;
  liburUmum: number;
  liburKhususSemester: number;
  kegiatanKhusus: string;
}

export interface DeepLearningModuleItem {
  id: string;
  mataPelajaran: string; // e.g. "Koding dan Kecerdasan Artifisial", "IPAS", "Matematika", dll
  fase: 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)';
  kelas: string; // "Kelas 1" - "Kelas 6"
  semester: 1 | 2;
  alokasiWaktu: string; // e.g. "2 JP (2 x 35 Menit)"
  penyusun: string; // Guru name
  tahunAjaran: string; // "2026/2027"
  
  // Blok 1: Identifikasi DPL (8 Dimensi Profil Lulusan)
  dimensiProfilLulusan: string[]; // e.g. ["Keimanan & Ketaqwaan", "Penalaran Kritis", "Kreativitas", "Kolaborasi", "Komunikasi"]
  karakteristikPesertaDidik: string;
  
  // Blok 2: Capaian & Tujuan Pembelajaran
  elemen: string;
  capaianPembelajaran: string;
  alurTujuanPembelajaran: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  
  // Blok 3: Desain Pengalaman Belajar (Mindful, Meaningful, Joyful)
  kegiatanAwal: string; // Berkesadaran (Mindful)
  kegiatanInti: {
    tahapMemahami: string; // Eksplorasi konsep
    tahapMengaplikasi: string; // Praktik terbimbing / proyek nyata
    tahapMerefleksi: string; // Evaluasi hasil & makna
  };
  kegiatanPenutup: string; // Joyful & apresiatif
  mediaDanBahanAjar: string[];
  
  // Blok 4: Asesmen & Evaluasi
  asesmenAwal: string;
  asesmenFormatif: string;
  asesmenSumatif: string;
  rubrikPenilaian: {
    kriteria: string;
    perluBimbingan: string;
    cukup: string;
    baik: string;
    sangatBaik: string;
  }[];
  soalIndividu: string[];
  tugasKelompok: string;
  lembarKerjaSiswa: string; // LKPD
}

export interface ProtaPromesItem {
  id: string;
  mapel: string;
  kelas: string;
  semester: 1 | 2;
  tahunAjaran: string;
  tujuanPembelajaran: string;
  alokasiJP: number;
  bulan: string;
  mingguKe: number[];
}
