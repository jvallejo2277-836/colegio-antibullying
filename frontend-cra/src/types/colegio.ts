// Tipos centralizados para evitar conflictos entre servicios y contextos

export interface Colegio {
  id: number;
  nombre: string;
  rbd: string;
  direccion: string;
  telefono: string;
  email: string;
  director: string;
  encargado_convivencia: string;
  created_at: string;
  reportes_count?: number;
}

export interface ColegioFormData {
  nombre: string;
  rbd: string;
  direccion: string;
  telefono: string;
  email: string;
  director: string;
  encargado_convivencia: string;
}

export interface ColegioResponse extends Colegio {
  // Para respuestas del API que podrían tener campos adicionales
}

export interface ColegioCreateRequest extends ColegioFormData {
  // Para requests de creación
}

export interface ColegioUpdateRequest extends Partial<ColegioFormData> {
  // Para requests de actualización (campos opcionales)
}