# Ley 20.536 sobre Violencia Escolar - Análisis e Implementación

## MARCO LEGAL FUNDAMENTAL

### Ley 20.536 - Sobre Violencia Escolar (2011)
**Modifica la Ley General de Educación para definir y tipificar el acoso escolar**

---

## ARTÍCULOS CLAVE Y SU IMPLEMENTACIÓN

### Art. 16 A - DEFINICIONES FUNDAMENTALES

#### **Acoso Escolar (Bullying)**
> *"Toda acción u omisión constitutiva de agresión u hostigamiento reiterado, realizada fuera o dentro del establecimiento educacional por estudiantes que, en forma individual o colectiva, atenten en contra de otro estudiante, valiéndose para ello de una situación de superioridad o de indefensión del estudiante afectado, que provoque en este último, maltrato, humillación o fundado temor de verse expuesto a un mal de carácter grave, ya sea por medios tecnológicos o cualquier otro medio, teniendo en cuenta su edad y condición"*

**IMPLEMENTACIÓN EN SISTEMA:**
```typescript
// Criterios obligatorios para detectar bullying
interface CriterioBullying {
  esReiterado: boolean;          // Debe ser repetitivo
  hayDesequilibroPoder: boolean; // Situación de superioridad/indefensión
  hayIntencion: boolean;         // Acción deliberada
  generaDano: boolean;           // Provoca maltrato/humillación/temor
  incluye_medios_tecnologicos: boolean; // Ciberbullying
}
```

#### **Violencia Escolar**
> *"Uso ilegítimo de la fuerza o poder, que puede ser física o psicológica, realizada por cualquier medio, en contra de un estudiante o un integrante de la comunidad educativa, por parte de otro miembro de la misma"*

**IMPLEMENTACIÓN EN SISTEMA:**
- Tipología amplia: física, psicológica, por cualquier medio
- Puede ser entre cualquier miembro de la comunidad educativa
- No requiere reiteración (diferencia clave con bullying)

### Art. 16 B - REGLAMENTO INTERNO OBLIGATORIO

#### **Contenido Mínimo Obligatorio:**
1. **Descripción precisa de conductas que constituyen violencia escolar**
2. **Procedimientos para gestionar conflictos y situaciones de violencia**
3. **Diversas medidas pedagógicas que fomenten la buena convivencia**
4. **Procedimiento de reconocimiento y reforzamiento de conductas positivas**
5. **Protocolos de actuación para casos de violencia escolar**
6. **Diversas formas de participación de la comunidad educativa**
7. **Programa de capacitación para docentes, asistentes y directivos**

**IMPLEMENTACIÓN EN SISTEMA:**
```python
class ReglamentoInterno(models.Model):
    colegio = models.OneToOneField(Colegio, on_delete=models.CASCADE)
    
    # Contenido obligatorio según Art. 16 B
    descripcion_conductas_violencia = models.TextField()
    procedimientos_gestion_conflictos = models.TextField()
    medidas_pedagogicas_convivencia = models.TextField()
    procedimiento_reconocimiento_positivo = models.TextField()
    protocolos_violencia_escolar = models.TextField()
    formas_participacion_comunidad = models.TextField()
    programa_capacitacion = models.TextField()
    
    # Control de versiones y aprobación
    version = models.CharField(max_length=10)
    fecha_aprobacion_consejo_escolar = models.DateField()
    vigente = models.BooleanField(default=True)
```

### Art. 16 C - ENCARGADO DE CONVIVENCIA ESCOLAR

#### **Requisitos Legales Obligatorios:**
- **Designación obligatoria** en establecimientos de educación básica y media
- **Funciones específicas** definidas por reglamento
- **Responsabilidades** establecidas por ley

**IMPLEMENTACIÓN EN SISTEMA:**
```python
class EncargadoConvivencia(models.Model):
    perfil_usuario = models.OneToOneField(PerfilUsuario, on_delete=models.CASCADE)
    
    # Cumplimiento Art. 16 C
    fecha_designacion = models.DateField()
    resolucion_nombramiento = models.CharField(max_length=100)
    
    # Funciones según reglamento
    FUNCIONES_OBLIGATORIAS = [
        'elaborar_plan_gestion',
        'implementar_medidas_plan',
        'investigar_denuncias',
        'aplicar_protocolos',
        'coordinar_redes_apoyo',
        'capacitar_comunidad',
        'reportar_autoridades'
    ]
    
    def verificar_cumplimiento_funciones(self):
        """Verifica cumplimiento de funciones obligatorias según Art. 16 C"""
        pass
```

### Art. 16 D - DENUNCIA OBLIGATORIA

