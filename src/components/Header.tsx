import React, { useState } from 'react';
import { Shield, KeyRound, LogOut, Download, Upload, UserCheck, Menu, School } from 'lucide-react';
import { AuthSession, exportEntireDatabaseJSON, importEntireDatabaseJSON, resetToFactoryDefault } from '../utils/storage';

interface HeaderProps {
  auth: AuthSession;
  onLogout: () => void;
  onOpenChangePassword: () => void;
  onToggleMobileMenu: () => void;
  onDataRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  auth,
  onLogout,
  onOpenChangePassword,
  onToggleMobileMenu,
  onDataRefresh,
}) => {
  const [showBackupMenu, setShowBackupMenu] = useState(false);

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && importEntireDatabaseJSON(content)) {
          alert('Data SIPANTAU berhasil dipulihkan dari cadangan JSON!');
          onDataRefresh();
        } else {
          alert('Gagal memulihkan file cadangan. Format JSON tidak valid.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang data ke setelan awal pabrik (395 siswa & 16 GTK SDN Nambo 03)?')) {
      resetToFactoryDefault();
      alert('Data telah dikembalikan ke setelan bawaan awal.');
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Mobile Menu Button & Logos */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* School & Regency Logos (Unaltered, original aspect ratios preserved) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17__1__e4d8a6c0.jpeg"
                alt="Logo Kabupaten Bogor - Tegar Beriman"
                className="h-12 sm:h-14 w-auto object-contain shrink-0"
              />
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17_94b6fe75.jpeg"
                alt="Logo SD Negeri Nambo 03"
                className="h-12 sm:h-14 w-auto object-contain shrink-0"
              />
            </div>

            {/* Title / Identity */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  SIPANTAU Nambo 03
                </span>
                <span className="text-[11px] font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded-sm">
                  NPSN 20200352
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md">
                SD NEGERI NAMBO 03 · KEC. KLAPANUNGGAL KAB. BOGOR
              </p>
            </div>
          </div>

          {/* Right: Headmaster Info & User Account Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Kepala Sekolah Chip */}
            <div className="hidden xl:flex flex-col text-right pr-3 border-r border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">Kepala Sekolah:</span>
              <span className="text-xs font-semibold text-slate-800">
                AM. MEGA PURNAMATATI, S. Pd.,M.Pd.
              </span>
              <span className="text-[10px] text-slate-600 font-mono">
                NIP. 198607172014062001
              </span>
            </div>

            {/* User Session Profile */}
            <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {auth.role === 'kepala_sekolah' ? 'KS' : 'GR'}
              </div>
              <div className="hidden md:block text-left pr-1">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">
                  {auth.userName}
                </div>
                <div className="text-[10px] text-red-700 font-medium">
                  {auth.role === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Pendidik / Staff'}
                </div>
              </div>
            </div>

            {/* Action Buttons: Ganti Password, Backup, Logout */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={onOpenChangePassword}
                title="Ganti Password"
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Ganti Password"
              >
                <KeyRound className="w-4 h-4" />
              </button>

              {/* Backup / Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowBackupMenu(!showBackupMenu)}
                  title="Cadangan & Setelan Data"
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Menu Cadangan Data"
                >
                  <Download className="w-4 h-4" />
                </button>

                {showBackupMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                    <button
                      onClick={() => {
                        exportEntireDatabaseJSON();
                        setShowBackupMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Download className="w-3.5 h-3.5 text-red-600" />
                      <span>Unduh Cadangan JSON</span>
                    </button>
                    
                    <label className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Pulihkan dari File JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          handleImportBackup(e);
                          setShowBackupMenu(false);
                        }}
                        className="hidden"
                      />
                    </label>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        handleResetData();
                        setShowBackupMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
                    >
                      <School className="w-3.5 h-3.5" />
                      <span>Reset ke Data Awal 395 Siswa</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Keluar"
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                aria-label="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
