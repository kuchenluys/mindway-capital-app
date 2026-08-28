import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@components/Card';
import Button from '@components/Button';
import Input from '@components/Input';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

const Comunidad: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Juan García',
      avatar: '👨‍💼',
      content:
        'Acabo de completar el curso de Trading Avanzado. Los conocimientos que adquirí fueron muy valiosos. 🚀',
      timestamp: 'Hace 2 horas',
      likes: 45,
      comments: 12,
      liked: false,
    },
    {
      id: '2',
      author: 'María López',
      avatar: '👩‍💻',
      content:
        'La sesión de meditación de hoy fue increíble. Alcancé un nivel de paz que no había sentido en meses. 🧘‍♀️',
      timestamp: 'Hace 4 horas',
      likes: 67,
      comments: 23,
      liked: true,
    },
    {
      id: '3',
      author: 'Carlos Martín',
      avatar: '👨‍🔬',
      content:
        '¿Alguien más está experimentando con el ayuno intermitente? Me encantaría escuchar sus resultados. 🥗',
      timestamp: 'Hace 6 horas',
      likes: 89,
      comments: 34,
      liked: false,
    },
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      setPosts([
        {
          id: String(posts.length + 1),
          author: 'Tu Nombre',
          avatar: '👤',
          content: newPost,
          timestamp: 'Ahora',
          likes: 0,
          comments: 0,
          liked: false,
        },
        ...posts,
      ]);
      setNewPost('');
    }
  };

  const toggleLike = (id: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const stats = {
    members: 1248,
    posts: 4562,
    discussions: 892,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">🌱 Comunidad</h1>
        <p className="text-dark-400">Conecta con otros miembros en tu viaje de transformación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Miembros Activos', value: stats.members, icon: '👥' },
          { label: 'Posts', value: stats.posts, icon: '📝' },
          { label: 'Discusiones', value: stats.discussions, icon: '💬' },
        ].map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-dark-100 mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Post */}
      <Card>
        <CardHeader title="Compartir tu Experiencia" icon="✍️" />
        <CardBody>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="¿Qué quieres compartir con la comunidad? 💭"
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 min-h-24 resize-none"
          />
          <div className="flex gap-2 mt-3">
            <Button onClick={handlePostSubmit} fullWidth>
              Publicar
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} hover>
            <div className="flex gap-3">
              <span className="text-3xl flex-shrink-0">{post.avatar}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-dark-100">{post.author}</h3>
                    <p className="text-xs text-dark-400">{post.timestamp}</p>
                  </div>
                </div>

                <p className="text-dark-300 mb-4">{post.content}</p>

                <div className="flex gap-4 pt-3 border-t border-dark-700">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition ${
                      post.liked
                        ? 'text-accent-400'
                        : 'text-dark-400 hover:text-accent-400'
                    }`}
                  >
                    <span>{post.liked ? '❤️' : '🤍'}</span>
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition">
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition">
                    <span>↗️</span>
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Discussions */}
      <div>
        <h2 className="text-2xl font-bold text-dark-100 mb-4">💡 Temas Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Trading: Nuevas Estrategias', posts: 234, members: 89 },
            { title: 'Biohacking: Resultados Reales', posts: 156, members: 67 },
            { title: 'Mindfulness y Meditación', posts: 298, members: 134 },
            { title: 'Educación Financiera', posts: 445, members: 203 },
          ].map((discussion, i) => (
            <Card key={i} hover>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-dark-100">{discussion.title}</h3>
                  <p className="text-xs text-dark-400 mt-1">
                    {discussion.posts} posts • {discussion.members} miembros
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Events */}
      <div>
        <h2 className="text-2xl font-bold text-dark-100 mb-4">📅 Próximos Eventos</h2>
        <div className="space-y-3">
          {[
            {
              title: 'Webinar: Trading en Cripto',
              date: '25 de Agosto 2026',
              time: '19:00 UTC',
              icon: '🔴',
            },
            {
              title: 'Sesión de Meditación en Grupo',
              date: '26 de Agosto 2026',
              time: '18:00 UTC',
              icon: '🧘',
            },
            {
              title: 'Q&A con Expertos en Biohacking',
              date: '27 de Agosto 2026',
              time: '20:00 UTC',
              icon: '🎤',
            },
          ].map((event, i) => (
            <Card key={i} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{event.icon}</span>
                  <div>
                    <h3 className="font-bold text-dark-100">{event.title}</h3>
                    <p className="text-xs text-dark-400">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Registrarse
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comunidad;
