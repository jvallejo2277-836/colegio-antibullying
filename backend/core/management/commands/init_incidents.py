# -*- coding: utf-8 -*-
"""
Comando Django para inicializar tipos de incidentes en español
"""

from django.core.management.base import BaseCommand
from core.models import TipoIncidente


class Command(BaseCommand):
    help = 'Inicializa tipos de incidentes en español con codificación UTF-8'

    def handle(self, *args, **options):
        """Ejecuta la inicialización de tipos de incidentes"""
        
        # Datos en español correcto con UTF-8
        tipos_incidentes = [
            # Violencia Física
            {
                'nombre': 'Agresion Fisica Leve',
                'descripcion': 'Actos de violencia fisica que no causan lesiones graves.',
                'categoria': 'violencia_fisica',
                'gravedad': 'leve',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5
            },
            {
                'nombre': 'Agresion Fisica Grave',
                'descripcion': 'Actos de violencia fisica que causan lesiones.',
                'categoria': 'violencia_fisica',
                'gravedad': 'grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            {
                'nombre': 'Pelea Entre Estudiantes',
                'descripcion': 'Enfrentamiento fisico mutuo entre estudiantes.',
                'categoria': 'violencia_fisica',
                'gravedad': 'grave',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 3
            },
            
            # Violencia Psicológica
            {
                'nombre': 'Acoso Psicologico',
                'descripcion': 'Agresiones verbales, humillaciones, insultos reiterados.',
                'categoria': 'violencia_psicologica',
                'gravedad': 'grave',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5
            },
            {
                'nombre': 'Amenazas Graves',
                'descripcion': 'Amenazas de muerte o dano fisico grave.',
                'categoria': 'violencia_psicologica',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            {
                'nombre': 'Exclusion Social Sistematica',
                'descripcion': 'Aislamiento deliberado y sostenido de un estudiante.',
                'categoria': 'violencia_psicologica',
                'gravedad': 'grave',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 7
            },
            
            # Ciberacoso
            {
                'nombre': 'Cyberbullying en Redes Sociales',
                'descripcion': 'Acoso a traves de redes sociales y plataformas digitales.',
                'categoria': 'ciberacoso',
                'gravedad': 'grave',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 3
            },
            {
                'nombre': 'Difusion de Imagenes Sin Consentimiento',
                'descripcion': 'Compartir fotos o videos privados sin autorizacion.',
                'categoria': 'ciberacoso',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            
            # Discriminación
            {
                'nombre': 'Discriminacion por Origen Etnico',
                'descripcion': 'Burlas o exclusion basada en etnia o nacionalidad.',
                'categoria': 'discriminacion',
                'gravedad': 'grave',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5
            },
            {
                'nombre': 'Discriminacion por Orientacion Sexual',
                'descripcion': 'Agresiones o exclusion por orientacion sexual.',
                'categoria': 'discriminacion',
                'gravedad': 'grave',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5
            },
            
            # Bullying
            {
                'nombre': 'Bullying Sistematico',
                'descripcion': 'Acoso escolar sistematico y reiterado.',
                'categoria': 'bullying',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            
            # Abuso Sexual
            {
                'nombre': 'Acoso Sexual',
                'descripcion': 'Conductas de caracter sexual no deseadas.',
                'categoria': 'abuso_sexual',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            
            # Consumo de drogas
            {
                'nombre': 'Consumo de Sustancias',
                'descripcion': 'Consumo de alcohol o drogas en el establecimiento.',
                'categoria': 'consumo_drogas',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            {
                'nombre': 'Trafico de Sustancias Ilicitas',
                'descripcion': 'Venta o distribucion de drogas en el establecimiento.',
                'categoria': 'consumo_drogas',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            
            # Porte de armas
            {
                'nombre': 'Porte de Armas',
                'descripcion': 'Porte de armas o elementos cortopunzantes.',
                'categoria': 'porte_armas',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            {
                'nombre': 'Porte de Armas de Fuego',
                'descripcion': 'Porte de armas de fuego o explosivos.',
                'categoria': 'porte_armas',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1
            },
            
            # Vandalismo
            {
                'nombre': 'Vandalismo',
                'descripcion': 'Dano intencional a la infraestructura del colegio.',
                'categoria': 'vandalismo',
                'gravedad': 'grave',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5
            },
            {
                'nombre': 'Destruccion de Propiedad',
                'descripcion': 'Destruccion severa de instalaciones o equipos.',
                'categoria': 'vandalismo',
                'gravedad': 'muy_grave',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 3
            },
            
            # Otros
            {
                'nombre': 'Incidente No Clasificado',
                'descripcion': 'Situacion que requiere evaluacion para clasificacion.',
                'categoria': 'otro',
                'gravedad': 'leve',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 7
            },
            {
                'nombre': 'Violacion de Protocolos COVID',
                'descripcion': 'Incumplimiento de medidas sanitarias establecidas.',
                'categoria': 'otro',
                'gravedad': 'leve',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 3
            }
        ]
        
        self.stdout.write("🔄 Actualizando tipos de incidentes en español...")
        
        # Actualizar tipos existentes o crear nuevos
        created_count = 0
        updated_count = 0
        
        for tipo_data in tipos_incidentes:
            tipo, created = TipoIncidente.objects.update_or_create(
                nombre=tipo_data['nombre'],
                defaults=tipo_data
            )
            if created:
                created_count += 1
                self.stdout.write(f"✅ Creado: {tipo.nombre}")
            else:
                updated_count += 1
                self.stdout.write(f"🔄 Actualizado: {tipo.nombre}")
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 {created_count} tipos creados, {updated_count} actualizados'
            )
        )
        self.stdout.write("📋 Todos configurados en español de Chile con UTF-8")