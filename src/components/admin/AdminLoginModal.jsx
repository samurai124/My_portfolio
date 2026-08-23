import { useState } from 'react';
import api from '../../services/api';

function AdminLoginModal({ isOpen, onClose, onLoginSuccess, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      if (res.success) {
        showToast('Connexion administrateur réussie !', 'success');
        onLoginSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Identifiants invalides');
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion au serveur backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_rgba(2,6,23,0.9)_48%)] backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface/95 border border-outline-variant/50 w-full max-w-md p-7 md:p-8 rounded-3xl shadow-2xl relative space-y-6 overflow-hidden">
        <div className="absolute -right-14 -top-14 w-40 h-40 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full border border-outline-variant/60 hover:border-primary flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer"
          aria-label="Fermer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Header */}
        <div className="space-y-1.5 relative">
          <span className="text-[10px] font-label-sm uppercase tracking-widest text-on-surface-variant block">
            [ Espace Restreint ]
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm border border-primary/25">
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            </span>
            Studio Administrateur
          </h2>
          <p className="text-on-surface-variant text-xs font-light">
            Gérez vos projets, articles, messages et réservations en temps réel.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-on-surface-variant">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Supabase Live
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/40">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              RLS Protected
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant block font-semibold">
              Adresse Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.com"
              className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant block font-semibold">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container/60 border border-outline-variant/50 focus:border-primary rounded-xl p-3 text-xs text-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>Authentification...</span>
                </>
              ) : (
                <>
                  <span>Se connecter au Studio</span>
                  <span className="material-symbols-outlined text-sm">login</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-outline-variant/30 text-[10px] text-on-surface-variant font-mono">
          Session sécurisée Supabase Auth • RLS activé
        </div>

      </div>
    </div>
  );
}

export default AdminLoginModal;
