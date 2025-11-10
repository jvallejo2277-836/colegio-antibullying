# -*- coding: utf-8 -*-
"""
Script de inicialización de tipos de incidentes para el sistema antibullying
Configurado para español de Chile con UTF-8
"""

import os

import django

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "colegio_api.settings")
django.setup()

from core.models import TipoIncidente


def init_incident_types():
    """
    Inicializa los tipos de incidentes según la clasificación de la Ley 20.536
    y las mejores prácticas en convivencia escolar chilena.
    """

    # Datos en español correcto con UTF-8
    tipos_incidentes = [
        # Violencia Física
        {
            "nombre": "Agresión Física Leve",
            "descripcion": "Actos de violencia física que no causan lesiones graves: empujones, tirones de pelo, pellizcos.",
            "categoria": "VIOLENCIA_FISICA",
            "severidad": "LEVE",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        {
            "nombre": "Agresión Física Grave",
            "descripcion": "Actos de violencia física que causan lesiones o pueden causarlas: golpes, patadas, uso de objetos.",
            "categoria": "VIOLENCIA_FISICA",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
        {
            "nombre": "Pelea Entre Estudiantes",
            "descripcion": "Enfrentamiento físico mutuo entre dos o más estudiantes.",
            "categoria": "VIOLENCIA_FISICA",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 3,
        },
        # Violencia Psicológica
        {
            "nombre": "Acoso Psicológico",
            "descripcion": "Agresiones verbales, humillaciones, insultos o amenazas de manera reiterada.",
            "categoria": "VIOLENCIA_PSICOLOGICA",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        {
            "nombre": "Amenazas Graves",
            "descripcion": "Amenazas de muerte, daño físico grave o que generen temor fundado.",
            "categoria": "VIOLENCIA_PSICOLOGICA",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
        {
            "nombre": "Exclusión Social Sistemática",
            "descripcion": "Aislamiento deliberado y sostenido de un estudiante del grupo.",
            "categoria": "VIOLENCIA_PSICOLOGICA",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 7,
        },
        # Ciberacoso
        {
            "nombre": "Cyberbullying en Redes Sociales",
            "descripcion": "Acoso, humillación o amenazas a través de redes sociales, WhatsApp u otras plataformas.",
            "categoria": "CIBERACOSO",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 3,
        },
        {
            "nombre": "Difusión de Imágenes Sin Consentimiento",
            "descripcion": "Compartir fotos, videos o información privada sin autorización.",
            "categoria": "CIBERACOSO",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
        {
            "nombre": "Suplantación de Identidad Digital",
            "descripcion": "Crear perfiles falsos o usar la identidad de otro estudiante en redes.",
            "categoria": "CIBERACOSO",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 3,
        },
        # Discriminación
        {
            "nombre": "Discriminación por Origen Étnico",
            "descripcion": "Comentarios, burlas o exclusión basada en la etnia o nacionalidad.",
            "categoria": "DISCRIMINACION",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        {
            "nombre": "Discriminación por Orientación Sexual",
            "descripcion": "Agresiones verbales o exclusión por orientación sexual real o percibida.",
            "categoria": "DISCRIMINACION",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        {
            "nombre": "Discriminación por Condición Socioeconómica",
            "descripcion": "Burlas, exclusión o trato diferencial por la situación económica.",
            "categoria": "DISCRIMINACION",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        {
            "nombre": "Discriminación por Discapacidad",
            "descripcion": "Burlas, exclusión o maltrato relacionado con alguna discapacidad o necesidad especial.",
            "categoria": "DISCRIMINACION",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        # Violencia Sexual
        {
            "nombre": "Acoso Sexual",
            "descripcion": "Conductas de carácter sexual no deseadas que afectan la dignidad.",
            "categoria": "VIOLENCIA_SEXUAL",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
        {
            "nombre": "Abuso Sexual",
            "descripcion": "Contacto sexual no consentido o inapropiado.",
            "categoria": "VIOLENCIA_SEXUAL",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
        # Violencia de Género
        {
            "nombre": "Violencia de Género",
            "descripcion": "Agresiones basadas en estereotipos de género o identidad de género.",
            "categoria": "VIOLENCIA_GENERO",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        # Violencia Patrimonial
        {
            "nombre": "Daño a Propiedad Personal",
            "descripcion": "Destrucción, daño o sustracción de pertenencias de otros estudiantes.",
            "categoria": "VIOLENCIA_PATRIMONIAL",
            "severidad": "MEDIA",
            "requiere_denuncia_obligatoria": False,
            "plazo_resolucion_dias": 5,
        },
        {
            "nombre": "Robo o Hurto",
            "descripcion": "Sustracción de dinero u objetos de valor.",
            "categoria": "VIOLENCIA_PATRIMONIAL",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
        # Otros
        {
            "nombre": "Consumo de Sustancias",
            "descripcion": "Consumo de alcohol, drogas o sustancias prohibidas en el establecimiento.",
            "categoria": "OTROS",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
        {
            "nombre": "Porte de Armas",
            "descripcion": "Porte de cualquier tipo de arma o elemento cortopunzante.",
            "categoria": "OTROS",
            "severidad": "GRAVE",
            "requiere_denuncia_obligatoria": True,
            "plazo_resolucion_dias": 1,
        },
    ]

    print("🔄 Inicializando tipos de incidentes en español...")

    # Eliminar tipos existentes para evitar duplicados
    TipoIncidente.objects.all().delete()

    # Crear nuevos tipos con codificación UTF-8
    for tipo_data in tipos_incidentes:
        tipo = TipoIncidente.objects.create(**tipo_data)
        print(f"✅ Creado: {tipo.nombre}")

    print(f"\n🎉 Se crearon {len(tipos_incidentes)} tipos de incidentes exitosamente")
    print("📋 Todos configurados en español de Chile con UTF-8")


if __name__ == "__main__":
    init_incident_types()
