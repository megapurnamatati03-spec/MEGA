import { HariEfektifItem, DeepLearningModuleItem, ProtaPromesItem } from '../types';

export const DIMENSI_PROFIL_LULUSAN = [
  'Keimanan & Ketaqwaan terhadap Tuhan YME',
  'Kewargaan & Nilai Kebangsaan',
  'Penalaran Kritis & Problem Solving',
  'Kreativitas & Inovasi',
  'Kolaborasi & Gotong Royong',
  'Kemandirian & Tanggung Jawab',
  'Kesehatan & Kebugaran Jasmani',
  'Komunikasi Efektif & Multiliterasi'
];

export const MATA_PELAJARAN_LIST = [
  'Koding dan Kecerdasan Artifisial',
  'Pendidikan Agama Islam dan Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
  'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  'Seni Rupa',
  'Seni Musik',
  'Seni Tari',
  'Bahasa Inggris',
  'Bahasa dan Sastra Sunda (Mulok)'
];

export const CAPAIAN_PEMBELAJARAN_DATABASE: Record<string, { fase: string; elemen: string; cp: string; atp: string; tp: string[] }[]> = {
  'Koding dan Kecerdasan Artifisial': [
    {
      fase: 'Fase A (Kelas 1-2)',
      elemen: 'Berpikir Komputasional & Logika Urutan (Unplugged)',
      cp: 'Peserta didik mampu memahami konsep instruksi berurutan (algoritma sederhana) melalui aktivitas bermain logika tanpa gawai (unplugged), mengidentifikasi pola, serta menyelesaikan teka-teki logika visual secara mandiri.',
      atp: 'A.1 Mengenal konsep instruksi langkah demi langkah -> A.2 Mengikuti arah panah dan pola gerak -> A.3 Menemukan kesalahan (debugging) sederhana dalam alur langkah.',
      tp: [
        'Peserta didik dapat menyusun instruksi berurutan untuk memandu robot/teman mencapai tujuan.',
        'Peserta didik dapat mengenali pola gambar atau warna yang berulang.',
        'Peserta didik dapat mendeteksi dan memperbaiki langkah yang keliru pada alur cerita bergambar.'
      ]
    },
    {
      fase: 'Fase B (Kelas 3-4)',
      elemen: 'Pemrograman Blok Visual & Dasar Kecerdasan Buatan',
      cp: 'Peserta didik mampu merancang program visual sederhana menggunakan blok perintah (Scratch Jr / Blockly), mengidentifikasi konsep pengulangan (looping) dan kondisi sederhana, serta mengenal bagaimana teknologi AI mengenali pola suara dan gambar.',
      atp: 'B.1 Menyusun sprite dan background -> B.2 Menggunakan blok perulangan dan event -> B.3 Bereksperimen dengan model klasifikasi pola sederhana (Teachable Machine).',
      tp: [
        'Peserta didik dapat membuat animasi cerita interaktif dengan perpindahan tokoh dan dialog.',
        'Peserta didik dapat menggunakan blok pengulangan (loop) untuk mengefisienkan langkah perintah.',
        'Peserta didik dapat menjelaskan cara kerja kecerdasan artifisial dalam mengenali objek di sekitar.'
      ]
    },
    {
      fase: 'Fase C (Kelas 5-6)',
      elemen: 'Algoritma Pemrograman, Analisis Data & Etika AI',
      cp: 'Peserta didik mampu mengembangkan aplikasi game edukatif berbasis visual block, menerapkan variabel, operator logika, dan conditional (if-then-else), serta memahami prinsip pemanfaatan kecerdasan artifisial secara etis, aman, dan bertanggung jawab.',
      atp: 'C.1 Perancangan algoritma pemecahan masalah komputasional -> C.2 Pembuatan game kuis interaktif dengan skor dan variabel -> C.3 Analisis etika digital dan penerapan asisten AI cerdas.',
      tp: [
        'Peserta didik dapat merancang alur logika permainan matematika edukatif dengan sistem skor variabel.',
        'Peserta didik dapat mengintegrasikan sensor masukan (suara/kamera) ke dalam kode program visual.',
        'Peserta didik dapat mengevaluasi dampak positif dan etika penggunaan AI generatif dalam pembelajaran.'
      ]
    }
  ],
  'Ilmu Pengetahuan Alam dan Sosial (IPAS)': [
    {
      fase: 'Fase B (Kelas 3-4)',
      elemen: 'Pemahaman IPAS & Keterampilan Proses',
      cp: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan, siklus hidup hewan dan manusia, wujud zat dan perubahannya, serta mengidentifikasi ragam bentang alam dan kekayaan hayati di lingkungan sekitar.',
      atp: 'B.1 Identifikasi bagian tumbuhan dan fungsinya -> B.2 Analisis fotosintesis -> B.3 Siklus hidup organisme sekitar.',
      tp: [
        'Peserta didik dapat mengidentifikasi bagian tubuh tumbuhan (akar, batang, daun, bunga) beserta fungsinya.',
        'Peserta didik dapat mendemonstrasikan proses fotosintesis melalui percobaan sederhana.',
        'Peserta didik dapat mengaitkan fungsi bagian tumbuhan dengan kelangsungan hidup ekosistem sekolah.'
      ]
    },
    {
      fase: 'Fase C (Kelas 5-6)',
      elemen: 'Sains Lingkungan & Harmoni Ekosistem',
      cp: 'Peserta didik menyelidiki bagaimana sistem organ tubuh manusia bekerja secara terpadu, menganalisis perpindahan energi dalam jaring-jaring makanan, serta mengusulkan solusi pelestarian lingkungan hidup dari dampak polusi.',
      atp: 'C.1 Sistem pencernaan dan pernapasan manusia -> C.2 Aliran energi dan rantai makanan ekosistem -> C.3 Solusi krisis sampah dan energi ramah lingkungan.',
      tp: [
        'Peserta didik dapat menjelaskan mekanisme kerja sistem pencernaan makanan manusia.',
        'Peserta didik dapat membuat bagan jaring-jaring makanan pada ekosistem kebun/sawah.',
        'Peserta didik dapat merancang kampanye hemat air dan pilah sampah di lingkungan SDN Nambo 03.'
      ]
    }
  ],
  'Matematika': [
    {
      fase: 'Fase A (Kelas 1-2)',
      elemen: 'Bilangan & Geometri',
      cp: 'Peserta didik menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 100, melakukan operasi penjumlahan dan pengurangan, serta mengenali bangun datar segitiga, segiempat, dan lingkaran.',
      atp: 'A.1 Menghitung benda konkret 1-100 -> A.2 Nilai tempat puluhan dan satuan -> A.3 Penjumlahan dan pengurangan kontekstual.',
      tp: [
        'Peserta didik dapat membilang dan menuliskan lambang bilangan cacah 1 sampai 100.',
        'Peserta didik dapat menyelesaikan soal cerita penjumlahan yang berhubungan dengan uang jajan harian.',
        'Peserta didik dapat mengelompokkan bangun datar yang ada di ruang kelas.'
      ]
    },
    {
      fase: 'Fase C (Kelas 5-6)',
      elemen: 'Pengukuran, Pecahan, dan Data',
      cp: 'Peserta didik mampu membandingkan dan mengurutkan berbagai pecahan termasuk pecahan campuran, melakukan operasi hitung pecahan dan desimal, menghitung volume bangun ruang, serta menyajikan data dalam bentuk diagram batang.',
      atp: 'C.1 Operasi penjumlahan dan perkalian pecahan -> C.2 Luas permukaan dan volume kubus/balok -> C.3 Pengumpulan dan penyajian data statistik sederhana.',
      tp: [
        'Peserta didik dapat menghitung operasi hitung perkalian pecahan dengan bilangan bulat secara tepat.',
        'Peserta didik dapat menghitung volume prisma segi empat dan kubus menggunakan satuan kubus kubik.',
        'Peserta didik dapat menyajikan data tinggi dan berat badan teman sekelas ke dalam diagram batang.'
      ]
    }
  ],
  'Bahasa Indonesia': [
    {
      fase: 'Fase B (Kelas 3-4)',
      elemen: 'Menyimak, Membaca dan Memirsa, Menulis',
      cp: 'Peserta didik mampu memahami ide pokok dan ide pendukung pada teks naratif dan informatif, menyusun teks narasi runtut dengan kosa kata baru, serta menyampaikan pendapat dalam diskusi kelompok secara santun.',
      atp: 'B.1 Menemukan ide pokok paragraf -> B.2 Menulis teks deskripsi lingkungan -> B.3 Berbicara mempresentasikan hasil karya.',
      tp: [
        'Peserta didik dapat menemukan gagasan utama dan informasi kunci dalam teks bacaan.',
        'Peserta didik dapat menulis cerita pengalaman liburan dengan ejaan yang disempurnakan (EYD).',
        'Peserta didik dapat menceritakan kembali dongeng daerah Sunda dengan intonasi yang ekspresif.'
      ]
    }
  ],
  'Pendidikan Pancasila': [
    {
      fase: 'Fase C (Kelas 5-6)',
      elemen: 'Pancasila & Bhinneka Tunggal Ika',
      cp: 'Peserta didik mampu memahami dan meneladani makna sila-sila Pancasila dalam kehidupan bermasyarakat, menghargai keragaman budaya, suku, dan agama di Indonesia, serta menerapkan norma hukum dan kesepakatan kelas.',
      atp: 'C.1 Penerapan nilai gotong royong dan keadilan -> C.2 Keberagaman adat istiadat nusantara -> C.3 Musyawarah mufakat di sekolah.',
      tp: [
        'Peserta didik dapat mengidentifikasi perilaku yang mencerminkan pengamalan sila ke-2 dan ke-5.',
        'Peserta didik dapat menunjukkan sikap toleransi terhadap perbedaan latar belakang suku teman sebaya.',
        'Peserta didik dapat mempraktikkan musyawarah dalam menentukan struktur kepengurusan kelas.'
      ]
    }
  ]
};

