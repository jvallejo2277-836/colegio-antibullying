# Credenciales de Desarrollo - Sistema Antibullying

## Django Superusuario
- **URL**: http://127.0.0.1:8000/admin
- **Usuario**: asus
- **Email**: jvallejo@gmail.com
- **Contraseña**: [Establecida durante creación]

## Frontend React
- **URL**: http://localhost:3000
- **Acceso**: Sin autenticación (desarrollo)

## Base de Datos
- **Motor**: SQLite (desarrollo)
- **Archivo**: backend/db.sqlite3

## Comandos Útiles

### Iniciar Backend
```bash
cd backend
python manage.py runserver
```

### Iniciar Frontend
```bash
cd frontend-cra
npm start
```

### Crear Migraciones
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Cargar Tipos de Incidentes
```bash
cd backend
python manage.py shell
exec(open('scripts/init_incident_types.py').read())
```

---
**Nota**: Este archivo contiene credenciales de desarrollo. No usar en producción.