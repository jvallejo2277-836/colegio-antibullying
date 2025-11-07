import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Interfaces para TypeScript
export interface DashboardMetrics {
  resumen: {
    colegios_count: number;
    reportes_count: number;
    evidencias_count: number;
    reportes_criticos: number;
  };
  reportes_por_estado: Array<{
    estado: string;
    count: number;
  }>;
  reportes_por_tipo: Array<{
    tipo_incidente__nombre: string;
    tipo_incidente__categoria: string;
    count: number;
  }>;
  reportes_por_gravedad: Array<{
    tipo_incidente__gravedad: string;
    count: number;
  }>;
}

export interface Colegio {
  id: number;
  nombre: string;
  rbd: string;
  director: string;
  direccion: string;
  telefono: string;
  email: string;
  created_at: string;
}

export interface IncidentReport {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  urgencia: string;
  fecha_incidente: string;
  lugar_incidente: string;
  colegio: number;
  tipo_incidente: number;
  anonimo: boolean;
  created_at: string;
}

export interface TipoIncidente {
  id: number;
  nombre: string;
  categoria: string;
  gravedad: string;
  descripcion: string;
  requiere_denuncia: boolean;
}

// Servicios API
export const apiService = {
  // Dashboard y métricas
  getDashboardMetrics: (): Promise<DashboardMetrics> =>
    api.get('/graphs/').then(res => res.data),

  // Colegios
  getColegios: (): Promise<Colegio[]> =>
    api.get('/colegios/').then(res => res.data.results || res.data),

  getColegio: (id: number): Promise<Colegio> =>
    api.get(`/colegios/${id}/`).then(res => res.data),

  // Reportes
  getReportes: (params?: any): Promise<IncidentReport[]> =>
    api.get('/reportes/', { params }).then(res => res.data.results || res.data),

  getReportesUrgentes: (): Promise<IncidentReport[]> =>
    api.get('/reportes/urgentes/').then(res => res.data),

  getReporte: (id: number): Promise<IncidentReport> =>
    api.get(`/reportes/${id}/`).then(res => res.data),

  createReporte: (data: Partial<IncidentReport>): Promise<IncidentReport> =>
    api.post('/reportes/', data).then(res => res.data),

  // Tipos de incidentes
  getTiposIncidente: (): Promise<TipoIncidente[]> =>
    api.get('/tipos-incidente/').then(res => res.data.results || res.data),

  // Utilidades
  ping: (): Promise<boolean> =>
    api.get('/graphs/')
      .then(() => true)
      .catch(() => false),
};

export default api;