Proyecto "Colegio Anti-bullying" — esqueleto monorepo

Estructura:
- backend/: Django + DRF
- frontend/: React + TypeScript (a generar)

Siguientes pasos locales:
1. Crear base de datos MySQL y usuario (ver backend/.env.example)
2. Entrar a backend, crear virtualenv, instalar dependencias
3. Configurar .env y ejecutar migraciones

Ver archivos en backend/ para más detalles.

Guardar conversaciones del chat
--------------------------------

Si quieres conservar los chats con el asistente al apagar el equipo, puedes usar la tarea y script incluidos en este repo:

- Script PowerShell: `backend/save-chat.ps1` — guarda el contenido del portapapeles en un archivo Markdown con timestamp dentro de `backend/chat-logs/`.
- Tarea de VS Code: `Save Chat from Clipboard` (definida en `.vscode/tasks.json`).
- Keybinding de workspace: Ctrl+Alt+S (definido en `.vscode/keybindings.json`) — ejecuta la tarea anterior.

Uso rápido:
1. Selecciona y copia el texto del chat (Ctrl+C) en la interfaz donde lo estés viendo.
2. En VS Code presiona Ctrl+Alt+S o abre la paleta (Ctrl+Shift+P) → "Tasks: Run Task" → "Save Chat from Clipboard".
3. Se creará un archivo `backend/chat-logs/chat_YYYY-MM-DD_HH-MM-SS.md` con el contenido.

También puedes ejecutar manualmente desde PowerShell:

```powershell
# desde la raíz del proyecto
.\backend\save-chat.ps1
```

Notas:
- El script usa `Get-Clipboard` de Windows PowerShell. En PowerShell Core/otros entornos podría diferir.
- Si prefieres guardar los logs en otra carpeta, cambia el parámetro `$Folder` en el script o dime cómo lo quieres y lo ajusto.
