from rest_framework import routers
from django.urls import path, include
from .views import (
    ColegioViewSet,
    IncidentReportViewSet,
    EvidenceViewSet,
    GraphsView,
)

router = routers.DefaultRouter()
router.register(r'colegios', ColegioViewSet)
router.register(r'reportes', IncidentReportViewSet)
router.register(r'evidencias', EvidenceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Minimal graphs endpoint used by frontend dashboards
    path('graphs/', GraphsView.as_view(), name='graphs'),
]
