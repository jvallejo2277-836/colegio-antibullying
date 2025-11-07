"""
Script de inicialización para tipos de incidentes según Ley 20.536
Ejecutar: python manage.py shell < init_tipos_incidentes_ley20536.py
"""

from core.models import TipoIncidente

# Borrar tipos existentes para recrear según ley
TipoIncidente.objects.all().delete()

# Tipos de incidentes según Ley 20.536 y normativa MINEDUC
tipos_ley20536 = [
    # ACOSO ESCOLAR (BULLYING) - Según Art. 16 A
    {
        'nombre': 'Acoso Escolar Físico',
        'categoria': 'bullying',
        'gravedad': 'grave',
        'descripcion': 'Agresión física reiterada que aprovecha situación de superioridad o indefensión. Incluye golpes, empujones, daño a pertenencias de forma sistemática.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },
    {
        'nombre': 'Acoso Escolar Psicológico',
        'categoria': 'bullying', 
        'gravedad': 'grave',
        'descripcion': 'Hostigamiento psicológico reiterado mediante insultos, humillaciones, exclusión social, burlas sistemáticas que generen maltrato o temor fundado.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },
    {
        'nombre': 'Ciberacoso o Ciberbullying',
        'categoria': 'ciberacoso',
        'gravedad': 'grave', 
        'descripcion': 'Acoso escolar realizado por medios tecnológicos (redes sociales, WhatsApp, etc.) de forma reiterada y sistemática.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },

    # VIOLENCIA ESCOLAR - Según Art. 16 A
    {
        'nombre': 'Violencia Física Leve',
        'categoria': 'violencia_fisica',
        'gravedad': 'leve',
        'descripcion': 'Agresión física esporádica sin lesiones graves. Incluye empujones, tirones de pelo, pellizcos.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 5
    },
    {
        'nombre': 'Violencia Física Grave - Lesiones',
        'categoria': 'violencia_fisica',
        'gravedad': 'muy_grave',
        'descripcion': 'Agresión física que causa lesiones que requieren atención médica. Constituye delito según Art. 16 D.',
        'requiere_denuncia': True,
        'plazo_investigacion_dias': 10
    },
    {
        'nombre': 'Violencia Psicológica',
        'categoria': 'violencia_psicologica',
        'gravedad': 'grave',
        'descripcion': 'Agresión verbal, amenazas, intimidación que genere daño psicológico en miembro de la comunidad educativa.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },

    # DELITOS QUE REQUIEREN DENUNCIA OBLIGATORIA - Art. 16 D
    {
        'nombre': 'Abuso Sexual',
        'categoria': 'abuso_sexual',
        'gravedad': 'muy_grave',
        'descripcion': 'Cualquier forma de abuso sexual hacia miembro de la comunidad educativa. Denuncia obligatoria en 24 horas.',
        'requiere_denuncia': True,
        'plazo_investigacion_dias': 3
    },
    {
        'nombre': 'Porte o Tenencia Ilegal de Armas',
        'categoria': 'porte_armas',
        'gravedad': 'muy_grave', 
        'descripcion': 'Porte de armas blancas, de fuego o elementos peligrosos en establecimiento educacional. Denuncia obligatoria.',
        'requiere_denuncia': True,
        'plazo_investigacion_dias': 1
    },
    {
        'nombre': 'Tráfico de Sustancias Ilícitas',
        'categoria': 'consumo_drogas',
        'gravedad': 'muy_grave',
        'descripcion': 'Venta, distribución o tráfico de drogas o sustancias ilícitas en establecimiento. Denuncia obligatoria.',
        'requiere_denuncia': True,
        'plazo_investigacion_dias': 1
    },
    {
        'nombre': 'Amenazas Graves',
        'categoria': 'violencia_psicologica',
        'gravedad': 'muy_grave',
        'descripcion': 'Amenazas de muerte o lesiones graves hacia miembros de la comunidad educativa. Constituye delito.',
        'requiere_denuncia': True,
        'plazo_investigacion_dias': 3
    },
    {
        'nombre': 'Robo con Intimidación',
        'categoria': 'otro',
        'gravedad': 'muy_grave',
        'descripcion': 'Sustracción de bienes mediante fuerza o intimidación en contexto escolar. Constituye delito.',
        'requiere_denuncia': True,
        'plazo_investigacion_dias': 3
    },
    {
        'nombre': 'Hurto',
        'categoria': 'otro',
        'gravedad': 'grave',
        'descripcion': 'Sustracción de bienes sin fuerza en las cosas ni violencia o intimidación en las personas.',
        'requiere_denuncia': True,
        'plazo_investigacion_dias': 5
    },

    # DISCRIMINACIÓN
    {
        'nombre': 'Discriminación por Orientación Sexual',
        'categoria': 'discriminacion',
        'gravedad': 'grave',
        'descripcion': 'Actos discriminatorios por orientación sexual o identidad de género hacia miembros de la comunidad.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },
    {
        'nombre': 'Discriminación Racial o Étnica',
        'categoria': 'discriminacion',
        'gravedad': 'grave',
        'descripcion': 'Actos discriminatorios por origen étnico, nacionalidad, color de piel u origen racial.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },
    {
        'nombre': 'Discriminación por Discapacidad',
        'categoria': 'discriminacion',
        'gravedad': 'grave',
        'descripcion': 'Actos discriminatorios hacia personas con discapacidad física, mental, intelectual o sensorial.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },

    # CONSUMO DE SUSTANCIAS
    {
        'nombre': 'Consumo de Alcohol en Establecimiento',
        'categoria': 'consumo_drogas',
        'gravedad': 'grave',
        'descripcion': 'Consumo de bebidas alcohólicas en establecimiento educacional o actividades escolares.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 5
    },
    {
        'nombre': 'Consumo de Drogas en Establecimiento',
        'categoria': 'consumo_drogas',
        'gravedad': 'muy_grave',
        'descripcion': 'Consumo de sustancias ilícitas en establecimiento educacional. Puede requerir denuncia según cantidad.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 3
    },

    # OTROS TIPOS SEGÚN NORMATIVA
    {
        'nombre': 'Vandalismo Menor',
        'categoria': 'vandalismo',
        'gravedad': 'leve',
        'descripcion': 'Daño menor a infraestructura o bienes del establecimiento. Rayados, daños menores.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 5
    },
    {
        'nombre': 'Vandalismo Grave',
        'categoria': 'vandalismo',
        'gravedad': 'grave',
        'descripcion': 'Daño grave a infraestructura o bienes del establecimiento que requiere reparación costosa.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 10
    },
    {
        'nombre': 'Conducta Contraria a la Convivencia',
        'categoria': 'otro',
        'gravedad': 'leve',
        'descripcion': 'Conductas que alteran la convivencia escolar sin constituir violencia. Disrupciones, desobediencia.',
        'requiere_denuncia': False,
        'plazo_investigacion_dias': 3
    }
]

# Crear los tipos de incidentes
for tipo_data in tipos_ley20536:
    tipo = TipoIncidente.objects.create(**tipo_data)
    print(f"✅ Creado: {tipo.nombre} ({tipo.get_gravedad_display()})")

print(f"\n🎉 Se han creado {len(tipos_ley20536)} tipos de incidentes según Ley 20.536")
print("\nTipos por gravedad:")
print(f"- Leves: {TipoIncidente.objects.filter(gravedad='leve').count()}")
print(f"- Graves: {TipoIncidente.objects.filter(gravedad='grave').count()}")  
print(f"- Muy Graves: {TipoIncidente.objects.filter(gravedad='muy_grave').count()}")

print(f"\nTipos que requieren denuncia obligatoria: {TipoIncidente.objects.filter(requiere_denuncia=True).count()}")

print("\n📋 Tipos creados según Art. 16 A y 16 D de Ley 20.536:")
for categoria in ['bullying', 'violencia_fisica', 'abuso_sexual', 'porte_armas', 'consumo_drogas']:
    count = TipoIncidente.objects.filter(categoria=categoria).count()
    if count > 0:
        print(f"- {categoria.replace('_', ' ').title()}: {count} tipos")