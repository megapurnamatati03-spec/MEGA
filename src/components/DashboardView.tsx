import React, { useMemo } from 'react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  TrendingUp,
  HeartHandshake,
  Calendar,
  CheckCircle,
  FileText,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { StudentItem, ClassItem, StaffItem, KinerjaGuruItem, DailyAttendanceItem } from '../types';

interface DashboardViewProps {
  students: StudentItem[];
  classes: ClassItem[];
  staff: StaffItem[];
  kinerja: KinerjaGuruItem[];
  attendance: DailyAttendanceItem[];
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  classes,
  staff,
  kinerja,
  attendance,
  onNavigate,
}) => {
  // Statistics Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'aktif' || s.status === 'pindahan').length;
  const maleCount = students.filter(s => s.jk === 'L').length;
  const femaleCount = students.filter(s => s.jk === 'P').length;
  const pipStudentsCount = students.filter(s => s.isPIP).length;
  const pipPercentage = totalStudents > 0 ? ((pipStudentsCount / totalStudents) * 100).toFixed(1) : '0';

  const mainClasses = classes.filter(c => c.tipe === 'utama');
  const ekskulClasses = classes.filter(c => c.tipe === 'ekskul');

  const teachers = staff.filter(s => s.isGuru);
  const tendik = staff.filter(s => !s.isGuru);

  // Kinerja Guru Stats
  const observedCount = kinerja.filter(k => k.praktikKinerja.statusObservasi).length;
  const observedPercent = teachers.length > 1 ? Math.round((observedCount / (teachers.length - 1)) * 100) : 0;

  // Average attendance calculation
  const totalHadir = attendance.reduce((acc, curr) => acc + curr.hadir, 0);
  const totalRombelAttendance = attendance.reduce((acc, curr) => acc + curr.totalSiswa, 0);
  const avgAttendancePercent = totalRombelAttendance > 0 ? ((totalHadir / totalRombelAttendance) * 100).toFixed(1) : '98.5';

  // Per-class breakdown
  const classBreakdown = useMemo(() => {
    return mainClasses.map(cls => {
      const inClass = students.filter(s => s.kelasId === cls.id);
      const l = inClass.filter(s => s.jk === 'L').length;
      const p = inClass.filter(s => s.jk === 'P').length;
      const pip = inClass.filter(s => s.isPIP).length;
      return {
        id: cls.id,
        nama: cls.nama,
        total: inClass.length,
        laki: l,
        perempuan: p,
        pip
      };
    });
  }, [mainClasses, students]);

  // Ekstrakurikuler counts
  const ekskulBreakdown = useMemo(() => {
    return ekskulClasses.map(ek => {
      const count = students.filter(s => s.ekskulIds && s.ekskulIds.includes(ek.id)).length;
      return {
        nama: ek.nama,
        count
      };
    });
  }, [ekskulClasses, students]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: SD Negeri Nambo 03 Overview */}
      <div className="bg-gradient-to-r from-red-800 via-rose-900 to-red-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-500/30 text-red-150 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Pusat Komando & Pengawasan
              </span>
              <span className="text-red-200 text-xs font-mono">
                TA 2026/2027
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SIPANTAU SDN Nambo 03
            </h1>
            <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Sistem Informasi & Pengawasan Tata Kelola SD Negeri Nambo 03, Klapanunggal, Kabupaten Bogor.
              Terintegrasi dengan Dapodik, E-Kinerja Guru 2026, dan Pembelajaran Mendalam Kurikulum Merdeka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('input_data')}
              className="px-3.5 py-2 bg-white text-red-900 hover:bg-red-50 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-red-700" />
              <span>Input Data Baru</span>
            </button>
            <button
              onClick={() => onNavigate('perangkat_ajar')}
              className="px-3.5 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Modul Ajar Koding</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Siswa */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Peserta Didik</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {totalStudents}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span>{maleCount} Laki-laki</span>
            <span aria-hidden="true">·</span>
            <span>{femaleCount} Perempuan</span>
          </div>
        </div>

        {/* Total Rombel & Kelas */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Rombel & Ekskul</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {mainClasses.length} <span className="text-base font-normal text-slate-500">Rombel</span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            + {ekskulClasses.length} Cabang Ekstrakurikuler
          </div>
        </div>

        {/* Pendidik & Tenaga Kependidikan (GTK) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">GTK & Pegawai</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {staff.length} <span className="text-base font-normal text-slate-500">Orang</span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {teachers.length} Guru · {tendik.length} Tenaga Teknis/TU
          </div>
        </div>

        {/* Bantuan PIP & Kehadiran */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Penerima Bantuan PIP</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono tabular-nums">
            {pipStudentsCount} <span className="text-base font-normal text-slate-500">Siswa</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>{pipPercentage}% dari total</span>
            <span className="font-semibold text-red-800">Kehadiran {avgAttendancePercent}%</span>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Interactive Bar Chart - Student Distribution per Class (1A - 6B) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Populasi & Rasio Gender Siswa per Rombongan Belajar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                SD Negeri Nambo 03 (Total: 395 Peserta Didik)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block"></span> Laki-laki
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-pink-400 inline-block"></span> Perempuan
              </span>
            </div>
          </div>

          {/* Interactive Stacked Bar Chart */}
          <div className="space-y-2.5 pt-2">
            {classBreakdown.map((item) => {
              const maxScale = 36;
              const lWidth = (item.laki / maxScale) * 100;
              const pWidth = (item.perempuan / maxScale) * 100;

              return (
                <div key={item.id} className="group">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 w-16">
                      {item.nama}
                    </span>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2">
                      <span className="font-mono text-blue-600">{item.laki}L</span>
                      <span>+</span>
                      <span className="font-mono text-pink-600">{item.perempuan}P</span>
                      <span className="font-bold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.2 rounded-sm">
                        ={item.total}
                      </span>
                      {item.pip > 0 && (
                        <span className="text-[10px] bg-amber-50 text-amber-700 px-1 py-0.2 rounded-xs">
                          {item.pip} PIP
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Bar Visual with hover tooltip feel */}
                  <div className="h-5 w-full bg-slate-100 rounded-md overflow-hidden flex transition-all group-hover:ring-1 group-hover:ring-red-400">
                    <div
                      style={{ width: `${lWidth}%` }}
                      className="bg-blue-500 h-full transition-all flex items-center justify-center text-[10px] text-white font-mono"
                      title={`${item.nama}: ${item.laki} Siswa Laki-laki`}
                    >
                      {item.laki > 5 ? item.laki : ''}
                    </div>
                    <div
                      style={{ width: `${pWidth}%` }}
                      className="bg-pink-400 h-full transition-all flex items-center justify-center text-[10px] text-white font-mono"
                      title={`${item.nama}: ${item.perempuan} Siswi Perempuan`}
                    >
                      {item.perempuan > 5 ? item.perempuan : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: E-Kinerja Guru & Partisipasi Ekskul */}
        <div className="space-y-6">
          
          {/* Box A: Status Observasi Kinerja Guru oleh Kepala Sekolah */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Observasi Kinerja Guru 2026
              </h3>
              <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-sm">
                Nilai 100 Poin
              </span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-red-600 transition-all duration-500"
                    strokeDasharray={`${observedPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-sm font-bold text-slate-900 font-mono">{observedPercent}%</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-800">
                  {observedCount} dari {teachers.length - 1} Guru Terobservasi
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Diobservasi langsung oleh Kepala Sekolah Ibu AM. Mega Pt, S.Pd.,M.Pd.
                </p>
                <button
                  onClick={() => onNavigate('kepegawaian')}
                  className="text-xs text-red-700 hover:text-red-800 font-semibold cursor-pointer pt-1 block"
                >
                  Buka Pengelolaan Kinerja &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Box B: Ekstrakurikuler Pilihan */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Peminatan Ekstrakurikuler
              </h3>
              <span className="text-[11px] text-slate-500">8 Cabang</span>
            </div>

            <div className="space-y-2 text-xs">
              {ekskulBreakdown.slice(0, 5).map((ek, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-700 truncate pr-2">{ek.nama}</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-sm shrink-0">
                    {ek.count} Siswa
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Official School Information & Address */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            03
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">
              SD NEGERI NAMBO 03 KECAMATAN KLAPANUNGGAL
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Jl. Raya Nambo Bantarkopo RT 001/004 Desa Bantarjati, Kec. Klapanunggal, Kab. Bogor, Jawa Barat
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-right">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">NPSN</div>
            <div className="font-mono font-bold text-slate-800 text-sm">20200352</div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Status</div>
            <div className="font-bold text-red-800 text-sm">Negeri</div>
          </div>
        </div>
      </div>

    </div>
  );
};
