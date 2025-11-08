from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import timedelta


class CustomUser(AbstractUser):
    """Usuario personalizado con roles para el sistema antibullying"""
    ROLE_CHOICES = [
        ('admin', 'Administrador del Sistema'),
        ('sostenedor', 'Sostenedor'),
        ('director', 'Director'),
        ('encargado_convivencia', 'Encargado de Convivencia Escolar'),
        ('inspector', 'Inspector General'),
        ('profesor', 'Profesor'),
        ('orientador', 'Orientador'),
        ('apoderado', 'Apoderado'),
        ('auxiliar', 'Personal de Apoyo/Auxiliar'),
    ]
    
    role = models.CharField(
        max_length=25, 
        choices=ROLE_CHOICES, 
        default='encargado_convivencia'
    )
    colegio = models.ForeignKey(
        'Colegio', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        help_text="Colegio al que pertenece el usuario (para roles de colegio específico)"
    )
    telefono = models.CharField(max_length=20, blank=True)
    rut = models.CharField(max_length=20, unique=True, null=True, blank=True)
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
    
    @property
    def es_admin(self):
        """Verifica si el usuario es administrador del sistema"""
        return self.role == 'admin'
    
    @property
    def es_sostenedor(self):
        """Verifica si el usuario es sostenedor"""
        return self.role == 'sostenedor'
    
    @property
    def puede_ver_todos_colegios(self):
        """Verifica si el usuario puede ver datos de todos los colegios"""
        return self.role in ['admin', 'sostenedor']
    
    @property
    def puede_crear_reportes(self):
        """Verifica si el usuario puede crear reportes de incidentes"""
        return self.role in ['encargado_convivencia', 'inspector', 'profesor', 'director']
    
    @property
    def puede_gestionar_usuarios(self):
        """Verifica si el usuario puede gestionar otros usuarios"""
        return self.role in ['admin', 'director']
    
    @property
    def puede_gestionar_protocolos(self):
        """Verifica si el usuario puede gestionar protocolos y procedimientos"""
        return self.role in ['admin', 'director', 'encargado_convivencia']
    
    @property
    def puede_ver_reportes_confidenciales(self):
        """Verifica si puede ver reportes con información confidencial"""
        return self.role in ['admin', 'director', 'encargado_convivencia']
    
    def get_colegios_permitidos(self):
        """Retorna los colegios a los que el usuario tiene acceso"""
        if self.es_admin:
            return Colegio.objects.all()
        elif self.colegio:
            # Usuarios de colegio específico
            return Colegio.objects.filter(id=self.colegio.id)
        else:
            return Colegio.objects.none()
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


