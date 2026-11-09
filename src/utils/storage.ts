import { StudentItem, ClassItem, StaffItem, KinerjaGuruItem, DailyAttendanceItem, HariEfektifItem, DeepLearningModuleItem, ProtaPromesItem, RoleType } from '../types';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import { INITIAL_CLASSES } from '../data/initialClasses';
import { INITIAL_STAFF } from '../data/initialStaff';
import { INITIAL_HARI_EFEKTIF, INITIAL_MODULES, INITIAL_PROTA_PROMES } from '../data/initialCurriculum';

const STORAGE_KEYS = {
  STUDENTS: 'sipantau_nambo03_students_v1',
  CLASSES: 'sipantau_nambo03_classes_v1',
  STAFF: 'sipantau_nambo03_staff_v1',
  KINERJA: 'sipantau_nambo03_kinerja_v1',
  ATTENDANCE: 'sipantau_nambo03_attendance_v1',
  HARI_EFEKTIF: 'sipantau_nambo03_hari_efektif_v1',
  MODULES: 'sipantau_nambo03_modules_v1',
  PROTA_PROMES: 'sipantau_nambo03_prota_promes_v1',
  AUTH: 'sipantau_nambo03_auth_v1',
  PASSWORDS: 'sipantau_nambo03_passwords_v1',
};

export const DEFAULT_NPSN_PASSWORD = '20200352';

export interface AuthSession {
  isLoggedIn: boolean;
  role: RoleType;
  userName: string;
  userId: string;
  userNip?: string;
  loginTime: string;
}

// Generate initial sample teacher performance (Kinerja Guru) for 2026
function generateInitialKinerja(): KinerjaGuruItem[] {
  return INITIAL_STAFF.filter(s => s.isGuru && s.jabatan !== 'Ka.Sekolah').map((guru, idx) => {
    const isObserved = idx % 2 === 0; // some observed, some pending
    return {
      id: `kinerja-${guru.id}-2026`,
      guruId: guru.id,
      guruNama: guru.nama,
      tahun: 2026,
      periode: 'Tahunan',
      praktikKinerja: {
        indikatorPilihan: idx % 3 === 0 ? 'Penerapan Disiplin Positif' : idx % 3 === 1 ? 'Keteraturan Suasana Kelas' : 'Umpan Balik Konstruktif',
        targetPerilaku: 'Guru membangun komunikasi dua arah yang menumbuhkan motivasi intrinsik dan kesadaran disiplin peserta didik tanpa hukuman fisik.',
        perencanaan: 'Menyusun RPP/Modul Ajar Pembelajaran Mendalam dengan kesepakatan kelas dan rubrik apresiasi kelompok.',
        pelaksanaan: 'Melaksanakan pembelajaran interaktif di kelas dengan melibatkan peserta didik menyusun refleksi harian.',
        umpanBalik: 'Peserta didik merespon antusias dan tercipta budaya saling menghargai pendapat di kelas.',
        statusObservasi: isObserved,
        nilaiObservasi: isObserved ? 100 : 85,
        catatanKS: isObserved ? 'Sangat memuaskan, interaksi guru dan siswa sangat hidup dan pembelajaran bermakna tercapai.' : 'Perlu penguatan pada asesmen diagnostik di awal pembelajaran.',
        tanggalObservasi: isObserved ? '2026-08-20' : undefined
      },
      perilakuBerakhlak: {
        berorientasiPelayanan: { sudah: true, refleksi: 'Memberikan bimbingan ramah dan responsif pada kendala belajar siswa.', nilai: 95 },
        akuntabel: { sudah: true, refleksi: 'Menyelesaikan administrasi kelas dan daftar nilai tepat waktu.', nilai: 96 },
        kompeten: { sudah: true, refleksi: 'Aktif mengikuti pelatihan mandiri Platform Merdeka Mengajar (PMM).', nilai: 94 },
        harmonis: { sudah: true, refleksi: 'Menjaga hubungan kekeluargaan yang erat dengan seluruh rekan pendidik.', nilai: 98 },
        loyal: { sudah: true, refleksi: 'Mendukung penuh visi dan program SD Negeri Nambo 03.', nilai: 95 },
        adaptif: { sudah: true, refleksi: 'Cepat beradaptasi dengan materi pembelajaran Koding & Kecerdasan Artifisial.', nilai: 92 },
        kolaboratif: { sudah: true, refleksi: 'Bekerja sama dalam kegiatan pembiasaan dan upacara bendera.', nilai: 97 },
        skorRataRata: 95.3
      },
      tugasTambahan: {
        namaTugas: guru.waliKelasRombel ? `Wali Kelas ${guru.waliKelasRombel}` : (guru.pembinaEkskul || 'Pengelola Sarana Prasarana'),
        skPenugasan: 'SK-KS/SDN-03/VII/2026',
        refleksi: 'Telah melaksanakan pembinaan rutin setiap minggu, memonitor absensi, serta membimbing siswa berprestasi.',
        statusPelaksanaan: 'Terlaksana Penuh',
        buktiDukung: 'Laporan Kegiatan Bulanan dan Foto Dokumentasi',
        nilai: 95
      },
      predikatAkhir: isObserved ? 'Sangat Baik' : 'Baik',
      catatanKepalaSekolah: 'Terus pertahankan dedikasi dan tingkatkan inovasi media ajar interaktif.',
      tanggalPenilaian: '2026-10-10',
      namaPenilai: 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.',
      nipPenilai: '198607172014062001'
    };
  });
}

