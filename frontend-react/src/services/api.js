import axios from 'axios';

// Configurar la URL base del API
const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicios para cada endpoint
export const apiService = {
  // Dashboard y métricas
  getGraphs: () => apiClient.get('/graphs/'),
  
  // Colegios
  getColegios: (params = {}) => apiClient.get('/colegios/', { params }),
  getColegio: (id) => apiClient.get(`/colegios/${id}/`),
  createColegio: (data) => apiClient.post('/colegios/', data),
  updateColegio: (id, data) => apiClient.put(`/colegios/${id}/`, data),
  deleteColegio: (id) => apiClient.delete(`/colegios/${id}/`),
  getColegioReportes: (id) => apiClient.get(`/colegios/${id}/reportes/`),
  
  // Tipos de Incidente
  getTiposIncidente: (params = {}) => apiClient.get('/tipos-incidente/', { params }),
  getTipoIncidente: (id) => apiClient.get(`/tipos-incidente/${id}/`),
  createTipoIncidente: (data) => apiClient.post('/tipos-incidente/', data),
  updateTipoIncidente: (id, data) => apiClient.put(`/tipos-incidente/${id}/`, data),
  deleteTipoIncidente: (id) => apiClient.delete(`/tipos-incidente/${id}/`),
  
  // Usuarios y Perfiles
  getUsuarios: (params = {}) => apiClient.get('/usuarios/', { params }),
  getUsuario: (id) => apiClient.get(`/usuarios/${id}/`),
  createUsuario: (data) => apiClient.post('/usuarios/', data),
  updateUsuario: (id, data) => apiClient.put(`/usuarios/${id}/`, data),
  deleteUsuario: (id) => apiClient.delete(`/usuarios/${id}/`),
  
  // Medidas Formativas
  getMedidasFormativas: (params = {}) => apiClient.get('/medidas-formativas/', { params }),
  getMedidaFormativa: (id) => apiClient.get(`/medidas-formativas/${id}/`),
  createMedidaFormativa: (data) => apiClient.post('/medidas-formativas/', data),
  updateMedidaFormativa: (id, data) => apiClient.put(`/medidas-formativas/${id}/`, data),
  deleteMedidaFormativa: (id) => apiClient.delete(`/medidas-formativas/${id}/`),
  
  // Sanciones
  getSanciones: (params = {}) => apiClient.get('/sanciones/', { params }),
  getSancion: (id) => apiClient.get(`/sanciones/${id}/`),
  createSancion: (data) => apiClient.post('/sanciones/', data),
  updateSancion: (id, data) => apiClient.put(`/sanciones/${id}/`, data),
  deleteSancion: (id) => apiClient.delete(`/sanciones/${id}/`),
  
  // Reportes de Incidentes
  getReportes: (params = {}) => apiClient.get('/reportes/', { params }),
  getReporte: (id) => apiClient.get(`/reportes/${id}/`),
  createReporte: (data) => apiClient.post('/reportes/', data),
  updateReporte: (id, data) => apiClient.put(`/reportes/${id}/`, data),
  deleteReporte: (id) => apiClient.delete(`/reportes/${id}/`),
  getReportesUrgentes: () => apiClient.get('/reportes/urgentes/'),
  cambiarEstadoReporte: (id, estado) => apiClient.post(`/reportes/${id}/cambiar_estado/`, { estado }),
  
  // Evidencias
  getEvidencias: (params = {}) => apiClient.get('/evidencias/', { params }),
  getEvidencia: (id) => apiClient.get(`/evidencias/${id}/`),
  createEvidencia: (data) => apiClient.post('/evidencias/', data),
  updateEvidencia: (id, data) => apiClient.put(`/evidencias/${id}/`, data),
  deleteEvidencia: (id) => apiClient.delete(`/evidencias/${id}/`),
  
  // Resoluciones
  getResoluciones: (params = {}) => apiClient.get('/resoluciones/', { params }),
  getResolucion: (id) => apiClient.get(`/resoluciones/${id}/`),
  createResolucion: (data) => apiClient.post('/resoluciones/', data),
  updateResolucion: (id, data) => apiClient.put(`/resoluciones/${id}/`, data),
  deleteResolucion: (id) => apiClient.delete(`/resoluciones/${id}/`),
  
  // Protocolos de Proceso
  getProtocolos: (params = {}) => apiClient.get('/protocolos-proceso/', { params }),
  getProtocolo: (id) => apiClient.get(`/protocolos-proceso/${id}/`),
  createProtocolo: (data) => apiClient.post('/protocolos-proceso/', data),
  updateProtocolo: (id, data) => apiClient.put(`/protocolos-proceso/${id}/`, data),
  deleteProtocolo: (id) => apiClient.delete(`/protocolos-proceso/${id}/`),
  getProtocoloEtapas: (id) => apiClient.get(`/protocolos-proceso/${id}/etapas/`),
  duplicateProtocolo: (id, data) => apiClient.post(`/protocolos-proceso/${id}/duplicar/`, data),
  
  // Etapas de Protocolo
  getEtapas: (params = {}) => apiClient.get('/etapas-protocolo/', { params }),
  getEtapa: (id) => apiClient.get(`/etapas-protocolo/${id}/`),
  createEtapa: (data) => apiClient.post('/etapas-protocolo/', data),
  updateEtapa: (id, data) => apiClient.put(`/etapas-protocolo/${id}/`, data),
  deleteEtapa: (id) => apiClient.delete(`/etapas-protocolo/${id}/`),
  
  // Procesos de Incidente
  getProcesos: (params = {}) => apiClient.get('/procesos-incidente/', { params }),
  getProceso: (id) => apiClient.get(`/procesos-incidente/${id}/`),
  createProceso: (data) => apiClient.post('/procesos-incidente/', data),
  updateProceso: (id, data) => apiClient.put(`/procesos-incidente/${id}/`, data),
  deleteProceso: (id) => apiClient.delete(`/procesos-incidente/${id}/`),
  avanzarEtapa: (id) => apiClient.post(`/procesos-incidente/${id}/avanzar_etapa/`),
  pausarProceso: (id) => apiClient.post(`/procesos-incidente/${id}/pausar/`),
  reanudarProceso: (id) => apiClient.post(`/procesos-incidente/${id}/reanudar/`),
  
  // Ejecuciones de Etapa
  getEjecuciones: (params = {}) => apiClient.get('/ejecuciones-etapa/', { params }),
  getEjecucion: (id) => apiClient.get(`/ejecuciones-etapa/${id}/`),
  createEjecucion: (data) => apiClient.post('/ejecuciones-etapa/', data),
  updateEjecucion: (id, data) => apiClient.put(`/ejecuciones-etapa/${id}/`, data),
  deleteEjecucion: (id) => apiClient.delete(`/ejecuciones-etapa/${id}/`),
  completarEtapa: (id, data) => apiClient.post(`/ejecuciones-etapa/${id}/completar/`, data),
  
  // Reglas de Anonimato
  getReglasAnonimato: (params = {}) => apiClient.get('/reglas-anonimato/', { params }),
  getReglaAnonimato: (id) => apiClient.get(`/reglas-anonimato/${id}/`),
  createReglaAnonimato: (data) => apiClient.post('/reglas-anonimato/', data),
  updateReglaAnonimato: (id, data) => apiClient.put(`/reglas-anonimato/${id}/`, data),
  deleteReglaAnonimato: (id) => apiClient.delete(`/reglas-anonimato/${id}/`),
  
  // Accesos a Identidad
  getAccesosIdentidad: (params = {}) => apiClient.get('/accesos-identidad/', { params }),
  getAccesoIdentidad: (id) => apiClient.get(`/accesos-identidad/${id}/`),
  createAccesoIdentidad: (data) => apiClient.post('/accesos-identidad/', data),
  updateAccesoIdentidad: (id, data) => apiClient.put(`/accesos-identidad/${id}/`, data),
  deleteAccesoIdentidad: (id) => apiClient.delete(`/accesos-identidad/${id}/`),
  registrarAcceso: (id) => apiClient.post(`/accesos-identidad/${id}/registrar_acceso/`),
};