class Colegio(models.Model):
    """Establecimiento educacional"""
    nombre = models.CharField(max_length=255)
    rbd = models.CharField(
        max_length=20, unique=True, null=True, blank=True,
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
    """Tipos de incidentes - Sistema híbrido: categorías legales fijas + personalizables por colegio"""
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

    # Categorías que NO pueden ser eliminadas (definidas por ley)
    CATEGORIAS_LEGALES = [
        'bullying', 'violencia_fisica', 'violencia_psicologica', 
        'discriminacion', 'abuso_sexual', 'consumo_drogas', 
        'porte_armas', 'ciberacoso'
    ]

    nombre = models.CharField(max_length=255)
    categoria = models.CharField(max_length=30, choices=CATEGORIA_CHOICES)
    gravedad = models.CharField(max_length=15, choices=GRAVEDAD_CHOICES)
    descripcion = models.TextField()
    requiere_denuncia = models.BooleanField(default=False, help_text="Requiere denuncia a autoridades")
    plazo_investigacion_dias = models.PositiveIntegerField(default=5)
    
    # Campos para el sistema híbrido
    es_categoria_legal = models.BooleanField(
        default=False,
        help_text="Indica si es una categoría definida por normativa legal (no editable)"
    )
    colegio = models.ForeignKey(
        'Colegio', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        help_text="Colegio específico. NULL = aplica a todos los colegios (categorías base)"
    )
    activo = models.BooleanField(default=True)
    protocolo_especifico = models.TextField(
        blank=True,
        help_text="Protocolo específico del colegio para este tipo de incidente"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def es_editable(self):
        """Verifica si el tipo puede ser editado (no es categoría legal)"""
        return not self.es_categoria_legal

    @property 
    def icono_estado(self):
        """Retorna el icono según si es editable o no"""
        return "🔒" if self.es_categoria_legal else "✏️"

    @property
    def puede_eliminar(self):
        """Verifica si el tipo puede ser eliminado"""
        # No se pueden eliminar categorías legales
        if self.es_categoria_legal:
            return False
        # No se puede eliminar si ya hay incidentes reportados con este tipo
        return not self.incidentreport_set.exists()

    def clean(self):
        """Validaciones del modelo"""
        from django.core.exceptions import ValidationError
        
        # Validar que categorías legales no se marquen como específicas de colegio
        if self.es_categoria_legal and self.colegio:
            raise ValidationError(
                "Las categorías legales no pueden ser específicas de un colegio"
            )
        
        # Validar plazo de investigación dentro de rango legal
        if self.plazo_investigacion_dias < 1 or self.plazo_investigacion_dias > 15:
            raise ValidationError(
                "El plazo de investigación debe estar entre 1 y 15 días"
            )

    def save(self, *args, **kwargs):
        # Auto-detectar si es categoría legal
        if self.categoria in self.CATEGORIAS_LEGALES:
            self.es_categoria_legal = True
            self.colegio = None  # Categorías legales no tienen colegio específico
        
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        colegio_info = f" ({self.colegio.nombre})" if self.colegio else ""
        return f"{self.icono_estado} {self.nombre}{colegio_info}"

    class Meta:
        verbose_name = "Tipo de Incidente"
        verbose_name_plural = "Tipos de Incidente"
        unique_together = [
            ['nombre', 'colegio'],  # Evitar duplicados por colegio
        ]
        indexes = [
            models.Index(fields=['categoria', 'colegio']),
            models.Index(fields=['es_categoria_legal']),
        ]


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

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE)
    tipo_usuario = models.CharField(max_length=25, choices=TIPO_USUARIO_CHOICES)
    rut = models.CharField(max_length=12, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    
    # Campos específicos para estudiantes
    curso = models.CharField(max_length=10, blank=True, help_text="Ej: 8°A, 3° Medio")
    
    # Campos específicos para apoderados
    estudiantes_a_cargo = models.ManyToManyField('self', blank=True, symmetrical=False)
    
    # Campos específicos para Encargado de Convivencia Escolar (según normativa)
    PROFESION_CHOICES = [
        ('educacion', 'Profesional de la Educación'),
        ('psicologia', 'Psicólogo(a)'),
        ('trabajo_social', 'Trabajador(a) Social'),
        ('psicopedagogia', 'Psicopedagogo(a)'),
        ('orientacion', 'Orientador(a)'),
        ('otra', 'Otra Profesión Afín'),
    ]
    profesion = models.CharField(max_length=20, choices=PROFESION_CHOICES, blank=True)
    numero_registro_profesional = models.CharField(max_length=50, blank=True, 
        help_text="Número de registro en colegio profesional")
    jornada_laboral_horas = models.PositiveIntegerField(null=True, blank=True,
        help_text="Horas semanales de dedicación (mínimo 44h según normativa)")
    fecha_nombramiento = models.DateField(null=True, blank=True,
        help_text="Fecha de nombramiento como Encargado de Convivencia")
    
    # Capacitaciones y certificaciones (según Art. 15 Ley 20.536)
    certificacion_convivencia_escolar = models.BooleanField(default=False,
        help_text="¿Tiene certificación en convivencia escolar?")
    fecha_ultima_capacitacion = models.DateField(null=True, blank=True)
    instituciones_capacitacion = models.TextField(blank=True,
        help_text="Instituciones donde recibió capacitación")
    
    # Contacto de emergencia institucional
    email_institucional = models.EmailField(blank=True)
    telefono_emergencia = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_tipo_usuario_display()}"

    @property
    def es_encargado_convivencia(self):
        """Verifica si el usuario es Encargado de Convivencia Escolar"""
        return self.tipo_usuario == 'encargado_convivencia'
    
    @property
    def cumple_requisitos_encargado(self):
        """Verifica si cumple los requisitos legales para ser Encargado de Convivencia"""
        if not self.es_encargado_convivencia:
            return False
        
        # Verificar jornada mínima (44 horas según normativa)
        if not self.jornada_laboral_horas or self.jornada_laboral_horas < 44:
            return False
            
        # Verificar profesión adecuada
        if not self.profesion:
            return False
            
        return True
    
    @property
    def puede_resolver_casos_graves(self):
        """Verifica si puede resolver casos graves según normativa"""
        return (self.es_encargado_convivencia and 
                self.cumple_requisitos_encargado and
                self.certificacion_convivencia_escolar)
    
    def get_casos_asignados_pendientes(self):
        """Obtiene casos asignados pendientes de resolución"""
        return IncidentReport.objects.filter(
            asignado_a=self,
            estado__in=['recibido', 'en_investigacion']
        ).order_by('fecha_limite_investigacion')
    
    def get_casos_urgentes(self):
        """Obtiene casos asignados con urgencia alta o crítica"""
        return self.get_casos_asignados_pendientes().filter(
            urgencia__in=['alta', 'critica']
        )
    
    def get_casos_proximos_vencimiento(self, dias=2):
        """Obtiene casos próximos al vencimiento"""
        from django.utils import timezone
        fecha_limite = timezone.now() + timedelta(days=dias)
        return self.get_casos_asignados_pendientes().filter(
            fecha_limite_investigacion__lte=fecha_limite
        )

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
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE, related_name='reportes')
    tipo_incidente = models.ForeignKey(TipoIncidente, on_delete=models.PROTECT)
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_incidente = models.DateTimeField()
    lugar_incidente = models.CharField(max_length=255, help_text="Sala, patio, baño, etc.")
    
    # Personas involucradas
    estudiantes_involucrados = models.ManyToManyField(PerfilUsuario, 
        related_name='incidentes_involucrado', blank=True,
        limit_choices_to={'tipo_usuario': 'estudiante'})
    testigos = models.ManyToManyField(PerfilUsuario, 
        related_name='incidentes_testigo', blank=True)
    
    # Información del reporte - Registro del denunciante
    reportero = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT,
                                  related_name='reportes_realizados',
                                  null=True, blank=True)  # Temporal para migración
    
    # Sistema de anonimato controlado
    solicita_anonimato = models.BooleanField(default=False)
    NIVEL_ANONIMATO_CHOICES = [
        ('publico', 'Público - Mi identidad puede ser conocida'),
        ('restringido', 'Restringido - Solo autoridades del colegio'),
        ('confidencial', 'Confidencial - Solo Encargado de Convivencia'),
        ('judicial', 'Judicial - Solo para efectos legales'),
    ]
    nivel_anonimato = models.CharField(
        max_length=20, choices=NIVEL_ANONIMATO_CHOICES, default='publico')
    justificacion_anonimato = models.TextField(
        blank=True, help_text="¿Por qué solicita anonimato?")
    
    # Campos legacy para compatibilidad
    anonimo = models.BooleanField(default=False)  # Deprecated
    reportero_externo_nombre = models.CharField(
        max_length=255, blank=True,
        help_text="Si el reportero no está en el sistema")
    reportero_externo_contacto = models.CharField(max_length=255, blank=True)
    
    # Estado y seguimiento
    estado = models.CharField(max_length=20, choices=STATUS_CHOICES, default='recibido')
    urgencia = models.CharField(max_length=15, choices=URGENCIA_CHOICES, default='media')
    asignado_a = models.ForeignKey(PerfilUsuario, on_delete=models.SET_NULL, 
        null=True, blank=True, related_name='casos_asignados',
        limit_choices_to={'tipo_usuario__in': ['encargado_convivencia', 'directivo']})
    
    # Fechas importantes
    created_at = models.DateTimeField(auto_now_add=True)
    fecha_limite_investigacion = models.DateTimeField(null=True, blank=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    
    # Seguimiento legal
    requiere_denuncia = models.BooleanField(default=False)
    fecha_denuncia = models.DateTimeField(null=True, blank=True)
    numero_denuncia = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        # Sincronizar campo legacy
        if self.solicita_anonimato and not self.anonimo:
            self.anonimo = True
        elif not self.solicita_anonimato and self.anonimo:
            self.anonimo = False
            
        if not self.fecha_limite_investigacion and self.tipo_incidente:
            # Si es un nuevo objeto, usar fecha_incidente como base
            base_date = self.created_at or self.fecha_incidente
            self.fecha_limite_investigacion = base_date + timedelta(
                days=self.tipo_incidente.plazo_investigacion_dias)
        
        # Verificar si es primera vez que se guarda
        es_nuevo = self.pk is None
        
        super().save(*args, **kwargs)
        
        if es_nuevo:
            # Iniciar proceso automáticamente si es nuevo
            if not hasattr(self, 'proceso'):
                self.iniciar_proceso_automatico()
            
            # Verificar denuncia obligatoria según Ley 20.536
            self.verificar_denuncia_obligatoria()
            
            # Crear alertas legales automáticas
            AlertaLegal.crear_alertas_automaticas(self)
    
    def verificar_denuncia_obligatoria(self):
        """Verifica si requiere denuncia obligatoria según Art. 16 D Ley 20.536"""
        delitos_que_requieren_denuncia = [
            'abuso_sexual',
            'porte_armas', 
            'trafico_drogas',
            'violencia_fisica'  # Si constituye lesiones
        ]
        
        # Verificar por categoría del tipo de incidente
        if (self.tipo_incidente.categoria in delitos_que_requieren_denuncia or
            self.tipo_incidente.requiere_denuncia):
            
            # Determinar tipos de delito específicos
            tipos_delito = []
            
            if self.tipo_incidente.categoria == 'abuso_sexual':
                tipos_delito.append('abuso_sexual')
            elif self.tipo_incidente.categoria == 'porte_armas':
                tipos_delito.append('porte_armas')
            elif self.tipo_incidente.categoria == 'consumo_drogas':
                tipos_delito.append('trafico_drogas')
            elif self.tipo_incidente.categoria == 'violencia_fisica':
                tipos_delito.append('lesiones')
            elif 'amenaza' in self.descripcion.lower():
                tipos_delito.append('amenazas')
            elif 'robo' in self.descripcion.lower():
                tipos_delito.append('robos')
            elif 'hurto' in self.descripcion.lower():
                tipos_delito.append('hurtos')
            
            # Buscar denunciante institucional apropiado
            denunciante = self.asignado_a
            if not denunciante or denunciante.tipo_usuario not in ['directivo', 'encargado_convivencia']:
                denunciante = self.get_encargado_convivencia()
            
            # Si no hay encargado de convivencia, buscar cualquier directivo del colegio
            if not denunciante:
                denunciante = self.get_directivo_colegio()
            
            # Crear registro de denuncia obligatoria
            DenunciaObligatoria.objects.get_or_create(
                incidente=self,
                defaults={
                    'es_constitutivo_delito': True,
                    'tipos_delito': tipos_delito,
                    'fecha_conocimiento': self.created_at,
                    'denunciante_institucional': denunciante
                }
            )
    
    def get_encargado_convivencia(self):
        """Obtiene el Encargado de Convivencia del colegio"""
        try:
            return PerfilUsuario.objects.get(
                colegio=self.colegio,
                tipo_usuario='encargado_convivencia'
            )
        except PerfilUsuario.DoesNotExist:
            return None
    
    def get_directivo_colegio(self):
        """Obtiene cualquier directivo del colegio"""
        try:
            return PerfilUsuario.objects.filter(
                colegio=self.colegio,
                tipo_usuario='directivo'
            ).first()
        except PerfilUsuario.DoesNotExist:
            return None
    
    def es_acoso_escolar_segun_ley(self):
        """Evalúa si cumple definición de acoso escolar según Art. 16 A Ley 20.536"""
        # Criterios según definición legal:
        # 1. Agresión u hostigamiento reiterado
        # 2. Por estudiantes contra otro estudiante
        # 3. Situación de superioridad o indefensión
        # 4. Provoque maltrato, humillación o temor
        
        criterios_cumplidos = 0
        
        # 1. Verificar reiteración (otros incidentes similares en últimos 30 días)
        incidentes_similares = IncidentReport.objects.filter(
            colegio=self.colegio,
            estudiantes_involucrados__in=self.estudiantes_involucrados.all(),
            created_at__gte=self.created_at - timedelta(days=30)
        ).exclude(id=self.id).count()
        
        if incidentes_similares > 0:
            criterios_cumplidos += 1
        
        # 2. Verificar que son estudiantes
        if (self.estudiantes_involucrados.filter(tipo_usuario='estudiante').count() >= 2):
            criterios_cumplidos += 1
        
        # 3. Verificar situación de superioridad (por descripción o contexto)
        palabras_clave_superioridad = [
            'mayor', 'más grande', 'grupo contra', 'varios contra uno',
            'intimidación', 'abuso de poder', 'aprovecharse'
        ]
        if any(palabra in self.descripcion.lower() for palabra in palabras_clave_superioridad):
            criterios_cumplidos += 1
        
        # 4. Verificar efecto negativo
        palabras_clave_dano = [
            'humillación', 'maltrato', 'miedo', 'temor', 'angustia',
            'tristeza', 'no quiere venir', 'pesadillas'
        ]
        if any(palabra in self.descripcion.lower() for palabra in palabras_clave_dano):
            criterios_cumplidos += 1
        
        # Se considera acoso escolar si cumple al menos 3 de los 4 criterios
        return criterios_cumplidos >= 3
    
    def get_clasificacion_legal(self):
        """Obtiene clasificación legal según Ley 20.536"""
        if self.es_acoso_escolar_segun_ley():
            return 'acoso_escolar'
        elif self.tipo_incidente.requiere_denuncia:
            return 'constitutivo_delito'
        elif self.tipo_incidente.gravedad == 'muy_grave':
            return 'violencia_escolar_grave'
        else:
            return 'violencia_escolar_general'
    
    @property
    def cumple_ley_20536(self):
        """Verifica cumplimiento integral de Ley 20.536"""
        cumplimiento = {
            'denuncia_obligatoria': True,
            'notificacion_apoderado': False,
            'debido_proceso': False,
            'plazos_legales': False
        }
        
        # Verificar denuncia obligatoria
        if hasattr(self, 'denuncia_obligatoria'):
            cumplimiento['denuncia_obligatoria'] = (
                self.denuncia_obligatoria.fecha_denuncia_realizada is not None
            )
        
        # Verificar notificación a apoderado
        # (implementar según sistema de notificaciones)
        
        # Verificar debido proceso
        if hasattr(self, 'medidas_disciplinarias'):
            medidas = self.medidas_disciplinarias.all()
            if medidas.exists():
                cumplimiento['debido_proceso'] = all(
                    m.fecha_notificacion_apoderado is not None 
                    for m in medidas
                )
        
        return all(cumplimiento.values())

    def iniciar_proceso_automatico(self):
        """Inicia automáticamente el proceso según protocolo del colegio"""
        try:
            # Buscar protocolo según gravedad del tipo de incidente
            protocolo = ProtocoloProceso.objects.get(
                colegio=self.colegio,
                gravedad=self.tipo_incidente.gravedad,
                activo=True
            )
            
            # Crear proceso
            proceso = ProcesoIncidente.objects.create(
                incidente=self,
                protocolo=protocolo
            )
            
            # Iniciar el proceso
            proceso.iniciar_proceso()
            
        except ProtocoloProceso.DoesNotExist:
            # Si no hay protocolo configurado, continuar sin proceso
            pass

    def puede_ver_identidad_denunciante(self, usuario_solicitante):
        """Verifica si un usuario puede ver la identidad del denunciante"""
        # Si no solicita anonimato, todos pueden ver
        if not self.solicita_anonimato:
            return True
            
        # Si es el mismo denunciante, siempre puede ver
        if usuario_solicitante == self.reportero:
            return True
            
        # Verificar reglas del colegio
        try:
            regla = ReglasAnonimato.objects.get(
                colegio=self.colegio,
                nivel_anonimato=self.nivel_anonimato
            )
            
            # Verificar si su rol tiene acceso automático
            roles_permitidos = [r.strip() for r in 
                                regla.roles_con_acceso.split(',')]
            if usuario_solicitante.tipo_usuario in roles_permitidos:
                return True
                
        except ReglasAnonimato.DoesNotExist:
            pass
            
        # Verificar si tiene acceso específicamente otorgado
        return AccesoIdentidadDenunciante.objects.filter(
            incidente=self,
            usuario_autorizado=usuario_solicitante,
            activo=True
        ).exists()

    def registrar_acceso_identidad(self, usuario_que_accede, motivo=''):
        """Registra cuando alguien accede a ver la identidad"""
        if not self.solicita_anonimato:
            return  # No es necesario registrar si no es anónimo
            
        acceso, created = AccesoIdentidadDenunciante.objects.get_or_create(
            incidente=self,
            usuario_autorizado=usuario_que_accede,
            defaults={
                'tipo_acceso': 'automatico',
                'autorizado_por': usuario_que_accede,
                'motivo': motivo
            }
        )
        
        # Registrar el acceso
        acceso.registrar_acceso()

    @property
    def identidad_denunciante_protegida(self):
        """Devuelve información del denunciante según nivel de anonimato"""
        if not self.solicita_anonimato:
            return {
                'visible': True,
                'nombre': self.reportero.user.get_full_name(),
                'email': self.reportero.user.email,
                'tipo': self.reportero.get_tipo_usuario_display()
            }
        else:
            return {
                'visible': False,
                'nivel_proteccion': self.get_nivel_anonimato_display(),
                'justificacion': self.justificacion_anonimato,
                'requiere_autorizacion': True
            }

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
        ('prohibicion_actividades', 'Prohibición de Actividades Extracurriculares'),
        ('condicionalidad_matricula', 'Condicionalidad de Matrícula'),
        ('cancelacion_matricula', 'Cancelación de Matrícula'),
        ('no_renovacion_matricula', 'No Renovación de Matrícula'),
    ]

    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    descripcion = models.TextField()
    dias_duracion = models.PositiveIntegerField(default=1, 
        help_text="Duración en días (si aplica)")
    
    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Sanción"
        verbose_name_plural = "Sanciones"


