#!/usr/bin/env python
import os

import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "colegio_api.settings")
django.setup()

from core.models import CustomUser, PerfilUsuario

print("CORRIGIENDO INCONSISTENCIAS...")
print("=" * 50)

# Mapeo de tipos de usuario a roles
TIPO_TO_ROLE = {
    "directivo": "director",
    "encargado_convivencia": "encargado_convivencia",
    "docente": "profesor",
    "estudiante": "estudiante",
    "inspector": "inspector",
    "orientador": "orientador",
}

# Corregir usuarios con perfiles pero sin colegio_id en CustomUser
inconsistent_users = [
    "direccion.salas",
    "convivencia.salas",
    "prof.matematicas",
    "juan.estudiante",
]

for username in inconsistent_users:
    try:
        user = CustomUser.objects.get(username=username)
        perfil = PerfilUsuario.objects.get(user=user)

        # Actualizar colegio_id y role en CustomUser
        old_colegio = user.colegio_id
        old_role = user.role

        user.colegio_id = perfil.colegio_id
        user.role = TIPO_TO_ROLE.get(perfil.tipo_usuario, user.role)
        user.save()

        print(f"✅ {username}:")
        print(f"   Colegio: {old_colegio} → {user.colegio_id}")
        print(f"   Role: {old_role} → {user.role}")

    except Exception as e:
        print(f"❌ Error con {username}: {e}")

print("\n" + "=" * 50)
print("VERIFICACIÓN POST-CORRECCIÓN:")
print("=" * 50)

# Verificar usuarios corregidos
for username in inconsistent_users:
    try:
        user = CustomUser.objects.get(username=username)
        perfil = PerfilUsuario.objects.get(user=user)

        print(f"{username}:")
        print(f"  CustomUser: colegio_id={user.colegio_id}, role={user.role}")
        print(
            f"  PerfilUsuario: colegio_id={perfil.colegio_id}, tipo={perfil.tipo_usuario}"
        )
        print(f"  ✅ Consistente: {user.colegio_id == perfil.colegio_id}")
        print()
    except Exception as e:
        print(f"❌ Error verificando {username}: {e}")
