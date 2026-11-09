import { StudentItem } from '../types';

// Deterministic generation of 395 authentic SD Negeri Nambo 03 students
const FIRST_NAMES_MALE = [
  'Muhammad', 'Ahmad', 'Rizky', 'Daffa', 'Fajar', 'Bagas', 'Gilang', 'Rafi', 'Aditya', 'Rian',
  'Aldi', 'Farhan', 'Bayu', 'Ilham', 'Dimas', 'Reza', 'Fikri', 'Asep', 'Cecep', 'Ujang',
  'Arif', 'Hafizh', 'Rangga', 'Arya', 'Kevin', 'Alif', 'Fandi', 'Zidan', 'Naufal', 'Danu'
];

const FIRST_NAMES_FEMALE = [
  'Siti', 'Nur', 'Aulia', 'Putri', 'Amanda', 'Nayla', 'Salsa', 'Kayla', 'Zahra', 'Dinda',
  'Rani', 'Anisa', 'Tiara', 'Dewi', 'Intan', 'Melani', 'Fitri', 'Syifa', 'Azzahra', 'Salwa',
  'Nabila', 'Riska', 'Cinta', 'Lestari', 'Cantika', 'Fasya', 'Adinda', 'Keysha', 'Ayu', 'Wulan'
];

const LAST_NAMES = [
  'Pratama', 'Ramadhan', 'Kurniawan', 'Hidayat', 'Saputra', 'Setiawan', 'Nugraha', 'Maulana',
  'Fauzi', 'Hakim', 'Rahman', 'Kusuma', 'Gunawan', 'Permana', 'Wibowo', 'Santoso', 'Yulianto',
  'Firmansyah', 'Wijaya', 'Suryana', 'Irawan', 'Hermawan', 'Purnama', 'Subagja', 'Supriatna',
  'Wahyudi', 'Sanjaya', 'Ardiansyah', 'Budiman', 'Octaviani', 'Anggraeni', 'Safitri', 'Nurhaliza'
];

const DUSUN_ADDRESSES = [
  'Kp. Bantarkopo RT 001/RW 004 Desa Bantarjati',
  'Kp. Bantarkopo RT 002/RW 004 Desa Bantarjati',
  'Kp. Nambo RT 003/RW 001 Desa Nambo',
  'Kp. Nambo Hilir RT 002/RW 002 Desa Nambo',
  'Jl. Raya Nambo Klapanunggal RT 004/RW 003',
  'Kp. Bantarjati Leuwibilik RT 001/RW 005',
  'Perum Nambo Asri Blok C RT 005/RW 006',
  'Kp. Klapanunggal RT 002/RW 001',
  'Kp. Cikahuripan RT 003/RW 004 Klapanunggal',
  'Kp. Guha RT 001/RW 002 Desa Lulut'
];

const CLASS_DISTRIBUTION = [
  { classId: 'cls-1a', count: 33, grade: 1, baseYear: 2019 },
  { classId: 'cls-1b', count: 33, grade: 1, baseYear: 2019 },
  { classId: 'cls-2a', count: 33, grade: 2, baseYear: 2018 },
  { classId: 'cls-2b', count: 33, grade: 2, baseYear: 2018 },
  { classId: 'cls-3a', count: 33, grade: 3, baseYear: 2017 },
  { classId: 'cls-3b', count: 33, grade: 3, baseYear: 2017 },
  { classId: 'cls-4a', count: 33, grade: 4, baseYear: 2016 },
  { classId: 'cls-4b', count: 33, grade: 4, baseYear: 2016 },
  { classId: 'cls-5a', count: 33, grade: 5, baseYear: 2015 },
  { classId: 'cls-5b', count: 33, grade: 5, baseYear: 2015 },
  { classId: 'cls-6a', count: 33, grade: 6, baseYear: 2014 },
  { classId: 'cls-6b', count: 32, grade: 6, baseYear: 2014 }, // Total 395 students
];

