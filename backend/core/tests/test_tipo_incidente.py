from django.test import TestCase

from core.models import Colegio, TipoIncidente


class TipoIncidenteModelTests(TestCase):
    def test_create_legal_category_marks_es_categoria_legal_and_colegio_none(self):
        """Crear un TipoIncidente con categoría legal debe convertirse a categoría legal y limpiar colegio."""
        colegio = Colegio.objects.create(nombre="Colegio Prueba")

        tipo = TipoIncidente.objects.create(
            nombre="Acoso escolar - prueba",
            categoria="bullying",
            gravedad="leve",
            descripcion="Descripción de prueba",
            requiere_denuncia=False,
            plazo_investigacion_dias=5,
            colegio=colegio,
        )

        tipo.refresh_from_db()
        self.assertTrue(tipo.es_categoria_legal)
        self.assertIsNone(tipo.colegio)

    def test_update_colegio_specific_not_converted(self):
        """Actualizar un TipoIncidente específico de colegio no debe convertirlo en categoría legal."""
        colegio = Colegio.objects.create(nombre="Colegio Actualizar")

        tipo = TipoIncidente.objects.create(
            nombre="Tipo Colegio",
            categoria="otro",
            gravedad="leve",
            descripcion="Descripción",
            requiere_denuncia=False,
            plazo_investigacion_dias=3,
            colegio=colegio,
        )

        # Modificar un campo y guardar - no debe cambiar es_categoria_legal ni colegio
        tipo.nombre = "Tipo Colegio Modificado"
        tipo.save()
        tipo.refresh_from_db()

        self.assertFalse(tipo.es_categoria_legal)
        self.assertIsNotNone(tipo.colegio)
        self.assertEqual(tipo.colegio.id, colegio.id)
