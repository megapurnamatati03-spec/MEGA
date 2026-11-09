import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  BookOpen,
  X,
  FileSpreadsheet,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type MainNavTab =
  | 'dashboard'
  | 'input_data'
  | 'manajemen_kelas'
  | 'kepegawaian'
  | 'absensi_rekap'
  | 'perangkat_ajar';

interface SidebarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  totalStudents,
  totalStaff,
  totalClasses,
}) => {
  const menuItems: { id: MainNavTab; label: string; sub: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      sub: 'Grafik Interaktif & Ringkasan',
      icon: LayoutDashboard,
    },
    {
      id: 'input_data',
      label: 'Input Data',
      sub: 'Kelas, Ekskul, Siswa, GTK',
      icon: UserPlus,
      badge: 'Baru',
    },
    {
      id: 'manajemen_kelas',
      label: 'Manajemen Kelas',
      sub: 'Filter, PIP, Aksi & Laporan',
      icon: GraduationCap,
      badge: totalStudents,
    },
    {
      id: 'kepegawaian',
      label: 'Kepegawaian & Kinerja',
      sub: 'SKP, Observasi, BerAKHLAK',
      icon: Briefcase,
      badge: totalStaff,
    },
    {
      id: 'absensi_rekap',
      label: 'Absensi & Rekap Usia',
      sub: 'Harian 2026/27 & Umur Siswa',
      icon: CalendarCheck,
    },
    {
      id: 'perangkat_ajar',
      label: 'Perangkat Pembelajaran',
      sub: 'Hari Efektif, Modul & Koding',
      icon: BookOpen,
      badge: '2026/27',
    },
  ];

  const handleNavClick = (tabId: MainNavTab) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-20 z-40 h-full lg:h-[calc(100vh-5rem)] w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out no-print shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Header on Mobile */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Menu SIPANTAU</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* School Quick Identity Box */}
          <div className="p-4 border-b border-slate-100 bg-red-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <span className="text-[11px] font-bold text-red-800 tracking-wide uppercase">
                Tahun Ajaran 2026/2027
              </span>
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-900">
              SD Negeri Nambo 03
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              12 Rombel · 8 Ekskul · 395 Siswa
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-17rem)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold leading-tight truncate">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] leading-tight truncate mt-0.5 ${
                          isActive ? 'text-red-100' : 'text-slate-600'
                        }`}
                      >
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-red-700 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Card: Kurikulum Merdeka & BSKAP 046/2025 badge */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 m-2 rounded-xl border">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
            <span>Regulasi Terkini</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
            SK BSKAP No. 046/H/KR/2025 & Panduan Pembelajaran Mendalam (Deep Learning).
          </p>
        </div>
      </aside>
    </>
  );
};
