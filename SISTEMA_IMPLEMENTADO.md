# Sistema de Convivencia Escolar - Implementación Chile 🇨🇱

## 📋 Resumen de Implementación

### ✅ **Completado**

#### 🗄️ **Modelos de Datos (Basados en Ley 20.536)**
- **Colegio**: Establecimientos con RBD, información de contacto y responsables
- **TipoIncidente**: Categorización según normativa (bullying, violencia, drogas, etc.)
- **PerfilUsuario**: Usuarios con roles específicos (estudiantes, docentes, directivos, etc.)
- **IncidentReport**: Reportes completos con seguimiento y plazos legales
- **Evidence**: Sistema de evidencias con tipos y confidencialidad
- **MedidaFormativa**: Catálogo de medidas pedagógicas
- **Sancion**: Catálogo de sanciones disciplinarias
- **ResolucionIncidente**: Resoluciones con medidas aplicadas

#### 🔌 **API REST Completa**
- **12 endpoints principales** con filtros y búsquedas
- **Paginación automática** (20 elementos por página)
- **Serializers detallados** con campos calculados
- **Filtros avanzados** por estado, urgencia, tipo, etc.
- **Endpoints especiales**:
  - `/api/graphs/` - Métricas para dashboard
  - `/api/reportes/urgentes/` - Reportes críticos
  - `/api/colegios/{id}/reportes/` - Reportes por colegio

#### 📊 **Dashboard de Métricas**
- Contadores generales (colegios, reportes, evidencias)
- Reportes por estado y tipo de incidente
- Identificación de casos críticos y vencidos
- Reportes por gravedad

#### 👥 **Sistema de Usuarios y Roles**
- **7 tipos de usuario**: estudiante, docente, directivo, apoderado, encargado de convivencia, asistente, administrativo
- Perfiles extendidos con datos específicos del colegio
- Integración con sistema de autenticación Django

#### 🏫 **Panel de Administración**
- Interfaz completa para gestión de todos los modelos
- Acciones masivas para cambio de estados
- Filtros y búsquedas en todas las secciones
- Inlines para evidencias en reportes

### 🎯 **Características Destacadas**

#### ⚖️ **Cumplimiento Legal**
- **Tipos de incidente** según Ley 20.536
- **Plazos de investigación** automáticos
- **Indicadores de denuncia** obligatoria
- **Seguimiento de resoluciones**

#### 🚨 **Sistema de Alertas**
- Identificación automática de **casos críticos**
- **Reportes vencidos** por plazo de investigación
- Clasificación por **urgencia** (baja, media, alta, crítica)
- **Dashboard de casos urgentes**

#### 📈 **Trazabilidad Completa**
- **Historial completo** de cada incidente
- **Evidencias** con tipos y confidencialidad
- **Resoluciones** con medidas formativas y sanciones
- **Seguimiento temporal** con fechas clave

### 🛠️ **Tecnologías Utilizadas**
- **Backend**: Django 4.2 + Django REST Framework
- **Base de Datos**: SQLite (desarrollo) / MySQL (producción)
- **Autenticación**: JWT + Django Auth
- **Filtros**: django-filter
- **Documentación**: Swagger automático (DRF)

### 📊 **Datos de Prueba Incluidos**
- **2 colegios** con RBD reales
- **5 tipos de incidente** comunes
- **4 usuarios** con roles diferentes
- **3 medidas formativas** y **3 sanciones** de ejemplo
- **2 reportes de incidente** con diferentes características

## 🔗 **URLs de la API**

### Endpoints Principales
- `GET /api/` - Listado de endpoints disponibles
- `GET /api/graphs/` - Métricas y estadísticas
- `GET /api/colegios/` - Gestión de colegios
- `GET /api/reportes/` - Reportes de incidentes
- `GET /api/tipos-incidente/` - Tipos de incidentes
- `GET /api/usuarios/` - Perfiles de usuarios
- `GET /api/medidas-formativas/` - Catálogo de medidas
- `GET /api/sanciones/` - Catálogo de sanciones
- `GET /api/evidencias/` - Evidencias
- `GET /api/resoluciones/` - Resoluciones

### Endpoints Especiales
- `GET /api/reportes/urgentes/` - Casos críticos/vencidos
- `POST /api/reportes/{id}/cambiar_estado/` - Cambiar estado de reporte
- `GET /api/colegios/{id}/reportes/` - Reportes de un colegio

### Panel de Administración
- `GET /admin/` - Panel completo de administración
- **Usuario**: admin / **Contraseña**: admin123

## 🚀 **Para Ejecutar el Sistema**

```bash
# 1. Activar entorno virtual
cd backend
.\.venv\Scripts\Activate.ps1

# 2. Instalar dependencias (ya instaladas)
pip install -r requirements.txt

# 3. Ejecutar migraciones (ya ejecutadas)
python manage.py migrate

# 4. Cargar datos de prueba (ya cargados)
python create_test_data.py

# 5. Iniciar servidor
python manage.py runserver
```

## 📋 **Próximos Pasos Sugeridos**

### 1. **Frontend React** 🖥️
- Formulario de reporte de incidentes
- Dashboard con gráficos
- Panel de gestión para encargados
- Notificaciones en tiempo real

### 2. **Sistema de Notificaciones** 📧
- Email a apoderados en casos graves
- Alertas automáticas por plazos vencidos
- Notificaciones a directivos por casos críticos

### 3. **Reportes Avanzados** 📊
- Reportes para MINEDUC
- Estadísticas por período
- Gráficos de tendencias
- Exportación a PDF/Excel

### 4. **Seguridad y Permisos** 🔒
- Permisos granulares por rol
- Logs de auditoría
- Cifrado de datos sensibles
- Anonimización de reportes

### 5. **Integraciones** 🔗
- API MINEDUC
- Sistema de mensajería (WhatsApp/SMS)
- Integración con sistemas académicos existentes

## 🎓 **Marco Legal Chileno Considerado**

- **Ley N° 20.536** sobre Violencia Escolar
- **Política Nacional de Convivencia Escolar** MINEDUC
- **Protocolos de actuación** según gravedad
- **Plazos legales** de investigación
- **Medidas formativas** vs sanciones
- **Derechos del estudiante** y debido proceso

---

**Estado del Proyecto**: ✅ **Backend Completo y Funcional**  
**URL del Sistema**: http://127.0.0.1:8000/  
**Documentación API**: http://127.0.0.1:8000/api/  
**Panel Admin**: http://127.0.0.1:8000/admin/