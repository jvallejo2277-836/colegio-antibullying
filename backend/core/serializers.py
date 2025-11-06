from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Colegio, IncidentReport, Evidence, TipoIncidente, 
    PerfilUsuario, MedidaFormativa, Sancion, ResolucionIncidente,
    ProtocoloProceso, EtapaProtocolo, ProcesoIncidente, EjecucionEtapa,
    ReglasAnonimato, AccesoIdentidadDenunciante
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer básico para User"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class ColegioSerializer(serializers.ModelSerializer):
    reportes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Colegio
        fields = [
            'id', 'nombre', 'rbd', 'direccion', 'telefono', 'email',
            'director', 'encargado_convivencia', 'created_at', 'reportes_count'
        ]
    
    def get_reportes_count(self, obj):
        return obj.reportes.count()


class TipoIncidenteSerializer(serializers.ModelSerializer):
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    gravedad_display = serializers.CharField(source='get_gravedad_display', read_only=True)
    
    class Meta:
        model = TipoIncidente
        fields = [
            'id', 'nombre', 'categoria', 'categoria_display', 
            'gravedad', 'gravedad_display', 'descripcion', 
            'requiere_denuncia', 'plazo_investigacion_dias'
        ]


class PerfilUsuarioSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    colegio_nombre = serializers.CharField(source='colegio.nombre', read_only=True)
    tipo_usuario_display = serializers.CharField(source='get_tipo_usuario_display', read_only=True)
    
    class Meta:
        model = PerfilUsuario
        fields = [
            'id', 'user', 'colegio', 'colegio_nombre', 'tipo_usuario', 
            'tipo_usuario_display', 'rut', 'telefono', 'curso'
        ]


class MedidaFormativaSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = MedidaFormativa
        fields = ['id', 'nombre', 'tipo', 'tipo_display', 'descripcion', 'duracion_estimada_horas']


class SancionSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = Sancion
        fields = ['id', 'nombre', 'tipo', 'tipo_display', 'descripcion', 'dias_duracion']


class EvidenceSerializer(serializers.ModelSerializer):
    tipo_evidencia_display = serializers.CharField(source='get_tipo_evidencia_display', read_only=True)
    subido_por_nombre = serializers.CharField(source='subido_por.user.get_full_name', read_only=True)
    
    class Meta:
        model = Evidence
        fields = [
            'id', 'tipo_evidencia', 'tipo_evidencia_display', 'archivo', 
            'descripcion', 'testimonio_texto', 'subido_por', 'subido_por_nombre',
            'uploaded_at', 'es_confidencial'
        ]


class ResolucionIncidenteSerializer(serializers.ModelSerializer):
    medidas_formativas = MedidaFormativaSerializer(many=True, read_only=True)
    sanciones = SancionSerializer(many=True, read_only=True)
    resuelto_por_nombre = serializers.CharField(source='resuelto_por.user.get_full_name', read_only=True)
    
    class Meta:
        model = ResolucionIncidente
        fields = [
            'id', 'fundamentacion', 'fecha_resolucion', 'resuelto_por', 
            'resuelto_por_nombre', 'requiere_seguimiento', 'fecha_seguimiento',
            'medidas_formativas', 'sanciones'
        ]


