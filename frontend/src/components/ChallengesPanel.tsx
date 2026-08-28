import React from 'react';
import { Challenge } from '@services/gamificationService';

interface ChallengesPanelProps {
  challenges: Challenge[];
  onCompleteChallenge?: (challengeId: string) => void;
}

export const ChallengesPanel: React.FC<ChallengesPanelProps> = ({ challenges, onCompleteChallenge }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'hard':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  const daysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(days, 0);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">🎯 Desafíos Semanales</h3>

      {challenges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">No hay desafíos disponibles en este momento</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border transition-all ${
                challenge.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{challenge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{challenge.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{challenge.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                    {getDifficultyLabel(challenge.difficulty)}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Progreso: {challenge.criteria}</span>
                  <span className="text-xs font-bold text-slate-300">{challenge.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      challenge.completed ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-amber-400 font-semibold">
                    💰 +{challenge.pointsReward} pts
                  </span>
                  <span className="text-slate-400">
                    📅 {daysRemaining(challenge.endDate)} días
                  </span>
                </div>

                {challenge.completed ? (
                  <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Completado
                  </div>
                ) : (
                  <button
                    onClick={() => onCompleteChallenge?.(challenge.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors"
                  >
                    Comprobar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengesPanel;
