import * as XLSX from 'xlsx';

// Utility to create and download an actual .xlsx file from JSON data
export function exportToExcel(data: Record<string, any>[], filename: string, sheetName: string = 'Sheet1') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// Utility to parse uploaded Excel file (.xlsx, .xls) into JSON array
export function parseExcelFile<T = Record<string, any>>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<T>(worksheet, { defval: '' });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

// 1. Template Kelas & Ekskul (10 dummy rows)
export function downloadTemplateKelasEkskul() {
  const dummyData = [
    { 'Nama_Kelas': 'Kelas 1C', 'Tingkat': 1, 'Tipe': 'utama', 'Ruangan': 'Ruang 105', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Rombel Tambahan Kelas 1' },
    { 'Nama_Kelas': 'Kelas 2C', 'Tingkat': 2, 'Tipe': 'utama', 'Ruangan': 'Ruang 106', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Rombel Tambahan Kelas 2' },
    { 'Nama_Kelas': 'Kelas 3C', 'Tingkat': 3, 'Tipe': 'utama', 'Ruangan': 'Ruang 205', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Rombel Tambahan Kelas 3' },
    { 'Nama_Kelas': 'Kelas 4C', 'Tingkat': 4, 'Tipe': 'utama', 'Ruangan': 'Ruang 206', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Rombel Tambahan Kelas 4' },
    { 'Nama_Kelas': 'Kelas 5C', 'Tingkat': 5, 'Tipe': 'utama', 'Ruangan': 'Ruang 305', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Rombel Tambahan Kelas 5' },
    { 'Nama_Kelas': 'Kelas 6C', 'Tingkat': 6, 'Tipe': 'utama', 'Ruangan': 'Ruang 306', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Rombel Tambahan Kelas 6' },
    { 'Nama_Kelas': 'Pencak Silat', 'Tingkat': 0, 'Tipe': 'ekskul', 'Ruangan': 'Halaman Belakang', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Bela Diri Tradisional Sunda' },
    { 'Nama_Kelas': 'Angklung & Karawitan', 'Tingkat': 0, 'Tipe': 'ekskul', 'Ruangan': 'Ruang Kesenian', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Alat Musik Tradisional Jawa Barat' },
    { 'Nama_Kelas': 'Klub Sains Cilik', 'Tingkat': 0, 'Tipe': 'ekskul', 'Ruangan': 'Lab IPA', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Eksperimen Sains Sederhana' },
    { 'Nama_Kelas': 'Catur Sekolah', 'Tingkat': 0, 'Tipe': 'ekskul', 'Ruangan': 'Perpustakaan', 'Tahun_Ajaran': '2026/2027', 'Deskripsi': 'Strategi Asah Otak dan Logika' }
  ];
  exportToExcel(dummyData, 'Template_Import_Kelas_Ekskul_SDN_Nambo_03', 'Template_Kelas');
}

// 2. Template Siswa (10 dummy rows)
export function downloadTemplateSiswa() {
  const dummyData = [
    {
      'NISN': '3195501001',
      'NIS': '20260401',
      'Nama_Lengkap': 'Arya Dwi Pangestu',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2019-04-12',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'L',
      'NIK': '3201241204190001',
      'Alamat': 'Kp. Bantarkopo RT 001/004 Desa Bantarjati',
      'Tinggi_Badan_cm': 118,
      'Berat_Badan_kg': 22,
      'Nama_Kelas': 'Kelas 1A',
      'Status': 'aktif',
      'Penerima_PIP': 'TIDAK'
    },
    {
      'NISN': '3195501002',
      'NIS': '20260402',
      'Nama_Lengkap': 'Kirana Azzahra',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2019-08-25',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'P',
      'NIK': '3201246508190002',
      'Alamat': 'Kp. Nambo RT 003/001 Desa Nambo',
      'Tinggi_Badan_cm': 116,
      'Berat_Badan_kg': 20,
      'Nama_Kelas': 'Kelas 1A',
      'Status': 'aktif',
      'Penerima_PIP': 'YA'
    },
    {
      'NISN': '3185502003',
      'NIS': '20260403',
      'Nama_Lengkap': 'Rizky Alamsyah',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2018-02-14',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'L',
      'NIK': '3201241402180003',
      'Alamat': 'Perum Nambo Asri Blok C RT 005/006',
      'Tinggi_Badan_cm': 122,
      'Berat_Badan_kg': 24,
      'Nama_Kelas': 'Kelas 2B',
      'Status': 'aktif',
      'Penerima_PIP': 'TIDAK'
    },
    {
      'NISN': '3185502004',
      'NIS': '20260404',
      'Nama_Lengkap': 'Naila Putri Sabrina',
      'Tempat_Lahir': 'Jakarta',
      'Tanggal_Lahir': '2018-06-18',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'P',
      'NIK': '3201245806180004',
      'Alamat': 'Jl. Raya Nambo RT 004/003',
      'Tinggi_Badan_cm': 120,
      'Berat_Badan_kg': 23,
      'Nama_Kelas': 'Kelas 2B',
      'Status': 'aktif',
      'Penerima_PIP': 'YA'
    },
    {
      'NISN': '3175503005',
      'NIS': '20260405',
      'Nama_Lengkap': 'Muhammad Hafiz',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2017-09-09',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'L',
      'NIK': '3201240909170005',
      'Alamat': 'Kp. Bantarkopo RT 002/004',
      'Tinggi_Badan_cm': 128,
      'Berat_Badan_kg': 27,
      'Nama_Kelas': 'Kelas 3A',
      'Status': 'aktif',
      'Penerima_PIP': 'TIDAK'
    },
    {
      'NISN': '3175503006',
      'NIS': '20260406',
      'Nama_Lengkap': 'Salma Dianita',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2017-11-20',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'P',
      'NIK': '3201246011170006',
      'Alamat': 'Kp. Klapanunggal RT 002/001',
      'Tinggi_Badan_cm': 127,
      'Berat_Badan_kg': 26,
      'Nama_Kelas': 'Kelas 3B',
      'Status': 'aktif',
      'Penerima_PIP': 'YA'
    },
    {
      'NISN': '3165504007',
      'NIS': '20260407',
      'Nama_Lengkap': 'Bima Satria Yudha',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2016-03-30',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'L',
      'NIK': '3201243003160007',
      'Alamat': 'Kp. Bantarjati Leuwibilik RT 001/005',
      'Tinggi_Badan_cm': 134,
      'Berat_Badan_kg': 31,
      'Nama_Kelas': 'Kelas 4A',
      'Status': 'aktif',
      'Penerima_PIP': 'TIDAK'
    },
    {
      'NISN': '3165504008',
      'NIS': '20260408',
      'Nama_Lengkap': 'Syifa Aurellia',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2016-07-04',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'P',
      'NIK': '3201244407160008',
      'Alamat': 'Kp. Nambo Hilir RT 002/002',
      'Tinggi_Badan_cm': 133,
      'Berat_Badan_kg': 30,
      'Nama_Kelas': 'Kelas 4B',
      'Status': 'aktif',
      'Penerima_PIP': 'TIDAK'
    },
    {
      'NISN': '3155505009',
      'NIS': '20260409',
      'Nama_Lengkap': 'Farel Pratama Kusuma',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2015-10-15',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'L',
      'NIK': '3201241510150009',
      'Alamat': 'Kp. Bantarkopo RT 001/004',
      'Tinggi_Badan_cm': 140,
      'Berat_Badan_kg': 36,
      'Nama_Kelas': 'Kelas 5A',
      'Status': 'aktif',
      'Penerima_PIP': 'YA'
    },
    {
      'NISN': '3145506010',
      'NIS': '20260410',
      'Nama_Lengkap': 'Cantika Wulandari',
      'Tempat_Lahir': 'Bogor',
      'Tanggal_Lahir': '2014-12-05',
      'Agama': 'Islam',
      'Jenis_Kelamin': 'P',
      'NIK': '3201244512140010',
      'Alamat': 'Kp. Guha RT 001/002 Desa Lulut',
      'Tinggi_Badan_cm': 144,
      'Berat_Badan_kg': 39,
      'Nama_Kelas': 'Kelas 6A',
      'Status': 'aktif',
      'Penerima_PIP': 'TIDAK'
    }
  ];
  exportToExcel(dummyData, 'Template_Import_Siswa_SDN_Nambo_03', 'Template_Siswa');
}

// 3. Template Guru (10 dummy rows)
export function downloadTemplateGuru() {
  const dummyData = [
    { 'NIP': '198703122015021002', 'Nama_Lengkap': 'Budi Santoso, S.Pd', 'Jenis_Kelamin': 'L', 'Status': 'PNS', 'Jabatan': 'Guru PJOK', 'Pangkat_Golongan': 'IIIa', 'Program_Studi': 'S1 - Penjaskes', 'No_HP': '081234567801' },
    { 'NIP': '198905202019032005', 'Nama_Lengkap': 'Ratna Sari, S.Pd', 'Jenis_Kelamin': 'P', 'Status': 'PPPK', 'Jabatan': 'Guru Kelas', 'Pangkat_Golongan': 'IX', 'Program_Studi': 'S1 - PGSD', 'No_HP': '081234567802' },
    { 'NIP': '199108152023211003', 'Nama_Lengkap': 'Irfan Maulana, S.Pd', 'Jenis_Kelamin': 'L', 'Status': 'PPPK', 'Jabatan': 'Guru Seni Budaya', 'Pangkat_Golongan': 'IX', 'Program_Studi': 'S1 - Seni Rupa', 'No_HP': '081234567803' },
    { 'NIP': '-', 'Nama_Lengkap': 'Siti Maryam, S.Pd.I', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Guru PAI', 'Pangkat_Golongan': '-', 'Program_Studi': 'S1 - PAI', 'No_HP': '081234567804' },
    { 'NIP': '-', 'Nama_Lengkap': 'Asep Saepudin, S.Pd', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Guru Kelas', 'Pangkat_Golongan': '-', 'Program_Studi': 'S1 - PGSD', 'No_HP': '081234567805' },
    { 'NIP': '-', 'Nama_Lengkap': 'Endah Sulastri, S.Pd', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Guru Bahasa Sunda', 'Pangkat_Golongan': '-', 'Program_Studi': 'S1 - Bahasa Sunda', 'No_HP': '081234567806' },
    { 'NIP': '-', 'Nama_Lengkap': 'Yandi Kuswandi, S.Kom', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Guru Koding & Komputer', 'Pangkat_Golongan': '-', 'Program_Studi': 'S1 - Informatika', 'No_HP': '081234567807' },
    { 'NIP': '-', 'Nama_Lengkap': 'Fitri Handayani, S.Pd', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Guru Kelas Pendamping', 'Pangkat_Golongan': '-', 'Program_Studi': 'S1 - PGSD', 'No_HP': '081234567808' },
    { 'NIP': '-', 'Nama_Lengkap': 'Dedi Mulyadi, S.Pd', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Guru Matematika', 'Pangkat_Golongan': '-', 'Program_Studi': 'S1 - Pendidikan Matematika', 'No_HP': '081234567809' },
    { 'NIP': '-', 'Nama_Lengkap': 'Rina Marlina, S.Pd', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Guru Kelas', 'Pangkat_Golongan': '-', 'Program_Studi': 'S1 - PGSD', 'No_HP': '081234567810' }
  ];
  exportToExcel(dummyData, 'Template_Import_Guru_SDN_Nambo_03', 'Template_Guru');
}

// 4. Template Kepegawaian (Tendik, TU, Kebersihan, Penjaga) (10 dummy rows)
export function downloadTemplateKepegawaian() {
  const dummyData = [
    { 'NIP': '-', 'Nama_Lengkap': 'Hendra Gunawan', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Staff Tata Usaha (Dapodik)', 'Pangkat_Golongan': '-', 'Pendidikan': 'D3 Komputer', 'No_HP': '085711223301' },
    { 'NIP': '-', 'Nama_Lengkap': 'Rika Kartika', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Staff Tata Usaha (Keuangan/BOS)', 'Pangkat_Golongan': '-', 'Pendidikan': 'S1 Akuntansi', 'No_HP': '085711223302' },
    { 'NIP': '-', 'Nama_Lengkap': 'Wahyu Hidayat', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Pengelola Perpustakaan', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMA', 'No_HP': '085711223303' },
    { 'NIP': '-', 'Nama_Lengkap': 'Surya Darma', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Teknisi Laboratorium & IT', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMK Komputer', 'No_HP': '085711223304' },
    { 'NIP': '-', 'Nama_Lengkap': 'Iis Rohaeti', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Petugas Kebersihan Gedung A', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMP', 'No_HP': '085711223305' },
    { 'NIP': '-', 'Nama_Lengkap': 'Ujang Sumarna', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Petugas Kebersihan Gedung B', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMP', 'No_HP': '085711223306' },
    { 'NIP': '-', 'Nama_Lengkap': 'Kusnadi', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Penjaga Malam & Keamanan', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMA', 'No_HP': '085711223307' },
    { 'NIP': '-', 'Nama_Lengkap': 'Wati Rahmawati', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Petugas Pengelola Kantin Sehat', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMA', 'No_HP': '085711223308' },
    { 'NIP': '-', 'Nama_Lengkap': 'Junaedi', 'Jenis_Kelamin': 'L', 'Status': 'Honor', 'Jabatan': 'Pemelihara Taman & Lapangan', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMP', 'No_HP': '085711223309' },
    { 'NIP': '-', 'Nama_Lengkap': 'Sri Mulyani', 'Jenis_Kelamin': 'P', 'Status': 'Honor', 'Jabatan': 'Staff Administrasi Surat Menyurat', 'Pangkat_Golongan': '-', 'Pendidikan': 'SMK Administrasi', 'No_HP': '085711223310' }
  ];
  exportToExcel(dummyData, 'Template_Import_Kepegawaian_SDN_Nambo_03', 'Template_Kepegawaian');
}

// 5. Template Absensi (10 dummy rows)
export function downloadTemplateAbsensi() {
  const dummyData = [
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 1A', 'Hadir': 32, 'Sakit': 1, 'Izin': 0, 'Alfa': 0, 'Catatan': 'Hari pertama efektif pembelajaran' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 1B', 'Hadir': 33, 'Sakit': 0, 'Izin': 0, 'Alfa': 0, 'Catatan': 'Lengkap 100%' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 2A', 'Hadir': 31, 'Sakit': 1, 'Izin': 1, 'Alfa': 0, 'Catatan': '1 siswa demam berdarah' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 2B', 'Hadir': 32, 'Sakit': 0, 'Izin': 1, 'Alfa': 0, 'Catatan': 'Izin urusan keluarga' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 3A', 'Hadir': 33, 'Sakit': 0, 'Izin': 0, 'Alfa': 0, 'Catatan': 'Lengkap' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 3B', 'Hadir': 32, 'Sakit': 1, 'Izin': 0, 'Alfa': 0, 'Catatan': 'Sakit flu' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 4A', 'Hadir': 33, 'Sakit': 0, 'Izin': 0, 'Alfa': 0, 'Catatan': 'Lengkap' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 4B', 'Hadir': 31, 'Sakit': 1, 'Izin': 1, 'Alfa': 0, 'Catatan': 'Sakit' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 5A', 'Hadir': 32, 'Sakit': 1, 'Izin': 0, 'Alfa': 0, 'Catatan': 'Sakit gigi' },
    { 'Tanggal': '2026-07-20', 'Nama_Kelas': 'Kelas 6A', 'Hadir': 33, 'Sakit': 0, 'Izin': 0, 'Alfa': 0, 'Catatan': 'Lengkap' }
  ];
  exportToExcel(dummyData, 'Template_Import_Absensi_SDN_Nambo_03', 'Template_Absensi');
}

// 6. Template Hari Efektif (10 dummy rows)
export function downloadTemplateHariEfektif() {
  const dummyData = [
    { 'Bulan': 'Juli 2026', 'Semester': 1, 'Tahun': 2026, 'Hari_Kalender': 31, 'Hari_Efektif_Sekolah': 13, 'Hari_Efektif_Belajar': 13, 'Hari_Minggu': 4, 'Libur_Umum': 0, 'Libur_Semester': 14, 'Kegiatan_Khusus': 'MPLS dan Masuk Sekolah' },
    { 'Bulan': 'Agustus 2026', 'Semester': 1, 'Tahun': 2026, 'Hari_Kalender': 31, 'Hari_Efektif_Sekolah': 21, 'Hari_Efektif_Belajar': 19, 'Hari_Minggu': 5, 'Libur_Umum': 1, 'Libur_Semester': 0, 'Kegiatan_Khusus': 'HUT RI ke-81' },
    { 'Bulan': 'September 2026', 'Semester': 1, 'Tahun': 2026, 'Hari_Kalender': 30, 'Hari_Efektif_Sekolah': 21, 'Hari_Efektif_Belajar': 17, 'Hari_Minggu': 4, 'Libur_Umum': 1, 'Libur_Semester': 0, 'Kegiatan_Khusus': 'Sumatif Tengah Semester 1' },
    { 'Bulan': 'Oktober 2026', 'Semester': 1, 'Tahun': 2026, 'Hari_Kalender': 31, 'Hari_Efektif_Sekolah': 22, 'Hari_Efektif_Belajar': 22, 'Hari_Minggu': 4, 'Libur_Umum': 0, 'Libur_Semester': 0, 'Kegiatan_Khusus': 'Bulan Bahasa' },
    { 'Bulan': 'November 2026', 'Semester': 1, 'Tahun': 2026, 'Hari_Kalender': 30, 'Hari_Efektif_Sekolah': 21, 'Hari_Efektif_Belajar': 20, 'Hari_Minggu': 5, 'Libur_Umum': 0, 'Libur_Semester': 0, 'Kegiatan_Khusus': 'Hari Guru Nasional' },
    { 'Bulan': 'Desember 2026', 'Semester': 1, 'Tahun': 2026, 'Hari_Kalender': 31, 'Hari_Efektif_Sekolah': 15, 'Hari_Efektif_Belajar': 11, 'Hari_Minggu': 4, 'Libur_Umum': 2, 'Libur_Semester': 10, 'Kegiatan_Khusus': 'ASAS 1 & Libur Semester 1' },
    { 'Bulan': 'Januari 2027', 'Semester': 2, 'Tahun': 2027, 'Hari_Kalender': 31, 'Hari_Efektif_Sekolah': 19, 'Hari_Efektif_Belajar': 15, 'Hari_Minggu': 5, 'Libur_Umum': 2, 'Libur_Semester': 5, 'Kegiatan_Khusus': 'Masuk Semester 2 & Isra Mi\'raj' },
    { 'Bulan': 'Februari 2027', 'Semester': 2, 'Tahun': 2027, 'Hari_Kalender': 28, 'Hari_Efektif_Sekolah': 18, 'Hari_Efektif_Belajar': 12, 'Hari_Minggu': 4, 'Libur_Umum': 2, 'Libur_Semester': 0, 'Kegiatan_Khusus': 'Tahun Baru Imlek' },
    { 'Bulan': 'Maret 2027', 'Semester': 2, 'Tahun': 2027, 'Hari_Kalender': 31, 'Hari_Efektif_Sekolah': 10, 'Hari_Efektif_Belajar': 6, 'Hari_Minggu': 4, 'Libur_Umum': 3, 'Libur_Semester': 14, 'Kegiatan_Khusus': 'Awal Puasa Ramadhan & Idul Fitri' },
    { 'Bulan': 'April 2027', 'Semester': 2, 'Tahun': 2027, 'Hari_Kalender': 30, 'Hari_Efektif_Sekolah': 20, 'Hari_Efektif_Belajar': 16, 'Hari_Minggu': 4, 'Libur_Umum': 1, 'Libur_Semester': 5, 'Kegiatan_Khusus': 'Sanlat Ramadhan & Hari Kartini' }
  ];
  exportToExcel(dummyData, 'Template_Import_Hari_Efektif_SDN_Nambo_03', 'Template_Hari_Efektif');
}
