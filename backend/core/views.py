from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from .models import (
    Colegio, IncidentReport, Evidence, TipoIncidente, 
    PerfilUsuario, MedidaFormativa, Sancion, ResolucionIncidente,
    ProtocoloProceso, EtapaProtocolo, ProcesoIncidente, EjecucionEtapa,
    ReglasAnonimato, AccesoIdentidadDenunciante
)
from .serializers import (
    ColegioSerializer, IncidentReportSerializer, IncidentReportListSerializer,
    EvidenceSerializer, TipoIncidenteSerializer, PerfilUsuarioSerializer,
    MedidaFormativaSerializer, SancionSerializer, ResolucionIncidenteSerializer,
    ProtocoloProcesoSerializer, EtapaProtocoloSerializer, 
    ProcesoIncidenteSerializer, EjecucionEtapaSerializer,
    ReglasAnonimatoSerializer, AccesoIdentidadSerializer,
    IncidentReportDetailSerializer
)


class GraphsView(APIView):
    """Endpoint que retorna métricas agregadas para dashboards y gráficos."""
    
    def get(self, request, format=None):
        # Estadísticas generales
        colegios_count = Colegio.objects.count()
        reportes_count = IncidentReport.objects.count()
        evidencias_count = Evidence.objects.count()
        
        # Reportes por estado
        reportes_por_estado = IncidentReport.objects.values('estado').annotate(
            count=Count('id')
        ).order_by('estado')
        
        # Reportes por tipo de incidente
        reportes_por_tipo = IncidentReport.objects.values(
            'tipo_incidente__nombre', 'tipo_incidente__categoria'
        ).annotate(count=Count('id')).order_by('-count')[:10]
        
        # Reportes por gravedad
        reportes_por_gravedad = IncidentReport.objects.values(
            'tipo_incidente__gravedad'
        ).annotate(count=Count('id')).order_by('tipo_incidente__gravedad')
        
        # Reportes críticos (alta urgencia o vencidos)
        from django.utils import timezone
        now = timezone.now()
        reportes_criticos = IncidentReport.objects.filter(
            Q(urgencia='critica') | 
            Q(fecha_limite_investigacion__lt=now, estado__in=['recibido', 'en_investigacion'])
        ).count()
        
        data = {
            "resumen": {
                "colegios_count": colegios_count,
                "reportes_count": reportes_count,
                "evidencias_count": evidencias_count,
                "reportes_criticos": reportes_criticos
            },
            "reportes_por_estado": list(reportes_por_estado),
            "reportes_por_tipo": list(reportes_por_tipo),
            "reportes_por_gravedad": list(reportes_por_gravedad)
        }
        return Response(data)


class ColegioViewSet(viewsets.ModelViewSet):
    queryset = Colegio.objects.all()
    serializer_class = ColegioSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['rbd']
    search_fields = ['nombre', 'rbd', 'director']
    
    @action(detail=True, methods=['get'])
    def reportes(self, request, pk=None):
        """Obtener reportes de un colegio específico"""
        colegio = self.get_object()
        reportes = colegio.reportes.all().order_by('-created_at')
        serializer = IncidentReportListSerializer(reportes, many=True)
        return Response(serializer.data)


class TipoIncidenteViewSet(viewsets.ModelViewSet):
    queryset = TipoIncidente.objects.all()
    serializer_class = TipoIncidenteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['categoria', 'gravedad', 'requiere_denuncia']


class PerfilUsuarioViewSet(viewsets.ModelViewSet):
    queryset = PerfilUsuario.objects.all()
    serializer_class = PerfilUsuarioSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tipo_usuario', 'colegio']
    search_fields = ['user__first_name', 'user__last_name', 'rut']


class MedidaFormativaViewSet(viewsets.ModelViewSet):
    queryset = MedidaFormativa.objects.all()
    serializer_class = MedidaFormativaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo']


class SancionViewSet(viewsets.ModelViewSet):
    queryset = Sancion.objects.all()
    serializer_class = SancionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo']