class ResolucionIncidente(models.Model):
    """Resolución aplicada a un incidente"""
    incidente = models.OneToOneField(IncidentReport, on_delete=models.CASCADE, 
        related_name='resolucion')
    
    # Medidas aplicadas
    medidas_formativas = models.ManyToManyField(MedidaFormativa, blank=True)
    sanciones = models.ManyToManyField(Sancion, blank=True)
    
    # Detalles de la resolución
    fundamentacion = models.TextField(help_text="Fundamentos de la resolución")
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


def validar_archivo_evidencia(archivo):
    """Valida tipos de archivo y tamaño para evidencias"""
    from django.core.exceptions import ValidationError
    
    # Tipos de archivo permitidos por categoría
    EXTENSIONES_PERMITIDAS = {
        'documento': [
            'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt',
            'xls', 'xlsx', 'ppt', 'pptx'
        ],
        'foto': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'],
        'video': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', '3gp'],
        'audio': ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'],
        'otro': []  # Permitir cualquier tipo para "otro"
    }
    
    # Tamaño máximo: 50MB
    MAX_SIZE = 50 * 1024 * 1024
    
    if archivo.size > MAX_SIZE:
        raise ValidationError(
            f'El archivo es demasiado grande. '
            f'Tamaño máximo permitido: 50MB'
        )
    
    # Obtener extensión
    ext = archivo.name.split('.')[-1].lower() if '.' in archivo.name else ''
    
    # Validar extensión según tipo (si no es "otro")
    # Esta validación se hará en el serializer donde tenemos el tipo
    
    return archivo


