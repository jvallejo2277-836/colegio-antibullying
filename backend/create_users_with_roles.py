#!/usr/bin/env python3
"""
Script para crear usuarios de prueba con diferentes roles
Ejecutar desde el directorio backend: python create_users_with_roles.py
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')
django.setup()

from core.models import CustomUser, Colegio

def crear_usuarios_prueba():
    """Crear usuarios de prueba con diferentes roles"""
    
    # Crear colegios de prueba si no existen
    colegio1, created = Colegio.objects.get_or_create(
        rbd='12345',
        defaults={
            'nombre': 'Colegio San José',
            'direccion': 'Av. Principal 123',
            'director': 'Juan Pérez',
            'telefono': '223456789',
            'email': 'contacto@sanjose.cl'
        }
    )
    
    colegio2, created = Colegio.objects.get_or_create(
        rbd='67890',
        defaults={
            'nombre': 'Liceo María Teresa',
            'direccion': 'Calle Educación 456',
            'director': 'María González',
            'telefono': '223456790',
            'email': 'info@mariateresa.cl'
        }
    )
    
    # Usuarios de prueba
    usuarios_prueba = [
        {
            'username': 'admin',
            'email': 'admin@sistema.cl',
            'first_name': 'Administrador',
            'last_name': 'del Sistema',
            'role': 'admin',
            'colegio': None,
            'password': 'admin123'
        },
        {
            'username': 'director.sanjose',
            'email': 'director@sanjose.cl',
            'first_name': 'Juan',
            'last_name': 'Pérez',
            'role': 'director',
            'colegio': colegio1,
            'password': 'director123',
            'rut': '12345678-9'
        },
        {
            'username': 'convivencia.sanjose',
            'email': 'convivencia@sanjose.cl',
            'first_name': 'Ana',
            'last_name': 'Martínez',
            'role': 'encargado_convivencia',
            'colegio': colegio1,
            'password': 'convivencia123',
            'rut': '23456789-0'
        },
        {
            'username': 'inspector.sanjose',
            'email': 'inspector@sanjose.cl',
            'first_name': 'Carlos',
            'last_name': 'Rodriguez',
            'role': 'inspector',
            'colegio': colegio1,
            'password': 'inspector123',
            'rut': '34567890-1'
        },
        {
            'username': 'profesor.sanjose',
            'email': 'profesor@sanjose.cl',
            'first_name': 'Elena',
            'last_name': 'López',
            'role': 'profesor',
            'colegio': colegio1,
            'password': 'profesor123',
            'rut': '45678901-2'
        },
        {
            'username': 'orientador.sanjose',
            'email': 'orientador@sanjose.cl',
            'first_name': 'Miguel',
            'last_name': 'Fernández',
            'role': 'orientador',
            'colegio': colegio1,
            'password': 'orientador123',
            'rut': '56789012-3'
        },
        {
            'username': 'sostenedor',
            'email': 'sostenedor@fundacion.cl',
            'first_name': 'Patricia',
            'last_name': 'Silva',
            'role': 'sostenedor',
            'colegio': None,  # Sostenedor puede ver múltiples colegios
            'password': 'sostenedor123',
            'rut': '67890123-4'
        },
        {
            'username': 'director.mariateresa',
            'email': 'director@mariateresa.cl',
            'first_name': 'María',
            'last_name': 'González',
            'role': 'director',
            'colegio': colegio2,
            'password': 'director123',
            'rut': '78901234-5'
        }
    ]
    
    usuarios_creados = []
    
    for user_data in usuarios_prueba:
        username = user_data['username']
        
        # Verificar si el usuario ya existe
        if CustomUser.objects.filter(username=username).exists():
            print(f"ℹ️  Usuario '{username}' ya existe, omitiendo...")
            continue
        
        # Crear el usuario
        user = CustomUser.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            role=user_data['role'],
            colegio=user_data['colegio'],
            rut=user_data.get('rut', '')
        )
        
        usuarios_creados.append(user)
        colegio_nombre = user.colegio.nombre if user.colegio else "Sistema Global"
        print(f"✅ Usuario creado: {user.get_full_name()} ({user.get_role_display()}) - {colegio_nombre}")
    
    print(f"\n🎉 Proceso completado! Se crearon {len(usuarios_creados)} nuevos usuarios.")
    
    if usuarios_creados:
        print("\n📋 Credenciales de acceso:")
        print("=" * 60)
        for user in usuarios_creados:
            print(f"👤 {user.get_role_display()}: {user.username} / contraseña: {user_data['password']}")
    
    print(f"\n🏫 Colegios disponibles:")
    for colegio in [colegio1, colegio2]:
        print(f"   • {colegio.nombre} (RBD: {colegio.rbd})")

if __name__ == '__main__':
    print("🚀 Creando usuarios de prueba con diferentes roles...")
    crear_usuarios_prueba()