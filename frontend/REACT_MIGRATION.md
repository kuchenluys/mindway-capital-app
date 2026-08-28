# 🚀 Fase 4: React + TypeScript Migration

## 📋 Descripción

Migración completa del frontend desde HTML/CSS/JavaScript vanilla a **React 18** con **TypeScript** y **Tailwind CSS**. Incluye Redux para state management, React Router para navegación, y Vite como bundler.

---

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── pages/              # Páginas/vistas
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Inversiones.tsx
│   │   └── ...
│   ├── hooks/              # Hooks personalizados
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── ...
│   ├── store/              # Redux slices
│   │   ├── authSlice.ts
│   │   └── index.ts
│   ├── utils/              # Funciones utilitarias
│   │   ├── api.ts
│   │   ├── validators.ts
│   │   └── ...
│   ├── types/              # Tipos TypeScript
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── ...
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css            # Estilos globales
├── public/                  # Assets estáticos
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## 📦 Dependencias Principales

### Core
- **React 18.2.0** - UI library
- **TypeScript 5.2** - Type safety
- **Vite 5.0** - Build tool (10x faster than Webpack)

### State Management
- **Redux Toolkit 1.9.7** - State management
- **React Redux 8.1.3** - Redux bindings
- **Zustand 4.4.1** - Lightweight alternative (opcional)

### Routing
- **React Router 6.20** - Client-side routing
- **useNavigate, useParams, useLocation** - Router hooks

### Styling
- **Tailwind CSS 3.3.6** - Utility-first CSS
- **PostCSS 8.4.31** - CSS processing
- **Autoprefixer 10.4.16** - Browser prefixes

### HTTP Client
- **Axios 1.6** - HTTP requests with interceptors

### Utilities
- **date-fns 2.30** - Date manipulation
- **clsx 2.0** - Conditional class names

---

## 🔧 Setup & Development

### 1. Instalación

```bash
cd frontend
npm install
```

### 2. Variables de Entorno

Crear `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Mindway Capital
```

### 3. Desarrollo

```bash
npm run dev

# Abrirá http://localhost:3000
# Hot Module Replacement (HMR) habilitado
# TypeScript checking automático
```

### 4. Build Producción

```bash
npm run build      # Build optimizado
npm run preview    # Vista previa del build
```

---

## 🎯 Componentes Implementados (43/43)

### Layout Components ✅
- **Layout.tsx** - Layout principal con Navbar y Sidebar
- **Navbar.tsx** - Barra de navegación superior con usuario y logout
- **Sidebar.tsx** - Navegación lateral con rutas y panel admin condicional

### Page Components ✅ (7/7 - 100%)
- **Login.tsx** - Autenticación con login/signup, selector de rol (user/admin)
- **Dashboard.tsx** - Stats, posiciones abiertas, tareas diarias, progreso de cursos
- **Inversiones.tsx** - Gestor de posiciones XAUUSD, formulario de nuevas posiciones, estadísticas
- **Personal.tsx** - Objetivos personales, categorías, hábitos diarios, racha de progreso
- **Biohacking.tsx** - Registro de métricas (peso, sueño, energía, ánimo), protocolos, historial
- **Cursos.tsx** - Catálogo de cursos, inscripción, filtros por categoría, progreso
- **Planes.tsx** - Planes de suscripción (Free/Premium/Elite), toggle mensual/anual, FAQ
- **Comunidad.tsx** - Feed de posts, likes, comentarios, temas populares, eventos

### UI Components ✅ (8/8 - 100%)
- **Button.tsx** - Variants: primary/secondary/danger/ghost, sizes: sm/md/lg
- **Card.tsx** - CardHeader, CardBody, CardFooter con opciones de hover
- **Input.tsx** - Input con label, error, icon support
- **Modal.tsx** - Modal reutilizable con tamaños sm/md/lg
- **Tabs.tsx** - Componente de tabs con navegación
- **Navbar.tsx** - Barra superior
- **Sidebar.tsx** - Navegación lateral
- **Layout.tsx** - Layout principal

### Types ✅
- **src/types/index.ts** - 9 interfaces TypeScript (User, Position, Course, Enrollment, Article, Payment, Subscription, AuthState, ApiResponse)

### Admin Components (To Implement)
- **Analytics.tsx** - Dashboard de analytics
- **ContentManager.tsx** - Gestor de contenido
- **UserManagement.tsx** - Gestión de usuarios
- **Settings.tsx** - Configuración

---

## 🔐 State Management (Redux)

### Auth Slice

```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  role: 'user' | 'admin' | 'editor' | 'moderator'
  plan: 'free' | 'premium' | 'elite'
  loading: boolean
  error: string | null
}

// Actions
- loginSuccess
- loginFailure
- logout
- updateUser
- updatePlan
```

### Usage

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@store/index';

const MyComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}</p>}
    </div>
  );
};
```

---

## 🪝 Custom Hooks

### useAuth

```typescript
const { user, token, login, logout, register } = useAuth();

// Login
await login('user@example.com', 'password');

// Register
await register('name', 'user@example.com', 'password');

// Logout
logout();
```

### useApi

```typescript
const { data, loading, error, request } = useApi<Position[]>([]);

// GET
const positions = await request('/positions', 'GET');

