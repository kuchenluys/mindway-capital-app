import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@components/Card';
import Button from '@components/Button';

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  target: string;
  dueDate: string;
  completed: boolean;
}

const Personal: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Leer 12 libros',
      category: 'Lectura',
      progress: 7,
      target: '12 libros',
      dueDate: '2026-12-31',
      completed: false,
    },
    {
      id: '2',
      title: 'Meditación diaria',
      category: 'Mindfulness',
      progress: 45,
      target: '60 días',
      dueDate: '2026-10-23',
      completed: false,
    },
    {
      id: '3',
      title: 'Aprender Inglés',
      category: 'Idiomas',
      progress: 35,
      target: 'Fluidez',
      dueDate: '2027-03-31',
      completed: false,
    },
  ]);

  const toggleGoal = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const categories = [
    { name: 'Lectura', icon: '📚', color: 'primary' },
    { name: 'Mindfulness', icon: '🧘', color: 'secondary' },
    { name: 'Idiomas', icon: '🗣️', color: 'accent' },
    { name: 'Fitness', icon: '💪', color: 'primary' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">🧠 Desarrollo Personal</h1>
        <p className="text-dark-400">Crece en consciencia y alcanza tus objetivos</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <Card key={i} hover>
            <div className="text-center py-2">
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="text-sm font-medium text-dark-100">{cat.name}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Goals */}
      <div>
        <h2 className="text-2xl font-bold text-dark-100 mb-4">🎯 Mis Objetivos</h2>
        <div className="space-y-3">
          {goals.map((goal) => (
            <Card key={goal.id} hover>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    goal.completed
                      ? 'bg-accent-500 border-accent-500'
                      : 'border-dark-600 hover:border-accent-500'
                  }`}
                >
                  {goal.completed && <span className="text-white font-bold">✓</span>}
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3
                        className={`font-bold text-lg ${
                          goal.completed ? 'line-through text-dark-400' : 'text-dark-100'
                        }`}
                      >
                        {goal.title}
                      </h3>
                      <p className="text-sm text-dark-400">{goal.category}</p>
                    </div>
                    <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-dark-400">
                    <span>Meta: {goal.target}</span>
                    <span>Fecha: {goal.dueDate}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Habits */}
      <Card>
        <CardHeader title="Hábitos Diarios" icon="🔄" subtitle="Construye tus mejores costumbres" />
        <CardBody>
          <div className="space-y-3">
            {[
              { title: 'Meditación', time: '20 min', icon: '🧘' },
              { title: 'Lectura', time: '30 min', icon: '📖' },
              { title: 'Ejercicio', time: '45 min', icon: '🏋️' },
              { title: 'Journaling', time: '15 min', icon: '✍️' },
            ].map((habit, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <div>
                    <p className="font-medium text-dark-100">{habit.title}</p>
                    <p className="text-xs text-dark-400">{habit.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  ✓ Hecho
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Objetivos Completados', value: goals.filter((g) => g.completed).length, icon: '🏆' },
          { label: 'En Progreso', value: goals.filter((g) => !g.completed).length, icon: '⏳' },
          { label: 'Racha Diaria', value: '12 días', icon: '🔥' },
        ].map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-dark-100 mt-1">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Personal;
