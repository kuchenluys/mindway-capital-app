# 📱 FASE 6: MOBILE BUILD GUIDE (iOS & Android)

**Duración:** 1 semana  
**Prioridad:** 🟡 MEDIA  
**Status:** ⏳ A COMENZAR

---

## 📋 PREREQUISITES

```bash
# Instalar Expo CLI
npm install -g expo-cli

# Instalar EAS CLI
npm install -g eas-cli

# Verificar
expo --version
eas --version
```

---

## PASO 1: EXPO ACCOUNT SETUP

### Crear cuenta:

```bash
# Ir a https://expo.dev/signup
# O desde CLI:
expo login

# Verificar login
expo whoami
```

---

## PASO 2: CONFIGURE app.json

`mobile/app.json`:

```json
{
  "expo": {
    "name": "Mindway Capital",
    "slug": "mindway-capital",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mindwaycapital.ios",
      "buildNumber": "1.0.0",
      "config": {
        "usesNonExemptEncryption": false
      },
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Necesitamos tu ubicación para análisis",
        "UIRequiredDeviceCapabilities": ["armv7"]
      }
    },
    "android": {
      "package": "com.mindwaycapital",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#fbbf24"
      },
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      "softwareKeyboardLayoutMode": "pan"
    },
    "extra": {
      "apiUrl": "https://api.mindwaycapital.com",
      "websocketUrl": "wss://api.mindwaycapital.com",
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID"
      }
    },
    "owner": "mindwaycapital"
  }
}
```

---

## 📱 iOS BUILD

### PASO 3: iOS Certificates Setup

```bash
# En la carpeta mobile/
eas build -p ios --profile preview

# Esperar a que pida credenciales

# O setup manualmente:
eas credentials

# Seleccionar:
# ? Platform? ios
# ? Credentials source? local
# ? Would you like to generate new credentials? Yes
```

### Apple Developer Account:

1. **Ir a https://developer.apple.com**

2. **Enroll en Developer Program** ($99/year)

3. **Crear App ID:**
   ```
   Bundle ID: com.mindwaycapital.ios
   Description: Mindway Capital Trading App
   ```

4. **Crear Certificate (Production):**
   - iOS App Distribution
   - Descargar .cer

5. **Create Provisioning Profile:**
   - App Store
   - Seleccionar App ID
   - Seleccionar certificate
   - Descargar .mobileprovision

### PASO 4: Build para TestFlight

```bash
cd mobile

# Create build
eas build -p ios --profile production

# Copiar URL de build
# Esperar a que termine (~15-20 min)
```

### PASO 5: Upload a TestFlight

```bash
# Una vez que el build está listo, automáticamente:
# Verás opción "Upload to App Store"
# Click para subir a TestFlight

# O manual:
eas submit -p ios

# Seleccionar opciones:
# ? Apple ID: tu_email@apple.com
# ? Password: app_specific_password
```

### PASO 6: App Store Review

En Apple TestFlight:

1. **Agregar testers:**
   - Internal Testers: tu equipo
   - External Testers: hasta 10,000 usuarios

2. **Configurar build:**
   - Versión
   - Notas de release
   - Información de privacidad

3. **Agregar información de app:**
   ```
   Nombre: Mindway Capital
   Descripción: Plataforma de trading inteligente
   Categoría: Finance
   
   Screenshots (mínimo 2 por device):
   - Dashboard screenshot
   - Trading screenshot
   
   Keywords: trading, crypto, stocks, IA, market
   
   Support URL: https://mindwaycapital.com/support
   Privacy URL: https://mindwaycapital.com/privacy
   ```

4. **Submit a App Store Review:**
   ```
   Edad: 12+
   Características:
   - No se vende nada
   - Datos de usuario (email, location)
   - No tiene publicidades
   ```

5. **Esperar aprobación** (24-48 horas)

---

## 🤖 ANDROID BUILD

### PASO 7: Android Keystore Setup

```bash
# Generar keystore
eas build -p android --profile production

# Cuando pregunte:
# ? Use existing keystore? No
# ? Generate new keystore? Yes

# Seleccionar:
# ? Keystore password: (crear contraseña fuerte)
# ? Key alias: mindway
# ? Key password: (mismo que keystore)
# ? Common name: Mindway Capital
# ? Organizational unit: Development
# ? Organization: Mindway Capital
# ? Country code: US
```

### PASO 8: Build APK & AAB

```bash
# Para Google Play, necesitamos AAB (App Bundle)
eas build -p android --profile production

# Esperar a que complete (~15-20 min)
```

### PASO 9: Google Play Console Setup

