import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';
import { etapasAPI } from '../../services/api';

const ROLES_OPTIONS = [
  { value: 'encargado_convivencia', label: 'Encargado de Convivencia' },
  { value: 'orientador', label: 'Orientador' },
  { value: 'director', label: 'Director' },
  { value: 'subdirector', label: 'Subdirector' },
  { value: 'coordinador', label: 'Coordinador Académico' },
  { value: 'inspector', label: 'Inspector General' },
  { value: 'profesor_jefe', label: 'Profesor Jefe' },
  { value: 'psicologo', label: 'Psicólogo' },
  { value: 'trabajador_social', label: 'Trabajador Social' }
];

const ACCIONES_ANONIMO_OPTIONS = [
  { value: 'contactar_apoderado', label: 'Contactar Apoderado' },
  { value: 'entrevista_estudiante', label: 'Entrevista con Estudiante' },
  { value: 'investigacion_general', label: 'Investigación General' },
  { value: 'derivar_especialista', label: 'Derivar a Especialista' },
  { value: 'medidas_preventivas', label: 'Aplicar Medidas Preventivas' }
];

export default function EtapasManager({ protocoloId, onClose }) {
  const [etapas, setEtapas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEtapa, setSelectedEtapa] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    plazo_horas: '',
    es_plazo_habiles: false,
    responsable_rol: '',
    acciones_requeridas: '',
    documentos_requeridos: '',
    es_obligatoria: true,
    permite_anonimo: true,
    accion_si_anonimo: '',
    descripcion_anonimo: ''
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadEtapas();
  }, [protocoloId]);

  const loadEtapas = async () => {
    try {
      const response = await etapasAPI.getEtapas({
        protocolo: protocoloId
      });
      const etapasOrdenadas = (response.data.results || response.data)
        .sort((a, b) => a.orden - b.orden);
      setEtapas(etapasOrdenadas);
    } catch (error) {
      enqueueSnackbar('Error al cargar etapas', { variant: 'error' });
    }
  };

  const handleOpenDialog = (etapa = null) => {
    if (etapa) {
      setFormData({
        nombre: etapa.nombre,
        descripcion: etapa.descripcion,
        plazo_horas: etapa.plazo_horas,
        es_plazo_habiles: etapa.es_plazo_habiles,
        responsable_rol: etapa.responsable_rol,
        acciones_requeridas: etapa.acciones_requeridas,
        documentos_requeridos: etapa.documentos_requeridos,
        es_obligatoria: etapa.es_obligatoria,
        permite_anonimo: etapa.permite_anonimo,
        accion_si_anonimo: etapa.accion_si_anonimo,
        descripcion_anonimo: etapa.descripcion_anonimo
      });
      setSelectedEtapa(etapa);
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        plazo_horas: '',
        es_plazo_habiles: false,
        responsable_rol: '',
        acciones_requeridas: '',
        documentos_requeridos: '',
        es_obligatoria: true,
        permite_anonimo: true,
        accion_si_anonimo: '',
        descripcion_anonimo: ''
      });
      setSelectedEtapa(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEtapa(null);
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        protocolo: protocoloId,
        orden: selectedEtapa ? selectedEtapa.orden : etapas.length + 1,
        plazo_horas: parseInt(formData.plazo_horas)
      };

      if (selectedEtapa) {
        await etapasAPI.updateEtapa(selectedEtapa.id, dataToSubmit);
        enqueueSnackbar('Etapa actualizada correctamente', { variant: 'success' });
      } else {
        await etapasAPI.createEtapa(dataToSubmit);
        enqueueSnackbar('Etapa creada correctamente', { variant: 'success' });
      }

      handleCloseDialog();
      loadEtapas();
    } catch (error) {
      enqueueSnackbar('Error al guardar etapa', { variant: 'error' });
    }
  };

  const handleDelete = async (etapaId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta etapa?')) {
      try {
        await etapasAPI.deleteEtapa(etapaId);
        enqueueSnackbar('Etapa eliminada correctamente', { variant: 'success' });
        loadEtapas();
      } catch (error) {
        enqueueSnackbar('Error al eliminar etapa', { variant: 'error' });
      }
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(etapas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizar orden local
    const updatedItems = items.map((item, index) => ({
      ...item,
      orden: index + 1
    }));

    setEtapas(updatedItems);

    // Actualizar en backend
    try {
      await Promise.all(
        updatedItems.map(item =>
          etapasAPI.updateEtapa(item.id, { orden: item.orden })
        )
      );
      enqueueSnackbar('Orden actualizado correctamente', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al actualizar orden', { variant: 'error' });
      loadEtapas(); // Recargar si falla
    }
  };

  const getRolLabel = (rol) => {
    const option = ROLES_OPTIONS.find(opt => opt.value === rol);
    return option?.label || rol;
  };

  const getAccionAnonimoLabel = (accion) => {
    const option = ACCIONES_ANONIMO_OPTIONS.find(opt => opt.value === accion);
    return option?.label || accion;
  };

  const formatPlazo = (horas, esHabiles) => {
    const dias = Math.floor(horas / 24);
    const horasRestantes = horas % 24;
    
    let texto = '';
    if (dias > 0) texto += `${dias} día${dias > 1 ? 's' : ''}`;
    if (horasRestantes > 0) {
      if (texto) texto += ' ';
      texto += `${horasRestantes} hora${horasRestantes > 1 ? 's' : ''}`;
    }
    
    return `${texto}${esHabiles ? ' (hábiles)' : ''}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Etapas del Protocolo ({etapas.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Etapa
        </Button>
      </Box>

      {etapas.length === 0 ? (
        <Alert severity="info">
          No hay etapas configuradas. Agregue al menos una etapa para que el protocolo sea funcional.
        </Alert>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="etapas">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {etapas.map((etapa, index) => (
                  <Draggable
                    key={etapa.id}
                    draggableId={etapa.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        elevation={snapshot.isDragging ? 4 : 1}
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: snapshot.isDragging ? 'grey.50' : 'white'
                        }}
                      >
                        <Grid container spacing={2} alignItems="flex-start">
                          <Grid item xs="auto">
                            <Box
                              {...provided.dragHandleProps}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'text.secondary',
                                cursor: 'grab'
                              }}
                            >
                              <DragIcon />
                            </Box>
                          </Grid>

                          <Grid item xs>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Chip
                                label={`Etapa ${etapa.orden}`}
                                color="primary"
                                size="small"
                              />
                              <Typography variant="h6" component="h3">
                                {etapa.nombre}
                              </Typography>
                              {!etapa.es_obligatoria && (
                                <Chip
                                  label="Opcional"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {etapa.permite_anonimo ? (
                                <Tooltip title="Permite casos anónimos">
                                  <VisibilityOffIcon color="action" fontSize="small" />
                                </Tooltip>
                              ) : (
                                <Tooltip title="Requiere identidad">
                                  <VisibilityIcon color="action" fontSize="small" />
                                </Tooltip>
                              )}
                            </Box>

                            <Typography variant="body2" color="text.secondary" paragraph>
                              {etapa.descripcion}
                            </Typography>

                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <ScheduleIcon fontSize="small" color="action" />
                                  <Typography variant="caption">
                                    Plazo: {formatPlazo(etapa.plazo_horas, etapa.es_plazo_habiles)}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={4}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <PersonIcon fontSize="small" color="action" />
                                  <Typography variant="caption">
                                    {getRolLabel(etapa.responsable_rol)}
                                  </Typography>
                                </Box>
                              </Grid>

                              {etapa.accion_si_anonimo && (
                                <Grid item xs={12} md={4}>
                                  <Typography variant="caption" color="warning.main">
                                    Anónimo: {getAccionAnonimoLabel(etapa.accion_si_anonimo)}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>

                            {(etapa.acciones_requeridas || etapa.documentos_requeridos) && (
                              <Box mt={2}>
                                <Divider sx={{ mb: 1 }} />
                                {etapa.acciones_requeridas && (
                                  <Typography variant="caption" display="block">
                                    <strong>Acciones:</strong> {etapa.acciones_requeridas}
                                  </Typography>
                                )}
                                {etapa.documentos_requeridos && (
                                  <Typography variant="caption" display="block">
                                    <strong>Documentos:</strong> {etapa.documentos_requeridos}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Grid>

                          <Grid item xs="auto">
                            <Box display="flex" flexDirection="column" gap={1}>
                              <Tooltip title="Editar etapa">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(etapa)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar etapa">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(etapa.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Dialog para crear/editar etapa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedEtapa ? 'Editar Etapa' : 'Nueva Etapa'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Nombre de la Etapa"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Responsable</InputLabel>
                <Select
                  value={formData.responsable_rol}
                  onChange={(e) => setFormData({ ...formData, responsable_rol: e.target.value })}
                  label="Responsable"
                >
                  {ROLES_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción de la Etapa"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Plazo (horas)"
                value={formData.plazo_horas}
                onChange={(e) => setFormData({ ...formData, plazo_horas: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.es_plazo_habiles}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      es_plazo_habiles: e.target.checked 
                    })}
                  />
                }
                label="Plazo en días/horas hábiles"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.es_obligatoria}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      es_obligatoria: e.target.checked 
                    })}
                  />
                }
                label="Etapa obligatoria"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permite_anonimo}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      permite_anonimo: e.target.checked 
                    })}
                  />
                }
                label="Permite casos anónimos"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Acciones Requeridas"
                value={formData.acciones_requeridas}
                onChange={(e) => setFormData({ ...formData, acciones_requeridas: e.target.value })}
                placeholder="Describa las acciones específicas que se deben realizar en esta etapa"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Documentos Requeridos"
                value={formData.documentos_requeridos}
                onChange={(e) => setFormData({ ...formData, documentos_requeridos: e.target.value })}
                placeholder="Liste los documentos que deben generarse o recopilarse"
              />
            </Grid>

            {formData.permite_anonimo && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Acción si es Anónimo</InputLabel>
                    <Select
                      value={formData.accion_si_anonimo}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        accion_si_anonimo: e.target.value 
                      })}
                      label="Acción si es Anónimo"
                    >
                      {ACCIONES_ANONIMO_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Descripción para Casos Anónimos"
                    value={formData.descripcion_anonimo}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      descripcion_anonimo: e.target.value 
                    })}
                    placeholder="Procedimiento específico para casos anónimos"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.nombre || !formData.responsable_rol || !formData.plazo_horas}
          >
            {selectedEtapa ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}