def evidencia_upload_path(instance, filename):
    """Genera path único para archivos de evidencia"""
    import os
    from django.utils import timezone
    
    # Obtener extensión del archivo
    ext = filename.split('.')[-1].lower() if '.' in filename else 'bin'
    
    # Generar nombre único con timestamp
    timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
    tipo = instance.tipo_evidencia
    reporte_id = instance.reporte.id
    nuevo_nombre = f"{tipo}_{timestamp}_{reporte_id}.{ext}"
    
    # Organizar por año/mes para mejor gestión
    fecha = timezone.now()
    return os.path.join(
        'evidencias',
        str(fecha.year),
        f"{fecha.month:02d}",
        nuevo_nombre
    )


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

    reporte = models.ForeignKey(IncidentReport, on_delete=models.CASCADE, related_name='evidencias')
    tipo_evidencia = models.CharField(max_length=15, choices=TIPO_EVIDENCIA_CHOICES, default='documento')
    archivo = models.FileField(upload_to=evidencia_upload_path, null=True, blank=True)
    descripcion = models.CharField(max_length=255)
    testimonio_texto = models.TextField(blank=True, help_text="Para testimonios escritos")
    subido_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    es_confidencial = models.BooleanField(default=False)

    @property
    def archivo_url(self):
        """Obtiene URL completa del archivo"""
        if self.archivo:
            return self.archivo.url
        return None
    
    @property
    def archivo_nombre_original(self):
        """Obtiene nombre de archivo legible"""
        if self.archivo:
            import os
            nombre = os.path.basename(self.archivo.name)
            # Remover timestamp del nombre para mostrar algo más amigable
            partes = nombre.split('_')
            if len(partes) >= 3:
                return f"{self.get_tipo_evidencia_display()}_{partes[-1]}"
            return nombre
        return "Sin archivo"
    
    @property
    def archivo_tamano_mb(self):
        """Obtiene tamaño del archivo en MB"""
        if self.archivo:
            return round(self.archivo.size / (1024 * 1024), 2)
        return 0

    def __str__(self):
        titulo = self.reporte.titulo[:30] + "..." if len(
            self.reporte.titulo) > 30 else self.reporte.titulo
        return f"Evidencia {self.get_tipo_evidencia_display()} - {titulo}"

    class Meta:
        verbose_name = "Evidencia"
        verbose_name_plural = "Evidencias"


# =============================================================================
# MODELOS ESPECÍFICOS LEY 20.536 SOBRE VIOLENCIA ESCOLAR
# =============================================================================

class ReglamentoInterno(models.Model):
    """Reglamento Interno según Art. 16 B de Ley 20.536"""
    colegio = models.OneToOneField(Colegio, on_delete=models.CASCADE,
                                   related_name='reglamento_interno')
    
    # Contenido mínimo obligatorio según Art. 16 B
    descripcion_conductas_violencia = models.TextField(
        help_text="Descripción precisa de conductas que constituyen violencia escolar")
    procedimientos_gestion_conflictos = models.TextField(
        help_text="Procedimientos para gestionar conflictos y situaciones de violencia")
    medidas_pedagogicas_convivencia = models.TextField(
        help_text="Diversas medidas pedagógicas que fomenten la buena convivencia")
    procedimiento_reconocimiento_positivo = models.TextField(
        help_text="Procedimiento de reconocimiento y reforzamiento de conductas positivas")
    protocolos_violencia_escolar = models.TextField(
        help_text="Protocolos de actuación para casos de violencia escolar")
    formas_participacion_comunidad = models.TextField(
        help_text="Diversas formas de participación de la comunidad educativa")
    programa_capacitacion = models.TextField(
        help_text="Programa de capacitación para docentes, asistentes y directivos")
    
    # Control de versiones y aprobación
    version = models.CharField(max_length=10)
    fecha_aprobacion_consejo_escolar = models.DateField()
    fecha_vigencia = models.DateField()
    vigente = models.BooleanField(default=True)
    
    # Archivo del reglamento
    archivo_reglamento = models.FileField(upload_to='reglamentos/', 
                                          null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Reglamento {self.colegio.nombre} v{self.version}"
    
    class Meta:
        verbose_name = "Reglamento Interno"
        verbose_name_plural = "Reglamentos Internos"


class DenunciaObligatoria(models.Model):
    """Denuncia obligatoria según Art. 16 D de Ley 20.536"""
    incidente = models.OneToOneField(IncidentReport, on_delete=models.CASCADE,
                                     related_name='denuncia_obligatoria')
    
    # Verificación automática de obligatoriedad
    es_constitutivo_delito = models.BooleanField(default=False)
    
    TIPOS_DELITO_CHOICES = [
        ('lesiones', 'Lesiones'),
        ('amenazas', 'Amenazas'),
        ('robos', 'Robos'),
        ('hurtos', 'Hurtos'),
        ('abuso_sexual', 'Abuso Sexual'),
        ('porte_armas', 'Porte o Tenencia Ilegal de Armas'),
        ('trafico_drogas', 'Tráfico de Sustancias Ilícitas'),
        ('otro_delito', 'Otro Delito'),
    ]
    tipos_delito = models.JSONField(default=list,
        help_text="Lista de tipos de delito identificados")
    
    # Cumplimiento Art. 16 D - Plazo 24 horas
    fecha_conocimiento = models.DateTimeField(
        help_text="Fecha en que se toma conocimiento del hecho")
    fecha_limite_denuncia = models.DateTimeField(
        help_text="Fecha límite para realizar denuncia (24h)")
    fecha_denuncia_realizada = models.DateTimeField(null=True, blank=True)
    
    # Autoridad competente según ley
    AUTORIDADES_CHOICES = [
        ('carabineros', 'Carabineros de Chile'),
        ('pdi', 'Policía de Investigaciones'),
        ('fiscalia', 'Fiscalía Local'),
        ('tribunal_familia', 'Tribunal de Familia'),
    ]
    autoridad_denunciada = models.CharField(max_length=20, 
                                            choices=AUTORIDADES_CHOICES,
                                            blank=True)
    numero_denuncia = models.CharField(max_length=100, blank=True)
    
    # Responsable de la denuncia
    denunciante_institucional = models.ForeignKey(PerfilUsuario, 
                                                  on_delete=models.PROTECT,
                                                  null=True, blank=True,
                                                  limit_choices_to={
                                                      'tipo_usuario__in': [
                                                          'directivo', 
                                                          'encargado_convivencia'
                                                      ]
                                                  })
    
    # Documentación
    documento_denuncia = models.FileField(upload_to='denuncias/', 
                                          null=True, blank=True)
    observaciones = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        if not self.fecha_limite_denuncia and self.fecha_conocimiento:
            self.fecha_limite_denuncia = (self.fecha_conocimiento + 
                                          timedelta(hours=24))
        super().save(*args, **kwargs)
    
    @property
    def esta_vencida(self):
        """Verifica si la denuncia está vencida según Art. 16 D"""
        from django.utils import timezone
        return (timezone.now() > self.fecha_limite_denuncia and 
                not self.fecha_denuncia_realizada)
    
    @property
    def horas_restantes(self):
        """Calcula horas restantes para cumplir con la ley"""
        from django.utils import timezone
        if self.fecha_denuncia_realizada:
            return 0
        delta = self.fecha_limite_denuncia - timezone.now()
        return max(0, int(delta.total_seconds() / 3600))
    
    def __str__(self):
        return f"Denuncia Obligatoria - {self.incidente.titulo}"
    
    class Meta:
        verbose_name = "Denuncia Obligatoria"
        verbose_name_plural = "Denuncias Obligatorias"


class MedidaDisciplinaria(models.Model):
    """Medidas disciplinarias según Art. 16 E de Ley 20.536"""
    incidente = models.ForeignKey(IncidentReport, on_delete=models.CASCADE,
                                  related_name='medidas_disciplinarias')
    
    # Cumplimiento Art. 16 E - Proporcionalidad
    GRAVEDAD_INFRACCION_CHOICES = [
        ('leve', 'Leve'),
        ('menos_grave', 'Menos Grave'), 
        ('grave', 'Grave'),
        ('gravisima', 'Gravísima'),
    ]
    gravedad_infraccion = models.CharField(max_length=15, 
                                           choices=GRAVEDAD_INFRACCION_CHOICES)
    
    # Debido proceso obligatorio
    fecha_notificacion_estudiante = models.DateTimeField()
    fecha_notificacion_apoderado = models.DateTimeField()
    plazo_descargos_dias = models.PositiveIntegerField(default=5)
    descargos_presentados = models.TextField(blank=True)
    fecha_presentacion_descargos = models.DateTimeField(null=True, blank=True)
    
    # Medida aplicada
    TIPO_MEDIDA_CHOICES = [
        ('amonestacion_verbal', 'Amonestación Verbal'),
        ('amonestacion_escrita', 'Amonestación Escrita'),
        ('suspension_temporal', 'Suspensión Temporal'),
        ('reduccion_jornada', 'Reducción de Jornada Escolar'),
        ('separacion_temporal', 'Separación Temporal de Actividades'),
        ('condicionalidad', 'Condicionalidad de Matrícula'),
        ('cancelacion_matricula', 'Cancelación de Matrícula'),
        ('no_renovacion', 'No Renovación de Matrícula'),
    ]
    tipo_medida = models.CharField(max_length=25, choices=TIPO_MEDIDA_CHOICES)
    descripcion_medida = models.TextField()
    duracion_dias = models.PositiveIntegerField(null=True, blank=True)
    
    # Proporcionalidad obligatoria
    fundamentacion_proporcionalidad = models.TextField(
        help_text="Fundamentación de la proporcionalidad de la medida")
    cumple_principio_proporcionalidad = models.BooleanField(default=True)
    
    # Apelación (derecho fundamental)
    permite_apelacion = models.BooleanField(default=True)
    plazo_apelacion_dias = models.PositiveIntegerField(default=5)
    fecha_limite_apelacion = models.DateTimeField(null=True, blank=True)
    
    # Proceso de apelación
    apelacion_presentada = models.BooleanField(default=False)
    fecha_apelacion = models.DateTimeField(null=True, blank=True)
    fundamentos_apelacion = models.TextField(blank=True)
    resolucion_apelacion = models.TextField(blank=True)
    apelacion_acogida = models.BooleanField(null=True, blank=True)
    
    # Aplicación de la medida
    fecha_inicio_aplicacion = models.DateField(null=True, blank=True)
    fecha_fin_aplicacion = models.DateField(null=True, blank=True)
    medida_cumplida = models.BooleanField(default=False)
    
    # Responsable
    aplicada_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT)
    
    def save(self, *args, **kwargs):
        if not self.fecha_limite_apelacion and self.fecha_notificacion_estudiante:
            self.fecha_limite_apelacion = (self.fecha_notificacion_estudiante + 
                                           timedelta(days=self.plazo_apelacion_dias))
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.get_tipo_medida_display()} - {self.incidente.titulo}"
    
    class Meta:
        verbose_name = "Medida Disciplinaria"
        verbose_name_plural = "Medidas Disciplinarias"


class AlertaLegal(models.Model):
    """Sistema de alertas para cumplimiento de plazos legales Ley 20.536"""
    
    TIPO_ALERTA_CHOICES = [
        ('denuncia_24h', 'Denuncia Obligatoria 24h'),
        ('notificacion_apoderado_48h', 'Notificación Apoderado 48h'),
        ('resolucion_caso_10d', 'Resolución de Caso 10 días'),
        ('seguimiento_medidas_30d', 'Seguimiento Medidas 30 días'),
        ('vencimiento_apelacion', 'Vencimiento Plazo Apelación'),
        ('reporte_mineduc', 'Reporte MINEDUC'),
    ]
    
    incidente = models.ForeignKey(IncidentReport, on_delete=models.CASCADE,
                                  related_name='alertas_legales')
    tipo_alerta = models.CharField(max_length=30, choices=TIPO_ALERTA_CHOICES)
    fecha_limite = models.DateTimeField()
    
    # Estado de la alerta
    ESTADO_ALERTA_CHOICES = [
        ('activa', 'Activa'),
        ('enviada', 'Enviada'),
        ('atendida', 'Atendida'),
        ('vencida', 'Vencida'),
    ]
    estado = models.CharField(max_length=15, choices=ESTADO_ALERTA_CHOICES,
                              default='activa')
    
    # Notificación
    destinatarios = models.ManyToManyField(PerfilUsuario, 
                                           related_name='alertas_recibidas')
    mensaje = models.TextField()
    enviada = models.BooleanField(default=False)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    @classmethod
    def crear_alertas_automaticas(cls, incidente):
        """Crea alertas automáticas según Ley 20.536"""
        
        # Alerta denuncia obligatoria (24h) si es delito
        if incidente.tipo_incidente.requiere_denuncia:
            cls.objects.create(
                incidente=incidente,
                tipo_alerta='denuncia_24h',
                fecha_limite=incidente.created_at + timedelta(hours=24),
                mensaje=f"URGENTE: Denuncia obligatoria en 24h - {incidente.titulo}"
            )
        
        # Alerta notificación apoderado (48h)
        cls.objects.create(
            incidente=incidente,
            tipo_alerta='notificacion_apoderado_48h',
            fecha_limite=incidente.created_at + timedelta(hours=48),
            mensaje=f"Notificar apoderado en 48h - {incidente.titulo}"
        )
        
        # Alerta resolución caso (10 días hábiles)
        cls.objects.create(
            incidente=incidente,
            tipo_alerta='resolucion_caso_10d',
            fecha_limite=incidente.created_at + timedelta(days=10),
            mensaje=f"Resolver caso en 10 días hábiles - {incidente.titulo}"
        )
    
    @property
    def esta_vencida(self):
        """Verifica si la alerta está vencida"""
        from django.utils import timezone
        return timezone.now() > self.fecha_limite
    
    def __str__(self):
        return f"{self.get_tipo_alerta_display()} - {self.incidente.titulo}"
    
    class Meta:
        verbose_name = "Alerta Legal"
        verbose_name_plural = "Alertas Legales"
        ordering = ['fecha_limite']


class CumplimientoLey20536(models.Model):
    """Monitoreo de cumplimiento de Ley 20.536 por colegio"""
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE,
                                related_name='cumplimiento_ley')
    periodo_inicio = models.DateField()
    periodo_fin = models.DateField()
    
    # Métricas de cumplimiento
    total_casos = models.PositiveIntegerField(default=0)
    casos_requieren_denuncia = models.PositiveIntegerField(default=0)
    denuncias_en_plazo = models.PositiveIntegerField(default=0)
    casos_notificados_plazo = models.PositiveIntegerField(default=0)
    casos_resueltos_plazo = models.PositiveIntegerField(default=0)
    medidas_proporcionales = models.PositiveIntegerField(default=0)
    debido_proceso_completo = models.PositiveIntegerField(default=0)
    
    # Porcentajes de cumplimiento
    porcentaje_denuncias_plazo = models.DecimalField(max_digits=5, 
                                                     decimal_places=2, 
                                                     default=0)
    porcentaje_notificaciones_plazo = models.DecimalField(max_digits=5, 
                                                          decimal_places=2, 
                                                          default=0)
    porcentaje_resoluciones_plazo = models.DecimalField(max_digits=5, 
                                                        decimal_places=2, 
                                                        default=0)
    porcentaje_debido_proceso = models.DecimalField(max_digits=5, 
                                                    decimal_places=2, 
                                                    default=0)
    
    # Cumplimiento general
    cumplimiento_general = models.DecimalField(max_digits=5, 
                                               decimal_places=2, 
                                               default=0)
    
    # Estado del reporte
    generado_automaticamente = models.BooleanField(default=True)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    
    def calcular_cumplimiento(self):
        """Calcula automáticamente las métricas de cumplimiento"""
        from django.db.models import Count, Q
        
        # Obtener casos del período
        casos = IncidentReport.objects.filter(
            colegio=self.colegio,
            created_at__date__gte=self.periodo_inicio,
            created_at__date__lte=self.periodo_fin
        )
        
        self.total_casos = casos.count()
        
        if self.total_casos > 0:
            # Calcular denuncias en plazo
            self.casos_requieren_denuncia = casos.filter(
                tipo_incidente__requiere_denuncia=True).count()
            
            if self.casos_requieren_denuncia > 0:
                denuncias_plazo = DenunciaObligatoria.objects.filter(
                    incidente__in=casos,
                    fecha_denuncia_realizada__isnull=False
                ).filter(
                    fecha_denuncia_realizada__lte=models.F('fecha_limite_denuncia')
                ).count()
                
                self.denuncias_en_plazo = denuncias_plazo
                self.porcentaje_denuncias_plazo = (denuncias_plazo / 
                                                   self.casos_requieren_denuncia) * 100
            
            # Calcular otras métricas...
            # (implementar según necesidades específicas)
            
            # Cumplimiento general (promedio de todos los porcentajes)
            porcentajes = [
                self.porcentaje_denuncias_plazo,
                self.porcentaje_notificaciones_plazo,
                self.porcentaje_resoluciones_plazo,
                self.porcentaje_debido_proceso
            ]
            self.cumplimiento_general = sum(porcentajes) / len(porcentajes)
        
        self.save()
    
    def __str__(self):
        return f"Cumplimiento Ley 20.536 - {self.colegio.nombre} ({self.periodo_inicio} - {self.periodo_fin})"
    
    class Meta:
        verbose_name = "Cumplimiento Ley 20.536"
        verbose_name_plural = "Cumplimientos Ley 20.536"
        unique_together = ['colegio', 'periodo_inicio', 'periodo_fin']