class IncidentReportViewSet(viewsets.ModelViewSet):
    queryset = IncidentReport.objects.select_related(
        'colegio', 'tipo_incidente', 'reportero'
    ).prefetch_related(
        'estudiantes_involucrados', 'evidencias'
    ).order_by('-created_at')
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'urgencia', 'colegio', 'tipo_incidente', 'anonimo']
    search_fields = ['titulo', 'descripcion', 'lugar_incidente']
    ordering_fields = ['created_at', 'fecha_incidente', 'urgencia']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return IncidentReportListSerializer
        return IncidentReportSerializer
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar el estado de un reporte"""
        reporte = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado in dict(IncidentReport.STATUS_CHOICES):
            reporte.estado = nuevo_estado
            reporte.save()
            return Response({'status': 'Estado actualizado'})
        
        return Response({'error': 'Estado inválido'}, status=400)
    
    @action(detail=False, methods=['get'])
    def urgentes(self, request):
        """Obtener reportes urgentes o vencidos"""
        from django.utils import timezone
        now = timezone.now()
        
        reportes_urgentes = self.get_queryset().filter(
            Q(urgencia__in=['alta', 'critica']) |
            Q(fecha_limite_investigacion__lt=now, estado__in=['recibido', 'en_investigacion'])
        )
        
        serializer = IncidentReportListSerializer(reportes_urgentes, many=True)
        return Response(serializer.data)


class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.select_related('reporte', 'subido_por')
    serializer_class = EvidenceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo_evidencia', 'reporte', 'es_confidencial']


class ResolucionIncidenteViewSet(viewsets.ModelViewSet):
    queryset = ResolucionIncidente.objects.select_related(
        'incidente', 'resuelto_por'
    ).prefetch_related('medidas_formativas', 'sanciones')
    serializer_class = ResolucionIncidenteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['requiere_seguimiento']


# =============================================================================
# VIEWSETS PARA SISTEMA DE PROTOCOLOS Y ANONIMATO
# =============================================================================

class ProtocoloProcesoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de protocolos de proceso"""
    queryset = ProtocoloProceso.objects.select_related(
        'colegio'
    ).prefetch_related('etapas')
    serializer_class = ProtocoloProcesoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['colegio', 'gravedad', 'activo']
    search_fields = ['nombre', 'descripcion']
    
    @action(detail=True, methods=['get'])
    def etapas(self, request, pk=None):
        """Obtener etapas de un protocolo específico"""
        protocolo = self.get_object()
        etapas = protocolo.etapas.all()
        serializer = EtapaProtocoloSerializer(etapas, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def duplicar(self, request, pk=None):
        """Duplicar un protocolo para otro colegio"""
        protocolo_original = self.get_object()
        nuevo_colegio_id = request.data.get('colegio_id')
        
        if not nuevo_colegio_id:
            return Response({'error': 'colegio_id es requerido'}, status=400)
        
        try:
            nuevo_colegio = Colegio.objects.get(id=nuevo_colegio_id)
        except Colegio.DoesNotExist:
            return Response({'error': 'Colegio no encontrado'}, status=404)
        
        # Crear nuevo protocolo
        nuevo_protocolo = ProtocoloProceso.objects.create(
            colegio=nuevo_colegio,
            gravedad=protocolo_original.gravedad,
            nombre=f"{protocolo_original.nombre} (Copia)",
            descripcion=protocolo_original.descripcion,
            plazo_total_dias=protocolo_original.plazo_total_dias,
            requiere_aprobacion_director=(
                protocolo_original.requiere_aprobacion_director
            )
        )
        
        # Duplicar etapas
        for etapa_original in protocolo_original.etapas.all():
            EtapaProtocolo.objects.create(
                protocolo=nuevo_protocolo,
                orden=etapa_original.orden,
                nombre=etapa_original.nombre,
                descripcion=etapa_original.descripcion,
                plazo_horas=etapa_original.plazo_horas,
                es_plazo_habiles=etapa_original.es_plazo_habiles,
                responsable_rol=etapa_original.responsable_rol,
                acciones_requeridas=etapa_original.acciones_requeridas,
                documentos_requeridos=etapa_original.documentos_requeridos,
                es_obligatoria=etapa_original.es_obligatoria,
                permite_anonimo=etapa_original.permite_anonimo,
                accion_si_anonimo=etapa_original.accion_si_anonimo,
                descripcion_anonimo=etapa_original.descripcion_anonimo
            )
        
        serializer = self.get_serializer(nuevo_protocolo)
        return Response(serializer.data, status=201)


class EtapaProtocoloViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de etapas de protocolo"""
    queryset = EtapaProtocolo.objects.select_related('protocolo')
    serializer_class = EtapaProtocoloSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        'protocolo', 'responsable_rol', 'es_obligatoria', 'permite_anonimo'
    ]
    search_fields = ['nombre', 'descripcion']


class ProcesoIncidenteViewSet(viewsets.ModelViewSet):
    """ViewSet para seguimiento de procesos de incidente"""
    queryset = ProcesoIncidente.objects.select_related(
        'incidente', 'protocolo', 'etapa_actual'
    ).prefetch_related('ejecuciones__etapa', 'ejecuciones__ejecutado_por')
    serializer_class = ProcesoIncidenteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['estado', 'protocolo', 'incidente__colegio']
    
    @action(detail=True, methods=['post'])
    def avanzar_etapa(self, request, pk=None):
        """Avanzar a la siguiente etapa del proceso"""
        proceso = self.get_object()
        
        if not proceso.etapa_actual:
            return Response({'error': 'No hay etapa actual'}, status=400)
        
        # Buscar siguiente etapa
        siguiente_etapa = EtapaProtocolo.objects.filter(
            protocolo=proceso.protocolo,
            orden__gt=proceso.etapa_actual.orden
        ).first()
        
        if not siguiente_etapa:
            # Es la última etapa, completar proceso
            proceso.estado = 'completado'
            proceso.etapa_actual = None
        else:
            proceso.etapa_actual = siguiente_etapa
        
        proceso.save()
        serializer = self.get_serializer(proceso)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def pausar(self, request, pk=None):
        """Pausar el proceso"""
        proceso = self.get_object()
        proceso.estado = 'pausado'
        proceso.save()
        return Response({'status': 'pausado'})
    
    @action(detail=True, methods=['post'])
    def reanudar(self, request, pk=None):
        """Reanudar el proceso"""
        proceso = self.get_object()
        proceso.estado = 'en_curso'
        proceso.save()
        return Response({'status': 'reanudado'})


class EjecucionEtapaViewSet(viewsets.ModelViewSet):
    """ViewSet para ejecución de etapas"""
    queryset = EjecucionEtapa.objects.select_related(
        'proceso', 'etapa', 'ejecutado_por'
    )
    serializer_class = EjecucionEtapaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['proceso', 'estado', 'ejecutado_por']
    
    @action(detail=True, methods=['post'])
    def completar(self, request, pk=None):
        """Marcar etapa como completada"""
        from django.utils import timezone
        
        ejecucion = self.get_object()
        ejecucion.estado = 'completada'
        ejecucion.fecha_completada = timezone.now()
        ejecucion.observaciones = request.data.get('observaciones', '')
        ejecucion.save()
        
        # Avanzar proceso automáticamente si está configurado
        proceso = ejecucion.proceso
        if proceso.etapa_actual == ejecucion.etapa:
            # Buscar siguiente etapa
            siguiente = EtapaProtocolo.objects.filter(
                protocolo=proceso.protocolo,
                orden__gt=ejecucion.etapa.orden
            ).first()
            
            if siguiente:
                proceso.etapa_actual = siguiente
                proceso.save()
        
        serializer = self.get_serializer(ejecucion)
        return Response(serializer.data)


class ReglasAnonimatoViewSet(viewsets.ModelViewSet):
    """ViewSet para reglas de anonimato por colegio"""
    queryset = ReglasAnonimato.objects.select_related('colegio')
    serializer_class = ReglasAnonimatoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['colegio', 'nivel_anonimato']


class AccesoIdentidadViewSet(viewsets.ModelViewSet):
    """ViewSet para control de acceso a identidades"""
    queryset = AccesoIdentidadDenunciante.objects.select_related(
        'incidente', 'usuario_autorizado', 'autorizado_por'
    )
    serializer_class = AccesoIdentidadSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'incidente', 'usuario_autorizado', 'tipo_acceso', 'activo'
    ]
    
    @action(detail=True, methods=['post'])
    def registrar_acceso(self, request, pk=None):
        """Registrar un acceso a la identidad"""
        acceso = self.get_object()
        acceso.registrar_acceso()
        return Response({'accesos': acceso.numero_accesos})
