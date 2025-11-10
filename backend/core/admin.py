"""Registro y configuración del admin para la app core.

Contiene inlines y acciones para facilitar la gestión de reportes
de incidentes y evidencias en el panel de administración.
"""

from django.contrib import admin

from .models import (
    Colegio,
    Evidence,
    IncidentReport,
    MedidaFormativa,
    PerfilUsuario,
    ResolucionIncidente,
    Sancion,
    TipoIncidente,
)


class EvidenceInline(admin.TabularInline):
    """Inline para evidencias en el admin de IncidentReport."""

    model = Evidence
    extra = 0
    readonly_fields = ("uploaded_at",)


class IncidentReportAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "colegio", "estado", "anonimo", "created_at")
    list_filter = ("estado", "colegio", "anonimo", "created_at")
    search_fields = ("titulo", "descripcion", "reportero_nombre", "colegio__nombre")
    inlines = (EvidenceInline,)
    actions = ["mark_investigating", "mark_resolved", "mark_dismissed"]

    def mark_investigating(self, request, queryset):
        updated = queryset.update(estado="investigating")
        self.message_user(request, f"{updated} reportes marcados: Investigando")

    mark_investigating.short_description = "Marcar como Investigando"

    def mark_resolved(self, request, queryset):
        updated = queryset.update(estado="resolved")
        self.message_user(request, f"{updated} reportes marcados: Resuelto")

    mark_resolved.short_description = "Marcar como Resuelto"

    def mark_dismissed(self, request, queryset):
        updated = queryset.update(estado="dismissed")
        self.message_user(request, f"{updated} reportes marcados: Descartado")

    mark_dismissed.short_description = "Marcar como Descartado"


class ColegioAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "direccion", "created_at")
    search_fields = ("nombre", "direccion")


class EvidenceAdmin(admin.ModelAdmin):
    list_display = ("id", "reporte", "descripcion", "archivo", "uploaded_at")
    search_fields = ("descripcion", "reporte__titulo")


# Configuraciones adicionales de admin para los nuevos modelos


class TipoIncidenteAdmin(admin.ModelAdmin):
    list_display = ("nombre", "categoria", "gravedad", "requiere_denuncia")
    list_filter = ("categoria", "gravedad", "requiere_denuncia")
    search_fields = ("nombre", "descripcion")


class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ("user", "tipo_usuario", "colegio", "rut", "curso")
    list_filter = ("tipo_usuario", "colegio")
    search_fields = ("user__username", "user__first_name", "user__last_name", "rut")


class MedidaFormativaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "tipo", "duracion_estimada_horas")
    list_filter = ("tipo",)
    search_fields = ("nombre", "descripcion")


class SancionAdmin(admin.ModelAdmin):
    list_display = ("nombre", "tipo", "dias_duracion")
    list_filter = ("tipo",)
    search_fields = ("nombre", "descripcion")


class ResolucionIncidenteAdmin(admin.ModelAdmin):
    list_display = (
        "incidente",
        "fecha_resolucion",
        "resuelto_por",
        "requiere_seguimiento",
    )
    list_filter = ("requiere_seguimiento", "fecha_resolucion")
    filter_horizontal = ("medidas_formativas", "sanciones")


# Registrar todos los modelos
admin.site.register(Colegio, ColegioAdmin)
admin.site.register(IncidentReport, IncidentReportAdmin)
admin.site.register(Evidence, EvidenceAdmin)
admin.site.register(TipoIncidente, TipoIncidenteAdmin)
admin.site.register(PerfilUsuario, PerfilUsuarioAdmin)
admin.site.register(MedidaFormativa, MedidaFormativaAdmin)
admin.site.register(Sancion, SancionAdmin)
admin.site.register(ResolucionIncidente, ResolucionIncidenteAdmin)
