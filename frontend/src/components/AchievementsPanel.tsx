import React from 'react';
import { Achievement } from '@services/gamificationService';

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const lockedCount = achievements.length - unlockedCount;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">🏅 Logros</h3>

      {/* Progress */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">
            {unlockedCount} de {achievements.length} desbloqueados
          </span>
          <span className="text-xs text-slate-400">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedCount > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-300 mb-3">Desbloqueados</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {achievements.map((achievement) =>
              achievement.unlocked ? (
                <div
                  key={achievement.id}
                  className="group relative"
                  title={achievement.name}
                >
                  <div className="flex flex-col items-center gap-1 p-3 bg-gradient-to-br from-amber-600/20 to-amber-500/10 border border-amber-500/30 rounded-lg hover:border-amber-500/60 transition-all cursor-pointer">
                    <span className="text-3xl">{achievement.icon}</span>
                    <span className="text-xs text-center text-slate-300 truncate">
                      {achievement.name}
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    +{achievement.points} pts
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedCount > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-400 mb-3">Por Desbloquear</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {achievements.map((achievement) =>
              !achievement.unlocked ? (
                <div
                  key={achievement.id}
                  className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl opacity-50">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-400">{achievement.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-amber-500 mt-1">
                        📌 {achievement.criteria}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">
                      +{achievement.points}
                    </span>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel;
