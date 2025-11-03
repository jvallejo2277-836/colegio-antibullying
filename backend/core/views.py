from rest_framework import viewsets
from .models import Colegio, IncidentReport, Evidence
from .serializers import ColegioSerializer, IncidentReportSerializer, EvidenceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class GraphsView(APIView):
    """Simple endpoint that returns small aggregate metrics for UI graphs.

    This is a minimal placeholder so the frontend can call /api/graphs/
    while you build richer analytics. It returns counts of main objects.
    """
    def get(self, request, format=None):
        data = {
            "colegios_count": Colegio.objects.count(),
            "reports_count": IncidentReport.objects.count(),
            "evidences_count": Evidence.objects.count(),
        }
        return Response(data)


class ColegioViewSet(viewsets.ModelViewSet):
    queryset = Colegio.objects.all()
    serializer_class = ColegioSerializer


class IncidentReportViewSet(viewsets.ModelViewSet):
    queryset = IncidentReport.objects.all().order_by('-created_at')
    serializer_class = IncidentReportSerializer


class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer
