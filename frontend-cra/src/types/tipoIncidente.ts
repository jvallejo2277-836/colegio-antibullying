export interface TipoIncidente {
  id?: number;
  nombre: string;
  categoria: string;
  categoria_display: string;
  gravedad: string;
  gravedad_display: string;
  descripcion: string;
  requiere_denuncia: boolean;
  plazo_investigacion_dias: number;
  es_categoria_legal: boolean;
  colegio: number | null;
  colegio_nombre?: string;
  activo: boolean;
  protocolo_especifico: string;
  icono_estado: string;
  es_editable: boolean;
  puede_eliminar: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TipoIncidenteFormData {
  nombre: string;
  categoria: string;
  gravedad: string;
  descripcion: string;
  requiere_denuncia: boolean;
  plazo_investigacion_dias: number;
  protocolo_especifico: string;
  colegio: number | null;
}