from django.core.management.base import BaseCommand
from django.db import transaction
from core.models import TipoIncidente


class Command(BaseCommand):
    help = 'Poblar la base de datos con tipos de incidentes definidos por ley'

    def handle(self, *args, **options):
        """Crear tipos de incidentes base según normativa legal chilena"""
        
        tipos_legales = [
            {
                'nombre': 'Bullying/Acoso Escolar',
                'categoria': 'bullying',
                'gravedad': 'grave',
                'descripcion': 'Conducta de persecución física o psicológica que realiza un estudiante contra otro.',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5,
                'protocolo_especifico': 'Seguir protocolo de convivencia escolar establecido por el establecimiento.',
            },
            {
                'nombre': 'Violencia Física',
                'categoria': 'violencia_fisica',
                'gravedad': 'muy_grave',
                'descripcion': 'Agresión física que puede causar lesiones corporales.',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 3,
                'protocolo_especifico': 'Denuncia inmediata a Carabineros o PDI según gravedad de las lesiones.',
            },
            {
                'nombre': 'Violencia Psicológica',
                'categoria': 'violencia_psicologica',
                'gravedad': 'grave',
                'descripcion': 'Hostigamiento verbal, intimidación, humillación, discriminación.',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5,
                'protocolo_especifico': 'Evaluación psicológica y medidas de protección.',
            },
            {
                'nombre': 'Discriminación',
                'categoria': 'discriminacion',
                'gravedad': 'grave',
                'descripcion': 'Distinción, exclusión o restricción por motivos de raza, sexo, religión, etc.',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 7,
                'protocolo_especifico': 'Activación de medidas formativas y reparatorias.',
            },
            {
                'nombre': 'Abuso Sexual',
                'categoria': 'abuso_sexual',
                'gravedad': 'muy_grave',
                'descripcion': 'Contacto sexual no consensual o inapropiado.',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1,
                'protocolo_especifico': 'Denuncia INMEDIATA a Fiscalía y protección de la víctima.',
            },
            {
                'nombre': 'Consumo de Drogas/Alcohol',
                'categoria': 'consumo_drogas',
                'gravedad': 'muy_grave',
                'descripcion': 'Consumo, porte o tráfico de sustancias ilícitas o alcohol.',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 2,
                'protocolo_especifico': 'Denuncia a PDI y derivación a programa de rehabilitación.',
            },
            {
                'nombre': 'Porte de Armas',
                'categoria': 'porte_armas',
                'gravedad': 'muy_grave',
                'descripcion': 'Ingreso o porte de armas de fuego, cortopunzantes o contundentes.',
                'requiere_denuncia': True,
                'plazo_investigacion_dias': 1,
                'protocolo_especifico': 'Denuncia INMEDIATA a Carabineros y decomiso del arma.',
            },
            {
                'nombre': 'Ciberacoso',
                'categoria': 'ciberacoso',
                'gravedad': 'grave',
                'descripcion': 'Acoso a través de medios digitales, redes sociales o tecnológicos.',
                'requiere_denuncia': False,
                'plazo_investigacion_dias': 5,
                'protocolo_especifico': 'Preservación de evidencia digital y medidas de protección online.',
            },
        ]

        with transaction.atomic():
            created_count = 0
            updated_count = 0
            
            for tipo_data in tipos_legales:
                tipo, created = TipoIncidente.objects.update_or_create(
                    categoria=tipo_data['categoria'],
                    es_categoria_legal=True,
                    colegio=None,  # Las categorías legales no pertenecen a un colegio específico
                    defaults={
                        'nombre': tipo_data['nombre'],
                        'gravedad': tipo_data['gravedad'],
                        'descripcion': tipo_data['descripcion'],
                        'requiere_denuncia': tipo_data['requiere_denuncia'],
                        'plazo_investigacion_dias': tipo_data['plazo_investigacion_dias'],
                        'protocolo_especifico': tipo_data['protocolo_especifico'],
                        'activo': True,
                    }
                )
                
                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Creado: {tipo.nombre}')
                    )
                else:
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'🔄 Actualizado: {tipo.nombre}')
                    )

        self.stdout.write('\n' + '='*60)
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Proceso completado:\n'
                f'   • {created_count} tipos creados\n'
                f'   • {updated_count} tipos actualizados\n'
                f'   • Total: {len(tipos_legales)} categorías legales'
            )
        )
        self.stdout.write('='*60)