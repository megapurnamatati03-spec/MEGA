import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, User, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AuthSession, DEFAULT_NPSN_PASSWORD, getCustomPassword, setCustomPassword } from '../utils/storage';
import { INITIAL_STAFF } from '../data/initialStaff';
import { RoleType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (session: AuthSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('staff-01');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = INITIAL_STAFF.find(s => s.id === selectedStaffId);
    if (!staff) return;

    const correctPassword = getCustomPassword(staff.id);
    if (password === correctPassword) {
      const role: RoleType = staff.jabatan === 'Ka.Sekolah' ? 'kepala_sekolah' : (staff.isGuru ? 'guru' : 'tu');
      const session: AuthSession = {
        isLoggedIn: true,
        role,
        userName: staff.nama,
        userId: staff.id,
        userNip: staff.nip !== '-' ? staff.nip : undefined,
        loginTime: new Date().toISOString()
      };
      onLoginSuccess(session);
    } else {
      setErrorMsg('Kata sandi salah! Kata sandi default awal adalah NPSN: 20200352');
    }
  };

  const handleFillDefaultPassword = () => {
    setPassword(DEFAULT_NPSN_PASSWORD);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Dual Logos */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17__1__e4d8a6c0.jpeg"
              alt="Logo Kabupaten Bogor"
              className="h-14 w-auto object-contain"
            />
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-13_at_11.21.17_94b6fe75.jpeg"
              alt="Logo SD Negeri Nambo 03"
              className="h-14 w-auto object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            SIPANTAU Nambo 03
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Informasi & Pengawasan Tata Kelola SD Negeri Nambo 03
          </p>
          <div className="inline-block mt-2 px-2.5 py-0.5 bg-slate-100 rounded-md text-[11px] font-mono text-slate-700">
            NPSN: 20200352 · Kab. Bogor
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Akun Pengguna / GTK
            </label>
            <div className="relative">
              <select
                value={selectedStaffId}
                onChange={(e) => {
                  setSelectedStaffId(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium"
              >
                <optgroup label="Pimpinan Sekolah">
                  <option value="staff-01">
                    AM. Mega Pt, S.Pd.,M.Pd (Kepala Sekolah)
                  </option>
                </optgroup>
                <optgroup label="Dewan Guru">
                  {INITIAL_STAFF.filter(s => s.isGuru && s.id !== 'staff-01').map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nama} ({g.jabatan})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Tenaga Kependidikan / TU">
                  {INITIAL_STAFF.filter(s => !s.isGuru).map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nama} ({t.jabatan})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={handleFillDefaultPassword}
                className="text-[11px] text-red-700 hover:text-red-800 font-medium cursor-pointer"
              >
                Gunakan Default NPSN (20200352)
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              Sandi awal untuk semua GTK: <span className="font-mono font-bold text-slate-600">20200352</span>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Masuk ke SIPANTAU</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-600">
          SD Negeri Nambo 03 · Jl. Raya Nambo Bantarkopo Klapanunggal Bogor
        </div>
      </div>
    </div>
  );
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  userId,
  userName,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const currentSaved = getCustomPassword(userId);
    if (oldPassword !== currentSaved) {
      setErrorMsg('Kata sandi saat ini tidak sesuai.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setCustomPassword(userId, newPassword);
    setSuccessMsg('Kata sandi berhasil diperbarui!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 animate-in fade-in">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-red-600" />
          <h3 className="text-base font-bold text-slate-900">
            Ganti Kata Sandi: {userName}
          </h3>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-red-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kata Sandi Saat Ini
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan sandi saat ini (default: 20200352)"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Simpan Sandi Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
