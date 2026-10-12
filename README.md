# BioGestión — Landing page

Landing page responsive para presentar la propuesta SaaS BioGestión y recoger inscripciones de interés para la beta. Está preparada como sitio estático para desplegarse en Vercel.

## Contenido
- `index.html`: estructura y contenido de la landing.
- `styles.css`: diseño responsive para escritorio, tablet y móvil.
- `script.js`: menú móvil, validación del formulario y envío a Supabase.
- `config.js`: configuración pública de Supabase.
- `supabase.sql`: creación de tabla y política de inserción.
- `vercel.json`: configuración de publicación estática.

## Publicar en Vercel
1. Descomprime el ZIP.
2. Sube la carpeta a un repositorio nuevo en GitHub (incluye todos los archivos).
3. Entra en https://vercel.com/ e importa ese repositorio.
4. Framework Preset: **Other**. Build Command: vacío. Output Directory: `.` (raíz). Deploy.
5. La landing se verá públicamente, pero el formulario no guardará datos hasta configurar Supabase.

También puedes usar la opción de importar un repositorio Git desde el panel de Vercel. No requiere Node.js ni comando de compilación.

## Conectar el formulario con Supabase
1. Crea un proyecto en https://supabase.com/.
2. Abre **SQL Editor**, pega el contenido de `supabase.sql` y ejecútalo.
3. En Supabase, ve a **Project Settings → API** (la ubicación puede variar según la versión).
4. Copia el **Project URL** y la **publishable key** (o `anon` public key).
5. Abre `config.js` y completa:

   ```js
   window.BIOGESTION_CONFIG = {
     supabaseUrl: "https://TU-PROYECTO.supabase.co",
     supabaseAnonKey: "TU_CLAVE_PUBLICA"
   };
   ```

6. Guarda y sube el cambio al repositorio. Vercel volverá a desplegar automáticamente.
7. Envía una inscripción de prueba y verifica que aparezca en `Table Editor → beta_signups`.

**Seguridad:** la clave pública del frontend no es una clave secreta, pero debe usarse únicamente con RLS y permisos mínimos. El SQL permite insertar inscripciones válidas y no crea acceso público de lectura. Nunca publiques una clave `service_role`. Antes de difundir la página, completa un aviso de privacidad con responsable/contacto, conservación y procedimiento para solicitar eliminación de datos.

## Antes de entregar
- [ ] Publicar y guardar la URL pública de Vercel.
- [ ] Configurar Supabase y probar una inscripción real.
- [ ] Capturar la página en escritorio y móvil.
- [ ] Capturar la tabla `beta_signups` en Supabase.
- [ ] Verificar que la tabla no permite lectura pública.
- [ ] Completar el aviso de privacidad.
- [ ] Reemplazar los datos ficticios del panel por capturas propias cuando exista un prototipo real.

## Importante sobre el prototipo
Los números, nombres de equipos y registros que aparecen en las ilustraciones son ficticios y se muestran solo como ejemplo de interfaz. La landing comunica que BioGestión está en desarrollo y en fase de validación; no afirma que el producto ya esté comercialmente disponible ni que la demanda haya sido validada.
