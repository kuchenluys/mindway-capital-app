import React from 'react';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-primary-500">💎 Mindway</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Breadcrumb o título de página puede ir aquí */}
          <div className="text-dark-300 text-sm">
            Crece en Conciencia y Capital
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <LanguageSwitcher />
              <CurrencySwitcher />

              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm font-semibold text-dark-100">
                    {user.name}
                  </div>
                  <div className="text-xs text-dark-400">
                    {user.plan === 'elite' && '👑 Elite'}
                    {user.plan === 'premium' && '💎 Premium'}
                    {user.plan === 'free' && '📦 Free'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition text-sm font-medium"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
