"""Script simple para poblar la base con datos de ejemplo.
Ejecutar desde la carpeta backend activando antes el venv:

    python create_test_data.py

Creará un Colegio y un IncidentReport.
"""
import os
import django

# Use PyMySQL as a drop-in replacement for MySQLdb so we don't need mysqlclient on Windows
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except Exception:
    # If PyMySQL is not installed the script will fail later; user should install it in the venv
    pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')
django.setup()

from core.models import Colegio, IncidentReport


def run():
    colegio, created = Colegio.objects.get_or_create(
        nombre='Colegio Ejemplo',
        defaults={'direccion': 'Calle Falsa 123'}
    )

    reporte = IncidentReport.objects.create(
        colegio=colegio,
        titulo='Acoso en el patio',
        descripcion='Alumno A empuja y insulta a Alumno B en recreo',
        anonimo=False,
        reportero_nombre='Profesor Juan',
        estado='new'
    )

    print('Colegio id:', colegio.id, 'created=', created)
    print('Reporte id:', reporte.id)


if __name__ == '__main__':
    run()
