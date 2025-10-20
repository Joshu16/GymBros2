# GitHub Pages Configuration

## Configuración automática con GitHub Actions

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Pasos para activar GitHub Pages:

1. **Habilitar GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Click en "Settings" (Configuración)
   - Scroll hacia abajo hasta "Pages"
   - En "Source", selecciona "GitHub Actions"

2. **El workflow automático**:
   - Cada vez que hagas push a la rama `master`, se ejecutará automáticamente el workflow
   - El workflow construirá la aplicación y la desplegará en GitHub Pages
   - La URL será: `https://tuusuario.github.io/GymBros2/`

3. **Verificar el despliegue**:
   - Ve a la pestaña "Actions" en tu repositorio
   - Verás el workflow ejecutándose
   - Una vez completado, tu app estará disponible en GitHub Pages

### Configuración técnica:

- **Base path**: `/GymBros2/` (configurado en `vite.config.js`)
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Branch**: `gh-pages` (creada automáticamente)

### Troubleshooting:

Si el despliegue falla:
1. Verifica que el workflow esté habilitado en Settings > Actions
2. Revisa los logs en la pestaña Actions
3. Asegúrate de que no haya errores de build en tu código local

### Despliegue manual (alternativo):

Si prefieres desplegar manualmente:
```bash
npm run build
npm run deploy
```

Esto usará `gh-pages` para desplegar directamente desde tu máquina local.