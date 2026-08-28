import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import clsx from 'clsx';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role);

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Inversiones', icon: '💰', path: '/inversiones' },
    { label: 'Desarrollo', icon: '🧠', path: '/personal' },
    { label: 'Biohacking', icon: '💪', path: '/biohacking' },
    { label: 'Cursos', icon: '📚', path: '/cursos' },
    { label: 'Planes', icon: '💎', path: '/planes' },
    { label: 'Comunidad', icon: '🌱', path: '/comunidad' },
  ];

  const adminItems = [
    { label: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { label: 'Contenido', icon: '✏️', path: '/admin/content' },
    { label: 'Usuarios', icon: '👥', path: '/admin/users' },
    { label: 'Configuración', icon: '⚙️', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-dark-700">
        <h1 className="text-xl font-bold text-primary-500">💎 Mindway</h1>
        <p className="text-xs text-dark-400 mt-1">Panel de Usuario</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-xs uppercase font-semibold text-dark-500 mb-3">
            Principal
          </h3>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition',
                isActive(item.path)
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-dark-300 hover:bg-dark-700'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {role === 'admin' && (
          <div>
            <h3 className="text-xs uppercase font-semibold text-dark-500 mb-3">
              Administración
            </h3>
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition',
                  isActive(item.path)
                    ? 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30'
                    : 'text-dark-300 hover:bg-dark-700'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-dark-700">
        <button className="w-full px-4 py-2 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 transition text-sm font-medium">
          💬 Soporte
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
