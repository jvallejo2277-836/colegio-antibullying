from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta


class Colegio(models.Model):
    """Establecimiento educacional"""
    nombre = models.CharField(max_length=255)
    rbd = models.CharField(
        max_length=20, unique=True,
        help_text="Rol Base de Datos MINEDUC")
    direccion = models.TextField(blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    director = models.CharField(max_length=255, blank=True)
    encargado_convivencia = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} (RBD: {self.rbd})"

    class Meta:
        verbose_name = "Colegio"
        verbose_name_plural = "Colegios"


class TipoIncidente(models.Model):
    """Tipos de incidentes según Ley 20.536 y normativas MINEDUC"""
    CATEGORIA_CHOICES = [
        ('bullying', 'Acoso Escolar/Bullying'),
        ('violencia_fisica', 'Violencia Física'),
        ('violencia_psicologica', 'Violencia Psicológica'),
        ('discriminacion', 'Discriminación'),
        ('abuso_sexual', 'Abuso Sexual'),
        ('consumo_drogas', 'Consumo de Drogas/Alcohol'),
        ('porte_armas', 'Porte de Armas'),
        ('vandalismo', 'Vandalismo'),
        ('ciberacoso', 'Ciberacoso'),
        ('otro', 'Otro'),
    ]

    GRAVEDAD_CHOICES = [
        ('leve', 'Leve'),
        ('grave', 'Grave'),
        ('muy_grave', 'Muy Grave'),
    ]

    nombre = models.CharField(max_length=255)
    categoria = models.CharField(max_length=30, choices=CATEGORIA_CHOICES)
    gravedad = models.CharField(max_length=15, choices=GRAVEDAD_CHOICES)
    descripcion = models.TextField()
    requiere_denuncia = models.BooleanField(
        default=False, help_text="Requiere denuncia a autoridades")
    plazo_investigacion_dias = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} ({self.get_gravedad_display()})"

    class Meta:
        verbose_name = "Tipo de Incidente"
        verbose_name_plural = "Tipos de Incidente"


class PerfilUsuario(models.Model):
    """Extensión del modelo User para datos específicos del colegio"""
    TIPO_USUARIO_CHOICES = [
        ('estudiante', 'Estudiante'),
        ('docente', 'Docente'),
        ('directivo', 'Directivo'),
        ('apoderado', 'Apoderado'),
        ('encargado_convivencia', 'Encargado de Convivencia'),
        ('asistente', 'Asistente de la Educación'),
        ('administrativo', 'Administrativo'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE)
    tipo_usuario = models.CharField(
        max_length=25, choices=TIPO_USUARIO_CHOICES)
    rut = models.CharField(max_length=12, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    
    # Campos específicos para estudiantes
    curso = models.CharField(
        max_length=10, blank=True, help_text="Ej: 8°A, 3° Medio")
    
    # Campos específicos para apoderados
    estudiantes_a_cargo = models.ManyToManyField(
        'self', blank=True, symmetrical=False)

    def __str__(self):
        return (f"{self.user.get_full_name()} - "
                f"{self.get_tipo_usuario_display()}")

    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuario"


class IncidentReport(models.Model):
    """Reporte de incidente de convivencia escolar"""
    STATUS_CHOICES = [
        ('recibido', 'Recibido'),
        ('en_investigacion', 'En Investigación'),
        ('resuelto', 'Resuelto'),
        ('cerrado', 'Cerrado'),
        ('derivado', 'Derivado a Autoridades'),
    ]

    URGENCIA_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('critica', 'Crítica'),
    ]

    # Información básica
    colegio = models.ForeignKey(
        Colegio, on_delete=models.CASCADE, related_name='reportes')
    tipo_incidente = models.ForeignKey(TipoIncidente, on_delete=models.PROTECT)
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_incidente = models.DateTimeField()
    lugar_incidente = models.CharField(
        max_length=255, help_text="Sala, patio, baño, etc.")
    
    # Personas involucradas
    estudiantes_involucrados = models.ManyToManyField(
        PerfilUsuario,
        related_name='incidentes_involucrado', blank=True,
        limit_choices_to={'tipo_usuario': 'estudiante'})
    testigos = models.ManyToManyField(
        PerfilUsuario,
        related_name='incidentes_testigo', blank=True)
    
    # Información del reporte
    reportero = models.ForeignKey(
        PerfilUsuario, on_delete=models.PROTECT,
        related_name='reportes_realizados', null=True, blank=True)
    anonimo = models.BooleanField(default=False)
    reportero_externo_nombre = models.CharField(
        max_length=255, blank=True,
        help_text="Si el reportero no está en el sistema")
    reportero_externo_contacto = models.CharField(max_length=255, blank=True)
    
    # Estado y seguimiento
    estado = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='recibido')
    urgencia = models.CharField(
        max_length=15, choices=URGENCIA_CHOICES, default='media')
    asignado_a = models.ForeignKey(
        PerfilUsuario, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='casos_asignados',
        limit_choices_to={
            'tipo_usuario__in': ['encargado_convivencia', 'directivo']})
    
    # Fechas importantes
    created_at = models.DateTimeField(auto_now_add=True)
    fecha_limite_investigacion = models.DateTimeField(null=True, blank=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    
    # Seguimiento legal
    requiere_denuncia = models.BooleanField(default=False)
    fecha_denuncia = models.DateTimeField(null=True, blank=True)
    numero_denuncia = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        if not self.fecha_limite_investigacion and self.tipo_incidente:
            self.fecha_limite_investigacion = (
                self.created_at +
                timedelta(days=self.tipo_incidente.plazo_investigacion_dias))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.titulo} - {self.get_estado_display()}"

    class Meta:
        verbose_name = "Reporte de Incidente"
        verbose_name_plural = "Reportes de Incidente"
        ordering = ['-created_at']


