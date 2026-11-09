import { ClassItem } from '../types';

export const INITIAL_CLASSES: ClassItem[] = [
  // Kelas Utama (1A - 6B)
  {
    id: 'cls-1a',
    nama: 'Kelas 1A',
    tingkat: 1,
    tipe: 'utama',
    ruangan: 'Gedung A - Ruang 101',
    waliKelasId: 'staff-03',
    waliKelasNama: 'Dian Purnamasari, S.Pd',
    deskripsi: 'Fase A - Rombongan Belajar 1A',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-1b',
    nama: 'Kelas 1B',
    tingkat: 1,
    tipe: 'utama',
    ruangan: 'Gedung A - Ruang 102',
    waliKelasId: 'staff-04',
    waliKelasNama: 'Nining Sariningsih, S.Pd',
    deskripsi: 'Fase A - Rombongan Belajar 1B',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-2a',
    nama: 'Kelas 2A',
    tingkat: 2,
    tipe: 'utama',
    ruangan: 'Gedung A - Ruang 103',
    waliKelasId: 'staff-07',
    waliKelasNama: 'Siti Rohimah, S.Pd',
    deskripsi: 'Fase A - Rombongan Belajar 2A',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-2b',
    nama: 'Kelas 2B',
    tingkat: 2,
    tipe: 'utama',
    ruangan: 'Gedung A - Ruang 104',
    waliKelasId: 'staff-08',
    waliKelasNama: 'Anggun Nastiti, S.Pd',
    deskripsi: 'Fase A - Rombongan Belajar 2B',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-3a',
    nama: 'Kelas 3A',
    tingkat: 3,
    tipe: 'utama',
    ruangan: 'Gedung B - Ruang 201',
    waliKelasId: 'staff-10',
    waliKelasNama: 'Amelia Agustina',
    deskripsi: 'Fase B - Rombongan Belajar 3A',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-3b',
    nama: 'Kelas 3B',
    tingkat: 3,
    tipe: 'utama',
    ruangan: 'Gedung B - Ruang 202',
    waliKelasId: 'staff-11',
    waliKelasNama: 'Resta Putriandari',
    deskripsi: 'Fase B - Rombongan Belajar 3B',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-4a',
    nama: 'Kelas 4A',
    tingkat: 4,
    tipe: 'utama',
    ruangan: 'Gedung B - Ruang 203',
    waliKelasId: 'staff-12',
    waliKelasNama: 'Fadilah',
    deskripsi: 'Fase B - Rombongan Belajar 4A',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-4b',
    nama: 'Kelas 4B',
    tingkat: 4,
    tipe: 'utama',
    ruangan: 'Gedung B - Ruang 204',
    waliKelasId: 'staff-14',
    waliKelasNama: 'Gina Nabila, S. Pd',
    deskripsi: 'Fase B - Rombongan Belajar 4B',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-5a',
    nama: 'Kelas 5A',
    tingkat: 5,
    tipe: 'utama',
    ruangan: 'Gedung C - Ruang 301',
    waliKelasId: 'staff-05',
    waliKelasNama: 'Asim, S.Pd',
    deskripsi: 'Fase C - Rombongan Belajar 5A',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-5b',
    nama: 'Kelas 5B',
    tingkat: 5,
    tipe: 'utama',
    ruangan: 'Gedung C - Ruang 302',
    waliKelasId: 'staff-06',
    waliKelasNama: 'Nurhaeni, S.Pd',
    deskripsi: 'Fase C - Rombongan Belajar 5B',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-6a',
    nama: 'Kelas 6A',
    tingkat: 6,
    tipe: 'utama',
    ruangan: 'Gedung C - Ruang 303',
    waliKelasId: 'staff-02',
    waliKelasNama: 'Abdul Rohman Wahid, S.Pd',
    deskripsi: 'Fase C - Rombongan Belajar 6A',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'cls-6b',
    nama: 'Kelas 6B',
    tingkat: 6,
    tipe: 'utama',
    ruangan: 'Gedung C - Ruang 304',
    waliKelasId: 'staff-05',
    waliKelasNama: 'Asim, S.Pd',
    deskripsi: 'Fase C - Rombongan Belajar 6B',
    tahunAjaran: '2026/2027'
  },

  // Ekstrakurikuler
  {
    id: 'ekskul-01',
    nama: 'Pramuka Siaga & Penggalang',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Lapangan Utama & Aula',
    waliKelasId: 'staff-05',
    waliKelasNama: 'Asim, S.Pd',
    deskripsi: 'Ekstrakurikuler Wajib Pembinaan Karakter & Kepanduan',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'ekskul-02',
    nama: 'Robotika & Koding Anak',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Laboratorium Komputer',
    waliKelasId: 'staff-02',
    waliKelasNama: 'Abdul Rohman Wahid, S.Pd',
    deskripsi: 'Pemrograman Visual Block & Logika Berpikir Komputasional',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'ekskul-03',
    nama: 'Tari Tradisional Jaipong & Sunda',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Ruang Kesenian',
    waliKelasId: 'staff-03',
    waliKelasNama: 'Dian Purnamasari, S.Pd',
    deskripsi: 'Pelestarian Seni Tari Tradisional Jawa Barat',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'ekskul-04',
    nama: 'Marawis & BTQ',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Musholla Al-Ikhlas',
    waliKelasId: 'staff-09',
    waliKelasNama: 'Siti Mu’arifah, S.Pd',
    deskripsi: 'Seni Musik Islami dan Pendalaman Baca Tulis Al-Qur\'an',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'ekskul-05',
    nama: 'Futsal Anak & Olahraga',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Lapangan Olahraga',
    waliKelasId: 'staff-12',
    waliKelasNama: 'Fadilah',
    deskripsi: 'Kebugaran Jasmani dan Pembinaan Bakat Sepakbola Mini',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'ekskul-06',
    nama: 'Dokter Kecil / UKS',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Ruang UKS',
    waliKelasId: 'staff-06',
    waliKelasNama: 'Nurhaeni, S.Pd',
    deskripsi: 'Pelatihan Pertolongan Pertama dan Pola Hidup Bersih Sehat',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'ekskul-07',
    nama: 'Seni Lukis & Kriya',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Ruang Prakarya',
    waliKelasId: 'staff-04',
    waliKelasNama: 'Nining Sariningsih, S.Pd',
    deskripsi: 'Menggambar Mewarnai dan Hasta Karya Kreatif',
    tahunAjaran: '2026/2027'
  },
  {
    id: 'ekskul-08',
    nama: 'English Club',
    tingkat: 0,
    tipe: 'ekskul',
    ruangan: 'Ruang Bahasa',
    waliKelasId: 'staff-14',
    waliKelasNama: 'Gina Nabila, S. Pd',
    deskripsi: 'Percakapan Bahasa Inggris Interaktif dan Cerita Bergambar',
    tahunAjaran: '2026/2027'
  }
];