1. **Crear cuenta:**
   - https://play.google.com/console
   - Crear nuevo proyecto: "Mindway Capital"

2. **Crear aplicación:**
   ```
   App name: Mindway Capital
   Default language: English
   App category: Finance
   App type: Application
   ```

3. **Configurar Store Listing:**
   ```
   Breve descripción: 
   "Plataforma de trading inteligente con predicciones IA"
   
   Descripción completa:
   "Mindway Capital es una plataforma de trading avanzada..."
   
   Screenshots:
   - Mínimo 2, máximo 8 por device type
   - Dimensiones: 1080x1920px
   
   Preview de video: (opcional)
   
   Icono: 512x512px
   Banner: 1024x500px
   ```

4. **Especificaciones del contenido:**
   ```
   Edad de público: Todos (4+)
   Contenido de publicidad: No
   Acceso a ubicación: Solo cuando usa la app
   Capturas de datos: Email, datos de ubicación
   ```

5. **Precios y distribución:**
   ```
   País: Todos
   Gratis: Yes
   Contenido: Standard
   Restricciones: Ninguna
   ```

### PASO 10: Upload AAB a Play Store

```bash
# En Google Play Console
# Tab: Internal testing
# Click: Create new release
# Upload AAB file (desde eas build result)

# O desde CLI:
eas submit -p android

# Seguir pasos:
# ? Google Play service account JSON path
# (crear en Google Cloud Console si no existe)
```

### PASO 11: Internal Testing

1. **Agregar testers internos:**
   - Emails del equipo
   - Pueden instalar desde Play Store enlace privado

2. **Test en devices:**
   - Android 11+ recomendado
   - Probar todas las funciones
   - Verificar que funciona offline

3. **Versionar:**
   ```
   Version: 1.0.0
   Release notes: First release
   ```

### PASO 12: Submit a Play Store Review

```
Internal → Production Release
Click: Confirm release
Esperar aprobación (24-48 horas)
```

---

## 📊 CONFIGURE EAS

`mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview2": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview3": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      },
      "ios": {
        "buildType": "archive"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🔄 CONTINUOUS DEPLOYMENT

GitHub Actions para auto-build:

`.github/workflows/build.yml`:

```yaml
name: EAS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd mobile
          npm install
          npm install -g eas-cli
      
      - name: Build iOS Preview
        run: |
          cd mobile
          eas build -p ios --profile preview --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build Android Preview
        run: |
          cd mobile
          eas build -p android --profile preview --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## ✅ VERIFICATION CHECKLIST

```bash
# 1. Build completando
# Ver en: https://expo.dev/builds

# 2. iOS build uploaded
# Ver en: App Store Connect → TestFlight

# 3. Android build uploaded
# Ver en: Google Play Console → Internal Testing

# 4. Testers agregados
# Verificar: Email recibida para testear

# 5. App funciona en devices
# Test login, trading, payments

# 6. Store listing completo
# Verificar: Screenshots, descripciones, info

# 7. Aprobación recibida
# iOS: email de Apple
# Android: email de Google
```

---

## 📊 METRICS TRACKING

Después de publicar:

```
App Store Connect:
- Daily active users
- Crashes
- Hang rate
- Rating

Google Play Console:
- Installs
- Crashes
- Rating
- Revenue
```

---

## 🔄 UPDATES & PATCHES

### OTA Updates (Expo):

```typescript
// mobile/app.json
"updates": {
  "enabled": true,
  "url": "https://u.expo.dev/PROJECT_ID"
}
```

```bash
# Deploy update
eas update --channel production
```

---

## ✅ FINAL CHECKLIST

- [ ] Apple Developer Account ($99/year)
- [ ] Google Play Developer Account ($25 one-time)
- [ ] iOS App ID creada
- [ ] iOS certificates generadas
- [ ] iOS provisioning profile creada
- [ ] Android keystore creado
- [ ] TestFlight build creado
- [ ] Google Play build creado
- [ ] App Store listing completado
- [ ] Play Store listing completado
- [ ] Testers internos agregados
- [ ] iOS aprobación recibida
- [ ] Android aprobación recibida
- [ ] App publicada en App Store
- [ ] App publicada en Play Store

---

**URLs Finales:**

```
iOS: https://apps.apple.com/app/mindway-capital/id1234567890
Android: https://play.google.com/store/apps/details?id=com.mindwaycapital
```

---

**Estado:** ⏳ A EJECUTAR  
**Próximo:** Fase 7 - Landing Page

**Tiempo para esta fase:** 1 semana  
**Una vez completado:** ✅ Apps en App Store & Play Store
