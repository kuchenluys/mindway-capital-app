import sequelize from '../config/database.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Article from '../models/Article.js';

async function seed() {
  try {
    console.log('🌱 Iniciando seed de base de datos...');

    await sequelize.sync({ alter: true });

    // Crear usuarios de demo
    const admin = await User.create({
      name: 'Luis Kuchen',
      email: 'admin@mindway.com',
      password: 'admin123',
      role: 'admin',
      plan: 'elite'
    });

    const user1 = await User.create({
      name: 'María García',
      email: 'maria@example.com',
      password: 'password123',
      role: 'user',
      plan: 'premium'
    });

    const user2 = await User.create({
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      password: 'password123',
      role: 'user',
      plan: 'free'
    });

    console.log('✅ Usuarios creados');

    // Crear cursos
    const courses = await Course.bulkCreate([
      {
        title: 'Trading Avanzado',
        description: 'Domina las estrategias del mercado de divisas',
        category: 'trading',
        instructor: 'Luis Kuchen',
        duration: 480,
        modules: 5,
        level: 'advanced',
        price: 99.99,
        isPublished: true
      },
      {
        title: 'Mindfulness Avanzado',
        description: 'Meditación y técnicas de mindfulness para traders',
        category: 'mindfulness',
        instructor: 'Coach de Bienestar',
        duration: 360,
        modules: 8,
        level: 'intermediate',
        price: 49.99,
        isPublished: true
      },
      {
        title: 'Biohacking 101',
        description: 'Optimiza tu cuerpo para máximo rendimiento',
        category: 'biohacking',
        instructor: 'Expert en Biohacking',
        duration: 240,
        modules: 4,
        level: 'beginner',
        price: 29.99,
        isPublished: true
      }
    ]);

    console.log('✅ Cursos creados');

    // Crear artículos
    await Article.bulkCreate([
      {
        title: 'Estrategias de Trading Avanzado',
        slug: 'estrategias-trading-avanzado',
        content: 'En este artículo exploraremos las mejores estrategias...',
        authorId: admin.id,
        section: 'inversiones',
        isPublished: true,
        views: 1245
      },
      {
        title: 'Mindfulness para Traders',
        slug: 'mindfulness-traders',
        content: 'La meditación es fundamental para el trading...',
        authorId: admin.id,
        section: 'personal',
        isPublished: true,
        views: 2134
      }
    ]);

    console.log('✅ Artículos creados');

    console.log('🎉 Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

seed();
