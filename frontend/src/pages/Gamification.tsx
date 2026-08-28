import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { Link } from 'react-router-dom';
import PointsCard from '@components/PointsCard';
import AchievementsPanel from '@components/AchievementsPanel';
import Leaderboard from '@components/Leaderboard';
import ChallengesPanel from '@components/ChallengesPanel';
import gamificationService from '@services/gamificationService';

const Gamification = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Simular datos del usuario
  const userPoints = 7250;
  const userLevel = gamificationService.getUserLevel(userPoints);
  const progressToNext = gamificationService.getProgressToNextLevel(userPoints);
  const allAchievements = gamificationService.getAllAchievements();
  const leaderboard = gamificationService.generateLeaderboard(userPoints, user?.name || 'Usuario');
  const activeChallenges = gamificationService.getActiveChallenges();
  const specialBadges = gamificationService.getSpecialBadges(allAchievements);

  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard' | 'challenges'>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="text-amber-400 hover:text-amber-300 text-sm mb-4 inline-block">
            ← Volver al Dashboard
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">🎮 Sistema de Gamificación</h1>
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-semibold">
              {userLevel.icon} {userLevel.name}
            </span>
          </div>
          <p className="text-slate-400">Completa operaciones, desafíos y gana puntos para subir de nivel</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700 overflow-x-auto">
          {[
            { key: 'overview', label: '📊 Resumen' },
            { key: 'achievements', label: '🏅 Logros' },
            { key: 'leaderboard', label: '🏆 Ranking' },
            { key: 'challenges', label: '🎯 Desafíos' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Puntos Totales</p>
                  <p className="text-3xl font-bold text-amber-400">{userPoints.toLocaleString()}</p>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Nivel Actual</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{userLevel.icon}</span>
                    <p className="text-2xl font-bold text-white">{userLevel.level}</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Operaciones</p>
                  <p className="text-3xl font-bold text-blue-400">87</p>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Racha Actual</p>
                  <p className="text-3xl font-bold text-green-400">12 días</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">📈 Resumen de Actividad</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tasa de Ganancia</span>
                    <span className="text-lg font-bold text-green-400">58%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Logros Desbloqueados</span>
                    <span className="text-lg font-bold text-amber-400">8/12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Desafíos Completados</span>
                    <span className="text-lg font-bold text-blue-400">5/15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contribuciones Comunidad</span>
                    <span className="text-lg font-bold text-purple-400">42</span>
                  </div>
                </div>
              </div>

              {/* Special Badges */}
              {specialBadges.length > 0 && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4">✨ Insignias Especiales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {specialBadges.map((badge) => (
                      <div
                        key={badge.name}
                        className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-center"
                      >
                        <p className="text-3xl mb-2">{badge.icon}</p>
                        <p className="text-sm font-semibold text-white">{badge.name}</p>
                        <p className="text-xs text-slate-400 mt-1 capitalize">{badge.rarity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div>
              <PointsCard
                totalPoints={userPoints}
                level={userLevel}
                progressPercent={progressToNext.percent}
                rank={4}
              />
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <AchievementsPanel achievements={allAchievements} />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            <Leaderboard entries={leaderboard} currentUserId="current-user" />
          </div>
        )}

        {activeTab === 'challenges' && (
          <div>
            <ChallengesPanel challenges={activeChallenges} />
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">📚 ¿Cómo Funciona?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-2xl mb-2">⚡</p>
              <p className="font-semibold text-white text-sm mb-1">Gana Puntos</p>
              <p className="text-xs text-slate-400">
                Completa operaciones, cursos y desafíos para acumular puntos
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-2xl mb-2">📈</p>
              <p className="font-semibold text-white text-sm mb-1">Sube de Nivel</p>
              <p className="text-xs text-slate-400">
                Alcanza hitos de puntos para desbloquear nuevos niveles
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-2xl mb-2">🏅</p>
              <p className="font-semibold text-white text-sm mb-1">Desbloquea Logros</p>
              <p className="text-xs text-slate-400">
                Cumple criterios específicos para ganar logros especiales
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-2xl mb-2">🏆</p>
              <p className="font-semibold text-white text-sm mb-1">Compite Globalmente</p>
              <p className="text-xs text-slate-400">
                Sube en el leaderboard y compite con otros traders
              </p>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">🎁 Recompensas por Actividad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <p className="text-sm font-semibold text-blue-300 mb-2">Completar Trade</p>
              <p className="text-2xl font-bold text-blue-400">+10 pts</p>
            </div>

            <div className="p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
              <p className="text-sm font-semibold text-green-300 mb-2">Trade Ganador</p>
              <p className="text-2xl font-bold text-green-400">+25 pts</p>
            </div>

            <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg">
              <p className="text-sm font-semibold text-purple-300 mb-2">Desafío Completado</p>
              <p className="text-2xl font-bold text-purple-400">+50-250 pts</p>
            </div>

            <div className="p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <p className="text-sm font-semibold text-amber-300 mb-2">Logro Desbloqueado</p>
              <p className="text-2xl font-bold text-amber-400">+50-500 pts</p>
            </div>

            <div className="p-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg">
              <p className="text-sm font-semibold text-indigo-300 mb-2">Curso Completado</p>
              <p className="text-2xl font-bold text-indigo-400">+100 pts</p>
            </div>

            <div className="p-4 bg-pink-900/20 border border-pink-700/30 rounded-lg">
              <p className="text-sm font-semibold text-pink-300 mb-2">Login Diario</p>
              <p className="text-2xl font-bold text-pink-400">+15 pts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
