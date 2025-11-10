# -*- coding: utf-8 -*-
"""
Comando Django para limpiar y recrear tipos de incidentes sin acentos
"""

from core.models import IncidentReport, TipoIncidente
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Limpia y recrea tipos de incidentes sin problemas de codificacion"

    def handle(self, *args, **options):
        """Limpia y recrea los tipos de incidentes"""

        self.stdout.write("🔄 Limpiando tipos de incidentes con problemas...")

        # Primero actualizar reportes existentes a un tipo temporal
        reportes_count = IncidentReport.objects.count()
        if reportes_count > 0:
            # Crear tipo temporal
            tipo_temporal, created = TipoIncidente.objects.get_or_create(
                nombre="Temporal - En Migracion",
                defaults={
                    "descripcion": "Tipo temporal durante actualizacion",
                    "categoria": "otro",
                    "gravedad": "leve",
                    "requiere_denuncia": False,
                    "plazo_investigacion_dias": 5,
                },
            )

            # Actualizar reportes existentes
            IncidentReport.objects.all().update(tipo_incidente=tipo_temporal)
            self.stdout.write(f"📋 {reportes_count} reportes movidos a tipo temporal")

        # Eliminar todos los tipos excepto el temporal
        tipos_eliminados = TipoIncidente.objects.exclude(
            nombre="Temporal - En Migracion"
        ).delete()
        self.stdout.write(f"🗑️ Eliminados tipos problemáticos: {tipos_eliminados[0]}")

        # Datos limpios sin acentos
        tipos_incidentes = [
            # Violencia Fisica
            {
                "nombre": "Agresion Fisica Leve",
                "descripcion": "Empujones, pellizcos sin lesiones graves",
                "categoria": "violencia_fisica",
                "gravedad": "leve",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 5,
            },
            {
                "nombre": "Agresion Fisica Grave",
                "descripcion": "Golpes, patadas que causan lesiones",
                "categoria": "violencia_fisica",
                "gravedad": "grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            {
                "nombre": "Pelea Entre Estudiantes",
                "descripcion": "Enfrentamiento fisico mutuo",
                "categoria": "violencia_fisica",
                "gravedad": "grave",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 3,
            },
            # Violencia Psicologica
            {
                "nombre": "Acoso Psicologico",
                "descripcion": "Humillaciones, insultos reiterados",
                "categoria": "violencia_psicologica",
                "gravedad": "grave",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 5,
            },
            {
                "nombre": "Amenazas Graves",
                "descripcion": "Amenazas de muerte o dano fisico",
                "categoria": "violencia_psicologica",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            {
                "nombre": "Exclusion Social",
                "descripcion": "Aislamiento deliberado del grupo",
                "categoria": "violencia_psicologica",
                "gravedad": "grave",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 7,
            },
            # Ciberacoso
            {
                "nombre": "Ciberacoso",
                "descripcion": "Acoso por redes sociales",
                "categoria": "ciberacoso",
                "gravedad": "grave",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 3,
            },
            {
                "nombre": "Difusion de Imagenes",
                "descripcion": "Compartir fotos/videos sin permiso",
                "categoria": "ciberacoso",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            # Discriminacion
            {
                "nombre": "Discriminacion Etnica",
                "descripcion": "Burlas por origen o nacionalidad",
                "categoria": "discriminacion",
                "gravedad": "grave",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 5,
            },
            {
                "nombre": "Discriminacion Sexual",
                "descripcion": "Exclusion por orientacion sexual",
                "categoria": "discriminacion",
                "gravedad": "grave",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 5,
            },
            # Bullying
            {
                "nombre": "Bullying Sistematico",
                "descripcion": "Acoso escolar persistente",
                "categoria": "bullying",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            # Abuso Sexual
            {
                "nombre": "Acoso Sexual",
                "descripcion": "Conductas sexuales no deseadas",
                "categoria": "abuso_sexual",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            # Drogas
            {
                "nombre": "Consumo de Drogas",
                "descripcion": "Uso de alcohol o sustancias",
                "categoria": "consumo_drogas",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            {
                "nombre": "Trafico de Drogas",
                "descripcion": "Venta o distribucion de sustancias",
                "categoria": "consumo_drogas",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            # Armas
            {
                "nombre": "Porte de Armas Blancas",
                "descripcion": "Cuchillos, elementos cortopunzantes",
                "categoria": "porte_armas",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            {
                "nombre": "Porte de Armas de Fuego",
                "descripcion": "Pistolas, rifles, explosivos",
                "categoria": "porte_armas",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 1,
            },
            # Vandalismo
            {
                "nombre": "Vandalismo Menor",
                "descripcion": "Dano menor a infraestructura",
                "categoria": "vandalismo",
                "gravedad": "grave",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 5,
            },
            {
                "nombre": "Destruccion Grave",
                "descripcion": "Dano severo a instalaciones",
                "categoria": "vandalismo",
                "gravedad": "muy_grave",
                "requiere_denuncia": True,
                "plazo_investigacion_dias": 3,
            },
            # Otros
            {
                "nombre": "Incidente No Clasificado",
                "descripcion": "Situacion pendiente de evaluacion",
                "categoria": "otro",
                "gravedad": "leve",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 7,
            },
            {
                "nombre": "Violacion de Protocolos",
                "descripcion": "Incumplimiento de normas internas",
                "categoria": "otro",
                "gravedad": "leve",
                "requiere_denuncia": False,
                "plazo_investigacion_dias": 3,
            },
        ]

        # Crear nuevos tipos
        created_count = 0
        for tipo_data in tipos_incidentes:
            tipo = TipoIncidente.objects.create(**tipo_data)
            created_count += 1
            self.stdout.write(f"✅ Creado: {tipo.nombre}")

        # Restaurar reportes existentes al primer tipo nuevo
        if reportes_count > 0:
            primer_tipo = TipoIncidente.objects.filter(
                nombre="Agresion Fisica Leve"
            ).first()
            if primer_tipo:
                IncidentReport.objects.filter(
                    tipo_incidente__nombre="Temporal - En Migracion"
                ).update(tipo_incidente=primer_tipo)
                # Eliminar tipo temporal
                TipoIncidente.objects.filter(nombre="Temporal - En Migracion").delete()
                self.stdout.write(f"📋 {reportes_count} reportes restaurados")

        self.stdout.write(
            self.style.SUCCESS(f"🎉 {created_count} tipos creados sin acentos")
        )
        self.stdout.write("✅ Problema de codificacion solucionado")
