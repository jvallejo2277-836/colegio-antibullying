import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { colegioService } from '../../services/colegioService';
import { Colegio, ColegioFormData } from '../../types/colegio';

interface ColegioFormProps {
  open: boolean;
  colegio: Colegio | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const ColegioForm: React.FC<ColegioFormProps> = ({
  open,
  colegio,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<ColegioFormData>({
    nombre: '',
    rbd: '',
    direccion: '',
    telefono: '',
    email: '',
    director: '',
    encargado_convivencia: ''
  });
  const [errors, setErrors] = useState<Partial<Colegio>>({});
  const [saving, setSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (colegio) {
        // Modo edición
        setFormData({
          nombre: colegio.nombre || '',
          rbd: colegio.rbd || '',
          direccion: colegio.direccion || '',
          telefono: colegio.telefono || '',
          email: colegio.email || '',
          director: colegio.director || '',
          encargado_convivencia: colegio.encargado_convivencia || ''
        });
      } else {
        // Modo creación
        setFormData({
          nombre: '',
          rbd: '',
          direccion: '',
          telefono: '',
          email: '',
          director: '',
          encargado_convivencia: ''
        });
      }
      setErrors({});
      setGeneralError(null);
    }
  }, [open, colegio]);

  const handleInputChange = (field: keyof Colegio, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Colegio> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.rbd.trim()) {
      newErrors.rbd = 'El RBD es obligatorio';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setGeneralError(null);

    try {
      if (colegio?.id) {
        // Actualizar colegio existente
        await colegioService.update(colegio.id, formData);
        onSuccess('Colegio actualizado correctamente');
      } else {
        // Crear nuevo colegio
        await colegioService.create(formData);
        onSuccess('Colegio creado correctamente');
      }
    } catch (error: any) {
      if (error.response?.data) {
        // Errores de validación del backend
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          setErrors(backendErrors);
        } else {
          setGeneralError('Error del servidor: ' + backendErrors);
        }
      } else {
        setGeneralError('Error de conexión: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {colegio ? 'Editar Colegio' : 'Nuevo Colegio'}
      </DialogTitle>
      
      <DialogContent>
        {generalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {generalError}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {/* Información básica */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Información Básica
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Nombre del Colegio"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
              sx={{ flex: 2 }}
            />

            <TextField
              fullWidth
              label="RBD"
              value={formData.rbd}
              onChange={(e) => handleInputChange('rbd', e.target.value)}
              error={!!errors.rbd}
              helperText={errors.rbd || 'Rol Base de Datos MINEDUC'}
              required
              sx={{ flex: 1 }}
            />
          </Box>

          <TextField
            fullWidth
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => handleInputChange('direccion', e.target.value)}
            error={!!errors.direccion}
            helperText={errors.direccion}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          {/* Información de contacto */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Información de Contacto
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              error={!!errors.telefono}
              helperText={errors.telefono}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>

          {/* Responsables */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Responsables
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Director"
              value={formData.director}
              onChange={(e) => handleInputChange('director', e.target.value)}
              error={!!errors.director}
              helperText={errors.director}
            />

            <TextField
              fullWidth
              label="Encargado de Convivencia"
              value={formData.encargado_convivencia}
              onChange={(e) => handleInputChange('encargado_convivencia', e.target.value)}
              error={!!errors.encargado_convivencia}
              helperText={errors.encargado_convivencia}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={saving}
        >
          {saving ? 'Guardando...' : (colegio ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColegioForm;