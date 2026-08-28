// Servicio de Gamificación - Sistema completo de puntos, logros y leaderboards

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  criteria: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserLevel {
  level: number;
  name: string;
  pointsRequired: number;
  description: string;
  icon: string;
}

export interface Leaderboard {
  rank: number;
  userId: string;
  userName: string;
  points: number;
  level: number;
  trades: number;
  winRate: number;
  avatar?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pointsReward: number;
  icon: string;
  criteria: string;
  endDate: Date;
  completed: boolean;
  progress: number;
}

export interface UserStats {
  totalPoints: number;
  level: number;
  rank: number;
  consecutiveDays: number;
  tradesCount: number;
  winRate: number;
  achievements: Achievement[];
  activeChallenges: Challenge[];
}

class GamificationService {
  // Niveles del sistema
  private levels: UserLevel[] = [
    { level: 1, name: 'Novato', pointsRequired: 0, description: 'Recién empezado', icon: '🌱' },
    { level: 2, name: 'Aprendiz', pointsRequired: 500, description: 'Primeros pasos', icon: '📚' },
    { level: 3, name: 'Trader', pointsRequired: 1500, description: 'Operando activamente', icon: '📈' },
    { level: 4, name: 'Profesional', pointsRequired: 3500, description: 'Experiencia demostrada', icon: '💼' },
    { level: 5, name: 'Maestro', pointsRequired: 7000, description: 'Dominio completo', icon: '🏆' },
  ];

  // Logros disponibles
  private allAchievements: Achievement[] = [
    {
      id: 'first-trade',
      name: 'Primera Operación',
      description: 'Realiza tu primer trade',
      icon: '🎯',
      points: 50,
      criteria: 'Completar 1 operación',
      unlocked: false,
    },
    {
      id: 'ten-trades',
      name: 'Diez Operaciones',
      description: 'Completa 10 trades',
      icon: '📊',
      points: 100,
      criteria: 'Completar 10 operaciones',
      unlocked: false,
    },
    {
      id: 'fifty-trades',
      name: 'Operador Activo',
      description: 'Completa 50 trades',
      icon: '⚡',
      points: 250,
      criteria: 'Completar 50 operaciones',
      unlocked: false,
    },
    {
      id: 'hundred-trades',
      name: 'Centésimo Trade',
      description: 'Completa 100 trades',
      icon: '🚀',
      points: 500,
      criteria: 'Completar 100 operaciones',
      unlocked: false,
    },
    {
      id: 'first-win',
      name: 'Primera Victoria',
      description: 'Gana tu primer trade',
      icon: '✨',
      points: 75,
      criteria: 'Ganar 1 operación',
      unlocked: false,
    },
    {
      id: 'win-streak-5',
      name: 'Racha Ganadora',
      description: '5 trades ganadores consecutivos',
      icon: '🔥',
      points: 200,
      criteria: 'Ganar 5 trades seguidos',
      unlocked: false,
    },
    {
      id: 'fifty-percent-winrate',
      name: '50% Efectividad',
      description: 'Logra 50% de tasa de ganancia',
      icon: '📍',
      points: 300,
      criteria: 'Tasa de ganancia 50%+',
      unlocked: false,
    },
    {
      id: 'seven-day-streak',
      name: 'Semana Consistente',
      description: 'Tradea 7 días consecutivos',
      icon: '📅',
      points: 150,
      criteria: '7 días operando',
      unlocked: false,
    },
    {
      id: 'complete-course',
      name: 'Educado',
      description: 'Completa un curso entero',
      icon: '🎓',
      points: 200,
      criteria: 'Completar 1 curso',
      unlocked: false,
    },
    {
      id: 'community-contributor',
      name: 'Miembro Activo',
      description: 'Publica 10 posts en comunidad',
      icon: '👥',
      points: 100,
      criteria: '10 posts en comunidad',
      unlocked: false,
    },
    {
      id: 'profitable-month',
      name: 'Mes Rentable',
      description: 'Mes con ganancias totales',
      icon: '💰',
      points: 400,
      criteria: 'Mes con +10% retorno',
      unlocked: false,
    },
    {
      id: 'perfect-week',
      name: 'Semana Perfecta',
      description: 'Gana todas las operaciones en una semana',
      icon: '⭐',
      points: 300,
      criteria: '100% winrate en semana',
      unlocked: false,
    },
  ];

