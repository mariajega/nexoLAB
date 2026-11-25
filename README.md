# NexoLab · Tu centro de mando personal

NexoLab es una aplicación web progresiva (PWA) para organizar en un único lugar el trabajo, Raditest y el Máster de Inteligencia Artificial.

## Qué incluye

- **Dashboard diario:** tareas para hoy, tareas vencidas, seguimientos que requieren revisión y próximos eventos.
- **Tres espacios iniciales:** GE Healthcare, Raditest y Máster IA.
- **Raditest organizado por partes:** TAC, Mamografía, Arcos y Salas RX. Cada subárea puede tener tareas, reuniones, entregables, seguimientos y notas propios.
- **Tareas:** prioridad, estado, fecha límite, fecha prevista, recordatorio, etiquetas, descripción y checklist.
- **Seguimientos independientes:** qué se está esperando, de quién depende, fecha de inicio, fecha prevista, próxima revisión e historial de actuaciones.
- **Calendario flexible:** vistas mensual, semanal, diaria y cronológica; reúne reuniones, visitas, entregas, fechas límite, tareas y revisiones. Los eventos admiten repetición semanal, mensual o anual.
- **Vista de tareas en lista o Kanban:** permite mover tarjetas entre Por hacer, En curso y Completadas.
- **Notas fijadas, buscador global y estadísticas.**
- **Guardado local automático** mediante IndexedDB, funcionamiento sin conexión después de la primera carga y exportación/importación JSON.
- **Sincronización opcional con Google Drive** dentro de una carpeta visible llamada `NexoLab`.
- **PWA instalable** en iPhone y Windows.

## Archivos

- `index.html`: aplicación completa.
- `manifest.json`: configuración instalable PWA.
- `sw.js`: caché offline y recepción de clics en notificaciones.
- `icon.svg`, `icon-192.png` e `icon-512.png`: iconos de NexoLab para navegador, Android y pantalla de inicio.

## Publicar gratis con GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `nexolab`.
2. Sube **los seis archivos** de esta carpeta a la raíz del repositorio: `index.html`, `manifest.json`, `sw.js`, `icon.svg`, `icon-192.png` e `icon-512.png`.
3. En GitHub abre **Settings → Pages**.
4. En *Build and deployment*, selecciona *Deploy from a branch*, elige `main` y `/ (root)` y guarda.
5. Espera a que GitHub Pages publique la web y abre la dirección HTTPS que te proporciona.
6. Utiliza siempre esa dirección HTTPS, no el archivo `index.html` abierto directamente desde Windows.

La primera carga necesita conexión. Después, el service worker almacena los recursos principales para permitir abrir la app sin conexión. Para actualizar la versión, sube los archivos nuevos; el navegador actualizará el caché del service worker.

## Instalar en iPhone

1. Abre la dirección HTTPS publicada desde **Safari**.
2. Pulsa **Compartir**.
3. Selecciona **Añadir a pantalla de inicio**.
4. Abre NexoLab desde el nuevo icono.
5. En Preferencias y datos, activa los permisos de notificación si deseas avisos del sistema.

## Instalar en Windows

Abre la dirección HTTPS en Chrome o Edge y utiliza el icono de instalación de la barra de direcciones o el menú del navegador → **Instalar NexoLab**.

## Conectar Google Drive

La conexión es opcional. La aplicación ya guarda los datos localmente aunque no configures Drive.

### 1. Crear el cliente OAuth

1. Entra en [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto (o utiliza uno propio) y activa **Google Drive API** en *APIs & Services → Library*.
3. Abre *Google Auth Platform* y configura la pantalla de consentimiento. Para uso personal puedes dejar la aplicación en modo de prueba y añadir tu cuenta de Google como usuario de prueba.
4. En *Clients / Credentials*, crea un **OAuth client ID** de tipo **Web application**.
5. En *Authorized JavaScript origins*, añade únicamente el origen de tu web publicada, por ejemplo `https://TUUSUARIO.github.io`. Si usas un dominio propio, añade también ese origen. No incluyas rutas como `/nexolab` en el campo de origen.
6. Copia el **Client ID** generado.

### 2. Conectar desde NexoLab

1. Abre NexoLab desde su dirección HTTPS.
2. Entra en **Más → Preferencias y datos → Google Drive**.
3. Pega el Client ID y pulsa **Conectar / sincronizar**.
4. Inicia sesión con tu cuenta de Google y concede el permiso solicitado.
5. NexoLab creará una carpeta visible `NexoLab` en tu Drive y dentro guardará `nexolab-datos.json`.
6. La primera sincronización combina los registros locales y los de Drive. Si un registro existe en ambos sitios, prevalece la versión con fecha de actualización más reciente.

El permiso OAuth utilizado es `drive.file`, limitado a los archivos que crea o abre esta aplicación; NexoLab no necesita acceso general a todo tu Drive.

### Cómo funciona la sincronización

- Los cambios se guardan primero en el dispositivo.
- Tras conectar Drive, NexoLab sincroniza los cambios mientras la sesión de Google siga válida y la sincronización automática esté activada.
- Por seguridad, el token de acceso de Google no se guarda en la base de datos de la aplicación. Al abrir una sesión nueva o caducar el token, pulsa de nuevo **Conectar / sincronizar** para renovar el acceso.
- La sincronización automática funciona mientras hay una sesión de autorización válida en esa pestaña. No es un servicio de sincronización en segundo plano del servidor.
- Conserva también copias JSON periódicas desde **Copias de seguridad**. La sincronización no sustituye a una copia de seguridad independiente.

## Notificaciones: alcance real

NexoLab puede solicitar permiso al navegador y mostrar avisos locales de tareas, eventos y revisiones cuando la aplicación está abierta o vuelve a estar activa. En iPhone, instala primero la PWA desde la pantalla de inicio.

**Las notificaciones push programadas cuando la aplicación está cerrada no están activadas en esta entrega.** Para eso se necesita un servicio externo que programe y envíe mensajes Web Push (backend, claves VAPID y almacenamiento de suscripciones). No se debe interpretar la notificación local como una alarma garantizada con la app cerrada.

## Datos y privacidad

- Los datos se guardan en IndexedDB en el navegador de cada dispositivo.
- La sincronización con Drive es opcional y los datos de NexoLab se guardan en la carpeta visible creada por la app.
- Las copias manuales son archivos JSON descargables que puedes guardar donde prefieras.
- No introduzcas datos de pacientes, información identificable de terceros ni información corporativa confidencial en una aplicación personal no autorizada por tu empresa.
- La base local del navegador no está cifrada por NexoLab. Protege el dispositivo y tu cuenta de Google.

## Uso recomendado

1. Registra cada acción concreta como **Tarea**.
2. Cuando dependa de una respuesta, de un pedido o de otra persona, crea un **Seguimiento** en vez de dejarlo como una tarea genérica.
3. Pon siempre una **próxima revisión** a los seguimientos.
4. Añade al calendario las reuniones, visitas, fechas de entrega y compromisos con hora.
5. Guarda el contexto en **Notas** y vincúlalo al espacio correcto.
6. Abre el dashboard al empezar el día y al terminar para revisar lo vencido y planificar lo siguiente.
