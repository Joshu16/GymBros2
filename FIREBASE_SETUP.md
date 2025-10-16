# 🔥 Configuración de Firebase - GymBros

## Paso a Paso para Configurar Firebase

### 1. Crear Proyecto en Firebase Console

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en **"Crear un proyecto"**
3. **Nombre del proyecto**: `gymbros-app` (o el que prefieras)
4. **Google Analytics**: Desactiva (opcional para esta app)
5. Haz clic en **"Crear proyecto"**

### 2. Configurar Authentication

1. En el panel izquierdo, haz clic en **"Authentication"**
2. Haz clic en **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. **Habilita "Correo electrónico/contraseña"**:
   - Haz clic en "Correo electrónico/contraseña"
   - Activa la primera opción
   - Haz clic en "Guardar"
5. **Habilita "Google"**:
   - Haz clic en "Google"
   - Activa el proveedor
   - Selecciona un email de soporte del proyecto
   - Haz clic en "Guardar"

### 3. Configurar Firestore Database

1. En el panel izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. **Modo de seguridad**: Selecciona **"Comenzar en modo de prueba"** (por ahora)
4. **Ubicación**: Elige la más cercana a ti (ej: us-central1)
5. Haz clic en **"Habilitar"**

### 4. Obtener Configuración de la App

1. En el panel izquierdo, haz clic en el ícono de configuración ⚙️
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"General"**
4. Busca **"Tus aplicaciones"** y haz clic en el ícono web `</>`
5. **Registra la app**:
   - **Apodo**: `GymBros Web App`
   - **NO** marques "También configura Firebase Hosting"
   - Haz clic en **"Registrar app"**
6. **Copia la configuración** que aparece (algo como esto):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gymbros-app-xxxxx.firebaseapp.com",
  projectId: "gymbros-app-xxxxx",
  storageBucket: "gymbros-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### 5. Actualizar el Código

1. Abre el archivo `src/firebase/config.js`
2. Reemplaza la configuración de ejemplo con la tuya:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};
```

### 6. Configurar Reglas de Firestore (Opcional pero Recomendado)

1. Ve a **"Firestore Database"** → **"Reglas"**
2. Reemplaza las reglas con estas (más seguras):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden acceder a sus datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /routines/{routineId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /exercises/{exerciseId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        match /sessions/{sessionId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
}
```

3. Haz clic en **"Publicar"**

### 7. Probar la Aplicación

1. Ejecuta `npm run dev`
2. Ve a `http://localhost:5173`
3. Intenta registrarte con Google o email/contraseña
4. Si funciona, ¡Firebase está configurado correctamente!

## 🚨 Solución de Problemas

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"
- Verifica que la configuración en `config.js` sea correcta
- Asegúrate de que todos los campos estén llenos

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Ve a Authentication → Settings → Authorized domains
- Añade `localhost` si no está

### Error: "Firestore: Missing or insufficient permissions"
- Verifica las reglas de Firestore
- Asegúrate de que el usuario esté autenticado

## 📱 Estructura de Datos

La app creará automáticamente esta estructura en Firestore:

```
users/
  {userId}/
    routines/
      {routineId}/
        name: string
        description: string
        createdAt: timestamp
        updatedAt: timestamp
        exercises/
          {exerciseId}/
            name: string
            sets: number
            reps: number
            rir: number
            createdAt: timestamp
            updatedAt: timestamp
        sessions/
          {sessionId}/
            exercises: array
            completedAt: timestamp
            createdAt: timestamp
```

¡Listo! Tu app GymBros ya está conectada a Firebase. 🎉
