import api from './api';

export interface UpdateColegioRequest {
  colegio_id: number;
}

export const userService = {
  // Actualizar el colegio asignado para un usuario (especialmente admin)
  updateColegioAsignado: async (userId: number, colegioId: number): Promise<void> => {
    try {
      console.log('🔄 UserService: Actualizando colegio_id para usuario', userId, 'a colegio', colegioId);
      
      const response = await api.patch(`/usuarios/${userId}/colegio/`, {
        colegio_id: colegioId
      });
      
      console.log('✅ UserService: Colegio actualizado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ UserService: Error actualizando colegio:', error);
      throw error;
    }
  },

  // Obtener el perfil actual del usuario
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user/');
      return response.data;
    } catch (error) {
      console.error('❌ UserService: Error obteniendo usuario actual:', error);
      throw error;
    }
  },

  // Refresh del usuario después de cambios
  refreshUserData: async () => {
    try {
      const response = await api.get('/auth/refresh/');
      return response.data;
    } catch (error) {
      console.error('❌ UserService: Error refrescando datos de usuario:', error);
      throw error;
    }
  }
};

export default userService;