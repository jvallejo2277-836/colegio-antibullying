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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import apiService from '../../services/api';

function ColegiosManager() {
  const [colegios, setColegios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingColegio, setEditingColegio] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    rbd: '',
    direccion: '',
    telefono: '',
    email: '',
    director: '',
    encargado_convivencia: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadColegios();
  }, []);

  const loadColegios = async () => {
    try {
      setLoading(true);
      const response = await apiService.getColegios();
      setColegios(response.data.results || response.data);
    } catch (error) {
      showSnackbar('Error al cargar los colegios', 'error');
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

  const handleOpenDialog = (colegio = null) => {
    if (colegio) {
      setEditingColegio(colegio);
      setFormData(colegio);
    } else {
      setEditingColegio(null);
      setFormData({
        nombre: '',
        rbd: '',
        direccion: '',
        telefono: '',
        email: '',
        director: '',
        encargado_convivencia: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingColegio(null);
    setFormData({
      nombre: '',
      rbd: '',
      direccion: '',
      telefono: '',
      email: '',
      director: '',
      encargado_convivencia: '',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingColegio) {
        await apiService.updateColegio(editingColegio.id, formData);
        showSnackbar('Colegio actualizado exitosamente');
      } else {
        await apiService.createColegio(formData);
        showSnackbar('Colegio creado exitosamente');
      }
      handleCloseDialog();
      loadColegios();
    } catch (error) {
      showSnackbar('Error al guardar el colegio', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este colegio?')) {
      try {
        await apiService.deleteColegio(id);
        showSnackbar('Colegio eliminado exitosamente');
        loadColegios();
      } catch (error) {
        showSnackbar('Error al eliminar el colegio', 'error');
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nombre', headerName: 'Nombre del Colegio', width: 250, flex: 1 },
    { field: 'rbd', headerName: 'RBD', width: 120 },
    { field: 'director', headerName: 'Director', width: 200 },
    { field: 'encargado_convivencia', headerName: 'Encargado Convivencia', width: 200 },
    { field: 'reportes_count', headerName: 'N° Reportes', width: 120, type: 'number' },
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
          <SchoolIcon sx={{ mr: 2, fontSize: 40 }} />
          Mantenedor de Colegios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Nuevo Colegio
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={colegios}
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

      {/* Dialog para crear/editar colegio */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingColegio ? 'Editar Colegio' : 'Nuevo Colegio'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                name="nombre"
                label="Nombre del Colegio"
                value={formData.nombre}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="rbd"
                label="RBD"
                value={formData.rbd}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Ej: 8640-9"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="direccion"
                label="Dirección"
                value={formData.direccion}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="telefono"
                label="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                fullWidth
                helperText="Ej: +56229787500"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="director"
                label="Director(a)"
                value={formData.director}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="encargado_convivencia"
                label="Encargado de Convivencia"
                value={formData.encargado_convivencia}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingColegio ? 'Actualizar' : 'Crear'}
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

export default ColegiosManager;