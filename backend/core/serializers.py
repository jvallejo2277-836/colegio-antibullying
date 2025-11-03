from rest_framework import serializers
from .models import Colegio, IncidentReport, Evidence


class ColegioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colegio
        fields = ['id', 'nombre', 'direccion', 'created_at']


class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = ['id', 'descripcion', 'archivo', 'uploaded_at']


class IncidentReportSerializer(serializers.ModelSerializer):
    evidencias = EvidenceSerializer(many=True, read_only=True)

    class Meta:
        model = IncidentReport
        fields = ['id', 'colegio', 'titulo', 'descripcion', 'anonimo', 'reportero_nombre', 'estado', 'created_at', 'evidencias']