#### **Obligación Legal:**
> *"Los directores, inspectores y sostenedores de los establecimientos educacionales deberán denunciar cualquier acción u omisión que revista características de delito y que afecte a un miembro de la comunidad educativa, tales como lesiones, amenazas, robos, hurtos, abusos sexuales, porte o tenencia ilegal de armas, tráfico de sustancias ilícitas u otros."*

**PLAZOS OBLIGATORIOS:**
- **24 horas** desde que se tome conocimiento del hecho
- **Autoridades competentes**: Carabineros, PDI, Fiscalía

**IMPLEMENTACIÓN EN SISTEMA:**
```python
class DenunciaObligatoria(models.Model):
    incidente = models.OneToOneField(IncidentReport, on_delete=models.CASCADE)
    
    # Verificación automática de obligatoriedad
    es_constitutivo_delito = models.BooleanField()
    tipos_delito_detectados = models.JSONField(default=list)
    
    # Cumplimiento Art. 16 D
    fecha_conocimiento = models.DateTimeField()
    fecha_limite_denuncia = models.DateTimeField()  # +24 horas
    fecha_denuncia_realizada = models.DateTimeField(null=True, blank=True)
    
    AUTORIDADES_CHOICES = [
        ('carabineros', 'Carabineros de Chile'),
        ('pdi', 'Policía de Investigaciones'),
        ('fiscalia', 'Fiscalía Local'),
    ]
    autoridad_denunciada = models.CharField(max_length=15, choices=AUTORIDADES_CHOICES)
    numero_denuncia = models.CharField(max_length=100, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.fecha_limite_denuncia:
            self.fecha_limite_denuncia = self.fecha_conocimiento + timedelta(hours=24)
        super().save(*args, **kwargs)
    
    @property
    def esta_vencida(self):
        from django.utils import timezone
        return timezone.now() > self.fecha_limite_denuncia and not self.fecha_denuncia_realizada
```

### Art. 16 E - MEDIDAS DISCIPLINARIAS

#### **Principios Fundamentales:**
1. **Proporcionalidad**: Según gravedad de la infracción
2. **No discriminación**: Aplicación igualitaria
3. **Debido proceso**: Derecho a defensa y apelación
4. **Interés superior del niño**: Consideración primordial

**IMPLEMENTACIÓN EN SISTEMA:**
```python
class MedidaDisciplinaria(models.Model):
    incidente = models.ForeignKey(IncidentReport, on_delete=models.CASCADE)
    
    # Cumplimiento Art. 16 E - Proporcionalidad
    GRAVEDAD_INFRACCION_CHOICES = [
        ('leve', 'Leve'),
        ('menos_grave', 'Menos Grave'),
        ('grave', 'Grave'),
        ('gravisima', 'Gravísima'),
    ]
    gravedad_infraccion = models.CharField(max_length=15, choices=GRAVEDAD_INFRACCION_CHOICES)
    
    # Debido proceso obligatorio
    fecha_notificacion_estudiante = models.DateTimeField()
    fecha_notificacion_apoderado = models.DateTimeField()
    plazo_descargos_dias = models.PositiveIntegerField(default=5)
    descargos_presentados = models.TextField(blank=True)
    
    # Proporcionalidad de medidas
    medida_aplicada = models.TextField()
    fundamentacion_proporcionalidad = models.TextField()
    
    # Apelación (derecho fundamental)
    permite_apelacion = models.BooleanField(default=True)
    plazo_apelacion_dias = models.PositiveIntegerField(default=5)
    apelacion_presentada = models.TextField(blank=True)
    resolucion_apelacion = models.TextField(blank=True)
```

---

## IMPLEMENTACIÓN TÉCNICA ESPECÍFICA

### 1. SISTEMA DE DETECCIÓN AUTOMÁTICA

```python
class DetectorViolenciaEscolar:
    """Detector automático según definiciones Ley 20.536"""
    
    @staticmethod
    def es_acoso_escolar(incidente):
        """Evalúa si cumple criterios de acoso escolar según Art. 16 A"""
        criterios = {
            'reiteracion': False,
            'desequilibrio_poder': False,
            'intencion_dano': False,
            'efecto_negativo': False
        }
        
        # Verificar reiteración
        if IncidentReport.objects.filter(
            estudiantes_involucrados__in=incidente.estudiantes_involucrados.all(),
            created_at__gte=incidente.created_at - timedelta(days=30)
        ).count() > 1:
            criterios['reiteracion'] = True
        
        # Verificar otros criterios según datos del incidente
        # ... lógica de detección
        
        return all(criterios.values())
    
    @staticmethod
    def requiere_denuncia_obligatoria(incidente):
        """Evalúa si requiere denuncia según Art. 16 D"""
        delitos_graves = [
            'lesiones_graves',
            'amenazas',
            'abuso_sexual',
            'porte_armas',
            'trafico_drogas'
        ]
        return incidente.tipo_incidente.categoria in delitos_graves
```

