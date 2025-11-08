import api from './api';
import { Colegio, ColegioCreateRequest, ColegioUpdateRequest } from '../types/colegio';

export const colegioService = {
  async getAll(): Promise<Colegio[]> {
    try {
      const response = await api.get('/colegios/');
      console.log('API Response:', response.data);
      
      // Django REST Framework devuelve respuesta paginada: {count, results, next, previous}
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching colegios:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Colegio> {
    const response = await api.get(`/colegios/${id}/`);
    return response.data;
  },

  async create(colegio: ColegioCreateRequest): Promise<Colegio> {
    const response = await api.post('/colegios/', colegio);
    return response.data;
  },

  async update(id: number, colegio: ColegioUpdateRequest): Promise<Colegio> {
    const response = await api.put(`/colegios/${id}/`, colegio);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/colegios/${id}/`);
  },

  async getReportes(id: number): Promise<any[]> {
    const response = await api.get(`/colegios/${id}/reportes/`);
    return response.data;
  }
};

export default colegioService;