import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '../../contexts/AuthContext';
import { protocolosAPI } from '../../services/api';
import EtapasManager from './EtapasManager';

const GRAVEDAD_OPTIONS = [
  { value: 'leve', label: 'Leve', color: 'success' },
  { value: 'moderada', label: 'Moderada', color: 'warning' },
  { value: 'grave', label: 'Grave', color: 'error' }
];

export default function ProtocolosManager() {
  const [protocolos, setProtocolos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEtapas, setOpenEtapas] = useState(false);
  const [selectedProtocolo, setSelectedProtocolo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    gravedad: '',
    plazo_total_dias: '',
    requiere_aprobacion_director: false
  });
  
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadProtocolos();
  }, []);

  const loadProtocolos = async () => {
    try {
      setLoading(true);
      const response = await protocolosAPI.getProtocolos({
        colegio: user.perfil?.colegio?.id
      });
      setProtocolos(response.data.results || response.data);
    } catch (error) {
      enqueueSnackbar('Error al cargar protocolos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (protocolo = null) => {
    if (protocolo) {
      setFormData({
        nombre: protocolo.nombre,
        descripcion: protocolo.descripcion,
        gravedad: protocolo.gravedad,
        plazo_total_dias: protocolo.plazo_total_dias,
        requiere_aprobacion_director: protocolo.requiere_aprobacion_director
      });
      setSelectedProtocolo(protocolo);
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        gravedad: '',
        plazo_total_dias: '',
        requiere_aprobacion_director: false
      });
      setSelectedProtocolo(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProtocolo(null);
    setFormData({
      nombre: '',
      descripcion: '',
      gravedad: '',
      plazo_total_dias: '',
      requiere_aprobacion_director: false
    });
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        colegio: user.perfil?.colegio?.id,
        plazo_total_dias: parseInt(formData.plazo_total_dias)
      };

      if (selectedProtocolo) {
        await protocolosAPI.updateProtocolo(selectedProtocolo.id, dataToSubmit);
        enqueueSnackbar('Protocolo actualizado correctamente', { variant: 'success' });
      } else {
        await protocolosAPI.createProtocolo(dataToSubmit);
        enqueueSnackbar('Protocolo creado correctamente', { variant: 'success' });
      }

      handleCloseDialog();
      loadProtocolos();
    } catch (error) {
      enqueueSnackbar('Error al guardar protocolo', { variant: 'error' });
    }
  };

  const handleDelete = async (protocoloId) => {
    if (window.confirm('¿Está seguro que desea eliminar este protocolo?')) {
      try {
        await protocolosAPI.deleteProtocolo(protocoloId);
        enqueueSnackbar('Protocolo eliminado correctamente', { variant: 'success' });
        loadProtocolos();
      } catch (error) {
        enqueueSnackbar('Error al eliminar protocolo', { variant: 'error' });
      }
    }
  };

  const handleDuplicate = async (protocolo) => {
    try {
      await protocolosAPI.duplicateProtocolo(protocolo.id, {
        colegio_id: user.perfil?.colegio?.id
      });
      enqueueSnackbar('Protocolo duplicado correctamente', { variant: 'success' });
      loadProtocolos();
    } catch (error) {
      enqueueSnackbar('Error al duplicar protocolo', { variant: 'error' });
    }
  };

  const handleManageEtapas = (protocolo) => {
    setSelectedProtocolo(protocolo);
    setOpenEtapas(true);
  };

  const getGravedadColor = (gravedad) => {
    const option = GRAVEDAD_OPTIONS.find(opt => opt.value === gravedad);
    return option?.color || 'default';
  };

  const getGravedadLabel = (gravedad) => {
    const option = GRAVEDAD_OPTIONS.find(opt => opt.value === gravedad);
    return option?.label || gravedad;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Protocolos de Proceso
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Protocolo
        </Button>
      </Box>

      {protocolos.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No hay protocolos configurados. Cree el primer protocolo para comenzar.
        </Alert>
      )}

      <Grid container spacing={3}>
        {protocolos.map((protocolo) => (
          <Grid item xs={12} md={6} lg={4} key={protocolo.id}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {protocolo.nombre}
                  </Typography>
                  <Chip
                    label={getGravedadLabel(protocolo.gravedad)}
                    color={getGravedadColor(protocolo.gravedad)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {protocolo.descripcion}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Plazo Total
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {protocolo.plazo_total_dias} días
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Etapas
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {protocolo.total_etapas || 0} configuradas
                    </Typography>
                  </Grid>
                </Grid>

                {protocolo.requiere_aprobacion_director && (
                  <Chip
                    label="Requiere aprobación director"
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </CardContent>

              <CardActions>
                <Tooltip title="Ver etapas">
                  <IconButton
                    size="small"
                    onClick={() => handleManageEtapas(protocolo)}
                  >
                    <TimelineIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Editar protocolo">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(protocolo)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Duplicar protocolo">
                  <IconButton
                    size="small"
                    onClick={() => handleDuplicate(protocolo)}
                  >
                    <CopyIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar protocolo">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(protocolo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar protocolo */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProtocolo ? 'Editar Protocolo' : 'Nuevo Protocolo'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Protocolo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Gravedad</InputLabel>
                <Select
                  value={formData.gravedad}
                  onChange={(e) => setFormData({ ...formData, gravedad: e.target.value })}
                  label="Gravedad"
                >
                  {GRAVEDAD_OPTIONS.map((option) => (
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
                type="number"
                label="Plazo Total (días)"
                value={formData.plazo_total_dias}
                onChange={(e) => setFormData({ ...formData, plazo_total_dias: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Requiere Aprobación Director</InputLabel>
                <Select
                  value={formData.requiere_aprobacion_director}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    requiere_aprobacion_director: e.target.value 
                  })}
                  label="Requiere Aprobación Director"
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Sí</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.nombre || !formData.gravedad || !formData.plazo_total_dias}
          >
            {selectedProtocolo ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para gestionar etapas */}
      <Dialog
        open={openEtapas}
        onClose={() => setOpenEtapas(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          Gestión de Etapas: {selectedProtocolo?.nombre}
        </DialogTitle>
        <DialogContent>
          {selectedProtocolo && (
            <EtapasManager
              protocoloId={selectedProtocolo.id}
              onClose={() => setOpenEtapas(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}