// Kalender Hari Efektif Tahun Ajaran 2026/2027 (Juli 2026 - Juni 2027)
export const INITIAL_HARI_EFEKTIF: HariEfektifItem[] = [
  // Semester 1 (Ganjil 2026/2027)
  {
    id: 'he-jul-2026',
    bulan: 'Juli 2026',
    semester: 1,
    tahun: 2026,
    jumlahHariKalender: 31,
    hariEfektifSekolah: 13,
    hariEfektifBelajar: 13,
    hariMinggu: 4,
    liburUmum: 0,
    liburKhususSemester: 14,
    kegiatanKhusus: 'Hari Pertama Masuk Sekolah & Masa Pengenalan Lingkungan Sekolah (MPLS)'
  },
  {
    id: 'he-ags-2026',
    bulan: 'Agustus 2026',
    semester: 1,
    tahun: 2026,
    jumlahHariKalender: 31,
    hariEfektifSekolah: 21,
    hariEfektifBelajar: 19,
    hariMinggu: 5,
    liburUmum: 1,
    liburKhususSemester: 0,
    kegiatanKhusus: 'Peringatan Hari Kemerdekaan RI Ke-81 & Hari Pramuka'
  },
  {
    id: 'he-sep-2026',
    bulan: 'September 2026',
    semester: 1,
    tahun: 2026,
    jumlahHariKalender: 30,
    hariEfektifSekolah: 21,
    hariEfektifBelajar: 17,
    hariMinggu: 4,
    liburUmum: 1,
    liburKhususSemester: 0,
    kegiatanKhusus: 'Penilaian Sumatif Tengah Semester (STS) 1 & Maulid Nabi Muhammad SAW'
  },
  {
    id: 'he-okt-2026',
    bulan: 'Oktober 2026',
    semester: 1,
    tahun: 2026,
    jumlahHariKalender: 31,
    hariEfektifSekolah: 22,
    hariEfektifBelajar: 22,
    hariMinggu: 4,
    liburUmum: 0,
    liburKhususSemester: 0,
    kegiatanKhusus: 'Bulan Bahasa & Peringatan Hari Sumpah Pemuda'
  },
  {
    id: 'he-nov-2026',
    bulan: 'November 2026',
    semester: 1,
    tahun: 2026,
    jumlahHariKalender: 30,
    hariEfektifSekolah: 21,
    hariEfektifBelajar: 20,
    hariMinggu: 5,
    liburUmum: 0,
    liburKhususSemester: 0,
    kegiatanKhusus: 'Hari Pahlawan & Peringatan Hari Guru Nasional'
  },
  {
    id: 'he-des-2026',
    bulan: 'Desember 2026',
    semester: 1,
    tahun: 2026,
    jumlahHariKalender: 31,
    hariEfektifSekolah: 15,
    hariEfektifBelajar: 11,
    hariMinggu: 4,
    liburUmum: 2,
    liburKhususSemester: 10,
    kegiatanKhusus: 'Asesmen Sumatif Akhir Semester (ASAS) 1, Titimangsa Rapor & Libur Semester 1'
  },

  // Semester 2 (Genap 2026/2027)
  {
    id: 'he-jan-2027',
    bulan: 'Januari 2027',
    semester: 2,
    tahun: 2027,
    jumlahHariKalender: 31,
    hariEfektifSekolah: 19,
    hariEfektifBelajar: 15,
    hariMinggu: 5,
    liburUmum: 2,
    liburKhususSemester: 5,
    kegiatanKhusus: 'Hari Pertama Masuk Semester Genap & Peringatan Isra Mi\'raj'
  },
  {
    id: 'he-feb-2027',
    bulan: 'Februari 2027',
    semester: 2,
    tahun: 2027,
    jumlahHariKalender: 28,
    hariEfektifSekolah: 18,
    hariEfektifBelajar: 12,
    hariMinggu: 4,
    liburUmum: 2,
    liburKhususSemester: 0,
    kegiatanKhusus: 'Tahun Baru Imlek 2578 & Persiapan Kegiatan Lomba O2SN / FLS2N'
  },
  {
    id: 'he-mar-2027',
    bulan: 'Maret 2027',
    semester: 2,
    tahun: 2027,
    jumlahHariKalender: 31,
    hariEfektifSekolah: 10,
    hariEfektifBelajar: 6,
    hariMinggu: 4,
    liburUmum: 3,
    liburKhususSemester: 14,
    kegiatanKhusus: 'Awal Puasa Ramadhan 1448 H, Hari Raya Nyepi, & Cuti Libur Idul Fitri'
  },
  {
    id: 'he-apr-2027',
    bulan: 'April 2027',
    semester: 2,
    tahun: 2027,
    jumlahHariKalender: 30,
    hariEfektifSekolah: 20,
    hariEfektifBelajar: 16,
    hariMinggu: 4,
    liburUmum: 1,
    liburKhususSemester: 5,
    kegiatanKhusus: 'Kegiatan Pesantren Kilat (Sanlat) Ramadhan, Halal Bihalal & Peringatan Hari Kartini'
  },
  {
    id: 'he-mei-2027',
    bulan: 'Mei 2027',
    semester: 2,
    tahun: 2027,
    jumlahHariKalender: 31,
    hariEfektifSekolah: 18,
    hariEfektifBelajar: 14,
    hariMinggu: 5,
    liburUmum: 3,
    liburKhususSemester: 0,
    kegiatanKhusus: 'Hari Pendidikan Nasional, Kenaikan Yesus Kristus & Hari Raya Waisak'
  },
  {
    id: 'he-jun-2027',
    bulan: 'Juni 2027',
    semester: 2,
    tahun: 2027,
    jumlahHariKalender: 30,
    hariEfektifSekolah: 16,
    hariEfektifBelajar: 12,
    hariMinggu: 4,
    liburUmum: 2,
    liburKhususSemester: 8,
    kegiatanKhusus: 'Asesmen Sumatif Akhir Jenjang (ASAJ Kelas 6), ASAT Kelas 1-5, Pembagian Rapor & Libur Kenaikan Kelas'
  }
];

