#!/usr/bin/env python
import os

import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "colegio_api.settings")
django.setup()

from core.models import Colegio, CustomUser, PerfilUsuario

print("=" * 80)
print("ESTRUCTURA DE RELACIONES USUARIO-COLEGIO")
print("=" * 80)

print("\n=== TODOS LOS COLEGIOS ===")
colegios = Colegio.objects.all()
for colegio in colegios:
    print(f"ID: {colegio.id} | Nombre: {colegio.nombre} | RBD: {colegio.rbd}")

print("\n=== TODOS LOS USUARIOS ===")
print(f"{'Username':<20} {'Role':<20} {'Colegio_ID':<12} {'Colegio_Nombre'}")
print("-" * 80)

users = CustomUser.objects.select_related("colegio").all()
for user in users:
    colegio_name = user.colegio.nombre if user.colegio else "Sin colegio"
    print(
        f"{user.username:<20} {user.role:<20} {str(user.colegio_id):<12} {colegio_name}"
    )

print("\n=== PERFILES USUARIO ===")
print(f"{'User_ID':<8} {'Username':<20} {'Tipo_Usuario':<20} {'Colegio_ID'}")
print("-" * 70)

perfiles = PerfilUsuario.objects.select_related("user", "colegio").all()
for perfil in perfiles:
    print(
        f"{perfil.user.id:<8} {perfil.user.username:<20} {perfil.tipo_usuario:<20} {perfil.colegio.id}"
    )

print("\n=== ANÁLISIS DE PROBLEMAS POTENCIALES ===")
print("\n1. Usuarios sin colegio asignado:")
users_sin_colegio = CustomUser.objects.filter(colegio_id__isnull=True)
for user in users_sin_colegio:
    print(f"   - {user.username} ({user.role})")

print("\n2. Usuarios con múltiples perfiles:")
from django.db.models import Count

users_con_multiples_perfiles = (
    PerfilUsuario.objects.values("user")
    .annotate(count=Count("user"))
    .filter(count__gt=1)
)
for item in users_con_multiples_perfiles:
    user = CustomUser.objects.get(id=item["user"])
    print(f"   - {user.username}: {item['count']} perfiles")

print("\n3. Inconsistencias entre CustomUser.colegio_id y PerfilUsuario.colegio_id:")
for perfil in perfiles:
    if perfil.user.colegio_id != perfil.colegio_id:
        print(
            f"   - {perfil.user.username}: CustomUser.colegio_id={perfil.user.colegio_id}, PerfilUsuario.colegio_id={perfil.colegio_id}"
        )
