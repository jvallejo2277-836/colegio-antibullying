#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')
django.setup()

from core.models import CustomUser, Colegio
from django.contrib.auth.hashers import make_password

print("CREANDO USUARIOS ADMIN POR COLEGIO")
print("="*50)

# Obtener todos los colegios
colegios = Colegio.objects.all()

# Datos de usuarios admin a crear
admin_users = [
    {
        'username': 'admin_salas',
        'colegio_id': 1,  # Liceo Experimental Manuel de Salas
        'email': 'admin@salas.cl',
        'first_name': 'Admin',
        'last_name': 'Salas'
    },
    {
        'username': 'admin_sanjose', 
        'colegio_id': 3,  # Colegio San José
        'email': 'admin@sanjose.cl',
        'first_name': 'Admin',
        'last_name': 'San José'
    },
    {
        'username': 'admin_mariateresa',
        'colegio_id': 4,  # Liceo María Teresa
        'email': 'admin@mariateresa.cl',
        'first_name': 'Admin',
        'last_name': 'María Teresa'
    },
    {
        'username': 'admin_sanpatricio',
        'colegio_id': 2,  # Colegio San Patricio
        'email': 'admin@sanpatricio.cl',
        'first_name': 'Admin',
        'last_name': 'San Patricio'
    }
]

# Crear usuarios admin por colegio
for user_data in admin_users:
    try:
        # Verificar si el usuario ya existe
        if CustomUser.objects.filter(username=user_data['username']).exists():
            print(f"⚠️  Usuario {user_data['username']} ya existe")
            continue
            
        # Obtener el colegio
        colegio = Colegio.objects.get(id=user_data['colegio_id'])
        
        # Crear usuario
        user = CustomUser.objects.create(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            password=make_password('admin123'),  # Password por defecto
            role='admin',
            colegio_id=user_data['colegio_id'],
            telefono='+56 9 1234 5678',
            is_staff=True,
            is_active=True
        )
        
        print(f"✅ Creado: {user.username} → {colegio.nombre}")
        
    except Exception as e:
        print(f"❌ Error creando {user_data['username']}: {e}")

print("\n" + "="*50)
print("ACTUALIZANDO USUARIO ADMIN ACTUAL")
print("="*50)

# Actualizar el usuario admin actual para asignarlo al colegio San José
try:
    admin_actual = CustomUser.objects.get(username='admin')
    colegio_sanjose = Colegio.objects.get(id=3)  # San José
    
    print(f"Usuario admin actual: colegio_id={admin_actual.colegio_id}")
    
    # Renombrar a admin_sanjose_old para mantener como backup
    admin_actual.username = 'admin_sanjose_main'
    admin_actual.colegio_id = 3
    admin_actual.email = 'admin.main@sanjose.cl'
    admin_actual.save()
    
    print(f"✅ Usuario admin renombrado a: {admin_actual.username}")
    print(f"✅ Asignado a: {colegio_sanjose.nombre}")
    
except CustomUser.DoesNotExist:
    print("⚠️  Usuario 'admin' no encontrado")
except Exception as e:
    print(f"❌ Error actualizando admin: {e}")

print("\n" + "="*50)
print("VERIFICACIÓN FINAL")
print("="*50)

# Mostrar todos los usuarios admin
admin_users_final = CustomUser.objects.filter(role='admin')
for user in admin_users_final:
    colegio_name = user.colegio.nombre if user.colegio else "Sin colegio"
    print(f"{user.username:<20} → {colegio_name}")

print(f"\nTotal usuarios admin: {admin_users_final.count()}")