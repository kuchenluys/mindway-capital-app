# 🤝 Guía de Contribución - Mindway Capital

¡Gracias por tu interés en contribuir a Mindway Capital! Esta guía te ayudará a entender cómo contribuir efectivamente.

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Empezar](#cómo-empezar)
3. [Flujo de Contribución](#flujo-de-contribución)
4. [Estándares de Código](#estándares-de-código)
5. [Commits y PRs](#commits-y-prs)
6. [Testing](#testing)
7. [Documentación](#documentación)

---

## 🙏 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a proporcionar un ambiente amigable, seguro e inclusivo para todos, sin importar edad, cuerpo, discapacidad, etnia, identidad de género, experiencia, nacionalidad, apariencia personal, raza, religión u orientación sexual.

### Nuestras Normas

✅ **Comportamiento Esperado:**
- Lenguaje inclusivo y respetuoso
- Crítica constructiva
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía con otros miembros

❌ **Comportamiento Inaceptable:**
- Lenguaje ofensivo
- Acoso o discriminación
- Insultos o ataques personales
- Publicar información privada sin consentimiento

---

## 🚀 Cómo Empezar

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
git
PostgreSQL 14+
Redis 6+
```

### 1. Fork el Repositorio

```bash
# En GitHub: Click "Fork"
git clone https://github.com/YOUR_USERNAME/mindway-capital.git
cd mindway-capital
```

### 2. Agregar Upstream

```bash
git remote add upstream https://github.com/mindway/mindway-capital.git
git fetch upstream
```

### 3. Setup Local

```bash
# Instalar dependencias
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# Mobile
cd mobile && npm install && cd ..

# Setup .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 4. Crear Feature Branch

```bash
git checkout -b feature/my-amazing-feature
# O para bug fixes:
git checkout -b fix/issue-description
# O para documentación:
git checkout -b docs/update-readme
```

---

## 🔄 Flujo de Contribución

### Paso 1: Identifica el Trabajo

**Opciones:**
- Escoge un issue abierto
- Abre un issue nuevo para features grandes
- Para pequeños fixes, puedes ir directo a PR

### Paso 2: Desarrollo

```bash
# Actualizar tu branch con main
git fetch upstream
git rebase upstream/main

# Hacer cambios
# ... editar archivos ...

# Verificar que funciona
npm run dev
npm run test
```

### Paso 3: Commit

```bash
# Stage cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: add price prediction feature"
```

### Paso 4: Push

```bash
git push origin feature/my-amazing-feature
```

### Paso 5: Pull Request

1. Ir a GitHub
2. Click "New Pull Request"
3. Asegurar base es `main` (no `develop`)
4. Llenar template:

```markdown
## Descripción
[Qué cambias y por qué]

## Tipo de Cambio
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

## Screenshots (si aplica)
[Adjuntar imágenes]

## Checklist
- [ ] Código sigue estándares
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] No breaking changes
```

### Paso 6: Review

- Responder comentarios
- Hacer cambios si es necesario
- Rebase en main si hay conflictos

### Paso 7: Merge

Una vez aprobado:
```bash
# Actualizar
git fetch upstream
git rebase upstream/main

# Push updates
git push -f origin feature/my-amazing-feature
```

Merge será hecho por mantainers.

---

## 💻 Estándares de Código

### TypeScript

✅ **Tipo todo**
```typescript
// Bueno
const getUserById = async (id: string): Promise<User> => {
  return db.users.findOne({ where: { id } });
};

// Malo
const getUserById = async (id) => {
  return db.users.findOne({ where: { id } });
};
```

✅ **Usa interfaces para tipos complejos**
```typescript
interface Trade {
  id: string;
  userId: string;
  symbol: string;
  size: number;
  entryPrice: number;
  exitPrice?: number;
  pnl?: number;
  createdAt: Date;
}
```

✅ **Evita any**
```typescript
// Malo
const data: any = await fetch(...);

// Bueno
interface ApiResponse {
  trades: Trade[];
  total: number;
}
const data: ApiResponse = await fetch(...);
```

### Formatting

```bash
# Prettier (auto format)
npm run format

# ESLint (validación)
npm run lint

# Fix automáticamente
npm run lint:fix
```

### Naming Conventions

```typescript
// Componentes: PascalCase
export const TradeCard = () => { }

// Functions: camelCase
export const calculatePnL = () => { }

// Constants: UPPER_SNAKE_CASE
export const MAX_POSITION_SIZE = 100000;

// Private: _prefix
private _calculateFee() { }
```

### Código Limpio

```typescript
// ✅ Bueno: función pequeña, responsabilidad única
const calculatePnL = (entry: number, exit: number, size: number): number => {
  return (exit - entry) * size;
};

// ❌ Malo: función grande, múltiples responsabilidades
const processTrade = (trade, user, db) => {
  // 50 líneas de lógica...
}
```

### Comments

```typescript
// ✅ Solo cuando es no-obvio
// Esperamos 2-3s para que el precio se estabilice antes de ejecutar
await sleep(2500);

// ❌ Obvio
// Increment counter
counter++;
```

---

## 📝 Commits y PRs

### Formato de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: Nueva feature
- `fix`: Bug fix
- `docs`: Documentación
- `style`: Formato (no lógica)
- `refactor`: Reescribir sin cambiar comportamiento
- `perf`: Mejoras de performance
- `test`: Tests
- `chore`: Configuración, dependencias

**Ejemplos:**
```bash
git commit -m "feat(trading): add price prediction endpoint"
git commit -m "fix(auth): handle expired JWT tokens correctly"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(analytics): simplify leaderboard calculation"
```

### PR Title

```
[Type] Description

Ejemplos:
[feat] Add price prediction endpoint
[fix] Handle expired JWT tokens
[docs] Update README
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Backend
cd backend
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Frontend
cd frontend
npm run test
npm run test:coverage

# E2E
npm run test:e2e
```

### Escribir Tests

```typescript
// ✅ Bueno
describe('TradeService', () => {
  it('should calculate PnL correctly', () => {
    const pnl = calculatePnL(100, 110, 10);
    expect(pnl).toBe(100);
  });

  it('should throw error on negative size', () => {
    expect(() => calculatePnL(100, 110, -1)).toThrow();
  });
});

// ❌ Malo
it('should work', () => {
  const result = someFunction();
  expect(result).toBeDefined();
});
```

### Coverage Target

- **Lines:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%

---

## 📚 Documentación

### README Updates

Si cambias features, actualiza README.md:

```markdown
## Nuevas Features

### Price Prediction

La plataforma ahora predice precios usando ML.

```bash
GET /api/predictions/:symbol
```

Retorna confidence score 0-100.
```

### API Documentation

Para nuevos endpoints, documenta en `/backend/API.md`:

```markdown
## POST /api/trades

Crear un nuevo trade.

### Request
```json
{
  "symbol": "XAUUSD",
  "size": 1.5,
  "direction": "LONG"
}
```

### Response
```json
{
  "id": "trade_123",
  "entryPrice": 2450.50,
  "createdAt": "2026-08-27T..."
}
```
```

### Code Comments

Para features complejas:

```typescript
/**
 * Calcula el Position Size óptimo usando Kelly Criterion.
 * 
 * @param winRate - Porcentaje de trades ganadores (0-1)
 * @param avgWin - Ganancia promedio en pips
 * @param avgLoss - Pérdida promedio en pips
 * @returns Position size recomendado (0-1)
 * 
 * @example
 * const size = calculateKellySize(0.55, 100, 80);
 * // Returns 0.06 (6% del capital)
 */
export const calculateKellySize = (
  winRate: number,
  avgWin: number,
  avgLoss: number
): number => {
  return (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin;
};
```

---

## 🐛 Reporte de Bugs

Si encuentras un bug:

1. **Check issues existentes** - Quizás ya esté reportado
2. **Crea issue nuevo** con:
   - Título descriptivo
   - Descripción del comportamiento esperado vs actual
   - Pasos para reproducir
   - Screenshots si es visual
   - Sistema operativo, versión Node, etc.

---

## 💡 Sugerencias de Features

Abre issue con:
- Descripción clara del problema a resolver
- Solución propuesta
- Ejemplos de uso
- Impacto potencial

---

## 📞 Contacto

- **Chat:** [Discord](https://discord.gg/mindwaycapital)
- **Email:** dev@mindwaycapital.com
- **Issues:** GitHub Issues

---

## 🙏 Gracias

¡Apreciamos tu contribución! Juntos hacemos Mindway Capital mejor.

**Happy coding!** 🚀

