"""Script para poblar la base de datos con datos de prueba
según la normativa chilena de convivencia escolar.

Ejecutar desde la carpeta backend:
    python create_test_data.py

Crea datos de ejemplo incluye:
- Colegios con RBD
- Tipos de incidentes según Ley 20.536
- Usuarios con diferentes roles
- Medidas formativas y sanciones
- Reportes de incidentes de ejemplo
"""

import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')
django.setup()

from core.models import (
    CustomUser, Colegio, TipoIncidente, PerfilUsuario, MedidaFormativa, 
    Sancion, IncidentReport, Evidence
)


def create_colegios():
    """Crear colegios de ejemplo con RBD chilenos"""
    colegios_data = [
        {
            'nombre': 'Liceo Experimental Manuel de Salas',
            'rbd': '8640-9',
            'direccion': 'Av. José Pedro Alessandri 774, Ñuñoa, Santiago',
            'telefono': '+56229787500',
            'director': 'Ana María González',
            'encargado_convivencia': 'Carlos Mendoza'
        },
        {
            'nombre': 'Colegio San Patricio',
            'rbd': '9234-5',
            'direccion': 'Av. Las Condes 12345, Las Condes, Santiago',
            'telefono': '+56223456789',
            'director': 'María José Silva',
            'encargado_convivencia': 'Pedro Ramírez'
        }
    ]
    
    colegios_creados = []
    for data in colegios_data:
        colegio, created = Colegio.objects.get_or_create(
            rbd=data['rbd'],
            defaults=data
        )
        colegios_creados.append(colegio)
        print(f"Colegio: {colegio.nombre} - {'Creado' if created else 'Ya existe'}")
    
    return colegios_creados


def create_tipos_incidente():
    """Crear tipos de incidentes según normativa chilena"""
    tipos_data = [
        {
            'nombre': 'Bullying Físico',
            'categoria': 'bullying',
            'gravedad': 'grave',
            'descripcion': 'Agresión física repetitiva hacia un estudiante',
            'requiere_denuncia': True,
            'plazo_investigacion_dias': 10
        },
        {
            'nombre': 'Bullying Psicológico',
            'categoria': 'bullying', 
            'gravedad': 'grave',
            'descripcion': 'Intimidación, amenazas o exclusión social sistemática',
            'requiere_denuncia': False,
            'plazo_investigacion_dias': 7
        },
        {
            'nombre': 'Ciberbullying',
            'categoria': 'ciberacoso',
            'gravedad': 'grave',
            'descripcion': 'Acoso a través de medios digitales o redes sociales',
            'requiere_denuncia': False,
            'plazo_investigacion_dias': 5
        },
        {
            'nombre': 'Discriminación por Origen',
            'categoria': 'discriminacion',
            'gravedad': 'muy_grave',
            'descripcion': 'Discriminación por nacionalidad, etnia o clase social',
            'requiere_denuncia': True,
            'plazo_investigacion_dias': 15
        },
        {
            'nombre': 'Consumo de Alcohol en el Establecimiento',
            'categoria': 'consumo_drogas',
            'gravedad': 'muy_grave',
            'descripcion': 'Consumo de bebidas alcohólicas en el colegio',
            'requiere_denuncia': True,
            'plazo_investigacion_dias': 3
        }
    ]
    
    tipos_creados = []
    for data in tipos_data:
        tipo, created = TipoIncidente.objects.get_or_create(
            nombre=data['nombre'],
            defaults=data
        )
        tipos_creados.append(tipo)
        print(f"Tipo incidente: {tipo.nombre} - {'Creado' if created else 'Ya existe'}")
    
    return tipos_creados


def create_usuarios(colegios):
    """Crear usuarios de ejemplo para diferentes roles"""
    usuarios_data = [
        {
            'username': 'direccion.salas',
            'first_name': 'Ana María',
            'last_name': 'González',
            'email': 'direccion@manuelsalas.cl',
            'tipo_usuario': 'directivo',
            'colegio': colegios[0],
            'rut': '12345678-9'
        },
        {
            'username': 'convivencia.salas', 
            'first_name': 'Carlos',
            'last_name': 'Mendoza',
            'email': 'convivencia@manuelsalas.cl',
            'tipo_usuario': 'encargado_convivencia',
            'colegio': colegios[0],
            'rut': '23456789-0'
        },
        {
            'username': 'prof.matematicas',
            'first_name': 'Laura',
            'last_name': 'Pérez',
            'email': 'lperez@manuelsalas.cl', 
            'tipo_usuario': 'docente',
            'colegio': colegios[0],
            'rut': '34567890-1'
        },
        {
            'username': 'juan.estudiante',
            'first_name': 'Juan Carlos',
            'last_name': 'Rodríguez',
            'email': 'juan.rodriguez@estudiante.cl',
            'tipo_usuario': 'estudiante', 
            'colegio': colegios[0],
            'rut': '45678901-2',
            'curso': '8°A'
        }
    ]
    
    perfiles_creados = []
    for data in usuarios_data:
        user_data = {k: v for k, v in data.items() 
                     if k in ['username', 'first_name', 'last_name', 'email']}
        user, created = CustomUser.objects.get_or_create(
            username=data['username'],
            defaults=user_data
        )
        
        if created:
            user.set_password('password123')
            user.save()
        
        perfil_data = {k: v for k, v in data.items() 
                       if k not in ['username', 'first_name', 'last_name', 'email']}
        perfil_data['user'] = user
        
        perfil, created = PerfilUsuario.objects.get_or_create(
            user=user,
            defaults=perfil_data
        )
        perfiles_creados.append(perfil)
        print(f"Usuario: {user.username} ({perfil.tipo_usuario}) - {'Creado' if created else 'Ya existe'}")
    
    return perfiles_creados


