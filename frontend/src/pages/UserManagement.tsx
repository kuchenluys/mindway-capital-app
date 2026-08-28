import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@components/Card';
import Button from '@components/Button';
import Input from '@components/Input';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium' | 'elite';
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan García',
      email: 'juan@example.com',
      plan: 'premium',
      role: 'user',
      status: 'active',
      joinDate: '2026-06-15',
      lastLogin: '2026-08-25',
    },
    {
      id: '2',
      name: 'María López',
      email: 'maria@example.com',
      plan: 'elite',
      role: 'user',
      status: 'active',
      joinDate: '2026-05-10',
      lastLogin: '2026-08-24',
    },
    {
      id: '3',
      name: 'Carlos Admin',
      email: 'admin@mindway.com',
      plan: 'elite',
      role: 'admin',
      status: 'active',
      joinDate: '2026-01-01',
      lastLogin: '2026-08-25',
    },
    {
      id: '4',
      name: 'Pedro Ruiz',
      email: 'pedro@example.com',
      plan: 'free',
      role: 'user',
      status: 'inactive',
      joinDate: '2026-07-20',
      lastLogin: '2026-08-10',
    },
    {
      id: '5',
      name: 'Ana González',
      email: 'ana@example.com',
      plan: 'premium',
      role: 'moderator',
      status: 'active',
      joinDate: '2026-04-05',
      lastLogin: '2026-08-23',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  const handleChangePlan = (id: string, newPlan: 'free' | 'premium' | 'elite') => {
    setUsers(users.map((u) => (u.id === id ? { ...u, plan: newPlan } : u)));
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    premium: users.filter((u) => u.plan === 'premium').length,
    admins: users.filter((u) => u.role === 'admin').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">👥 Gestión de Usuarios</h1>
        <p className="text-dark-400">Administra permisos, planes y estado de usuarios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Usuarios Totales', value: stats.total, icon: '👥' },
          { label: 'Activos', value: stats.active, icon: '🟢' },
          { label: 'Premium+', value: stats.premium, icon: '💎' },
          { label: 'Administradores', value: stats.admins, icon: '⚙️' },
        ].map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-dark-100 mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por nombre o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon="🔍"
          className="flex-1"
        />
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 min-w-32"
        >
          <option value="all">Todos los planes</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
          <option value="elite">Elite</option>
        </select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader title="Usuarios Registrados" icon="📋" subtitle={`${filteredUsers.length} usuarios`} />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-dark-400 font-semibold">Nombre</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-semibold">Plan</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-semibold">Rol</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-semibold">Estado</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-semibold">Última Sesión</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-dark-700 hover:bg-dark-700/50 transition">
                    <td className="py-3 px-4 text-dark-100">{user.name}</td>
                    <td className="py-3 px-4 text-dark-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.plan}
                        onChange={(e) =>
                          handleChangePlan(user.id, e.target.value as 'free' | 'premium' | 'elite')
                        }
                        className="px-2 py-1 bg-dark-600 border border-dark-500 rounded text-xs text-dark-100"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="elite">Elite</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-secondary-500/20 text-secondary-400'
                            : user.role === 'moderator'
                            ? 'bg-primary-500/20 text-primary-400'
                            : 'bg-dark-700 text-dark-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.status === 'active'
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {user.status === 'active' ? '🟢 Activo' : '🔴 Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-400 text-xs">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.status === 'active' ? '⏹️' : '▶️'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          👁️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader title="Acciones en Lote" icon="⚡" />
        <CardBody>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              Enviar Email a Activos
            </Button>
            <Button variant="secondary" size="sm">
              Exportar CSV
            </Button>
            <Button variant="secondary" size="sm">
              Generar Reportes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserManagement;
