from django.db import models


class Colegio(models.Model):
    nombre = models.CharField(max_length=255)
    direccion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre


class IncidentReport(models.Model):
    STATUS_CHOICES = [
        ('new', 'Nuevo'),
        ('investigating', 'Investigando'),
        ('resolved', 'Resuelto'),
        ('dismissed', 'Descartado'),
    ]

    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE, related_name='reportes')
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    anonimo = models.BooleanField(default=True)
    reportero_nombre = models.CharField(max_length=255, blank=True, null=True)
    estado = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} ({self.get_estado_display()})"


class Evidence(models.Model):
    reporte = models.ForeignKey(IncidentReport, on_delete=models.CASCADE, related_name='evidencias')
    archivo = models.FileField(upload_to='evidencias/')
    descripcion = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evidencia {self.id} para {self.reporte.id}"
