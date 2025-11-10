#!/usr/bin/env python
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')
django.setup()

from django.contrib.auth import authenticate
from core.models import CustomUser

print("=" * 60)
print("VERIFICACIÓN COMPLETA DEL ADMIN")
print("=" * 60)

try:
    # 1. Verificar que el usuario existe
    admin_user = CustomUser.objects.get(username='admin')
    print(f"✅ Usuario encontrado: {admin_user.username}")
    print(f"📧 Email: {admin_user.email}")
    print(f"👨‍💼 Es superuser: {admin_user.is_superuser}")
    print(f"🏢 Es staff: {admin_user.is_staff}")
    print(f"🗓️ Fecha de creación: {admin_user.date_joined}")
    print(f"🔐 Password hash (primeros 20 chars): {admin_user.password[:20]}...")
    
    # 2. Probar autenticación
    print("\n" + "-" * 40)
    print("PROBANDO AUTENTICACIÓN")
    print("-" * 40)
    
    auth_user = authenticate(username='admin', password='admin123')
    if auth_user:
        print("✅ AUTENTICACIÓN EXITOSA")
        print(f"✅ Usuario autenticado: {auth_user.username}")
    else:
        print("❌ FALLO EN AUTENTICACIÓN")
        
    # 3. Verificar colegios asignados
    print("\n" + "-" * 40)
    print("COLEGIOS ASIGNADOS AL ADMIN")
    print("-" * 40)
    
    from core.models import ColegioAsignado
    colegios_asignados = ColegioAsignado.objects.filter(usuario=admin_user)
    
    if colegios_asignados.exists():
        print(f"✅ Colegios asignados: {colegios_asignados.count()}")
        for asignacion in colegios_asignados:
            print(f"  - {asignacion.colegio.nombre} (ID: {asignacion.colegio.id})")
    else:
        print("⚠️  No hay colegios asignados al admin")
        
    # 4. Verificar total de datos
    print("\n" + "-" * 40)
    print("RESUMEN DE DATOS EN EL SISTEMA")
    print("-" * 40)
    
    from core.models import Colegio, IncidentReport, TipoIncidente
    
    print(f"👥 Total usuarios: {CustomUser.objects.count()}")
    print(f"🏫 Total colegios: {Colegio.objects.count()}")
    print(f"📋 Total reportes: {IncidentReport.objects.count()}")
    print(f"📝 Total tipos incidente: {TipoIncidente.objects.count()}")
    print(f"⚖️ Tipos legales: {TipoIncidente.objects.filter(es_categoria_legal=True).count()}")
    print(f"🏫 Tipos personalizados: {TipoIncidente.objects.filter(es_categoria_legal=False).count()}")
    
except CustomUser.DoesNotExist:
    print("❌ Usuario admin no encontrado")
except Exception as e:
    print(f"❌ Error: {e}")
    
print("\n" + "=" * 60)