def create_medidas_y_sanciones():
    """Crear catálogo de medidas formativas y sanciones"""
    medidas_data = [
        {
            'nombre': 'Diálogo Reflexivo Personal',
            'tipo': 'dialogo_reflexivo',
            'descripcion': 'Conversación individual para reflexionar sobre la conducta',
            'duracion_estimada_horas': 1
        },
        {
            'nombre': 'Trabajo Comunitario en el Colegio',
            'tipo': 'trabajo_comunitario', 
            'descripcion': 'Colaborar en actividades de mejora del establecimiento',
            'duracion_estimada_horas': 8
        },
        {
            'nombre': 'Mediación entre las Partes',
            'tipo': 'mediacion',
            'descripcion': 'Proceso de mediación facilitado por encargado de convivencia',
            'duracion_estimada_horas': 2
        }
    ]
    
    sanciones_data = [
        {
            'nombre': 'Amonestación Verbal',
            'tipo': 'amonestacion_verbal',
            'descripcion': 'Llamada de atención verbal registrada en hoja de vida',
            'dias_duracion': 1
        },
        {
            'nombre': 'Suspensión de Clases por 3 días',
            'tipo': 'suspension_clases',
            'descripcion': 'Suspensión temporal con actividades formativas en casa',
            'dias_duracion': 3
        },
        {
            'nombre': 'Condicionalidad de Matrícula',
            'tipo': 'condicionalidad_matricula', 
            'descripcion': 'Matrícula condicional por el resto del año escolar',
            'dias_duracion': 180
        }
    ]
    
    # Crear medidas formativas
    for data in medidas_data:
        medida, created = MedidaFormativa.objects.get_or_create(
            nombre=data['nombre'],
            defaults=data
        )
        print(f"Medida: {medida.nombre} - {'Creada' if created else 'Ya existe'}")
    
    # Crear sanciones
    for data in sanciones_data:
        sancion, created = Sancion.objects.get_or_create(
            nombre=data['nombre'],
            defaults=data
        )
        print(f"Sanción: {sancion.nombre} - {'Creada' if created else 'Ya existe'}")


def create_reportes_ejemplo(colegios, tipos_incidente, perfiles):
    """Crear reportes de incidentes de ejemplo"""
    # Buscar perfiles específicos
    estudiante = next((p for p in perfiles if p.tipo_usuario == 'estudiante'), None)
    docente = next((p for p in perfiles if p.tipo_usuario == 'docente'), None)
    
    reportes_data = [
        {
            'colegio': colegios[0],
            'tipo_incidente': tipos_incidente[0],  # Bullying Físico
            'titulo': 'Agresión en el recreo',
            'descripcion': 'Estudiante de 7° básico empuja y golpea reiteradamente a compañero durante el recreo. Testigos presentes.',
            'fecha_incidente': datetime.now() - timedelta(days=2),
            'lugar_incidente': 'Patio principal',
            'reportero': docente,
            'anonimo': False,
            'estado': 'en_investigacion',
            'urgencia': 'alta'
        },
        {
            'colegio': colegios[0], 
            'tipo_incidente': tipos_incidente[2],  # Ciberbullying
            'titulo': 'Acoso por redes sociales',
            'descripcion': 'Estudiante recibe mensajes intimidatorios y se comparten fotos suyas sin consentimiento en Instagram.',
            'fecha_incidente': datetime.now() - timedelta(days=5),
            'lugar_incidente': 'Redes sociales/WhatsApp',
            'anonimo': True,
            'reportero_externo_nombre': 'Apoderado anónimo',
            'reportero_externo_contacto': 'apoderado@email.com',
            'estado': 'recibido',
            'urgencia': 'media'
        }
    ]
    
    reportes_creados = []
    for data in reportes_data:
        reporte = IncidentReport.objects.create(**data)
        
        # Agregar estudiante involucrado si existe
        if estudiante:
            reporte.estudiantes_involucrados.add(estudiante)
        
        reportes_creados.append(reporte)
        print(f"Reporte: {reporte.titulo} - Creado")
    
    return reportes_creados


def run():
    """Función principal que ejecuta la creación de datos de prueba"""
    print("=== Creando datos de prueba para Sistema de Convivencia Escolar ===\n")
    
    print("1. Creando colegios...")
    colegios = create_colegios()
    
    print("\n2. Creando tipos de incidentes...")
    tipos = create_tipos_incidente()
    
    print("\n3. Creando usuarios y perfiles...")
    perfiles = create_usuarios(colegios)
    
    print("\n4. Creando medidas formativas y sanciones...")
    create_medidas_y_sanciones()
    
    print("\n5. Creando reportes de ejemplo...")
    reportes = create_reportes_ejemplo(colegios, tipos, perfiles)
    
    print(f"\n=== Datos creados exitosamente ===")
    print(f"Colegios: {len(colegios)}")
    print(f"Tipos de incidente: {len(tipos)}")
    print(f"Usuarios: {len(perfiles)}")
    print(f"Reportes: {len(reportes)}")
    print("\n¡Sistema listo para usar!")


if __name__ == '__main__':
    run()
