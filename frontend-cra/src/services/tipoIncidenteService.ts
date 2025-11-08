import api from './api';
import { TipoIncidente, TipoIncidenteFormData } from '../types/tipoIncidente';

export const tipoIncidenteService = {
  // Obtener todos los tipos de incidente
  async obtenerTodos(colegioId?: number): Promise<TipoIncidente[]> {
    const params = colegioId ? { colegio: colegioId } : {};
    const response = await api.get('/tipos-incidente/', { params });
    return response.data;
  },

  // Obtener tipos específicos de un colegio (legales + propios)
  async obtenerPorColegio(colegioId: number): Promise<TipoIncidente[]> {
    const response = await api.get(`/tipos-incidente/por_colegio/?colegio_id=${colegioId}`);
    return response.data;
  },

  // Obtener solo categorías legales
  async obtenerCategoriasLegales(): Promise<TipoIncidente[]> {
    const response = await api.get('/tipos-incidente/categorias_legales/');
    return response.data;
  },

  // Obtener un tipo específico
  async obtenerPorId(id: number): Promise<TipoIncidente> {
    const response = await api.get(`/tipos-incidente/${id}/`);
    return response.data;
  },

  // Crear nuevo tipo de incidente
  async crear(data: TipoIncidenteFormData): Promise<TipoIncidente> {
    const response = await api.post('/tipos-incidente/', data);
    return response.data;
  },

  // Actualizar tipo de incidente
  async actualizar(id: number, data: Partial<TipoIncidenteFormData>): Promise<TipoIncidente> {
    const response = await api.patch(`/tipos-incidente/${id}/`, data);
    return response.data;
  },

  // Eliminar tipo de incidente (soft delete)
  async eliminar(id: number): Promise<void> {
    await api.delete(`/tipos-incidente/${id}/`);
  },

  // Obtener opciones para formularios
  obtenerOpcionesCategoria(): Array<{value: string, label: string}> {
    return [
      { value: 'bullying', label: 'Acoso Escolar/Bullying' },
      { value: 'violencia_fisica', label: 'Violencia Física' },
      { value: 'violencia_psicologica', label: 'Violencia Psicológica' },
      { value: 'discriminacion', label: 'Discriminación' },
      { value: 'abuso_sexual', label: 'Abuso Sexual' },
      { value: 'consumo_drogas', label: 'Consumo de Drogas/Alcohol' },
      { value: 'porte_armas', label: 'Porte de Armas' },
      { value: 'vandalismo', label: 'Vandalismo' },
      { value: 'ciberacoso', label: 'Ciberacoso' },
      { value: 'otro', label: 'Otro' },
    ];
  },

  obtenerOpcionesGravedad(): Array<{value: string, label: string}> {
    return [
      { value: 'leve', label: 'Leve' },
      { value: 'grave', label: 'Grave' },
      { value: 'muy_grave', label: 'Muy Grave' },
    ];
  }
};