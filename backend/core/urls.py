from rest_framework import routers
from django.urls import path, include
from .views import (
    ColegioViewSet,
    IncidentReportViewSet,
    EvidenceViewSet,
    TipoIncidenteViewSet,
    PerfilUsuarioViewSet,
    MedidaFormativaViewSet,
    SancionViewSet,
    ResolucionIncidenteViewSet,
    GraphsView,
    # ViewSets del sistema de protocolos y anonimato
    ProtocoloProcesoViewSet,
    EtapaProtocoloViewSet,
    ProcesoIncidenteViewSet,
    EjecucionEtapaViewSet,
    ReglasAnonimatoViewSet,
    AccesoIdentidadViewSet,
)

router = routers.DefaultRouter()
router.register(r'colegios', ColegioViewSet)
router.register(r'reportes', IncidentReportViewSet)
router.register(r'evidencias', EvidenceViewSet)
router.register(r'tipos-incidente', TipoIncidenteViewSet)
router.register(r'usuarios', PerfilUsuarioViewSet)
router.register(r'medidas-formativas', MedidaFormativaViewSet)
router.register(r'sanciones', SancionViewSet)
router.register(r'resoluciones', ResolucionIncidenteViewSet)

# Endpoints del sistema de protocolos y anonimato
router.register(r'protocolos-proceso', ProtocoloProcesoViewSet)
router.register(r'etapas-protocolo', EtapaProtocoloViewSet)
router.register(r'procesos-incidente', ProcesoIncidenteViewSet)
router.register(r'ejecuciones-etapa', EjecucionEtapaViewSet)
router.register(r'reglas-anonimato', ReglasAnonimatoViewSet)
router.register(r'accesos-identidad', AccesoIdentidadViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Endpoint para métricas y dashboards
    path('graphs/', GraphsView.as_view(), name='graphs'),
]