# =============================================================================
# MODELOS ESPECÍFICOS PARA CUMPLIMIENTO LEGAL CHILENO
# =============================================================================

class NotificacionLegal(models.Model):
    """Notificaciones obligatorias según normativa chilena"""
    TIPO_NOTIFICACION_CHOICES = [
        ('apoderado_caso_leve', 'Notificación a Apoderado - Caso Leve'),
        ('apoderado_caso_grave', 'Notificación a Apoderado - Caso Grave'),
        ('mineduc_caso_grave', 'Notificación MINEDUC - Caso Muy Grave'),
        ('fiscalia_delito', 'Denuncia Fiscalía - Delito'),
        ('pdi_delito', 'Denuncia PDI - Delito'),
        ('carabineros_delito', 'Denuncia Carabineros - Delito'),
        ('superintendencia', 'Notificación Superintendencia de Educación'),
        ('tribunal_familia', 'Notificación Tribunal de Familia'),
        ('opd_vulneracion', 'Notificación OPD - Vulneración Derechos'),
    ]

    incidente = models.ForeignKey(IncidentReport, on_delete=models.CASCADE,
                                  related_name='notificaciones_legales')
    tipo_notificacion = models.CharField(max_length=30, 
                                         choices=TIPO_NOTIFICACION_CHOICES)
    
    # Plazos legales
    plazo_maximo_horas = models.PositiveIntegerField(
        help_text="Plazo máximo legal en horas")
    fecha_limite = models.DateTimeField()
    
    # Destinatario
    destinatario_nombre = models.CharField(max_length=255)
    destinatario_email = models.EmailField(blank=True)
    destinatario_telefono = models.CharField(max_length=20, blank=True)
    institucion_destinatario = models.CharField(max_length=255, blank=True)
    
    # Estado de la notificación
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('enviada', 'Enviada'),
        ('recibida', 'Recibida/Confirmada'),
        ('vencida', 'Vencida'),
    ]
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, 
                              default='pendiente')
    
    # Seguimiento
    fecha_envio = models.DateTimeField(null=True, blank=True)
    fecha_confirmacion = models.DateTimeField(null=True, blank=True)
    numero_seguimiento = models.CharField(max_length=100, blank=True,
        help_text="Número de seguimiento oficial")
    
    # Contenido
    asunto = models.CharField(max_length=255)
    mensaje = models.TextField()
    documentos_adjuntos = models.FileField(upload_to='notificaciones/', 
                                           null=True, blank=True)
    
    # Responsable del envío
    enviado_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT,
                                    null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.fecha_limite:
            self.fecha_limite = (self.incidente.created_at + 
                                 timedelta(hours=self.plazo_maximo_horas))
        super().save(*args, **kwargs)
    
    @property
    def esta_vencida(self):
        """Verifica si la notificación está vencida"""
        from django.utils import timezone
        return (self.estado == 'pendiente' and 
                timezone.now() > self.fecha_limite)
    
    @property
    def horas_restantes(self):
        """Calcula horas restantes para el vencimiento"""
        from django.utils import timezone
        if self.estado != 'pendiente':
            return 0
        delta = self.fecha_limite - timezone.now()
        return max(0, int(delta.total_seconds() / 3600))
    
    def __str__(self):
        return f"{self.get_tipo_notificacion_display()} - {self.incidente.titulo}"
    
    class Meta:
        verbose_name = "Notificación Legal"
        verbose_name_plural = "Notificaciones Legales"
        ordering = ['fecha_limite']


class PlazoLegal(models.Model):
    """Control de plazos legales para cada tipo de incidente"""
    TIPO_PLAZO_CHOICES = [
        ('notificacion_apoderado', 'Notificación a Apoderado'),
        ('investigacion_completa', 'Investigación Completa'),
        ('resolucion_caso', 'Resolución del Caso'),
        ('denuncia_autoridades', 'Denuncia a Autoridades'),
        ('reporte_mineduc', 'Reporte a MINEDUC'),
        ('seguimiento_medidas', 'Seguimiento de Medidas'),
        ('apelacion', 'Plazo de Apelación'),
    ]

    incidente = models.ForeignKey(IncidentReport, on_delete=models.CASCADE,
                                  related_name='plazos_legales')
    tipo_plazo = models.CharField(max_length=25, choices=TIPO_PLAZO_CHOICES)
    
    # Configuración del plazo
    plazo_horas = models.PositiveIntegerField()
    es_plazo_habiles = models.BooleanField(default=True)
    fecha_inicio = models.DateTimeField()
    fecha_limite = models.DateTimeField()
    
    # Estado del cumplimiento
    ESTADO_CUMPLIMIENTO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_curso', 'En Curso'),
        ('cumplido', 'Cumplido'),
        ('vencido', 'Vencido'),
        ('prorrogado', 'Prorrogado'),
    ]
    estado = models.CharField(max_length=15, choices=ESTADO_CUMPLIMIENTO_CHOICES,
                              default='pendiente')
    
    # Seguimiento
    fecha_cumplimiento = models.DateTimeField(null=True, blank=True)
    observaciones = models.TextField(blank=True)
    responsable = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT)
    
    # Prórroga (si aplica)
    fecha_prorroga = models.DateTimeField(null=True, blank=True)
    justificacion_prorroga = models.TextField(blank=True)
    autorizada_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT,
                                       null=True, blank=True,
                                       related_name='prorrogas_autorizadas')
    
    def save(self, *args, **kwargs):
        if not self.fecha_limite:
            self.fecha_limite = self.fecha_inicio + timedelta(hours=self.plazo_horas)
        super().save(*args, **kwargs)
    
    @property
    def esta_vencido(self):
        """Verifica si el plazo está vencido"""
        from django.utils import timezone
        return (self.estado in ['pendiente', 'en_curso'] and 
                timezone.now() > self.fecha_limite)
    
    def marcar_cumplido(self, usuario):
        """Marca el plazo como cumplido"""
        from django.utils import timezone
        self.estado = 'cumplido'
        self.fecha_cumplimiento = timezone.now()
        self.save()
    
    def __str__(self):
        return f"{self.get_tipo_plazo_display()} - {self.incidente.titulo}"
    
    class Meta:
        verbose_name = "Plazo Legal"
        verbose_name_plural = "Plazos Legales"
        unique_together = ['incidente', 'tipo_plazo']


