import React from 'react';
import { Leaderboard as LeaderboardType } from '@services/gamificationService';

interface LeaderboardProps {
  entries: LeaderboardType[];
  currentUserId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentUserId }) => {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '📍';
    }
  };

  const getLevelIcon = (level: number) => {
    const icons = ['🌱', '📚', '📈', '💼', '🏆'];
    return icons[level - 1] || '🌱';
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">🏆 Leaderboard Global</h3>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
              entry.userId === currentUserId
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50'
            }`}
          >
            {/* Rank */}
            <div className="text-2xl w-10 text-center">{getMedalIcon(entry.rank)}</div>

            {/* Rank Number */}
            <div className="text-center w-8">
              <p className="text-sm font-bold text-slate-400">{entry.rank}</p>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-white truncate">{entry.userName}</p>
                <span className="text-sm">{getLevelIcon(entry.level)}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                  Lvl {entry.level}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-slate-400">
                <span>📊 {entry.trades} ops</span>
                <span>📈 {entry.winRate}%</span>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <p className="text-lg font-bold text-amber-400">{entry.points.toLocaleString()}</p>
              <p className="text-xs text-slate-400">pts</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <p className="text-xs text-slate-400">
          💡 Los puntos se ganan completando operaciones, cursos, desafíos y siendo activo en comunidad.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