// Servicios específicos por funcionalidad para mejor organización
export const protocolosAPI = {
  getProtocolos: (params = {}) => apiClient.get('/protocolos-proceso/', { params }),
  getProtocolo: (id) => apiClient.get(`/protocolos-proceso/${id}/`),
  createProtocolo: (data) => apiClient.post('/protocolos-proceso/', data),
  updateProtocolo: (id, data) => apiClient.put(`/protocolos-proceso/${id}/`, data),
  deleteProtocolo: (id) => apiClient.delete(`/protocolos-proceso/${id}/`),
  getEtapas: (id) => apiClient.get(`/protocolos-proceso/${id}/etapas/`),
  duplicateProtocolo: (id, data) => apiClient.post(`/protocolos-proceso/${id}/duplicar/`, data),
};

export const etapasAPI = {
  getEtapas: (params = {}) => apiClient.get('/etapas-protocolo/', { params }),
  getEtapa: (id) => apiClient.get(`/etapas-protocolo/${id}/`),
  createEtapa: (data) => apiClient.post('/etapas-protocolo/', data),
  updateEtapa: (id, data) => apiClient.put(`/etapas-protocolo/${id}/`, data),
  deleteEtapa: (id) => apiClient.delete(`/etapas-protocolo/${id}/`),
};

