#!/usr/bin/env python
"""
Script para resetear la contraseña del admin
"""

import os
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')

import django
django.setup()

from core.models import CustomUser
from django.contrib.auth.hashers import make_password

def reset_admin_password():
    """Resetear contraseña del admin"""
    print("=" * 60)
    print("RESETEANDO CONTRASEÑA DEL ADMIN")
    print("=" * 60)
    
    try:
        # Obtener el admin
        admin = CustomUser.objects.get(username='admin')
        print(f"✅ Admin encontrado: {admin.username}")
        print(f"📧 Email: {admin.email}")
        print(f"👨‍💼 Es superusuario: {admin.is_superuser}")
        print(f"🏢 Es staff: {admin.is_staff}")
        
        # Establecer nueva contraseña
        nueva_password = "admin123"
        admin.set_password(nueva_password)
        admin.save()
        
        print(f"\n✅ Contraseña reseteada exitosamente!")
        print(f"📝 Usuario: admin")
        print(f"🔑 Contraseña: {nueva_password}")
        
        # Verificar que se puede autenticar
        from django.contrib.auth import authenticate
        user = authenticate(username='admin', password=nueva_password)
        
        if user:
            print(f"\n✅ Autenticación verificada: FUNCIONA")
        else:
            print(f"\n❌ Error en autenticación")
            
    except CustomUser.DoesNotExist:
        print("❌ Usuario admin no encontrado")
        print("Creando nuevo usuario admin...")
        
        admin = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@colegio.cl',
            password='admin123',
            first_name='Administrador',
            last_name='Sistema'
        )
        print(f"✅ Admin creado: {admin.username}")

if __name__ == '__main__':
    reset_admin_password()