// Generate initial sample daily attendance across classes for 2026-2027
function generateInitialAttendance(): DailyAttendanceItem[] {
  const records: DailyAttendanceItem[] = [];
  const sampleDates = [
    '2026-07-20', '2026-07-21', '2026-07-22', '2026-07-23', '2026-07-24',
    '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07',
    '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-07',
    '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'
  ];

  for (const cls of INITIAL_CLASSES.filter(c => c.tipe === 'utama')) {
    const totalSiswa = cls.id === 'cls-6b' ? 32 : 33;
    sampleDates.forEach((tgl, i) => {
      const sakit = (i + cls.tingkat) % 7 === 0 ? 1 : 0;
      const izin = (i + cls.tingkat) % 11 === 0 ? 1 : 0;
      const alfa = (i + cls.tingkat) % 19 === 0 ? 1 : 0;
      const hadir = totalSiswa - (sakit + izin + alfa);
      records.push({
        id: `att-${cls.id}-${tgl}`,
        tanggal: tgl,
        kelasId: cls.id,
        sakit,
        izin,
        alfa,
        hadir,
        totalSiswa,
        catatan: sakit > 0 ? 'Surat dokter terlampir' : undefined
      });
    });
  }

  return records;
}

// LocalStorage Helpers
export function loadStudents(): StudentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load students from localStorage', e);
  }
  saveStudents(INITIAL_STUDENTS);
  return INITIAL_STUDENTS;
}

export function saveStudents(data: StudentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export function loadClasses(): ClassItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load classes from localStorage', e);
  }
  saveClasses(INITIAL_CLASSES);
  return INITIAL_CLASSES;
}

export function saveClasses(data: ClassItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save classes', e);
  }
}

export function loadStaff(): StaffItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load staff from localStorage', e);
  }
  saveStaff(INITIAL_STAFF);
  return INITIAL_STAFF;
}

export function saveStaff(data: StaffItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save staff', e);
  }
}

export function loadKinerja(): KinerjaGuruItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KINERJA);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load kinerja', e);
  }
  const initial = generateInitialKinerja();
  saveKinerja(initial);
  return initial;
}

export function saveKinerja(data: KinerjaGuruItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.KINERJA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save kinerja', e);
  }
}

export function loadAttendance(): DailyAttendanceItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load attendance', e);
  }
  const initial = generateInitialAttendance();
  saveAttendance(initial);
  return initial;
}

export function saveAttendance(data: DailyAttendanceItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save attendance', e);
  }
}

export function loadHariEfektif(): HariEfektifItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HARI_EFEKTIF);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load hari efektif', e);
  }
  saveHariEfektif(INITIAL_HARI_EFEKTIF);
  return INITIAL_HARI_EFEKTIF;
}

export function saveHariEfektif(data: HariEfektifItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.HARI_EFEKTIF, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save hari efektif', e);
  }
}

export function loadModules(): DeepLearningModuleItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load modules', e);
  }
  saveModules(INITIAL_MODULES);
  return INITIAL_MODULES;
}

export function saveModules(data: DeepLearningModuleItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save modules', e);
  }
}

export function loadProtaPromes(): ProtaPromesItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROTA_PROMES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load prota promes', e);
  }
  saveProtaPromes(INITIAL_PROTA_PROMES);
  return INITIAL_PROTA_PROMES;
}

export function saveProtaPromes(data: ProtaPromesItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROTA_PROMES, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save prota promes', e);
  }
}

// Authentication & Password Management
export function loadAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function saveAuthSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}

export function getCustomPassword(userKey: string): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
    if (raw) {
      const map = JSON.parse(raw);
      if (map[userKey]) return map[userKey];
    }
  } catch (e) {}
  return DEFAULT_NPSN_PASSWORD;
}

export function setCustomPassword(userKey: string, newPassword: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
    const map = raw ? JSON.parse(raw) : {};
    map[userKey] = newPassword;
    localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to set password', e);
  }
}

// Complete Database Backup & Restore
export function exportEntireDatabaseJSON() {
  const backup = {
    app: 'SIPANTAU Nambo 03',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    students: loadStudents(),
    classes: loadClasses(),
    staff: loadStaff(),
    kinerja: loadKinerja(),
    attendance: loadAttendance(),
    hariEfektif: loadHariEfektif(),
    modules: loadModules(),
    protaPromes: loadProtaPromes()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SIPANTAU_Nambo_03_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importEntireDatabaseJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.students && Array.isArray(parsed.students)) saveStudents(parsed.students);
    if (parsed.classes && Array.isArray(parsed.classes)) saveClasses(parsed.classes);
    if (parsed.staff && Array.isArray(parsed.staff)) saveStaff(parsed.staff);
    if (parsed.kinerja && Array.isArray(parsed.kinerja)) saveKinerja(parsed.kinerja);
    if (parsed.attendance && Array.isArray(parsed.attendance)) saveAttendance(parsed.attendance);
    if (parsed.hariEfektif && Array.isArray(parsed.hariEfektif)) saveHariEfektif(parsed.hariEfektif);
    if (parsed.modules && Array.isArray(parsed.modules)) saveModules(parsed.modules);
    if (parsed.protaPromes && Array.isArray(parsed.protaPromes)) saveProtaPromes(parsed.protaPromes);
    return true;
  } catch (e) {
    console.error('Failed to restore database', e);
    return false;
  }
}

export function resetToFactoryDefault() {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.CLASSES);
  localStorage.removeItem(STORAGE_KEYS.STAFF);
  localStorage.removeItem(STORAGE_KEYS.KINERJA);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
  localStorage.removeItem(STORAGE_KEYS.HARI_EFEKTIF);
  localStorage.removeItem(STORAGE_KEYS.MODULES);
  localStorage.removeItem(STORAGE_KEYS.PROTA_PROMES);
}