### 2. WORKFLOWS AUTOMATIZADOS

```python
class WorkflowLey20536:
    """Workflows automáticos para cumplir Ley 20.536"""
    
    @staticmethod
    def procesar_nuevo_incidente(incidente):
        """Procesa incidente según Art. 16 A y 16 D"""
        
        # 1. Clasificar tipo según ley
        if DetectorViolenciaEscolar.es_acoso_escolar(incidente):
            incidente.clasificacion_legal = 'acoso_escolar'
        else:
            incidente.clasificacion_legal = 'violencia_escolar'
        
        # 2. Verificar denuncia obligatoria
        if DetectorViolenciaEscolar.requiere_denuncia_obligatoria(incidente):
            DenunciaObligatoria.objects.create(
                incidente=incidente,
                es_constitutivo_delito=True,
                fecha_conocimiento=timezone.now()
            )
            
        # 3. Asignar a Encargado de Convivencia
        encargado = PerfilUsuario.objects.get(
            colegio=incidente.colegio,
            tipo_usuario='encargado_convivencia'
        )
        incidente.asignado_a = encargado
        
        # 4. Iniciar protocolo según gravedad
        WorkflowLey20536.iniciar_protocolo_legal(incidente)
        
        incidente.save()
    
    @staticmethod
    def iniciar_protocolo_legal(incidente):
        """Inicia protocolo según clasificación legal"""
        
        if incidente.clasificacion_legal == 'acoso_escolar':
            # Protocolo específico para acoso escolar
            WorkflowLey20536.protocolo_acoso_escolar(incidente)
        else:
            # Protocolo general violencia escolar
            WorkflowLey20536.protocolo_violencia_escolar(incidente)
```

### 3. SISTEMA DE ALERTAS LEGALES

```python
class AlertaLegal(models.Model):
    """Sistema de alertas para cumplimiento de plazos legales"""
    
    TIPO_ALERTA_CHOICES = [
        ('denuncia_24h', 'Denuncia Obligatoria 24h'),
        ('notificacion_apoderado', 'Notificación Apoderado'),
        ('resolucion_caso', 'Resolución de Caso'),
        ('seguimiento_medidas', 'Seguimiento Medidas'),
    ]
    
    incidente = models.ForeignKey(IncidentReport, on_delete=models.CASCADE)
    tipo_alerta = models.CharField(max_length=25, choices=TIPO_ALERTA_CHOICES)
    fecha_limite = models.DateTimeField()
    
    enviada = models.BooleanField(default=False)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    
    @classmethod
    def crear_alertas_automaticas(cls, incidente):
        """Crea alertas automáticas según Ley 20.536"""
        
        # Alerta denuncia obligatoria (24h)
        if incidente.requiere_denuncia:
            cls.objects.create(
                incidente=incidente,
                tipo_alerta='denuncia_24h',
                fecha_limite=incidente.created_at + timedelta(hours=24)
            )
        
        # Alerta notificación apoderado
        cls.objects.create(
            incidente=incidente,
            tipo_alerta='notificacion_apoderado',
            fecha_limite=incidente.created_at + timedelta(hours=48)
        )
```

---

## DASHBOARD DE CUMPLIMIENTO LEY 20.536

### Métricas Obligatorias a Monitorear:

1. **Denuncias en Plazo**: % de casos que requieren denuncia y se denuncia en 24h
2. **Notificaciones a Tiempo**: % de apoderados notificados en plazo legal
3. **Casos Resueltos**: % de casos resueltos en plazo según gravedad
4. **Medidas Proporcionales**: % de medidas que cumplen proporcionalidad
5. **Debido Proceso**: % de casos que respetan debido proceso completo

### Reportes Automáticos:

1. **Reporte Mensual MINEDUC**: Casos por tipo según Ley 20.536
2. **Reporte Superintendencia**: Cumplimiento de protocolos
3. **Informe Consejo Escolar**: Estado de convivencia según ley

---

## CONCLUSIÓN

La Ley 20.536 es efectivamente la ley más importante y establece **obligaciones específicas y no negociables**:

1. **Definiciones precisas** de acoso y violencia escolar
2. **Denuncia obligatoria en 24 horas** para delitos
3. **Encargado de Convivencia obligatorio**
4. **Reglamento interno con contenido mínimo específico**
5. **Debido proceso obligatorio** en medidas disciplinarias
6. **Proporcionalidad obligatoria** en sanciones

Nuestro sistema debe implementar **cada uno de estos elementos de forma automática y trazable** para garantizar el cumplimiento legal completo.