class SeguimientoLegal(models.Model):
    """Seguimiento específico según normativa chilena"""
    incidente = models.OneToOneField(IncidentReport, on_delete=models.CASCADE,
                                     related_name='seguimiento_legal')
    
    # Clasificación legal del caso
    CLASIFICACION_LEGAL_CHOICES = [
        ('tipo_i_leve', 'Tipo I - Situación Leve'),
        ('tipo_ii_grave', 'Tipo II - Situación Grave'), 
        ('tipo_iii_muy_grave', 'Tipo III - Situación Muy Grave'),
        ('constitutivo_delito', 'Constitutivo de Delito'),
    ]
    clasificacion_legal = models.CharField(max_length=20, 
                                           choices=CLASIFICACION_LEGAL_CHOICES)
    
    # Protocolo aplicado
    protocolo_aplicado = models.CharField(max_length=255, blank=True)
    fecha_inicio_protocolo = models.DateTimeField()
    fecha_limite_protocolo = models.DateTimeField()
    
    # Cumplimiento de etapas obligatorias
    etapa_denuncia_completada = models.BooleanField(default=False)
    etapa_medidas_urgentes_completada = models.BooleanField(default=False)
    etapa_notificacion_completada = models.BooleanField(default=False)
    etapa_investigacion_completada = models.BooleanField(default=False)
    etapa_resolucion_completada = models.BooleanField(default=False)
    etapa_apelacion_disponible = models.BooleanField(default=True)
    etapa_seguimiento_completada = models.BooleanField(default=False)
    
    # Notificaciones realizadas
    notificado_apoderado = models.BooleanField(default=False)
    fecha_notificacion_apoderado = models.DateTimeField(null=True, blank=True)
    notificado_mineduc = models.BooleanField(default=False)
    fecha_notificacion_mineduc = models.DateTimeField(null=True, blank=True)
    denunciado_autoridades = models.BooleanField(default=False)
    fecha_denuncia_autoridades = models.DateTimeField(null=True, blank=True)
    
    # Medidas aplicadas según normativa
    medidas_proteccion_aplicadas = models.TextField(blank=True)
    medidas_formativas_aplicadas = models.TextField(blank=True)
    sanciones_aplicadas = models.TextField(blank=True)
    
    # Documentación legal
    documentos_proceso = models.FileField(upload_to='procesos_legales/', 
                                          null=True, blank=True)
    actas_generadas = models.TextField(blank=True,
        help_text="Lista de actas y documentos generados")
    
    # Cumplimiento general
    cumple_normativa = models.BooleanField(default=False)
    observaciones_cumplimiento = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        # Verificar cumplimiento automático
        self.verificar_cumplimiento_normativa()
        super().save(*args, **kwargs)
    
    def verificar_cumplimiento_normativa(self):
        """Verifica si se cumple con toda la normativa aplicable"""
        cumple = True
        observaciones = []
        
        # Verificar según clasificación
        if self.clasificacion_legal in ['tipo_ii_grave', 'tipo_iii_muy_grave']:
            if not self.notificado_apoderado:
                cumple = False
                observaciones.append("Falta notificación a apoderado")
            
            if not self.etapa_investigacion_completada:
                cumple = False
                observaciones.append("Falta completar investigación")
                
            if not self.etapa_resolucion_completada:
                cumple = False
                observaciones.append("Falta resolución del caso")
        
        if self.clasificacion_legal == 'constitutivo_delito':
            if not self.denunciado_autoridades:
                cumple = False
                observaciones.append("Falta denuncia a autoridades")
                
            if not self.notificado_mineduc:
                cumple = False
                observaciones.append("Falta notificación a MINEDUC")
        
        self.cumple_normativa = cumple
        self.observaciones_cumplimiento = "; ".join(observaciones)
    
    def get_porcentaje_cumplimiento(self):
        """Calcula porcentaje de cumplimiento del protocolo"""
        etapas_total = 7
        etapas_completadas = sum([
            self.etapa_denuncia_completada,
            self.etapa_medidas_urgentes_completada,
            self.etapa_notificacion_completada,
            self.etapa_investigacion_completada,
            self.etapa_resolucion_completada,
            self.etapa_seguimiento_completada,
            self.cumple_normativa
        ])
        return int((etapas_completadas / etapas_total) * 100)
    
    def __str__(self):
        return f"Seguimiento Legal - {self.incidente.titulo}"
    
    class Meta:
        verbose_name = "Seguimiento Legal"
        verbose_name_plural = "Seguimientos Legales"


class ReporteMINEDUC(models.Model):
    """Reportes obligatorios a MINEDUC según normativa"""
    TIPO_REPORTE_CHOICES = [
        ('mensual', 'Reporte Mensual'),
        ('trimestral', 'Reporte Trimestral'),
        ('semestral', 'Reporte Semestral'),
        ('anual', 'Reporte Anual'),
        ('caso_grave', 'Reporte Caso Grave'),
        ('seguimiento', 'Reporte de Seguimiento'),
    ]

    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE,
                                related_name='reportes_mineduc')
    tipo_reporte = models.CharField(max_length=15, choices=TIPO_REPORTE_CHOICES)
    periodo_inicio = models.DateField()
    periodo_fin = models.DateField()
    
    # Estadísticas incluidas
    total_casos = models.PositiveIntegerField(default=0)
    casos_tipo_i = models.PositiveIntegerField(default=0)
    casos_tipo_ii = models.PositiveIntegerField(default=0)
    casos_tipo_iii = models.PositiveIntegerField(default=0)
    casos_delito = models.PositiveIntegerField(default=0)
    
    # Medidas aplicadas
    medidas_formativas_aplicadas = models.PositiveIntegerField(default=0)
    sanciones_aplicadas = models.PositiveIntegerField(default=0)
    derivaciones_externas = models.PositiveIntegerField(default=0)
    
    # Estado del reporte
    ESTADO_REPORTE_CHOICES = [
        ('borrador', 'Borrador'),
        ('generado', 'Generado'),
        ('enviado', 'Enviado'),
        ('recibido', 'Recibido por MINEDUC'),
    ]
    estado = models.CharField(max_length=15, choices=ESTADO_REPORTE_CHOICES,
                              default='borrador')
    
    # Archivos
    archivo_reporte = models.FileField(upload_to='reportes_mineduc/', 
                                       null=True, blank=True)
    numero_seguimiento_mineduc = models.CharField(max_length=100, blank=True)
    
    # Fechas
    fecha_generacion = models.DateTimeField(null=True, blank=True)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    
    # Responsable
    generado_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def generar_estadisticas(self):
        """Genera automáticamente las estadísticas del período"""
        incidentes = IncidentReport.objects.filter(
            colegio=self.colegio,
            created_at__date__gte=self.periodo_inicio,
            created_at__date__lte=self.periodo_fin
        )
        
        self.total_casos = incidentes.count()
        self.casos_tipo_i = incidentes.filter(
            tipo_incidente__gravedad='leve').count()
        self.casos_tipo_ii = incidentes.filter(
            tipo_incidente__gravedad='grave').count()
        self.casos_tipo_iii = incidentes.filter(
            tipo_incidente__gravedad='muy_grave').count()
        self.casos_delito = incidentes.filter(
            tipo_incidente__requiere_denuncia=True).count()
        
        # Contar medidas aplicadas
        resoluciones = ResolucionIncidente.objects.filter(
            incidente__in=incidentes)
        self.medidas_formativas_aplicadas = sum(
            r.medidas_formativas.count() for r in resoluciones)
        self.sanciones_aplicadas = sum(
            r.sanciones.count() for r in resoluciones)
        
        self.save()
    
    def __str__(self):
        return f"Reporte {self.get_tipo_reporte_display()} - {self.periodo_inicio} a {self.periodo_fin}"
    
    class Meta:
        verbose_name = "Reporte MINEDUC"
        verbose_name_plural = "Reportes MINEDUC"
        unique_together = ['colegio', 'tipo_reporte', 'periodo_inicio']


# =============================================================================
# NUEVOS MODELOS: Sistema de Protocolos Configurables y Anonimato Controlado
# =============================================================================

class ProtocoloProceso(models.Model):
    """Protocolo específico de cada colegio por gravedad del incidente"""
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE)
    
    GRAVEDAD_PROCESO_CHOICES = [
        ('leve', 'Leve'),
        ('grave', 'Grave'),
        ('muy_grave', 'Muy Grave'),
    ]
    gravedad = models.CharField(max_length=15, choices=GRAVEDAD_PROCESO_CHOICES)
    
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    activo = models.BooleanField(default=True)
    
    # Configuración general del protocolo
    plazo_total_dias = models.PositiveIntegerField(
        default=15, help_text="Plazo máximo total del proceso")
    requiere_aprobacion_director = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.colegio.nombre} - {self.get_gravedad_display()}"
    
    class Meta:
        unique_together = ['colegio', 'gravedad']
        verbose_name = "Protocolo de Proceso"
        verbose_name_plural = "Protocolos de Proceso"


class EtapaProtocolo(models.Model):
    """Etapas específicas de cada protocolo"""
    protocolo = models.ForeignKey(ProtocoloProceso, on_delete=models.CASCADE,
                                  related_name='etapas')
    orden = models.PositiveIntegerField()
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    
    # Configuración de plazos
    plazo_horas = models.PositiveIntegerField(default=24)
    es_plazo_habiles = models.BooleanField(
        default=True, help_text="¿Son horas hábiles o corridas?")
    
    # Responsabilidad
    RESPONSABLE_CHOICES = [
        ('encargado_convivencia', 'Encargado de Convivencia'),
        ('directivo', 'Directivo'),
        ('director', 'Director'),
        ('docente', 'Docente'),
        ('inspector', 'Inspector General'),
        ('consejo_disciplinario', 'Consejo Disciplinario'),
        ('equipo_convivencia', 'Equipo de Convivencia'),
    ]
    responsable_rol = models.CharField(max_length=25, choices=RESPONSABLE_CHOICES)
    
    # Configuración de acciones
    acciones_requeridas = models.TextField(
        help_text="Descripción de las acciones a realizar en esta etapa")
    documentos_requeridos = models.TextField(
        blank=True, help_text="Documentos que se deben generar/adjuntar")
    
    # Control de obligatoriedad
    es_obligatoria = models.BooleanField(default=True)
    
    # Configuración para casos con anonimato
    permite_anonimo = models.BooleanField(
        default=True, help_text="¿Se puede ejecutar con denuncia anónima?")
    ACCION_ANONIMO_CHOICES = [
        ('normal', 'Proceso Normal'),
        ('modificada', 'Proceso Modificado'),
        ('omitir', 'Omitir Esta Etapa'),
    ]
    accion_si_anonimo = models.CharField(
        max_length=20, choices=ACCION_ANONIMO_CHOICES, default='normal')
    descripcion_anonimo = models.TextField(
        blank=True, help_text="Descripción alternativa para casos anónimos")
    
    def __str__(self):
        return f"{self.protocolo} - Etapa {self.orden}: {self.nombre}"
    
    class Meta:
        ordering = ['orden']
        unique_together = ['protocolo', 'orden']
        verbose_name = "Etapa de Protocolo"
        verbose_name_plural = "Etapas de Protocolo"