export const INITIAL_MODULES: DeepLearningModuleItem[] = [
  {
    id: 'modul-koding-01',
    mataPelajaran: 'Koding dan Kecerdasan Artifisial',
    fase: 'Fase C (Kelas 5-6)',
    kelas: 'Kelas 5',
    semester: 1,
    alokasiWaktu: '2 JP (2 x 35 Menit)',
    penyusun: 'Abdul Rohman Wahid, S.Pd',
    tahunAjaran: '2026/2027',
    dimensiProfilLulusan: [
      'Penalaran Kritis & Problem Solving',
      'Kreativitas & Inovasi',
      'Kolaborasi & Gotong Royong',
      'Komunikasi Efektif & Multiliterasi'
    ],
    karakteristikPesertaDidik: 'Peserta didik kelas 5 telah terbiasa menggunakan perangkat gawai layar sentuh dan Chromebook sekolah, memiliki antusiasme tinggi terhadap gim interaktif, namun memerlukan bimbingan dalam menyusun urutan logika komputasi bertahap.',
    elemen: 'Algoritma Pemrograman Visual & Pemahaman Pola AI',
    capaianPembelajaran: 'Peserta didik mampu mengembangkan alur algoritma visual menggunakan blok perintah kondisional (if-then), menguji prototipe mini game edukasi, serta memahami konsep pengenalan pola gambar pada sistem kecerdasan artifisial.',
    alurTujuanPembelajaran: 'C.1 Memahami logika variabel -> C.2 Merancang interaksi tokoh sprite -> C.3 Melatih model klasifikasi gambar sederhana.',
    tujuanPembelajaran: [
      'Peserta didik dapat membuat alur logika pemungutan sampah digital menggunakan blok kondisional percabangan (if sentuh sampah, maka tambah skor 10).',
      'Peserta didik dapat menjelaskan secara verbal bagaimana sistem komputer membedakan pola gambar sampah organik dan non-organik.',
      'Peserta didik mampu berkolaborasi dalam kelompok untuk mendebug program yang mengalami kesalahan logika gerak.'
    ],
    pemahamanBermakna: 'Koding dan Kecerdasan Artifisial adalah bahasa komunikasi manusia dengan mesin untuk memecahkan persoalan dunia nyata secara kreatif, seperti menjaga kebersihan lingkungan sekolah.',
    pertanyaanPemantik: [
      'Bagaimana komputer atau robot di pabrik bisa membedakan botol plastik dari daun kering?',
      'Jika sebuah karakter game tidak mau berhenti bergerak saat menabrak dinding, bagian logika mana yang perlu kita perbaiki?'
    ],
    kegiatanAwal: 'Guru menyapa peserta didik dengan hangat, mengajak bernapas sadar (mindful breathing) selama 1 menit, mengaitkan pengalaman bermain game anak dengan cara kerja di balik layar, lalu mendemonstrasikan animasi singkat di layar proyektor.',
    kegiatanInti: {
      tahapMemahami: 'Peserta didik mencermati simulasi balok kode (block code) di layar, mengamati bagaimana instruksi "jika menyentuh warna hijau maka skor bertambah" bekerja (Meaningful Learning: menghubungkan kode dengan aturan game).',
      tahapMengaplikasi: 'Peserta didik berpasangan membuka platform pemrograman blok visual di Chromebook/Laptop, menyusun balok kode untuk menggerakkan sprite pembersih sungai Nambo, serta menguji respon balok ketika sprite menyentuh rintangan.',
      tahapMerefleksi: 'Setiap pasangan saling meninjau (peer-review) karya kelompok lain, menemukan bug bersama, dan menceritakan strategi logika yang mereka gunakan.'
    },
    kegiatanPenutup: 'Joyful Closure: Guru memberikan tepuk apresiasi "Bintang Koding", merangkum konsep algoritma percabangan bersama siswa, dan memberikan tantangan eksplorasi ringan di rumah.',
    mediaDanBahanAjar: [
      'Chromebook / Lab Komputer SDN Nambo 03',
      'Kartu Balok Algoritma Fisik (Unplugged Activity)',
      'Lembar Kerja Siswa (LKPD) Koding Mandiri'
    ],
    asesmenAwal: 'Kuis tanya jawab lisan tentang urutan langkah membuat teh manis untuk menguji pemahaman konsep algoritma berurutan.',
    asesmenFormatif: 'Observasi unjuk kerja saat peserta didik merangkai blok kode dan checklist keaktifan kolaborasi kelompok.',
    asesmenSumatif: 'Penilaian produk mini game yang berhasil dijalankan tanpa bug dan memenuhi 3 kriteria fitur interaktif.',
    rubrikPenilaian: [
      {
        kriteria: 'Logika Algoritma & Percabangan',
        perluBimbingan: 'Belum mampu menyusun urutan blok dengan benar meski dibimbing guru.',
        cukup: 'Mampu menyusun blok gerak dasar namun masih keliru pada logika percabangan kondisional (if-then).',
        baik: 'Mampu menyusun blok kondisional dengan benar dan mengatasi kesalahan kecil secara mandiri.',
        sangatBaik: 'Sangat mahir merancang logika percabangan bercabang ganda dan menambahkan variabel skor dinamis.'
      },
      {
        kriteria: 'Kolaborasi & Gotong Royong',
        perluBimbingan: 'Pasif dan mendominasi atau tidak terlibat dalam tugas pasangan.',
        cukup: 'Terlibat dalam tugas namun sesekali membutuhkan mediasi guru.',
        baik: 'Berbagi peran secara aktif dengan teman sebangku dalam merancang dan mencoba kode.',
        sangatBaik: 'Menjadi fasilitator yang suportif bagi rekannya, sabar menjelaskan ide dan menghargai masukan teman.'
      }
    ],
    soalIndividu: [
      'Jelaskan fungsi dari blok perintah "IF [menyentuh benda] THEN [skor bertambah 1]" dalam sebuah game!',
      'Jika robot pembersih sampah tidak bergerak saat tombol panah kanan ditekan, apa kemungkinan kesalahan kodenya?'
    ],
    tugasKelompok: 'Bersama pasangan sebangku, buatlah sebuah animasi cerita interaktif berdurasi 30 detik yang menampilkan pesan "Sayangi Sungai Nambo, Pilah Sampahmu!" lengkap dengan suara efek.',
    lembarKerjaSiswa: 'LKPD Modul Koding 01: Praktik Menyusun Algoritma Game Pemilah Sampah Pintar SDN Nambo 03.'
  }
];