class IncidentReportSerializer(serializers.ModelSerializer):
    evidencias = EvidenceSerializer(many=True, read_only=True)
    resolucion = ResolucionIncidenteSerializer(read_only=True)
    colegio_nombre = serializers.CharField(source='colegio.nombre', read_only=True)
    tipo_incidente_detail = TipoIncidenteSerializer(source='tipo_incidente', read_only=True)
    estudiantes_involucrados_detail = PerfilUsuarioSerializer(source='estudiantes_involucrados', many=True, read_only=True)
    reportero_nombre_completo = serializers.CharField(source='reportero.user.get_full_name', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    urgencia_display = serializers.CharField(source='get_urgencia_display', read_only=True)
    
    # Campos calculados
    dias_transcurridos = serializers.SerializerMethodField()
    dias_restantes_investigacion = serializers.SerializerMethodField()
    
    class Meta:
        model = IncidentReport
        fields = [
            'id', 'colegio', 'colegio_nombre', 'tipo_incidente', 'tipo_incidente_detail',
            'titulo', 'descripcion', 'fecha_incidente', 'lugar_incidente',
            'estudiantes_involucrados', 'estudiantes_involucrados_detail',
            'reportero', 'reportero_nombre_completo', 'anonimo', 
            'reportero_externo_nombre', 'reportero_externo_contacto',
            'estado', 'estado_display', 'urgencia', 'urgencia_display',
            'created_at', 'fecha_limite_investigacion', 'fecha_resolucion',
            'requiere_denuncia', 'fecha_denuncia', 'numero_denuncia',
            'evidencias', 'resolucion', 'dias_transcurridos', 'dias_restantes_investigacion'
        ]
    
    def get_dias_transcurridos(self, obj):
        from datetime import datetime
        from django.utils import timezone
        now = timezone.now()
        return (now - obj.created_at).days
    
    def get_dias_restantes_investigacion(self, obj):
        if not obj.fecha_limite_investigacion:
            return None
        from django.utils import timezone
        now = timezone.now()
        dias_restantes = (obj.fecha_limite_investigacion - now).days
        return max(0, dias_restantes)


# Serializer simplificado para listados
class IncidentReportListSerializer(serializers.ModelSerializer):
    colegio_nombre = serializers.CharField(source='colegio.nombre', read_only=True)
    tipo_incidente_nombre = serializers.CharField(source='tipo_incidente.nombre', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    urgencia_display = serializers.CharField(source='get_urgencia_display', read_only=True)
    
    class Meta:
        model = IncidentReport
        fields = [
            'id', 'titulo', 'colegio_nombre', 'tipo_incidente_nombre', 
            'estado', 'estado_display', 'urgencia', 'urgencia_display',
            'fecha_incidente', 'created_at'
        ]


# =============================================================================
# SERIALIZERS PARA SISTEMA DE PROTOCOLOS Y ANONIMATO
# =============================================================================

class EtapaProtocoloSerializer(serializers.ModelSerializer):
    """Serializer para etapas de protocolo"""
    responsable_display = serializers.CharField(
        source='get_responsable_rol_display', read_only=True)
    accion_anonimo_display = serializers.CharField(
        source='get_accion_si_anonimo_display', read_only=True)
    
    class Meta:
        model = EtapaProtocolo
        fields = [
            'id', 'orden', 'nombre', 'descripcion', 'plazo_horas',
            'es_plazo_habiles', 'responsable_rol', 'responsable_display',
            'acciones_requeridas', 'documentos_requeridos', 'es_obligatoria',
            'permite_anonimo', 'accion_si_anonimo', 'accion_anonimo_display',
            'descripcion_anonimo'
        ]


class ProtocoloProcesoSerializer(serializers.ModelSerializer):
    """Serializer para protocolos de proceso"""
    etapas = EtapaProtocoloSerializer(many=True, read_only=True)
    gravedad_display = serializers.CharField(
        source='get_gravedad_display', read_only=True)
    colegio_nombre = serializers.CharField(
        source='colegio.nombre', read_only=True)
    
    class Meta:
        model = ProtocoloProceso
        fields = [
            'id', 'colegio', 'colegio_nombre', 'gravedad', 'gravedad_display',
            'nombre', 'descripcion', 'activo', 'plazo_total_dias',
            'requiere_aprobacion_director', 'etapas', 'created_at', 'updated_at'
        ]


class EjecucionEtapaSerializer(serializers.ModelSerializer):
    """Serializer para ejecución de etapas"""
    etapa_nombre = serializers.CharField(source='etapa.nombre', read_only=True)
    etapa_orden = serializers.IntegerField(source='etapa.orden', read_only=True)
    ejecutado_por_nombre = serializers.CharField(
        source='ejecutado_por.user.get_full_name', read_only=True)
    estado_display = serializers.CharField(
        source='get_estado_display', read_only=True)
    
    class Meta:
        model = EjecucionEtapa
        fields = [
            'id', 'etapa', 'etapa_nombre', 'etapa_orden', 'estado',
            'estado_display', 'fecha_inicio', 'fecha_limite', 
            'fecha_completada', 'ejecutado_por', 'ejecutado_por_nombre',
            'observaciones', 'archivos_adjuntos', 'modificada_por_anonimato'
        ]


class ProcesoIncidenteSerializer(serializers.ModelSerializer):
    """Serializer para proceso de incidente"""
    protocolo_nombre = serializers.CharField(
        source='protocolo.nombre', read_only=True)
    etapa_actual_nombre = serializers.CharField(
        source='etapa_actual.nombre', read_only=True)
    estado_display = serializers.CharField(
        source='get_estado_display', read_only=True)
    ejecuciones = EjecucionEtapaSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProcesoIncidente
        fields = [
            'id', 'protocolo', 'protocolo_nombre', 'etapa_actual',
            'etapa_actual_nombre', 'estado', 'estado_display',
            'fecha_inicio', 'fecha_limite', 'fecha_completado',
            'observaciones', 'ejecuciones'
        ]


class ReglasAnonimatoSerializer(serializers.ModelSerializer):
    """Serializer para reglas de anonimato"""
    nivel_display = serializers.CharField(
        source='get_nivel_anonimato_display', read_only=True)
    colegio_nombre = serializers.CharField(
        source='colegio.nombre', read_only=True)
    
    class Meta:
        model = ReglasAnonimato
        fields = [
            'id', 'colegio', 'colegio_nombre', 'nivel_anonimato',
            'nivel_display', 'roles_con_acceso', 'requiere_aprobacion',
            'notificar_acceso', 'plazo_acceso_horas'
        ]


class AccesoIdentidadSerializer(serializers.ModelSerializer):
    """Serializer para accesos a identidad"""
    usuario_nombre = serializers.CharField(
        source='usuario_autorizado.user.get_full_name', read_only=True)
    autorizado_por_nombre = serializers.CharField(
        source='autorizado_por.user.get_full_name', read_only=True)
    tipo_display = serializers.CharField(
        source='get_tipo_acceso_display', read_only=True)
    
    class Meta:
        model = AccesoIdentidadDenunciante
        fields = [
            'id', 'usuario_autorizado', 'usuario_nombre', 'tipo_acceso',
            'tipo_display', 'fecha_autorizacion', 'autorizado_por',
            'autorizado_por_nombre', 'motivo', 'fecha_primer_acceso',
            'fecha_ultimo_acceso', 'numero_accesos', 'activo'
        ]


class IncidentReportDetailSerializer(IncidentReportSerializer):
    """Serializer detallado para incidentes con manejo de anonimato"""
    proceso = ProcesoIncidenteSerializer(read_only=True)
    identidad_protegida = serializers.SerializerMethodField()
    puede_ver_identidad = serializers.SerializerMethodField()
    
    def get_identidad_protegida(self, obj):
        """Información del denunciante según nivel de protección"""
        return obj.identidad_denunciante_protegida
    
    def get_puede_ver_identidad(self, obj):
        """Si el usuario actual puede ver la identidad"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            try:
                perfil = PerfilUsuario.objects.get(user=request.user)
                return obj.puede_ver_identidad_denunciante(perfil)
            except PerfilUsuario.DoesNotExist:
                return False
        return False
    
    class Meta(IncidentReportSerializer.Meta):
        fields = IncidentReportSerializer.Meta.fields + [
            'solicita_anonimato', 'nivel_anonimato', 'justificacion_anonimato',
            'proceso', 'identidad_protegida', 'puede_ver_identidad'
        ]