class ProcesoIncidente(models.Model):
    """Seguimiento del proceso específico de un incidente"""
    incidente = models.OneToOneField(IncidentReport, on_delete=models.CASCADE,
                                     related_name='proceso')
    protocolo = models.ForeignKey(ProtocoloProceso, on_delete=models.PROTECT)
    
    # Estado del proceso
    etapa_actual = models.ForeignKey(EtapaProtocolo, on_delete=models.PROTECT,
                                     null=True, blank=True)
    ESTADO_PROCESO_CHOICES = [
        ('iniciado', 'Iniciado'),
        ('en_curso', 'En Curso'),
        ('pausado', 'Pausado'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]
    estado = models.CharField(max_length=15, choices=ESTADO_PROCESO_CHOICES,
                              default='iniciado')
    
    # Fechas importantes
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_limite = models.DateTimeField(null=True, blank=True)
    fecha_completado = models.DateTimeField(null=True, blank=True)
    
    # Observaciones generales del proceso
    observaciones = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        if not self.fecha_limite and self.protocolo:
            # Calcular fecha límite basada en el protocolo
            self.fecha_limite = self.fecha_inicio + timedelta(
                days=self.protocolo.plazo_total_dias)
        super().save(*args, **kwargs)
    
    def iniciar_proceso(self):
        """Inicia el proceso creando las ejecuciones de etapas"""
        # Obtener etapas aplicables según anonimato
        if self.incidente.solicita_anonimato:
            etapas = self.protocolo.etapas.exclude(accion_si_anonimo='omitir')
        else:
            etapas = self.protocolo.etapas.all()
        
        # Crear ejecuciones para cada etapa
        for etapa in etapas:
            EjecucionEtapa.objects.get_or_create(
                proceso=self,
                etapa=etapa,
                defaults={
                    'modificada_por_anonimato': (
                        self.incidente.solicita_anonimato and
                        etapa.accion_si_anonimo == 'modificada'
                    )
                }
            )
        
        # Establecer primera etapa como actual
        primera_etapa = etapas.first()
        if primera_etapa:
            self.etapa_actual = primera_etapa
            self.estado = 'en_curso'
            self.save()
    
    def __str__(self):
        return f"Proceso: {self.incidente.titulo}"
    
    class Meta:
        verbose_name = "Proceso de Incidente"
        verbose_name_plural = "Procesos de Incidente"


class EjecucionEtapa(models.Model):
    """Registro de ejecución de cada etapa del proceso"""
    proceso = models.ForeignKey(ProcesoIncidente, on_delete=models.CASCADE,
                                related_name='ejecuciones')
    etapa = models.ForeignKey(EtapaProtocolo, on_delete=models.CASCADE)
    
    # Estado de la ejecución
    ESTADO_EJECUCION_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_curso', 'En Curso'),
        ('completada', 'Completada'),
        ('omitida', 'Omitida'),
        ('vencida', 'Vencida'),
    ]
    estado = models.CharField(max_length=15, choices=ESTADO_EJECUCION_CHOICES,
                              default='pendiente')
    
    # Fechas de ejecución
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_limite = models.DateTimeField(null=True, blank=True)
    fecha_completada = models.DateTimeField(null=True, blank=True)
    
    # Responsable asignado
    ejecutado_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT,
                                      null=True, blank=True)
    
    # Resultados de la ejecución
    observaciones = models.TextField(blank=True)
    archivos_adjuntos = models.FileField(upload_to='etapas/', null=True,
                                         blank=True)
    
    # Configuración especial por anonimato
    modificada_por_anonimato = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if self.fecha_inicio and not self.fecha_limite:
            # Calcular fecha límite basada en la etapa
            self.fecha_limite = self.fecha_inicio + timedelta(
                hours=self.etapa.plazo_horas)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return (f"{self.proceso.incidente.titulo} - "
                f"Etapa {self.etapa.orden}: {self.etapa.nombre}")
    
    class Meta:
        unique_together = ['proceso', 'etapa']
        verbose_name = "Ejecución de Etapa"
        verbose_name_plural = "Ejecuciones de Etapa"


class ReglasAnonimato(models.Model):
    """Reglas por colegio de quién puede ver identidades anónimas"""
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE)
    nivel_anonimato = models.CharField(
        max_length=20, choices=IncidentReport.NIVEL_ANONIMATO_CHOICES)
    
    # Configuración de acceso
    roles_con_acceso = models.TextField(
        help_text="Roles separados por coma que pueden ver la identidad")
    requiere_aprobacion = models.BooleanField(
        default=False, help_text="¿Requiere aprobación adicional?")
    notificar_acceso = models.BooleanField(
        default=True, help_text="¿Notificar al denunciante sobre accesos?")
    
    # Configuración adicional
    plazo_acceso_horas = models.PositiveIntegerField(
        default=24, help_text="Horas máximas para mantener acceso")
    
    def __str__(self):
        return f"{self.colegio.nombre} - {self.get_nivel_anonimato_display()}"
    
    class Meta:
        unique_together = ['colegio', 'nivel_anonimato']
        verbose_name = "Regla de Anonimato"
        verbose_name_plural = "Reglas de Anonimato"


class AccesoIdentidadDenunciante(models.Model):
    """Control de acceso a identidad de denunciantes anónimos"""
    incidente = models.ForeignKey(IncidentReport, on_delete=models.CASCADE,
                                  related_name='accesos_identidad')
    usuario_autorizado = models.ForeignKey(PerfilUsuario,
                                           on_delete=models.CASCADE)
    
    # Tipo de autorización
    TIPO_ACCESO_CHOICES = [
        ('automatico', 'Acceso Automático por Rol'),
        ('otorgado', 'Acceso Otorgado Específicamente'),
        ('judicial', 'Acceso por Orden Judicial'),
        ('emergencia', 'Acceso de Emergencia'),
    ]
    tipo_acceso = models.CharField(max_length=15, choices=TIPO_ACCESO_CHOICES)
    
    # Control de autorización
    fecha_autorizacion = models.DateTimeField(auto_now_add=True)
    autorizado_por = models.ForeignKey(PerfilUsuario, on_delete=models.PROTECT,
                                       related_name='accesos_autorizados')
    motivo = models.TextField(blank=True)
    
    # Log de accesos
    fecha_primer_acceso = models.DateTimeField(null=True, blank=True)
    fecha_ultimo_acceso = models.DateTimeField(null=True, blank=True)
    numero_accesos = models.PositiveIntegerField(default=0)
    
    # Control de vigencia
    activo = models.BooleanField(default=True)
    fecha_expiracion = models.DateTimeField(null=True, blank=True)
    
    def registrar_acceso(self):
        """Registra un acceso a la identidad"""
        from django.utils import timezone
        ahora = timezone.now()
        
        if not self.fecha_primer_acceso:
            self.fecha_primer_acceso = ahora
        
        self.fecha_ultimo_acceso = ahora
        self.numero_accesos += 1
        self.save()
    
    def __str__(self):
        return (f"Acceso de {self.usuario_autorizado} a "
                f"{self.incidente.titulo}")
    
    class Meta:
        unique_together = ['incidente', 'usuario_autorizado']
        verbose_name = "Acceso a Identidad de Denunciante"
        verbose_name_plural = "Accesos a Identidad de Denunciante"