export const INITIAL_PROTA_PROMES: ProtaPromesItem[] = [
  {
    id: 'pp-01',
    mapel: 'Koding dan Kecerdasan Artifisial',
    kelas: 'Kelas 5',
    semester: 1,
    tahunAjaran: '2026/2027',
    tujuanPembelajaran: 'Memahami konsep dasar algoritma visual dan pembuatan mini game interaktif',
    alokasiJP: 16,
    bulan: 'Agustus 2026',
    mingguKe: [1, 2, 3, 4]
  },
  {
    id: 'pp-02',
    mapel: 'IPAS',
    kelas: 'Kelas 5',
    semester: 1,
    tahunAjaran: '2026/2027',
    tujuanPembelajaran: 'Menganalisis sistem pernapasan dan pencernaan manusia serta jaring-jaring makanan',
    alokasiJP: 24,
    bulan: 'September 2026',
    mingguKe: [1, 2, 3]
  },
  {
    id: 'pp-03',
    mapel: 'Matematika',
    kelas: 'Kelas 5',
    semester: 1,
    tahunAjaran: '2026/2027',
    tujuanPembelajaran: 'Menyelesaikan permasalahan operasi pecahan biasa dan campuran dalam kehidupan sehari-hari',
    alokasiJP: 20,
    bulan: 'Oktober 2026',
    mingguKe: [1, 2, 3, 4]
  }
];
