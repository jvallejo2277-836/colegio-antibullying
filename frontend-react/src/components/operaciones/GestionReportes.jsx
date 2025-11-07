import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';

const ESTADO_CHOICES = [
  { value: 'pendiente', label: 'Pendiente', color: 'warning', icon: <ScheduleIcon /> },
  { value: 'en_investigacion', label: 'En Investigación', color: 'info', icon: <AssignmentIcon /> },
  { value: 'resuelto', label: 'Resuelto', color: 'success', icon: <CheckCircleIcon /> },
  { value: 'cerrado', label: 'Cerrado', color: 'default', icon: <CancelIcon /> },
];

const URGENCIA_CHOICES = [
  { value: 'baja', label: 'Baja', color: 'success' },
  { value: 'media', label: 'Media', color: 'info' },
  { value: 'alta', label: 'Alta', color: 'warning' },
  { value: 'critica', label: 'Crítica', color: 'error' },
];

function GestionReportes() {
  const [reportes, setReportes] = useState([]);
  const [colegios, setColegios] = useState([]);
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Filtros
  const [filters, setFilters] = useState({
    estado: '',
    urgencia: '',
    colegio: '',
    tipo_incidente: '',
    search: '',
  });

  const [editFormData, setEditFormData] = useState({
    estado: '',
    observaciones: '',
    asignado_a: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedReporte) {
      setEditFormData({
        estado: selectedReporte.estado,
        observaciones: selectedReporte.observaciones || '',
        asignado_a: selectedReporte.asignado_a || '',
      });
    }
  }, [selectedReporte]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportesRes, colegiosRes, tiposRes, usuariosRes] = await Promise.all([
        apiService.getReportes(),
        apiService.getColegios(),
        apiService.getTiposIncidente(),
        apiService.getUsuarios()
      ]);
      
      setReportes(reportesRes.data.results || reportesRes.data || []);
      setColegios(colegiosRes.data.results || colegiosRes.data || []);
      setTiposIncidente(tiposRes.data.results || tiposRes.data || []);
      setUsuarios(usuariosRes.data.results || usuariosRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error al cargar los datos', 'error');
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetails = (reporte) => {
    setSelectedReporte(reporte);
    setDetailsOpen(true);
  };

  const handleEdit = (reporte) => {
    setSelectedReporte(reporte);
    setEditOpen(true);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await apiService.updateReporte(selectedReporte.id, editFormData);
      showSnackbar('Reporte actualizado exitosamente');
      setEditOpen(false);
      loadData(); // Recargar datos
    } catch (error) {
      showSnackbar('Error al actualizar el reporte', 'error');
    }
  };

  const getEstadoInfo = (estado) => {
    return ESTADO_CHOICES.find(e => e.value === estado) || ESTADO_CHOICES[0];
  };

  const getUrgenciaInfo = (urgencia) => {
    return URGENCIA_CHOICES.find(u => u.value === urgencia) || URGENCIA_CHOICES[1];
  };

  // Filtrar reportes
  const filteredReportes = reportes.filter(reporte => {
    if (filters.estado && reporte.estado !== filters.estado) return false;
    if (filters.urgencia && reporte.urgencia !== filters.urgencia) return false;
    if (filters.colegio && reporte.colegio !== parseInt(filters.colegio)) return false;
    if (filters.tipo_incidente && reporte.tipo_incidente !== parseInt(filters.tipo_incidente)) return false;
    if (filters.search && !reporte.titulo.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'titulo',
      headerName: 'Título',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'colegio_nombre',
      headerName: 'Colegio',
      width: 150,
      valueGetter: (params) => {
        const colegio = colegios.find(c => c.id === params.row.colegio);
        return colegio ? colegio.nombre : 'N/A';
      }
    },
    {
      field: 'tipo_incidente_nombre',
      headerName: 'Tipo',
      width: 150,
      valueGetter: (params) => {
        const tipo = tiposIncidente.find(t => t.id === params.row.tipo_incidente);
        return tipo ? tipo.nombre : 'N/A';
      }
    },
    {
      field: 'urgencia',
      headerName: 'Urgencia',
      width: 120,
      renderCell: (params) => {
        const urgenciaInfo = getUrgenciaInfo(params.value);
        return (
          <Chip
            label={urgenciaInfo.label}
            color={urgenciaInfo.color}
            size="small"
          />
        );
      },
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 140,
      renderCell: (params) => {
        const estadoInfo = getEstadoInfo(params.value);
        return (
          <Chip
            icon={estadoInfo.icon}
            label={estadoInfo.label}
            color={estadoInfo.color}
            size="small"
          />
        );
      },
    },
    {
      field: 'fecha_creacion',
      headerName: 'Fecha Creación',
      width: 140,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('es-CL');
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleViewDetails(params.row)}
            title="Ver detalles"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            title="Editar"
          >
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AssignmentIcon sx={{ mr: 2, fontSize: 40 }} />
        Gestión de Reportes
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Filtros</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                {ESTADO_CHOICES.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Urgencia</InputLabel>
              <Select
                name="urgencia"
                value={filters.urgencia}
                onChange={handleFilterChange}
                label="Urgencia"
              >
                <MenuItem value="">Todas</MenuItem>
                {URGENCIA_CHOICES.map((urgencia) => (
                  <MenuItem key={urgencia.value} value={urgencia.value}>
                    {urgencia.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Colegio</InputLabel>
              <Select
                name="colegio"
                value={filters.colegio}
                onChange={handleFilterChange}
                label="Colegio"
              >
                <MenuItem value="">Todos</MenuItem>
                {colegios.map((colegio) => (
                  <MenuItem key={colegio.id} value={colegio.id}>
                    {colegio.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                name="tipo_incidente"
                value={filters.tipo_incidente}
                onChange={handleFilterChange}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposIncidente.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="search"
              label="Buscar por título"
              value={filters.search}
              onChange={handleFilterChange}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de reportes */}
      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={filteredReportes}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50, 100]}
          loading={loading}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        />
      </Paper>

      {/* Dialog para ver detalles */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles del Reporte #{selectedReporte?.id}
        </DialogTitle>
        <DialogContent>
          {selectedReporte && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {selectedReporte.titulo}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        icon={getEstadoInfo(selectedReporte.estado).icon}
                        label={getEstadoInfo(selectedReporte.estado).label}
                        color={getEstadoInfo(selectedReporte.estado).color}
                      />
                      <Chip
                        label={getUrgenciaInfo(selectedReporte.urgencia).label}
                        color={getUrgenciaInfo(selectedReporte.urgencia).color}
                      />
                    </Box>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Colegio"
                          secondary={colegios.find(c => c.id === selectedReporte.colegio)?.nombre || 'N/A'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tipo de Incidente"
                          secondary={tiposIncidente.find(t => t.id === selectedReporte.tipo_incidente)?.nombre || 'N/A'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Lugar"
                          secondary={selectedReporte.lugar_incidente}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Fecha del Incidente"
                          secondary={new Date(selectedReporte.fecha_incidente).toLocaleString('es-CL')}
                        />
                      </ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Descripción:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedReporte.descripcion}
                    </Typography>
                    {selectedReporte.observaciones && (
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          Observaciones:
                        </Typography>
                        <Typography variant="body1">
                          {selectedReporte.observaciones}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Cerrar</Button>
          <Button 
            variant="contained"
            onClick={() => {
              setDetailsOpen(false);
              handleEdit(selectedReporte);
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar */}
      <Dialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Editar Reporte #{selectedReporte?.id}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={editFormData.estado}
                  onChange={handleEditFormChange}
                  label="Estado"
                >
                  {ESTADO_CHOICES.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Asignar a</InputLabel>
                <Select
                  name="asignado_a"
                  value={editFormData.asignado_a}
                  onChange={handleEditFormChange}
                  label="Asignar a"
                >
                  <MenuItem value="">Sin asignar</MenuItem>
                  {usuarios.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.first_name} {usuario.last_name} ({usuario.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="observaciones"
                label="Observaciones"
                value={editFormData.observaciones}
                onChange={handleEditFormChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Agregue observaciones sobre el seguimiento del caso..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained"
            onClick={handleSaveEdit}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GestionReportes;