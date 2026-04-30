# Booking Frontend

**Creador:** Jose Manuel Castillo Queh

Frontend de la plataforma de reservaciones de espacios. La aplicación permite iniciar sesión, reservar espacios, consultar reservaciones pendientes, revisar historial y usar vistas administrativas para gestionar reservaciones, espacios y usuarios.

Este repositorio contiene solamente el frontend. La documentación de API, base de datos, seeds y endpoints debe mantenerse en el repositorio `BookingBackend`.

## Tecnologías

- Vue 3
- Vite
- Vue Router
- Pinia
- PrimeVue
- Tailwind CSS
- FullCalendar
- Google Login
- json-server para datos locales de prueba

## Requisitos

- Node.js instalado
- npm instalado
- Backend ejecutándose en `http://localhost:8080`
- Puerto `3000` disponible para Vite
- OAuth Client ID de Google si se usará el login con Google

## Estructura Principal

```text
BookingFrontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── router/
│   ├── stores/
│   ├── utils/
│   └── views/
├── package.json
├── vite.config.js
├── .env
└── README.md
```

Carpetas importantes:

- `src/views`: pantallas principales de login, usuario y administrador.
- `src/components`: componentes reutilizables de calendario, tablas, botones, modales y barras laterales.
- `src/router`: rutas protegidas y redirecciones por rol.
- `src/stores/auth.js`: estado de sesión, login, logout y validación del usuario autenticado.
- `src/utils/api.js`: función central para consumir el backend con `fetch`.
- `src/db.json`: datos locales para pruebas con `json-server`.

## Instalación

Desde la carpeta del frontend:

```bash
cd BookingFrontend
npm install
```

## Variables De Entorno

Copia un archivo `.env.example` en la raíz de `BookingFrontend`:

```bash
cp .env.example .env
```

Contenido requerido:

```env
VITE_API_BASE=http://localhost:8080
VITE_CLIENT_ID=TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com
```

Descripción:

- `VITE_API_BASE`: URL base del backend. En desarrollo local debe apuntar a `http://localhost:8080`.
- `VITE_CLIENT_ID`: OAuth Client ID de Google usado por el botón de inicio de sesión con Google.

Notas importantes:

- Las variables que usa Vite deben iniciar con `VITE_`.
- Si modificas `.env`, reinicia `npm run dev`.
- No subas Client IDs o credenciales reales si el repositorio será público.

## Configuración De Google Login

Para usar el login con Google necesitas crear un OAuth Client ID en Google Cloud Console.

1. Entra a Google Cloud Console:
   <https://console.cloud.google.com/>
2. Crea o selecciona un proyecto.
3. Ve a `APIs & Services` -> `OAuth consent screen`.
4. Configura la pantalla de consentimiento.
5. Para desarrollo local puedes usar modo de prueba.
6. Ve a `APIs & Services` -> `Credentials`.
7. Selecciona `Create credentials` -> `OAuth client ID`.
8. En `Application type`, selecciona `Web application`.
9. En `Authorized JavaScript origins`, agrega:

```text
http://localhost:3000
```

Si cambias el puerto de Vite, agrega también ese origen. Ejemplo:

```text
http://localhost:3001
```

10. Copia el `Client ID` generado y colócalo en `VITE_CLIENT_ID`.

El Client ID normalmente tiene este formato:

```text
xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

Checklist para que Google Login funcione:

- Backend activo en `http://localhost:8080`.
- Frontend activo en `http://localhost:3000`.
- `.env` del frontend contiene `VITE_CLIENT_ID`.
- `http://localhost:3000` está autorizado en Google Cloud.
- El usuario existe previamente en la base de datos del backend.
- El correo del usuario en el backend coincide con el correo de Google.

## Ejecución En Desarrollo

Levanta el backend primero desde `BookingBackend`.

Después, en `BookingFrontend`, ejecuta:

```bash
npm run dev
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

El puerto está configurado en `vite.config.js`:

```js
server: {
  port: 3000
}
```

## Scripts Disponibles

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

Previsualizar la compilación:

```bash
npm run preview
```

Levantar datos locales con json-server:

```bash
npm run server
```

El servidor de datos locales usa `src/db.json` y el puerto `5000`.

## Conexión Con El Backend

Todas las peticiones pasan por `src/utils/api.js`.

La URL base se toma desde:

```js
import.meta.env.VITE_API_BASE
```

Cuando el usuario está autenticado, el frontend envía el token JWT en cada request protegida:

```http
Authorization: Bearer <token>
```

El token se guarda en `localStorage` con la llave:

```text
token
```

## Flujo De Sesión

1. El usuario entra a la aplicación.
2. `src/router/index.js` ejecuta `auth.attempt()` para revisar si ya existe un token.
3. Si hay token, el frontend consulta `GET /user`.
4. Si el token es válido, se carga el usuario y su rol.
5. Si el usuario es `admin`, se redirige a vistas administrativas.
6. Si el usuario es `user`, se redirige a vistas de usuario.
7. Si no hay sesión, se muestra el login.

Roles usados por el frontend:

- `admin`: acceso a reservaciones globales, espacios, historial y registro de usuarios.
- `user`: acceso a reservar, ver pendientes y consultar historial propio.

## Rutas Principales

Rutas públicas:

- `/`
- `/login`

Rutas de administrador:

- `/admin/bookings`
- `/admin/history`
- `/admin/spaces`
- `/admin/register`

Rutas de usuario:

- `/user/bookings`
- `/user/book`
- `/user/archive`

## Compilación Para Producción

Genera los archivos finales:

```bash
npm run build
```

Vite genera la carpeta:

```text
dist/
```

Para revisar esa compilación localmente:

```bash
npm run preview
```

Antes de compilar para otro ambiente, actualiza `.env` con la URL real del backend:

```env
VITE_API_BASE=https://tu-backend.com
VITE_CLIENT_ID=TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com
```

## Problemas Comunes

Si el frontend no puede iniciar sesión:

- Verifica que el backend esté activo.
- Revisa que `VITE_API_BASE` apunte al backend correcto.
- Reinicia `npm run dev` después de cambiar `.env`.
- Confirma que el usuario exista en la base de datos.

Si Google Login no funciona:

- Revisa que `VITE_CLIENT_ID` sea correcto.
- Confirma que `http://localhost:3000` esté en `Authorized JavaScript origins`.
- Verifica que el correo de Google exista como usuario en el backend.

Si una ruta protegida te regresa al login:

- Borra el token anterior desde el navegador o ejecuta logout.
- Verifica que el backend responda correctamente `GET /user`.
- Confirma que el rol del usuario sea `admin` o `user`.
