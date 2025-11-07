#!/usr/bin/env python
"""
Script para crear colegios de ejemplo en la base de datos.
"""
import os
import sys
import django

# Configurar Django
sys.path.append('/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')
django.setup()

from core.models import Colegio

def create_colegios():
    """Crear colegios de ejemplo"""
    
    colegios_data = [
        {
            'rbd': '10101',
            'nombre': 'Colegio Municipal Las Flores',
            'direccion': 'Av. Las Flores 123, Santiago',
            'telefono': '+56 2 2555 1234',
            'email': 'contacto@lasflores.cl',
            'director': 'María González Pérez'
        },
        {
            'rbd': '10102', 
            'nombre': 'Liceo Técnico San José',
            'direccion': 'Calle San José 456, Providencia',
            'telefono': '+56 2 2777 5678',
            'email': 'direccion@sanjose.cl',
            'director': 'Carlos Rodríguez Silva'
        },
        {
            'rbd': '10103',
            'nombre': 'Escuela Básica El Bosque',
            'direccion': 'Pasaje El Bosque 789, Ñuñoa',
            'telefono': '+56 2 2333 9012',
            'email': 'secretaria@elbosque.cl',
            'director': 'Ana Martínez López'
        },
        {
            'rbd': '10104',
            'nombre': 'Colegio Particular San Patricio',
            'direccion': 'Av. Las Condes 1500, Las Condes',
            'telefono': '+56 2 2888 4567',
            'email': 'administracion@sanpatricio.cl',
            'director': 'Roberto Fernández Castro'
        },
        {
            'rbd': '10105',
            'nombre': 'Instituto Nacional del Norte',
            'direccion': 'Calle Norte 321, La Reina',
            'telefono': '+56 2 2444 7890',
            'email': 'contacto@innorte.cl',
            'director': 'Patricia Morales Ruiz'
        }
    ]
    
    created_count = 0
    
    for colegio_data in colegios_data:
        colegio, created = Colegio.objects.get_or_create(
            rbd=colegio_data['rbd'],
            defaults=colegio_data
        )
        
        if created:
            print(f"✅ Creado: {colegio.nombre} (RBD: {colegio.rbd})")
            created_count += 1
        else:
            print(f"⚠️  Ya existe: {colegio.nombre} (RBD: {colegio.rbd})")
    
    print(f"\n🎯 Resumen: {created_count} colegios nuevos creados")
    print(f"📊 Total colegios en BD: {Colegio.objects.count()}")

if __name__ == '__main__':
    create_colegios()