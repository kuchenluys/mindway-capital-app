import React from 'react';
import gamificationService, { UserLevel } from '@services/gamificationService';

interface PointsCardProps {
  totalPoints: number;
  level: UserLevel;
  progressPercent: number;
  rank?: number;
}

export const PointsCard: React.FC<PointsCardProps> = ({ totalPoints, level, progressPercent, rank }) => {
  const nextLevel = gamificationService.getAllLevels()[level.level] || level;
  const pointsToNextLevel = nextLevel.pointsRequired - totalPoints;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Mis Logros</h3>
          <p className="text-sm text-slate-400">Sigue acumulando puntos</p>
        </div>
        {rank && (
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-2xl font-bold text-amber-400">{rank}</p>
            <p className="text-xs text-slate-400">Ranking</p>
          </div>
        )}
      </div>

      {/* Points Display */}
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Puntos Totales</span>
          <span className="text-xl font-bold text-amber-400">{totalPoints.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Próximo nivel: +{pointsToNextLevel}</span>
          <span className="text-amber-400 font-semibold">{Math.round(progressPercent)}%</span>
        </div>
      </div>

      {/* Level Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{level.icon}</span>
            <div>
              <p className="text-lg font-bold text-white">{level.name}</p>
              <p className="text-xs text-slate-400">Nivel {level.level}</p>
            </div>
          </div>
          {level.level === 5 && (
            <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/50 rounded text-xs text-purple-300 font-semibold">
              ⭐ Máximo
            </span>
          )}
        </div>

        <p className="text-sm text-slate-300 mb-3">{level.description}</p>

        {/* Progress Bar */}
        {level.level < 5 && (
          <div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {totalPoints - level.pointsRequired} / {nextLevel.pointsRequired - level.pointsRequired} puntos
            </p>
          </div>
        )}
      </div>

      {/* Level Info */}
      <div className="pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 mb-3">Próximos Niveles</p>
        <div className="space-y-2">
          {gamificationService.getAllLevels().map((l) => (
            <div
              key={l.level}
              className={`flex items-center justify-between text-xs p-2 rounded ${
                l.level === level.level
                  ? 'bg-amber-500/10 border border-amber-500/20'
                  : l.level < level.level
                    ? 'opacity-50'
                    : 'opacity-75'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{l.icon}</span>
                <span className="text-slate-300">{l.name}</span>
              </div>
              <span className="text-slate-400">{l.pointsRequired} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsCard;
