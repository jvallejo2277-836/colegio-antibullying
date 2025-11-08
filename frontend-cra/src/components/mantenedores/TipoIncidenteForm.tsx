import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { tipoIncidenteService } from '../../services/tipoIncidenteService';
import { TipoIncidente, TipoIncidenteFormData } from '../../types/tipoIncidente';

interface Props {
  tipo: TipoIncidente | null;
  modoCreacion: boolean;
  onGuardar: () => void;
  onCancelar: () => void;
  colegioId: number;
}

const TipoIncidenteForm: React.FC<Props> = ({ 
  tipo, 
  modoCreacion, 
  onGuardar, 
  onCancelar, 
  colegioId 
}) => {
  const [formData, setFormData] = useState<TipoIncidenteFormData>({
    nombre: '',
    categoria: '',
    gravedad: 'leve',
    descripcion: '',
    requiere_denuncia: false,
    plazo_investigacion_dias: 5,
    protocolo_especifico: '',
    colegio: colegioId,
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Opciones para selects
  const opcionesCategoria = tipoIncidenteService.obtenerOpcionesCategoria();
  const opcionesGravedad = tipoIncidenteService.obtenerOpcionesGravedad();

  // Inicializar formulario
  useEffect(() => {
    if (tipo && !modoCreacion) {
      setFormData({
        nombre: tipo.nombre,
        categoria: tipo.categoria,
        gravedad: tipo.gravedad,
        descripcion: tipo.descripcion,
        requiere_denuncia: tipo.requiere_denuncia,
        plazo_investigacion_dias: tipo.plazo_investigacion_dias,
        protocolo_especifico: tipo.protocolo_especifico,
        colegio: tipo.colegio,
      });
    } else if (modoCreacion) {
      // Resetear para creación
      setFormData({
        nombre: '',
        categoria: '',
        gravedad: 'leve',
        descripcion: '',
        requiere_denuncia: false,
        plazo_investigacion_dias: 5,
        protocolo_especifico: '',
        colegio: colegioId,
      });
    }
  }, [tipo, modoCreacion, colegioId]);

  // Manejar cambios en el formulario
  const handleChange = (field: keyof TipoIncidenteFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error cuando el usuario edita
    if (errores[field]) {
      setErrores(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'Debe seleccionar una categoría';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (formData.plazo_investigacion_dias < 1 || formData.plazo_investigacion_dias > 15) {
      nuevosErrores.plazo_investigacion_dias = 'El plazo debe estar entre 1 y 15 días';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      if (modoCreacion) {
        await tipoIncidenteService.crear(formData);
      } else if (tipo) {
        // En modo edición, solo enviar campos editables
        const datosActualizacion = tipo.es_categoria_legal 
          ? {
              // Solo protocolo y plazo para categorías legales
              protocolo_especifico: formData.protocolo_especifico,
              plazo_investigacion_dias: formData.plazo_investigacion_dias,
              descripcion: formData.descripcion,
            }
          : formData; // Todos los campos para tipos personalizados

        await tipoIncidenteService.actualizar(tipo.id!, datosActualizacion);
      }
      
      onGuardar();
    } catch (error) {
      console.error('Error al guardar:', error);
      // Aquí podrías manejar errores específicos del servidor
    } finally {
      setLoading(false);
    }
  };

  const esEdicionLegal = !modoCreacion && tipo?.es_categoria_legal;

  return (
    <>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {modoCreacion ? '➕ Crear Tipo de Incidente' : 
         esEdicionLegal ? '🔒 Configurar Categoría Legal' : 
         '✏️ Editar Tipo Personalizado'}
      </DialogTitle>

      <DialogContent dividers>
        {esEdicionLegal && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Esta es una categoría definida por ley. Solo puede modificar el protocolo específico, 
              plazo de investigación y descripción complementaria.
            </Typography>
          </Alert>
        )}

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Información de la categoría legal (solo lectura) */}
          {esEdicionLegal && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <Chip icon={<span>🔒</span>} label="Categoría Legal" size="small" />
                <Typography variant="h6">{tipo?.nombre}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Categoría: {tipo?.categoria_display} • Gravedad: {tipo?.gravedad_display}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          )}

          {/* Campos editables según el modo */}
          {!esEdicionLegal && (
            <>
              <TextField
                label="Nombre del Tipo"
                value={formData.nombre}
                onChange={handleChange('nombre')}
                error={!!errores.nombre}
                helperText={errores.nombre}
                fullWidth
                required
              />

              <FormControl fullWidth required error={!!errores.categoria}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.categoria}
                  onChange={handleChange('categoria')}
                  label="Categoría"
                >
                  {opcionesCategoria.map((opcion) => (
                    <MenuItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </MenuItem>
                  ))}
                </Select>
                {errores.categoria && (
                  <Typography variant="caption" color="error">
                    {errores.categoria}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Gravedad</InputLabel>
                <Select
                  value={formData.gravedad}
                  onChange={handleChange('gravedad')}
                  label="Gravedad"
                >
                  {opcionesGravedad.map((opcion) => (
                    <MenuItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiere_denuncia}
                    onChange={handleChange('requiere_denuncia')}
                  />
                }
                label="Requiere denuncia obligatoria"
              />
            </>
          )}

          <TextField
            label="Descripción"
            value={formData.descripcion}
            onChange={handleChange('descripcion')}
            error={!!errores.descripcion}
            helperText={errores.descripcion || (esEdicionLegal ? "Descripción complementaria para este colegio" : "")}
            fullWidth
            multiline
            rows={3}
            required
          />

          <TextField
            label="Plazo de Investigación (días)"
            type="number"
            value={formData.plazo_investigacion_dias}
            onChange={handleChange('plazo_investigacion_dias')}
            error={!!errores.plazo_investigacion_dias}
            helperText={errores.plazo_investigacion_dias || "Entre 1 y 15 días según normativa"}
            inputProps={{ min: 1, max: 15 }}
            fullWidth
          />

          <TextField
            label="Protocolo Específico"
            value={formData.protocolo_especifico}
            onChange={handleChange('protocolo_especifico')}
            helperText="Pasos específicos que seguirá este colegio"
            fullWidth
            multiline
            rows={4}
            placeholder="Ej: 1. Notificar a dirección inmediatamente&#10;2. Contactar a los apoderados&#10;3. Activar protocolo de contención..."
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancelar} disabled={loading}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          variant="contained"
          color="primary"
        >
          {modoCreacion ? 'Crear' : 'Guardar Cambios'}
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default TipoIncidenteForm;