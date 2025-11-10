#!/usr/bin/env python
"""
Script para configurar las asignaciones de colegios para el admin
Implementa relación uno-a-muchos para usuario admin
"""

import os
import sys

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "colegio_api.settings")

import django

django.setup()

from core.models import Colegio, ColegioAsignado, CustomUser


def configurar_admin_colegios():
    """Configurar asignaciones de colegios para el admin"""
    print("=" * 80)
    print("CONFIGURANDO ASIGNACIONES UNO-A-MUCHOS PARA ADMIN")
    print("=" * 80)

    # Obtener el admin
    try:
        admin = CustomUser.objects.get(username="admin")
        print(f"✅ Admin encontrado: {admin.username}")
    except CustomUser.DoesNotExist:
        print(
            "❌ Admin no existe! Créalo primero con: python manage.py createsuperuser"
        )
        return

    # Obtener colegios disponibles
    colegios = Colegio.objects.all()
    if not colegios.exists():
        print("❌ No hay colegios en la base de datos")
        return

    print(f"\n📚 Colegios disponibles: {colegios.count()}")
    for colegio in colegios:
        print(f"   • ID: {colegio.id} - {colegio.nombre}")

    # Limpiar asignaciones existentes del admin
    ColegioAsignado.objects.filter(usuario=admin).delete()
    print("\n🧹 Asignaciones anteriores del admin eliminadas")

    # Asignar TODOS los colegios al admin (uno-a-muchos)
    asignaciones_creadas = []
    colegio_principal = None

    for i, colegio in enumerate(colegios):
        # Crear asignación
        asignacion, created = ColegioAsignado.objects.get_or_create(
            usuario=admin,
            colegio=colegio,
            defaults={"es_colegio_principal": i == 0, "activo": True},
        )

        if created:
            asignaciones_creadas.append(asignacion)
            if i == 0:
                colegio_principal = colegio

        print(
            f"   {'✅ Creado' if created else '⚠️  Ya existe'}: {colegio.nombre} {'(PRINCIPAL)' if i == 0 else ''}"
        )

    # Establecer el colegio principal en el usuario
    if colegio_principal:
        admin.colegio_id = colegio_principal.id
        admin.save()
        print(f"\n🎯 Colegio activo del admin: {colegio_principal.nombre}")

    print("\n✅ Configuración completada:")
    print(f"   • Admin: {admin.username}")
    print(
        f"   • Colegios asignados: {ColegioAsignado.objects.filter(usuario=admin).count()}"
    )
    print(
        f"   • Colegio activo: {admin.colegio.nombre if admin.colegio else 'Ninguno'}"
    )

    # Verificar la configuración
    print("\n" + "=" * 80)
    print("VERIFICACIÓN FINAL")
    print("=" * 80)

    asignaciones = ColegioAsignado.objects.filter(usuario=admin)
    print(f"👤 Usuario: {admin.username}")
    print(f"🎯 Colegio activo: {admin.colegio.nombre if admin.colegio else 'Ninguno'}")
    print(f"📚 Total colegios asignados: {asignaciones.count()}")

    for asignacion in asignaciones:
        print(
            f"   • {asignacion.colegio.nombre} {'(PRINCIPAL)' if asignacion.es_colegio_principal else ''}"
        )


if __name__ == "__main__":
    configurar_admin_colegios()
