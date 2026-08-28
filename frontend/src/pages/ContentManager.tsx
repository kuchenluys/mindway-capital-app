import React, { useState } from 'react';
import Card, { CardHeader, CardBody, CardFooter } from '@components/Card';
import Button from '@components/Button';
import Input from '@components/Input';

interface Article {
  id: string;
  title: string;
  section: string;
  status: 'draft' | 'published';
  createdAt: string;
  views: number;
}

const ContentManager: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Cómo comenzar en Trading de Forex',
      section: 'Inversiones',
      status: 'published',
      createdAt: '2026-08-20',
      views: 342,
    },
    {
      id: '2',
      title: 'Guía completa de meditación',
      section: 'Personal',
      status: 'published',
      createdAt: '2026-08-18',
      views: 567,
    },
    {
      id: '3',
      title: 'Protocolo de Cold Exposure',
      section: 'Biohacking',
      status: 'draft',
      createdAt: '2026-08-22',
      views: 0,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    section: 'Inversiones',
    content: '',
  });

  const handlePublish = (id: string) => {
    setArticles(
      articles.map((a) =>
        a.id === id ? { ...a, status: 'published' as const } : a
      )
    );
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
  };

  const handleCreate = () => {
    if (formData.title && formData.content) {
      const newArticle: Article = {
        id: String(articles.length + 1),
        title: formData.title,
        section: formData.section,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        views: 0,
      };
      setArticles([newArticle, ...articles]);
      setFormData({ title: '', section: 'Inversiones', content: '' });
      setShowForm(false);
    }
  };

  const stats = {
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">✏️ Gestor de Contenido</h1>
        <p className="text-dark-400">Crea y publica contenido para la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Publicados', value: stats.published, icon: '📝' },
          { label: 'Borradores', value: stats.draft, icon: '📋' },
          { label: 'Total de Vistas', value: stats.totalViews, icon: '👁️' },
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

      {/* Create Button */}
      <Button onClick={() => setShowForm(!showForm)} size="lg">
        ➕ Nuevo Artículo
      </Button>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader title="Crear Nuevo Artículo" icon="✍️" />
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Título"
                placeholder="Título del artículo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Sección
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100"
                >
                  <option>Inversiones</option>
                  <option>Personal</option>
                  <option>Biohacking</option>
                  <option>Educación</option>
                  <option>Comunidad</option>
                </select>
              </div>

              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">
                  Contenido
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe tu contenido aquí..."
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500 min-h-32 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreate} fullWidth>
                  Crear Artículo
                </Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Articles List */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-dark-100">Artículos</h2>
        {articles.length === 0 ? (
          <Card>
            <p className="text-dark-400 text-center py-8">
              No hay artículos. Crea uno para comenzar.
            </p>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-dark-100">{article.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        article.status === 'published'
                          ? 'bg-accent-500/20 text-accent-400'
                          : 'bg-primary-500/20 text-primary-400'
                      }`}
                    >
                      {article.status === 'published' ? '🟢 Publicado' : '🟡 Borrador'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-dark-400">
                    <span>📁 {article.section}</span>
                    <span>📅 {article.createdAt}</span>
                    <span>👁️ {article.views} vistas</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {article.status === 'draft' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePublish(article.id)}
                    >
                      Publicar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* File Manager */}
      <Card>
        <CardHeader title="Gestor de Archivos" icon="📁" subtitle="Sube y gestiona archivos" />
        <CardBody>
          <div className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center">
            <p className="text-4xl mb-2">📤</p>
            <p className="text-dark-300 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="text-xs text-dark-400">
              Formatos permitidos: PDF, DOC, IMG (máx. 10 MB)
            </p>
            <Button className="mt-4">Seleccionar Archivo</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContentManager;
