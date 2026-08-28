import React, { useState } from 'react';
import Card, { CardHeader, CardBody, CardFooter } from '@components/Card';
import Button from '@components/Button';

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  level: string;
  modules: number;
  progress: number;
  price: number;
  enrolled: boolean;
  image: string;
}

const Cursos: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Trading Avanzado en Forex',
      category: 'Inversiones',
      instructor: 'Juan García',
      duration: '12 semanas',
      level: 'Avanzado',
      modules: 8,
      progress: 40,
      price: 299,
      enrolled: true,
      image: '💹',
    },
    {
      id: '2',
      title: 'Mindfulness y Meditación',
      category: 'Personal',
      instructor: 'María López',
      duration: '4 semanas',
      level: 'Intermedio',
      modules: 20,
      progress: 75,
      price: 99,
      enrolled: true,
      image: '🧘',
    },
    {
      id: '3',
      title: 'Biohacking Pro: Optimiza tu Cuerpo',
      category: 'Biohacking',
      instructor: 'Carlos Martín',
      duration: '8 semanas',
      level: 'Avanzado',
      modules: 12,
      progress: 0,
      price: 199,
      enrolled: false,
      image: '💪',
    },
    {
      id: '4',
      title: 'Inversiones en Bolsa',
      category: 'Inversiones',
      instructor: 'Pedro Ruiz',
      duration: '6 semanas',
      level: 'Principiante',
      modules: 15,
      progress: 0,
      price: 149,
      enrolled: false,
      image: '📈',
    },
    {
      id: '5',
      title: 'Liderazgo y Comunicación',
      category: 'Personal',
      instructor: 'Ana González',
      duration: '5 semanas',
      level: 'Intermedio',
      modules: 10,
      progress: 20,
      price: 129,
      enrolled: true,
      image: '🎯',
    },
    {
      id: '6',
      title: 'Nutrición Avanzada',
      category: 'Biohacking',
      instructor: 'Dr. Roberto Silva',
      duration: '4 semanas',
      level: 'Intermedio',
      modules: 8,
      progress: 0,
      price: 179,
      enrolled: false,
      image: '🥗',
    },
  ]);

  const [filter, setFilter] = useState('todos');

  const enrollCourse = (id: string) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, enrolled: true } : course
      )
    );
  };

  const filteredCourses =
    filter === 'todos'
      ? courses
      : filter === 'enrolled'
      ? courses.filter((c) => c.enrolled)
      : courses.filter((c) => c.category === filter);

  const stats = {
    enrolled: courses.filter((c) => c.enrolled).length,
    completed: courses.filter((c) => c.enrolled && c.progress === 100).length,
    inProgress: courses.filter((c) => c.enrolled && c.progress > 0 && c.progress < 100).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">📚 Cursos y Educación</h1>
        <p className="text-dark-400">Aprende de expertos en todos los pilares</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Cursos Inscritos', value: stats.enrolled, icon: '📖' },
          { label: 'Completados', value: stats.completed, icon: '✅' },
          { label: 'En Progreso', value: stats.inProgress, icon: '⏳' },
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

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['todos', 'enrolled', 'Inversiones', 'Personal', 'Biohacking'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'todos' ? '📚 Todos' : f === 'enrolled' ? '✅ Inscritos' : f}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} hover>
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">{course.image}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                course.level === 'Avanzado'
                  ? 'bg-red-500/20 text-red-400'
                  : course.level === 'Intermedio'
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'bg-accent-500/20 text-accent-400'
              }`}>
                {course.level}
              </span>
            </div>

            <h3 className="font-bold text-dark-100 mb-2">{course.title}</h3>

            <div className="space-y-2 mb-4 text-xs text-dark-400">
              <p>👨‍🏫 {course.instructor}</p>
              <p>⏱️ {course.duration}</p>
              <p>📋 {course.modules} módulos</p>
              <p className="font-medium text-primary-400">💰 ${course.price}</p>
            </div>

            {course.enrolled && course.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-400">Progreso</span>
                  <span className="text-primary-400 font-bold">{course.progress}%</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            )}

            <CardFooter className="mt-0">
              {course.enrolled ? (
                <Button variant="secondary" fullWidth size="sm">
                  Continuar →
                </Button>
              ) : (
                <Button onClick={() => enrollCourse(course.id)} fullWidth size="sm">
                  Inscribirse
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