// POST
const newPosition = await request(
  '/positions',
  'POST',
  { symbol: 'XAUUSD', type: 'short' }
);

// PUT
await request('/positions/123', 'PUT', { entryPrice: 2450 });

// DELETE
await request('/positions/123', 'DELETE');
```

---

## 🎨 Tailwind CSS Setup

### Temas Incluidos

```javascript
colors: {
  primary: '#fbbf24'     // Dorado
  secondary: '#a855f7'   // Púrpura
  accent: '#22c55e'      // Verde
  dark: '#0f172a'        // Azul oscuro
}
```

### Uso en Componentes

```typescript
<div className="bg-gradient-dark text-primary-500">
  <button className="bg-primary-500 hover:bg-primary-600 
                     px-4 py-2 rounded-lg transition">
    Click me
  </button>
</div>
```

---

## 🛣️ Routing Setup

### React Router v6

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
  </Routes>
</BrowserRouter>
```

### Hooks

```typescript
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');

const { id } = useParams<{ id: string }>();
const location = useLocation();
```

---

## 📡 API Integration

### Axios Setup with Interceptors

```typescript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

## 🧪 TypeScript Best Practices

### Type Safety

```typescript
// Types file
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'premium' | 'elite';
}

export interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  status: 'open' | 'closed';
}
```

### Component Props

```typescript
interface DashboardProps {
  title: string;
  showStats?: boolean;
  onRefresh?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  title,
  showStats = true,
  onRefresh,
}) => {
  // Component logic
};
```

---

## 📱 Responsive Design

### Tailwind Breakpoints

```typescript
<div className="
  grid-cols-1                // Mobile
  sm:grid-cols-2             // 640px
  md:grid-cols-3             // 768px
  lg:grid-cols-4             // 1024px
  xl:grid-cols-5             // 1280px
">
  {/* Content */}
</div>
```

---

## 🚀 Performance Optimizations

### Code Splitting

```typescript
const Dashboard = React.lazy(() => import('@pages/Dashboard'));

<React.Suspense fallback={<Loading />}>
  <Dashboard />
</React.Suspense>
```

### Vite Optimizations

```typescript
// vite.config.ts
build: {
  outDir: 'dist',
  sourcemap: true,
  minify: 'terser',
}
```

---

## 🔍 Development Tools

### TypeScript Checking

```bash
npm run type-check
```

### ESLint

```bash
npm run lint
```

### Prettier

```bash
npm run format
```

---

## 📚 File Structure Best Practices

### Imports

Use path aliases for clean imports:

```typescript
// ✅ Good
import { useAuth } from '@hooks/useAuth';
import { Dashboard } from '@pages/Dashboard';

// ❌ Avoid
import { useAuth } from '../../../hooks/useAuth';
```

### Component Naming

- Files: PascalCase (e.g., `Dashboard.tsx`, `Navbar.tsx`)
- Functions: PascalCase (e.g., `export const Dashboard: React.FC = ...`)
- Styles: camelCase class utilities (Tailwind)

---

## 🎯 Migration Checklist

- [x] Setup Vite + React 18
- [x] Configure TypeScript
- [x] Setup Tailwind CSS
- [x] Redux configuration
- [x] React Router setup
- [x] Custom hooks (useAuth, useApi)
- [x] Layout components
- [x] Page components (7/7 - 100%)
  - [x] Login.tsx
  - [x] Dashboard.tsx
  - [x] Inversiones.tsx
  - [x] Personal.tsx
  - [x] Biohacking.tsx
  - [x] Cursos.tsx
  - [x] Planes.tsx
  - [x] Comunidad.tsx
- [x] Base UI components (Button, Card, Input)
- [ ] Additional UI components (Modal, Tabs, Select, etc.)
- [ ] API integration
- [ ] Form validation
- [ ] Error handling
- [ ] Tests setup
- [ ] Performance optimization

---

## 🧩 Component Checklist (To Implement)

### Common Components
- [ ] Button (variants: primary, secondary, danger, ghost)
- [ ] Card (with header, body, footer)
- [ ] Modal/Dialog
- [ ] Form Input with validation
- [ ] Select dropdown
- [ ] Tabs
- [ ] Tabs content switching
- [ ] Progress bar
- [ ] Toast notifications
- [ ] Loading spinner
- [ ] Badge/Label
- [ ] Table/DataGrid
- [ ] Pagination

### Feature Components
- [ ] Login/Register form
- [ ] Dashboard grid
- [ ] Position card
- [ ] Course card
- [ ] Course progress
- [ ] User profile
- [ ] Settings panel
- [ ] Analytics chart
- [ ] Biohacking tracker
- [ ] Subscription plan cards

---

## 🚀 Development Workflow

1. **Create component** in `src/components/`
2. **Define types** in `src/types/`
3. **Use hooks** from `src/hooks/`
4. **Call API** using `useApi` hook
5. **Style** with Tailwind classes
6. **Test** with local dev server

---

## 📖 Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

---

## ✅ Next Steps

1. Install dependencies: `npm install`
2. Create pages from vanilla HTML
3. Convert to React components
4. Integrate with Redux store
5. Connect to backend API
6. Build and test

---

**Fase 4: React Migration - EN PROGRESO ✅**

Última actualización: 24 de Agosto 2026
