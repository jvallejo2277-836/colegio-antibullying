# Generated manually for admin multi-colegio support

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_add_tipo_incidente_fields'),
    ]

    operations = [
        # Crear tabla intermedia para admin-colegios (relación muchos a muchos)
        migrations.CreateModel(
            name='ColegioAsignado',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('es_colegio_principal', models.BooleanField(default=False, help_text='Indica si es el colegio principal del usuario')),
                ('fecha_asignacion', models.DateTimeField(auto_now_add=True)),
                ('activo', models.BooleanField(default=True)),
                ('colegio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.colegio')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.customuser')),
            ],
            options={
                'verbose_name': 'Colegio Asignado',
                'verbose_name_plural': 'Colegios Asignados',
            },
        ),
        
        # Agregar índices para mejor performance
        migrations.AddIndex(
            model_name='colegioasignado',
            index=models.Index(fields=['usuario', 'activo'], name='core_col_user_activo_idx'),
        ),
        
        migrations.AddIndex(
            model_name='colegioasignado',
            index=models.Index(fields=['usuario', 'es_colegio_principal'], name='core_col_principal_idx'),
        ),
        
        # Constraint para evitar duplicados
        migrations.AddConstraint(
            model_name='colegioasignado',
            constraint=models.UniqueConstraint(
                fields=['usuario', 'colegio'], 
                name='unique_usuario_colegio'
            ),
        ),
        
        # Constraint para asegurar que solo hay un colegio principal por usuario
        migrations.AddConstraint(
            model_name='colegioasignado',
            constraint=models.UniqueConstraint(
                fields=['usuario'], 
                condition=models.Q(es_colegio_principal=True),
                name='unique_colegio_principal_por_usuario'
            ),
        ),
    ]