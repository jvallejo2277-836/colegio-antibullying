import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import apiService from '../../services/api';

const CATEGORIA_CHOICES = [
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

const GRAVEDAD_CHOICES = [
  { value: 'leve', label: 'Leve' },
  { value: 'grave', label: 'Grave' },
  { value: 'muy_grave', label: 'Muy Grave' },
];

function TiposIncidenteManager() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    gravedad: '',
    descripcion: '',
    requiere_denuncia: false,
    plazo_investigacion_dias: 5,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadTipos();
  }, []);

  const loadTipos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTiposIncidente();
      setTipos(response.data.results || response.data);
    } catch (error) {
      showSnackbar('Error al cargar los tipos de incidente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (tipo = null) => {
    if (tipo) {
      setEditingTipo(tipo);
      setFormData(tipo);
    } else {
      setEditingTipo(null);
      setFormData({
        nombre: '',
        categoria: '',
        gravedad: '',
        descripcion: '',
        requiere_denuncia: false,
        plazo_investigacion_dias: 5,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTipo(null);
    setFormData({
      nombre: '',
      categoria: '',
      gravedad: '',
      descripcion: '',
      requiere_denuncia: false,
      plazo_investigacion_dias: 5,
    });
  };

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingTipo) {
        await apiService.updateTipoIncidente(editingTipo.id, formData);
        showSnackbar('Tipo de incidente actualizado exitosamente');
      } else {
        await apiService.createTipoIncidente(formData);
        showSnackbar('Tipo de incidente creado exitosamente');
      }
      handleCloseDialog();
      loadTipos();
    } catch (error) {
      showSnackbar('Error al guardar el tipo de incidente', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este tipo de incidente?')) {
      try {
        await apiService.deleteTipoIncidente(id);
        showSnackbar('Tipo de incidente eliminado exitosamente');
        loadTipos();
      } catch (error) {
        showSnackbar('Error al eliminar el tipo de incidente', 'error');
      }
    }
  };

  const getGravedadColor = (gravedad) => {
    switch (gravedad) {
      case 'leve': return 'success';
      case 'grave': return 'warning';
      case 'muy_grave': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nombre', headerName: 'Nombre', width: 250, flex: 1 },
    { field: 'categoria_display', headerName: 'Categoría', width: 200 },
    { 
      field: 'gravedad_display', 
      headerName: 'Gravedad', 
      width: 140,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getGravedadColor(params.row.gravedad)}
          size="small"
        />
      ),
    },
    { 
      field: 'requiere_denuncia', 
      headerName: 'Req. Denuncia', 
      width: 120, 
      type: 'boolean',
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Sí' : 'No'} 
          color={params.value ? 'error' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    { field: 'plazo_investigacion_dias', headerName: 'Plazo (días)', width: 120, type: 'number' },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleOpenDialog(params.row)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 2, fontSize: 40 }} />
          Mantenedor de Tipos de Incidente
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Nuevo Tipo
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={tipos}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
          }}
        />
      </Paper>

      {/* Dialog para crear/editar tipo de incidente */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTipo ? 'Editar Tipo de Incidente' : 'Nuevo Tipo de Incidente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="nombre"
                label="Nombre del Tipo de Incidente"
                value={formData.nombre}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  label="Categoría"
                >
                  {CATEGORIA_CHOICES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Gravedad</InputLabel>
                <Select
                  name="gravedad"
                  value={formData.gravedad}
                  onChange={handleInputChange}
                  label="Gravedad"
                >
                  {GRAVEDAD_CHOICES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="plazo_investigacion_dias"
                label="Plazo de Investigación (días)"
                type="number"
                value={formData.plazo_investigacion_dias}
                onChange={handleInputChange}
                fullWidth
                inputProps={{ min: 1, max: 30 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="requiere_denuncia"
                    checked={formData.requiere_denuncia}
                    onChange={handleInputChange}
                    color="error"
                  />
                }
                label="Requiere Denuncia a Autoridades"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTipo ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TiposIncidenteManager;