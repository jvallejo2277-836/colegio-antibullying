#!/usr/bin/env python
"""
Script para mostrar las asignaciones de colegios del admin (relación uno a muchos)
"""
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'colegio_api.settings')
django.setup()

from core.models import CustomUser, ColegioAsignado

def mostrar_asignaciones_admin():
    print("=" * 80)
    print("ASIGNACIONES DE COLEGIOS PARA ADMIN (RELACIÓN UNO A MUCHOS)")
    print("=" * 80)
    
    try:
        admin_user = CustomUser.objects.get(username='admin')
        print(f"\n👤 Usuario: {admin_user.username}")
        print(f"📍 Colegio Actual (colegio_id): {admin_user.colegio_id} - {admin_user.colegio.nombre if admin_user.colegio else 'N/A'}")
        
        # Obtener asignaciones
        asignaciones = ColegioAsignado.objects.filter(
            usuario=admin_user, 
            activo=True
        ).select_related('colegio').order_by('-es_colegio_principal', 'colegio__nombre')
        
        if asignaciones.exists():
            print(f"\n🏫 COLEGIOS ASIGNADOS ({asignaciones.count()}):")
            print("-" * 60)
            for asignacion in asignaciones:
                principal = "🌟 PRINCIPAL" if asignacion.es_colegio_principal else "  Regular"
                print(f"{principal} | ID: {asignacion.colegio.id} | {asignacion.colegio.nombre}")
                print(f"          | Asignado: {asignacion.fecha_asignacion.strftime('%Y-%m-%d %H:%M')}")
                if asignacion.es_colegio_principal:
                    print(f"          | ⚡ ACTIVO EN SELECTOR")
                print()
        else:
            print("\n❌ No tiene colegios asignados en tabla ColegioAsignado")
        
        # Verificar método get_colegios_permitidos()
        colegios_permitidos = admin_user.get_colegios_permitidos()
        print(f"🔍 Método get_colegios_permitidos(): {colegios_permitidos.count()} colegios")
        for colegio in colegios_permitidos:
            print(f"   • {colegio.nombre}")
        
    except CustomUser.DoesNotExist:
        print("❌ No se encontró el usuario 'admin'")

def mostrar_logica_selector():
    print("\n" + "=" * 80)
    print("LÓGICA DEL SELECTOR PARA ADMIN")
    print("=" * 80)
    
    print("""
🎯 NUEVA LÓGICA (UNO A MUCHOS):
1. Admin tiene múltiples colegios asignados en tabla 'ColegioAsignado'
2. El campo 'colegio_id' en CustomUser indica el colegio ACTIVO actual
3. El selector permite cambiar entre colegios asignados
4. Cuando cambia en el selector, se actualiza 'colegio_id' en la BD
5. Los otros usuarios siguen con lógica mono-colegio (colegio_id fijo)

📋 COMPORTAMIENTO:
• Admin login → Ve selector con todos sus colegios asignados
• Admin selecciona colegio → Backend actualiza user.colegio_id
• Admin trabaja en contexto del colegio seleccionado
• Sistema mantiene persistencia entre sesiones
• No pierde acceso a otros colegios (quedan en ColegioAsignado)

🔄 SELECTOR ACTUALIZA BD:
• Frontend: admin selecciona nuevo colegio
• Backend: PATCH /api/usuarios/{user_id}/colegio/
• BD: UPDATE customuser SET colegio_id = {nuevo_id}
• Contexto: admin trabaja en nuevo colegio
""")

if __name__ == '__main__':
    mostrar_asignaciones_admin()
    mostrar_logica_selector()