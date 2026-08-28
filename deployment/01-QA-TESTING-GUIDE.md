# 🧪 FASE 1: QA & TESTING

**Duración:** 5 días  
**Prioridad:** 🔴 CRÍTICA  
**Status:** ⏳ A COMENZAR

---

## 📋 PASO 1: SETUP DE TESTING

### 1.1 Frontend Testing
```bash
cd frontend

# Verificar que Vitest está instalado
npm list vitest

# Si no está, instalar:
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui

# Crear archivo de configuración vitest.config.ts
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### 1.2 Backend Testing
```bash
cd backend

# Instalar testing dependencies
npm install -D jest supertest @types/jest ts-jest

# Crear jest.config.js
```

**jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## 🔬 PASO 2: UNIT TESTS

### Frontend Unit Tests
Crear `frontend/src/test/setup.ts`:
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});
```

Crear `frontend/src/hooks/__tests__/useI18n.test.ts`:
```typescript
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useI18n from '../useI18n';

describe('useI18n', () => {
  it('should format currency correctly', () => {
    const { result } = renderHook(() => useI18n());
    const formatted = result.current.formatCurrency(1000, 'USD');
    expect(formatted).toContain('1,000');
  });

  it('should convert currencies', () => {
    const { result } = renderHook(() => useI18n());
    const converted = result.current.convertCurrency(100, 'USD', 'EUR');
    expect(converted).toBeCloseTo(92, 1);
  });

  it('should format dates by locale', () => {
    const { result } = renderHook(() => useI18n());
    const date = new Date('2026-08-27');
    const formatted = result.current.formatDate(date, 'es');
    expect(formatted).toContain('agosto');
  });
});
```

### Backend Unit Tests
Crear `backend/__tests__/auth.test.ts`:
```typescript
import request from 'supertest';
import app from '../src/index';

describe('Auth API', () => {
  it('POST /api/auth/signup - Should create new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /api/auth/login - Should login user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });

  it('POST /api/auth/login - Should reject invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword'
      });

    expect(response.status).toBe(401);
  });
});
```

---

## 🔗 PASO 3: INTEGRATION TESTS

**Trading Flow Test:**
```typescript
describe('Trading Flow', () => {
  it('Complete trading workflow', async () => {
    // 1. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'trader@test.com', password: 'Pass123!' });
    
    const token = loginRes.body.token;

    // 2. Create position
    const posRes = await request(app)
      .post('/api/trading/positions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        symbol: 'XAUUSD',
        type: 'long',
        entryPrice: 2450,
        stopLoss: 2400
      });

    expect(posRes.status).toBe(201);
    const positionId = posRes.body.id;

    // 3. Get position
    const getRes = await request(app)
      .get(`/api/trading/positions/${positionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.symbol).toBe('XAUUSD');

    // 4. Close position
    const closeRes = await request(app)
      .patch(`/api/trading/positions/${positionId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send({ exitPrice: 2500 });

    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('closed');
  });
});
```

---

## 🎮 PASO 4: E2E TESTS (Cypress)

Instalar:
```bash
cd frontend
npm install -D cypress
npx cypress open
```

**cypress/e2e/auth.cy.ts:**
```typescript
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('Should login successfully', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('SecurePass123!');
    cy.get('button:contains("Iniciar Sesión")').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenido').should('be.visible');
  });

  it('Should show error for invalid credentials', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('WrongPassword');
    cy.get('button:contains("Iniciar Sesión")').click();
    
    cy.contains('Credenciales inválidas').should('be.visible');
  });
});
```

**cypress/e2e/trading.cy.ts:**
```typescript
describe('Trading', () => {
  beforeEach(() => {
    cy.login('trader@test.com', 'Pass123!');
    cy.visit('http://localhost:5173/inversiones');
  });

  it('Should create a new position', () => {
    cy.get('button:contains("Agregar Posición")').click();
    cy.get('input[name="symbol"]').type('XAUUSD');
    cy.get('select[name="type"]').select('long');
    cy.get('input[name="entryPrice"]').type('2450');
    cy.get('button:contains("Crear")').click();
    
    cy.contains('XAUUSD').should('be.visible');
  });
});
```

---

## 📊 PASO 5: COVERAGE REPORTS

Ejecutar:
```bash
# Frontend
cd frontend
npm run test:coverage

# Backend
cd backend
npm run test:coverage
```

Verificar:
```
✅ Líneas: > 80%
✅ Funciones: > 80%
✅ Ramas: > 80%
✅ Sentencias: > 80%
```

---

## ⚡ PASO 6: PERFORMANCE TESTING

**Lighthouse (Frontend):**
```bash
npm install -g lighthouse

# Ejecutar
lighthouse http://localhost:5173 --output=json > lighthouse-report.json

# Verificar
# Desiredores:
# - Performance: > 90
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 90
```

**Load Testing (Backend):**
```bash
npm install -g artillery

# Crear load.yml
duration: 60
arrivalRate: 10
stages:
  - duration: 10
    arrivalRate: 10
  - duration: 20
    arrivalRate: 20
  - duration: 30
    arrivalRate: 5

scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/api/dashboard"
          headers:
            Authorization: "Bearer {{ token }}"

# Ejecutar
artillery run load.yml
```

---

## ✅ CHECKLIST FINAL

**Unit Tests:**
- [ ] Frontend coverage > 80%
- [ ] Backend coverage > 80%
- [ ] Todos los servicios testeados
- [ ] Validaciones testeadas

**Integration Tests:**
- [ ] Auth flow completo
- [ ] Trading CRUD
- [ ] Payments workflow
- [ ] WebSocket connection

**E2E Tests:**
- [ ] Login/Signup
- [ ] Add position
- [ ] View AI analytics
- [ ] Switch language
- [ ] Gamification

**Performance:**
- [ ] Lighthouse score > 90
- [ ] API response < 200ms
- [ ] Load test passed (20 req/s)

**Security:**
- [ ] No hardcoded secrets
- [ ] OWASP scan passed
- [ ] SQL injection tests passed

---

**Estado:** ⏳ A EJECUTAR  
**Próximo:** Fase 2 - Configuration & Secrets
