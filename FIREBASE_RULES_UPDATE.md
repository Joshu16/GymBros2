# 🔥 Actualizar Reglas de Firebase - INSTRUCCIONES COMPLETAS

## ⚠️ IMPORTANTE: Sigue estos pasos EXACTAMENTE

### Paso 1: Ir a Firebase Console
1. Abre tu navegador y ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **gymbros-c21df**

### Paso 2: Ir a Firestore Database
1. En el menú lateral izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en la pestaña **"Rules"** (Reglas)

### Paso 3: Reemplazar las Reglas Completamente
**BORRA TODO** el contenido actual y pega estas reglas nuevas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Routines subcollection
      match /routines/{routineId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        // Exercises subcollection
        match /exercises/{exerciseId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        // Sessions subcollection
        match /sessions/{sessionId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    
    // Allow access to any document under users/{userId} and all subcollections
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Paso 4: Publicar las Reglas
1. Haz clic en el botón **"Publish"** (Publicar)
2. Espera a que aparezca el mensaje de confirmación
3. Deberías ver: "Rules published successfully"

### Paso 5: Verificar que Funciona
1. Ve a tu app GymBros
2. Recarga la página (F5)
3. Deberías ver las rutinas cargadas sin errores
4. Prueba crear una nueva rutina
5. Prueba añadir ejercicios a una rutina

## 🎯 ¿Qué Hacen Estas Reglas?

- ✅ **Seguridad Total**: Solo usuarios autenticados pueden acceder
- ✅ **Aislamiento de Usuarios**: Cada usuario solo ve sus propios datos
- ✅ **Acceso Completo**: Los usuarios pueden crear, leer, actualizar y eliminar:
  - Sus rutinas
  - Los ejercicios dentro de sus rutinas
  - Las sesiones de entrenamiento
- ✅ **Sin Acceso Público**: Usuarios no autenticados no pueden ver nada

## 🚨 Si Sigue Sin Funcionar

1. **Verifica que estás logueado** en la app
2. **Recarga la página** completamente (Ctrl+F5)
3. **Revisa la consola** del navegador para ver errores específicos
4. **Asegúrate** de que las reglas se publicaron correctamente

## 📱 Próximos Pasos

Una vez que las reglas estén actualizadas:
1. Las rutinas se cargarán automáticamente
2. Podrás crear nuevas rutinas
3. Podrás añadir ejercicios a las rutinas
4. Todo funcionará sin errores de permisos

¡Sigue estos pasos y tu app funcionará perfectamente! 🚀