export const procesosAPI = {
  getProcesos: (params = {}) => apiClient.get('/procesos-incidente/', { params }),
  getProceso: (id) => apiClient.get(`/procesos-incidente/${id}/`),
  createProceso: (data) => apiClient.post('/procesos-incidente/', data),
  updateProceso: (id, data) => apiClient.put(`/procesos-incidente/${id}/`, data),
  deleteProceso: (id) => apiClient.delete(`/procesos-incidente/${id}/`),
  avanzarEtapa: (id) => apiClient.post(`/procesos-incidente/${id}/avanzar_etapa/`),
  pausar: (id) => apiClient.post(`/procesos-incidente/${id}/pausar/`),
  reanudar: (id) => apiClient.post(`/procesos-incidente/${id}/reanudar/`),
};

export const ejecucionesAPI = {
  getEjecuciones: (params = {}) => apiClient.get('/ejecuciones-etapa/', { params }),
  getEjecucion: (id) => apiClient.get(`/ejecuciones-etapa/${id}/`),
  createEjecucion: (data) => apiClient.post('/ejecuciones-etapa/', data),
  updateEjecucion: (id, data) => apiClient.put(`/ejecuciones-etapa/${id}/`, data),
  deleteEjecucion: (id) => apiClient.delete(`/ejecuciones-etapa/${id}/`),
  completar: (id, data) => apiClient.post(`/ejecuciones-etapa/${id}/completar/`, data),
};

export const reglasAnonimatoAPI = {
  getReglas: (params = {}) => apiClient.get('/reglas-anonimato/', { params }),
  getRegla: (id) => apiClient.get(`/reglas-anonimato/${id}/`),
  createRegla: (data) => apiClient.post('/reglas-anonimato/', data),
  updateRegla: (id, data) => apiClient.put(`/reglas-anonimato/${id}/`, data),
  deleteRegla: (id) => apiClient.delete(`/reglas-anonimato/${id}/`),
};

export const accesoIdentidadAPI = {
  getAccesos: (params = {}) => apiClient.get('/accesos-identidad/', { params }),
  getAcceso: (id) => apiClient.get(`/accesos-identidad/${id}/`),
  createAcceso: (data) => apiClient.post('/accesos-identidad/', data),
  updateAcceso: (id, data) => apiClient.put(`/accesos-identidad/${id}/`, data),
  deleteAcceso: (id) => apiClient.delete(`/accesos-identidad/${id}/`),
  registrarAcceso: (id) => apiClient.post(`/accesos-identidad/${id}/registrar_acceso/`),
};

export default apiService;