# 📋 Fase 7 - Guía de Integración

Este documento explica cómo integrar los componentes WebSocket en la aplicación.

---

## 1️⃣ Integrar en App.tsx

Actualiza `frontend/src/App.tsx` para usar el hook de notificaciones:

```typescript
import useRealtimeNotifications from '@hooks/useRealtimeNotifications';

function App() {
  useRealtimeNotifications(); // Activar notificaciones globales

  return (
    <BrowserRouter>
      {/* resto del código */}
    </BrowserRouter>
  );
}
```

---

## 2️⃣ Agregar OnlineUsers al Navbar

Actualiza `frontend/src/components/Navbar.tsx`:

```typescript
import OnlineUsers from '@components/OnlineUsers';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="flex items-center justify-between">
        <h1>Mindway Capital</h1>
        <OnlineUsers /> {/* Agregar aquí */}
      </div>
    </nav>
  );
};
```

---

## 3️⃣ Agregar Panel de Notificaciones al Dashboard

Actualiza `frontend/src/pages/Dashboard.tsx`:

```typescript
import RealtimeNotificationsPanel from '@components/RealtimeNotificationsPanel';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-grid">
      {/* Stats y otros componentes */}
      
      {/* Agregar panel de notificaciones */}
      <RealtimeNotificationsPanel />
    </div>
  );
};
```

---

## 4️⃣ Emitir Eventos en Inversiones.tsx

Actualiza `frontend/src/pages/Inversiones.tsx` para emitir eventos:

```typescript
import useWebSocket from '@hooks/useWebSocket';

export const Inversiones: React.FC = () => {
  const { emit } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000'
  );

  const handleCreatePosition = (positionData: any) => {
    // ... lógica existente ...
    
    // Emitir evento WebSocket
    emit('position:update', {
      symbol: positionData.symbol,
      type: positionData.type,
      entry: positionData.entry,
      stop: positionData.stop,
      tp: positionData.tp,
      pips: calculatePips(positionData) // función existente
    });
  };

  return (
    // ... JSX existente ...
  );
};
```

---

## 5️⃣ Emitir Eventos en Cursos.tsx

Actualiza `frontend/src/pages/Cursos.tsx`:

```typescript
import useWebSocket from '@hooks/useWebSocket';

export const Cursos: React.FC = () => {
  const { emit } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000'
  );

  const handleEnrollCourse = (courseId: string, courseName: string) => {
    // ... lógica existente ...
    
    // Emitir evento
    emit('course:progress', {
      courseId,
      courseName,
      progress: 0 // Progreso inicial
    });
  };

  const handleProgressUpdate = (courseId: string, progress: number) => {
    // Emitir actualización de progreso
    emit('course:progress', {
      courseId,
      progress
    });
  };

  return (
    // ... JSX existente ...
  );
};
```

---

## 6️⃣ Variables de Entorno

### Backend (.env)
```env
PORT=5000
WEBSOCKET_CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
REACT_APP_WEBSOCKET_URL=http://localhost:5000
```

---

## 7️⃣ Instalación de Dependencias

```bash
# Frontend
cd frontend
npm install socket.io-client

# Backend (ya incluido)
cd backend
npm install
```

---

## 8️⃣ Verificación de Funcionalidad

### Paso 1: Iniciar Backend
```bash
cd backend
npm run dev
```

### Paso 2: Iniciar Frontend
```bash
cd frontend
npm run dev
```

### Paso 3: Verificar en DevTools
```javascript
// Abrir Console en DevTools
// Debe aparecer: "✅ WebSocket conectado: socket-xxx"
```

### Paso 4: Probar Eventos

1. **Usuarios Online:**
   - Abrir 2 pestañas
   - Ambas deben mostrar "🟢 2 online"

2. **Posición Actualizada:**
   - Ir a Inversiones
   - Crear una posición
   - Debe aparecer notificación toast
   - Panel debe actualizar

3. **Curso Actualizado:**
   - Ir a Cursos
   - Inscribirse en un curso
   - Debe aparecer notificación
   - Panel debe actualizar

---

## 9️⃣ Troubleshooting

### WebSocket no conecta
```
Posible causa: Backend no está corriendo
Solución: npm run dev en backend/
```

### Notificaciones no aparecen
```
Posible causa: useRealtimeNotifications no activado
Solución: Agregar hook en App.tsx (paso 1)
```

### Eventos no se emiten
```
Posible causa: Socket no está conectado
Solución: Verificar en console que WebSocket conectó
```

### CORS error
```
Posible causa: CORS no configurado en Socket.io
Solución: Verificar server.js línea 33-36
```

---

## 🔟 Próximos Pasos

Después de integrar:

1. **Testing:**
   - Probar con múltiples usuarios
   - Verificar reconexión automática
   - Probar con conexión inestable

2. **Monitoreo:**
   - Agregar logging en eventos
   - Monitorear conexiones activas
   - Alertas de desconexión

3. **Mejoras:**
   - Persistencia en BD
   - Notificaciones por email
   - Historial de eventos

---

## 📚 Referencias

- [Socket.io Documentation](https://socket.io/docs/)
- [React Hooks Best Practices](https://react.dev/reference/react/useEffect)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)

---

**Versión:** 7.0.0  
**Última actualización:** 26 de Agosto 2026