  // Desafíos activos
  private activeChallenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: 'Mini Trader',
      description: 'Realiza 5 operaciones esta semana',
      difficulty: 'easy',
      pointsReward: 100,
      icon: '🎯',
      criteria: '5 operaciones',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
      progress: 0,
    },
    {
      id: 'challenge-2',
      title: 'Ganador Consistente',
      description: 'Logra 60% de tasa de ganancia',
      difficulty: 'medium',
      pointsReward: 250,
      icon: '📈',
      criteria: '60% winrate',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
      progress: 0,
    },
    {
      id: 'challenge-3',
      title: 'Aprendiz Dedicado',
      description: 'Completa 2 lecciones de cursos',
      difficulty: 'easy',
      pointsReward: 75,
      icon: '📚',
      criteria: '2 lecciones',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
      progress: 0,
    },
  ];

  // Calcular puntos por acción
  calculatePoints(action: string, data?: any): number {
    const pointsMap: Record<string, number> = {
      'trade-completed': 10,
      'trade-won': 25,
      'trade-lost': 0,
      'course-lesson': 20,
      'course-completed': 100,
      'community-post': 10,
      'community-like-received': 5,
      'daily-login': 15,
      'weekly-streak': 50,
      'monthly-goal': 200,
    };

    return pointsMap[action] || 0;
  }

  // Obtener nivel basado en puntos
  getUserLevel(totalPoints: number): UserLevel {
    const level = this.levels.findLast((l) => l.pointsRequired <= totalPoints) || this.levels[0];
    return level;
  }

  // Calcular progreso al siguiente nivel
  getProgressToNextLevel(totalPoints: number): { current: number; required: number; percent: number } {
    const currentLevel = this.getUserLevel(totalPoints);
    const nextLevel = this.levels[currentLevel.level] || this.levels[this.levels.length - 1];

    const currentRequired = currentLevel.pointsRequired;
    const nextRequired = nextLevel.pointsRequired;
    const pointsInCurrentLevel = totalPoints - currentRequired;
    const pointsForLevel = nextRequired - currentRequired;

    return {
      current: pointsInCurrentLevel,
      required: pointsForLevel,
      percent: Math.min((pointsInCurrentLevel / pointsForLevel) * 100, 100),
    };
  }

  // Desbloquear logro
  unlockAchievement(achievementId: string, achievements: Achievement[]): Achievement[] {
    return achievements.map((a) =>
      a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date() } : a
    );
  }

  // Obtener logros desbloqueados
  getUnlockedAchievements(achievements: Achievement[]): Achievement[] {
    return achievements.filter((a) => a.unlocked);
  }

  // Completar desafío
  completeChallenge(challengeId: string, challenges: Challenge[]): Challenge[] {
    return challenges.map((c) => (c.id === challengeId ? { ...c, completed: true, progress: 100 } : c));
  }

  // Actualizar progreso de desafío
  updateChallengeProgress(challengeId: string, progress: number, challenges: Challenge[]): Challenge[] {
    return challenges.map((c) =>
      c.id === challengeId ? { ...c, progress: Math.min(progress, 100) } : c
    );
  }

  // Generar leaderboard (simulado)
  generateLeaderboard(userPoints: number, userName: string): Leaderboard[] {
    const mockLeaderboard: Leaderboard[] = [
      {
        rank: 1,
        userId: 'user1',
        userName: 'Carlos Mendez',
        points: 12500,
        level: 5,
        trades: 245,
        winRate: 68,
      },
      {
        rank: 2,
        userId: 'user2',
        userName: 'Maria Garcia',
        points: 11200,
        level: 5,
        trades: 189,
        winRate: 65,
      },
      {
        rank: 3,
        userId: 'user3',
        userName: 'Juan Rodriguez',
        points: 9800,
        level: 4,
        trades: 156,
        winRate: 62,
      },
      {
        rank: 4,
        userId: 'current-user',
        userName,
        points: userPoints,
        level: this.getUserLevel(userPoints).level,
        trades: 87,
        winRate: 58,
      },
      {
        rank: 5,
        userId: 'user5',
        userName: 'Pedro Lopez',
        points: 6200,
        level: 3,
        trades: 92,
        winRate: 55,
      },
    ];

    return mockLeaderboard.sort((a, b) => b.points - a.points).map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  }

  // Obtener todas las logros disponibles
  getAllAchievements(): Achievement[] {
    return this.allAchievements;
  }

  // Obtener todos los niveles
  getAllLevels(): UserLevel[] {
    return this.levels;
  }

  // Obtener desafíos activos
  getActiveChallenges(): Challenge[] {
    return this.activeChallenges.filter((c) => c.endDate > new Date());
  }

  // Calcular streak consecutivo (días)
  calculateConsecutiveDays(lastLoginDate: Date): number {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLoginDate >= yesterday) {
      return 1;
    }
    return 0;
  }

  // Obtener estadísticas del usuario (simuladas)
  getUserStats(userId: string, totalPoints: number, achievements: Achievement[]): UserStats {
    const level = this.getUserLevel(totalPoints);
    const leaderboard = this.generateLeaderboard(totalPoints, 'User');
    const userRank = leaderboard.find((u) => u.userId === userId)?.rank || 0;

    return {
      totalPoints,
      level: level.level,
      rank: userRank,
      consecutiveDays: Math.floor(Math.random() * 15),
      tradesCount: 87,
      winRate: 58,
      achievements: achievements.filter((a) => a.unlocked),
      activeChallenges: this.getActiveChallenges(),
    };
  }

  // Badges especiales por logros
  getSpecialBadges(achievements: Achievement[]): Array<{ name: string; icon: string; rarity: string }> {
    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    const badges = [];

    if (unlockedCount >= 3) {
      badges.push({ name: 'Coleccionista Emergente', icon: '🎖️', rarity: 'common' });
    }
    if (unlockedCount >= 6) {
      badges.push({ name: 'Coleccionista Ávido', icon: '🏅', rarity: 'rare' });
    }
    if (unlockedCount >= 9) {
      badges.push({ name: 'Maestro de Logros', icon: '👑', rarity: 'epic' });
    }
    if (unlockedCount === 12) {
      badges.push({ name: 'Coleccionista Completo', icon: '💎', rarity: 'legendary' });
    }

    return badges;
  }
}

export default new GamificationService();