class MedidaFormativa(models.Model):
    """Catálogo de medidas formativas según normativa"""
    TIPO_CHOICES = [
        ('dialogo_reflexivo', 'Diálogo Reflexivo'),
        ('trabajo_comunitario', 'Trabajo Comunitario'),
        ('reparacion_dano', 'Reparación del Daño'),
        ('mediacion', 'Mediación'),
        ('taller_formativo', 'Taller Formativo'),
        ('seguimiento_psicosocial', 'Seguimiento Psicosocial'),
        ('compromiso_conductual', 'Compromiso Conductual'),
        ('otro', 'Otro'),
    ]

    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=25, choices=TIPO_CHOICES)
    descripcion = models.TextField()
    duracion_estimada_horas = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Medida Formativa"
        verbose_name_plural = "Medidas Formativas"


class Sancion(models.Model):
    """Catálogo de sanciones disciplinarias"""
    TIPO_CHOICES = [
        ('amonestacion_verbal', 'Amonestación Verbal'),
        ('amonestacion_escrita', 'Amonestación Escrita'),
        ('suspension_clases', 'Suspensión de Clases'),
        ('prohibicion_actividades', 'Prohibición de Actividades'),
        ('condicionalidad_matricula', 'Condicionalidad de Matrícula'),
        ('cancelacion_matricula', 'Cancelación de Matrícula'),
        ('no_renovacion_matricula', 'No Renovación de Matrícula'),
    ]

    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    descripcion = models.TextField()
    dias_duracion = models.PositiveIntegerField(
        default=1, help_text="Duración en días (si aplica)")
    
    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Sanción"
        verbose_name_plural = "Sanciones"


class ResolucionIncidente(models.Model):
    """Resolución aplicada a un incidente"""
    incidente = models.OneToOneField(
        IncidentReport, on_delete=models.CASCADE, related_name='resolucion')
    
    # Medidas aplicadas
    medidas_formativas = models.ManyToManyField(MedidaFormativa, blank=True)
    sanciones = models.ManyToManyField(Sancion, blank=True)
    
    # Detalles de la resolución
    fundamentacion = models.TextField(
        help_text="Fundamentos de la resolución")
    fecha_resolucion = models.DateTimeField()
    resuelto_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT)
    
    # Seguimiento
    requiere_seguimiento = models.BooleanField(default=True)
    fecha_seguimiento = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Resolución {self.incidente.titulo}"

    class Meta:
        verbose_name = "Resolución de Incidente"
        verbose_name_plural = "Resoluciones de Incidente"


class Evidence(models.Model):
    """Evidencias asociadas a un incidente"""
    TIPO_EVIDENCIA_CHOICES = [
        ('documento', 'Documento'),
        ('foto', 'Fotografía'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('testimonio', 'Testimonio Escrito'),
        ('otro', 'Otro'),
    ]

    reporte = models.ForeignKey(
        IncidentReport, on_delete=models.CASCADE, related_name='evidencias')
    tipo_evidencia = models.CharField(
        max_length=15, choices=TIPO_EVIDENCIA_CHOICES, default='documento')
    archivo = models.FileField(upload_to='evidencias/', null=True, blank=True)
    descripcion = models.CharField(max_length=255)
    testimonio_texto = models.TextField(
        blank=True, help_text="Para testimonios escritos")
    subido_por = models.ForeignKey(
        PerfilUsuario, on_delete=models.PROTECT, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    es_confidencial = models.BooleanField(default=False)

    def __str__(self):
        return (f"Evidencia {self.get_tipo_evidencia_display()} - "
                f"{self.reporte.titulo}")

    class Meta:
        verbose_name = "Evidencia"
        verbose_name_plural = "Evidencias"