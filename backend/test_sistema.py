#!/usr/bin/env python
import os
import sys

import django

# Agregar el directorio del proyecto al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "colegio_api.settings")
django.setup()


def test_imports():
    """Verificar que todos los modelos se importen correctamente"""
    try:
        from core.models import (  # Nuevos modelos del sistema de protocolos
            AccesoIdentidadDenunciante,
            Colegio,
            EjecucionEtapa,
            EtapaProtocolo,
            IncidentReport,
            MedidaFormativa,
            PerfilUsuario,
            ProcesoIncidente,
            ProtocoloProceso,
            ReglasAnonimato,
            ResolucionIncidente,
            Sancion,
            TipoIncidente,
        )

        print("✅ Todos los modelos se importaron correctamente")
        return True
    except ImportError as e:
        print(f"❌ Error al importar modelos: {e}")
        return False


def test_serializers():
    """Verificar que todos los serializers se importen correctamente"""
    try:
        from core.serializers import (  # Nuevos serializers
            AccesoIdentidadSerializer,
            ColegioSerializer,
            EjecucionEtapaSerializer,
            EtapaProtocoloSerializer,
            IncidentReportSerializer,
            MedidaFormativaSerializer,
            PerfilUsuarioSerializer,
            ProcesoIncidenteSerializer,
            ProtocoloProcesoSerializer,
            ReglasAnonimatoSerializer,
            ResolucionIncidenteSerializer,
            SancionSerializer,
            TipoIncidenteSerializer,
        )

        print("✅ Todos los serializers se importaron correctamente")
        return True
    except ImportError as e:
        print(f"❌ Error al importar serializers: {e}")
        return False


def test_views():
    """Verificar que todas las vistas se importen correctamente"""
    try:
        from core.views import (  # Nuevas vistas
            AccesoIdentidadViewSet,
            ColegioViewSet,
            EjecucionEtapaViewSet,
            EtapaProtocoloViewSet,
            IncidentReportViewSet,
            MedidaFormativaViewSet,
            PerfilUsuarioViewSet,
            ProcesoIncidenteViewSet,
            ProtocoloProcesoViewSet,
            ReglasAnonimatoViewSet,
            ResolucionIncidenteViewSet,
            SancionViewSet,
            TipoIncidenteViewSet,
        )

        print("✅ Todas las vistas se importaron correctamente")
        return True
    except ImportError as e:
        print(f"❌ Error al importar vistas: {e}")
        return False


def test_urls():
    """Verificar que las URLs se importen correctamente"""
    try:
        from core.urls import router, urlpatterns

        print("✅ URLs se importaron correctamente")
        print(f"   - Rutas registradas: {len(router.registry)}")
        return True
    except ImportError as e:
        print(f"❌ Error al importar URLs: {e}")
        return False


def test_database_schema():
    """Verificar que los modelos tengan la estructura esperada"""
    try:
        from core.models import EtapaProtocolo, ProtocoloProceso

        # Verificar campos del modelo ProtocoloProceso
        protocolo_fields = [field.name for field in ProtocoloProceso._meta.fields]
        expected_fields = [
            "id",
            "colegio",
            "gravedad",
            "nombre",
            "descripcion",
            "plazo_total_dias",
            "requiere_aprobacion_director",
            "activo",
            "created_at",
            "updated_at",
        ]

        missing_fields = set(expected_fields) - set(protocolo_fields)
        if missing_fields:
            print(f"❌ Campos faltantes en ProtocoloProceso: {missing_fields}")
            return False

        # Verificar campos del modelo EtapaProtocolo
        etapa_fields = [field.name for field in EtapaProtocolo._meta.fields]
        expected_etapa_fields = [
            "id",
            "protocolo",
            "orden",
            "nombre",
            "descripcion",
            "plazo_horas",
            "es_plazo_habiles",
            "responsable_rol",
            "acciones_requeridas",
            "documentos_requeridos",
            "es_obligatoria",
            "permite_anonimo",
            "accion_si_anonimo",
            "descripcion_anonimo",
        ]

        missing_etapa_fields = set(expected_etapa_fields) - set(etapa_fields)
        if missing_etapa_fields:
            print(f"❌ Campos faltantes en EtapaProtocolo: {missing_etapa_fields}")
            return False

        print("✅ Estructura de la base de datos verificada correctamente")
        return True
    except Exception as e:
        print(f"❌ Error al verificar estructura de BD: {e}")
        return False


if __name__ == "__main__":
    print("=== VERIFICACIÓN DEL SISTEMA DE PROTOCOLOS ===\n")

    tests = [
        ("Importación de Modelos", test_imports),
        ("Importación de Serializers", test_serializers),
        ("Importación de Vistas", test_views),
        ("Importación de URLs", test_urls),
        ("Estructura de Base de Datos", test_database_schema),
    ]

    results = []
    for test_name, test_func in tests:
        print(f"Ejecutando: {test_name}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Error inesperado en {test_name}: {e}")
            results.append((test_name, False))
        print()

    print("=== RESUMEN DE RESULTADOS ===")
    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"{test_name}: {status}")

    print(f"\nTotal: {passed}/{total} pruebas pasaron")

    if passed == total:
        print("\n🎉 ¡Todos los tests pasaron! El sistema está listo para usar.")
    else:
        print(f"\n⚠️  {total - passed} pruebas fallaron. Revise los errores arriba.")
