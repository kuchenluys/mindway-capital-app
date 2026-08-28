import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

type AuthMode = 'login' | 'signup';
type UserRole = 'user' | 'admin';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, loading, error } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('demo@mindway.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">💎</div>
            <h1 className="text-3xl font-bold text-primary-500 mb-2">
              Mindway Capital
            </h1>
            <p className="text-dark-400 text-sm">
              Crece en Conciencia y Capital
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Tab Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'login'
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                mode === 'signup'
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setRole('user')}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition ${
                role === 'user'
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              👤 Usuario
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition ${
                role === 'admin'
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              ⚙️ Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-dark-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-dark-300 text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-primary text-black font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? 'Procesando...'
                : mode === 'login'
                ? 'Entrar'
                : 'Crear Cuenta'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-700/50 border border-dark-600 rounded-lg">
            <p className="text-dark-400 text-xs font-medium mb-2">
              CREDENCIALES DE DEMO
            </p>
            <p className="text-dark-500 text-xs">
              Email: <span className="text-dark-300">demo@mindway.com</span>
            </p>
            <p className="text-dark-500 text-xs">
              Password: <span className="text-dark-300">demo123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-dark-400 text-xs">
          <p>© 2026 Mindway Capital. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