export function generateInitialStudents(): StudentItem[] {
  const students: StudentItem[] = [];
  let studentIndex = 1;

  for (const group of CLASS_DISTRIBUTION) {
    for (let i = 0; i < group.count; i++) {
      const isMale = (studentIndex + i) % 2 === 0;
      const firstNameList = isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
      const fName = firstNameList[(studentIndex * 7 + i * 3) % firstNameList.length];
      const lName = LAST_NAMES[(studentIndex * 11 + i * 5) % LAST_NAMES.length];
      const fullName = `${fName} ${lName}`;

      // Realistic NISN: 10 digits (last 2 digits of birth year + 8 digits)
      const birthYearSuffix = String(group.baseYear).slice(-2);
      const nisnSeq = String(10000000 + studentIndex * 179 + i * 37).slice(-8);
      const nisn = `${birthYearSuffix}${nisnSeq}`;
      const nis = `2026${String(1000 + studentIndex).slice(-4)}`;

      // Month & Day
      const month = ((studentIndex * 3 + i * 2) % 12) + 1;
      const day = ((studentIndex * 5 + i * 7) % 28) + 1;
      const mmStr = month < 10 ? `0${month}` : `${month}`;
      const ddStr = day < 10 ? `0${day}` : `${day}`;
      const tanggalLahir = `${group.baseYear}-${mmStr}-${ddStr}`;

      // NIK: 3201 (Bogor) + 24 (Klapanunggal) + DDMMYY + 0000
      const nik = `320124${ddStr}${mmStr}${birthYearSuffix}${String(1000 + studentIndex).slice(-4)}`;

      // Height and weight according to grade level
      const baseHeight = 110 + (group.grade - 1) * 6;
      const baseWeight = 20 + (group.grade - 1) * 3;
      const tinggiBadan = baseHeight + ((studentIndex % 7) - 3);
      const beratBadan = baseWeight + ((studentIndex % 5) - 2);

      // PIP flag (approx 20% of students)
      const isPIP = studentIndex % 5 === 0;

      // Status: mostly active, with realistic sample pindahan, mutasi keluar, and DO
      let status: 'aktif' | 'pindahan' | 'mutasi_keluar' | 'do' = 'aktif';
      let sekolahAsal: string | undefined = undefined;
      let tanggalPindah: string | undefined = undefined;
      let alasanKeluar: string | undefined = undefined;
      let tanggalKeluar: string | undefined = undefined;

      if (studentIndex === 15 || studentIndex === 88 || studentIndex === 172) {
        status = 'pindahan';
        sekolahAsal = 'SD Negeri Klapanunggal 01';
        tanggalPindah = '2026-07-20';
      } else if (studentIndex === 120 || studentIndex === 245) {
        status = 'mutasi_keluar';
        tanggalKeluar = '2026-08-15';
        alasanKeluar = 'Mengikuti orang tua pindah domisili ke Cileungsi';
      } else if (studentIndex === 310) {
        status = 'do';
        tanggalKeluar = '2026-09-01';
        alasanKeluar = 'Faktor ekonomi keluarga dan pindah tanpa konfirmasi';
      }

      // Assign ekskul: Pramuka is standard + 1 optional
      const ekskulPool = ['ekskul-01', 'ekskul-02', 'ekskul-03', 'ekskul-04', 'ekskul-05', 'ekskul-06', 'ekskul-07', 'ekskul-08'];
      const studentEkskuls = ['ekskul-01']; // All students join Pramuka
      if (group.grade >= 3) {
        const secondaryEkskul = ekskulPool[((studentIndex + group.grade) % (ekskulPool.length - 1)) + 1];
        if (!studentEkskuls.includes(secondaryEkskul)) {
          studentEkskuls.push(secondaryEkskul);
        }
      }

      students.push({
        id: nisn,
        nisn,
        nis,
        nama: fullName,
        tempatLahir: studentIndex % 15 === 0 ? 'Jakarta' : 'Bogor',
        tanggalLahir,
        agama: studentIndex % 35 === 0 ? 'Kristen' : 'Islam',
        jk: isMale ? 'L' : 'P',
        nik,
        alamat: DUSUN_ADDRESSES[studentIndex % DUSUN_ADDRESSES.length],
        tinggiBadan,
        beratBadan,
        kelasId: group.classId,
        status,
        isPIP,
        ekskulIds: studentEkskuls,
        sekolahAsal,
        tanggalPindah,
        tanggalKeluar,
        alasanKeluar
      });

      studentIndex++;
    }
  }

  return students;
}

export const INITIAL_STUDENTS: StudentItem[] = generateInitialStudents();
