import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import apiService from '../../services/api';

const URGENCIA_CONFIG = {
  critica: {
    color: 'error',
    icon: <ErrorIcon />,
    tiempoLimite: 1, // horas
    prioridad: 1,
    label: 'Crítica',
    backgroundColor: '#ffebee',
    borderColor: '#f44336'
  },
  alta: {
    color: 'warning',
    icon: <WarningIcon />,
    tiempoLimite: 4, // horas
    prioridad: 2,
    label: 'Alta',
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800'
  }
};

function ReportesUrgentes() {
  const [reportesUrgentes, setReportesUrgentes] = useState([]);
  const [colegios, setColegios] = useState([]);
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filtroUrgencia, setFiltroUrgencia] = useState('');
  
  const [actionFormData, setActionFormData] = useState({
    estado: 'en_investigacion',
    observaciones: '',
    asignado_a: '',
    accion_inmediata: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh cada 30 segundos si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportesRes, colegiosRes, tiposRes, usuariosRes] = await Promise.all([
        apiService.getReportes(), // Filtraremos en el cliente
        apiService.getColegios(),
        apiService.getTiposIncidente(),
        apiService.getUsuarios()
      ]);
      
      const allReportes = reportesRes.data.results || reportesRes.data || [];
      
      // Filtrar solo reportes urgentes (alta y crítica) pendientes o en investigación
      const urgentes = allReportes.filter(reporte => 
        (reporte.urgencia === 'alta' || reporte.urgencia === 'critica') &&
        (reporte.estado === 'pendiente' || reporte.estado === 'en_investigacion')
      );
      
      // Ordenar por prioridad (críticos primero) y luego por fecha
      urgentes.sort((a, b) => {
        const prioridadA = URGENCIA_CONFIG[a.urgencia]?.prioridad || 999;
        const prioridadB = URGENCIA_CONFIG[b.urgencia]?.prioridad || 999;
        
        if (prioridadA !== prioridadB) {
          return prioridadA - prioridadB;
        }
        
        return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
      });
      
      setReportesUrgentes(urgentes);
      setColegios(colegiosRes.data.results || colegiosRes.data || []);
      setTiposIncidente(tiposRes.data.results || tiposRes.data || []);
      setUsuarios(usuariosRes.data.results || usuariosRes.data || []);
    } catch (error) {
      console.error('Error loading urgent reports:', error);
      showSnackbar('Error al cargar los reportes urgentes', 'error');
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

  const calcularTiempoTranscurrido = (fechaCreacion) => {
    const ahora = new Date();
    const creacion = new Date(fechaCreacion);
    const diferenciaMs = ahora - creacion;
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    }
    return `${minutos}m`;
  };

  const calcularPorcentajeTiempo = (fechaCreacion, urgencia) => {
    const config = URGENCIA_CONFIG[urgencia];
    if (!config) return 0;
    
    const ahora = new Date();
    const creacion = new Date(fechaCreacion);
    const diferenciaMs = ahora - creacion;
    const horasTranscurridas = diferenciaMs / (1000 * 60 * 60);
    
    return Math.min((horasTranscurridas / config.tiempoLimite) * 100, 100);
  };

  const esVencido = (fechaCreacion, urgencia) => {
    const porcentaje = calcularPorcentajeTiempo(fechaCreacion, urgencia);
    return porcentaje >= 100;
  };

  const handleViewDetails = (reporte) => {
    setSelectedReporte(reporte);
    setDetailsOpen(true);
  };

  const handleTakeAction = (reporte) => {
    setSelectedReporte(reporte);
    setActionFormData({
      estado: 'en_investigacion',
      observaciones: '',
      asignado_a: '',
      accion_inmediata: '',
    });
    setActionOpen(true);
  };

  const handleActionFormChange = (event) => {
    const { name, value } = event.target;
    setActionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAction = async () => {
    try {
      await apiService.updateReporte(selectedReporte.id, {
        ...actionFormData,
        fecha_ultima_actualizacion: new Date().toISOString(),
      });
      
      showSnackbar('Acción registrada exitosamente');
      setActionOpen(false);
      loadData(); // Recargar datos
    } catch (error) {
      showSnackbar('Error al registrar la acción', 'error');
    }
  };

  const filteredReportes = reportesUrgentes.filter(reporte => {
    if (filtroUrgencia && reporte.urgencia !== filtroUrgencia) return false;
    return true;
  });

  const reportesCriticos = filteredReportes.filter(r => r.urgencia === 'critica').length;
  const reportesAlta = filteredReportes.filter(r => r.urgencia === 'alta').length;
  const reportesVencidos = filteredReportes.filter(r => 
    esVencido(r.fecha_creacion, r.urgencia)
  ).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={filteredReportes.length} color="error">
            <NotificationsActiveIcon sx={{ mr: 2, fontSize: 40 }} />
          </Badge>
          Reportes Urgentes
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                color="primary"
              />
            }
            label="Auto-actualizar"
          />
          <IconButton 
            onClick={loadData} 
            disabled={loading}
            title="Actualizar manualmente"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Panel de estadísticas urgentes */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: '#ffebee', borderLeft: '4px solid #f44336' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="error">
                    {reportesCriticos}
                  </Typography>
                  <Typography variant="subtitle1" color="error">
                    Críticos
                  </Typography>
                </Box>
                <ErrorIcon sx={{ fontSize: 40, color: '#f44336' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {reportesAlta}
                  </Typography>
                  <Typography variant="subtitle1" color="warning.main">
                    Alta Urgencia
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: '#f3e5f5', borderLeft: '4px solid #9c27b0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="secondary">
                    {reportesVencidos}
                  </Typography>
                  <Typography variant="subtitle1" color="secondary">
                    Vencidos
                  </Typography>
                </Box>
                <AccessTimeIcon sx={{ fontSize: 40, color: '#9c27b0' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Filtrar por Urgencia</InputLabel>
            <Select
              value={filtroUrgencia}
              onChange={(e) => setFiltroUrgencia(e.target.value)}
              label="Filtrar por Urgencia"
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="critica">Crítica</MenuItem>
              <MenuItem value="alta">Alta</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {filteredReportes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No hay reportes urgentes pendientes
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Excelente trabajo manteniendo los casos al día
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredReportes.map((reporte) => {
            const urgenciaConfig = URGENCIA_CONFIG[reporte.urgencia];
            const tiempoTranscurrido = calcularTiempoTranscurrido(reporte.fecha_creacion);
            const porcentajeTiempo = calcularPorcentajeTiempo(reporte.fecha_creacion, reporte.urgencia);
            const vencido = esVencido(reporte.fecha_creacion, reporte.urgencia);
            const colegio = colegios.find(c => c.id === reporte.colegio);
            const tipoIncidente = tiposIncidente.find(t => t.id === reporte.tipo_incidente);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={reporte.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: urgenciaConfig?.backgroundColor,
                    border: `2px solid ${urgenciaConfig?.borderColor}`,
                    ...(vencido && {
                      boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
                      animation: 'pulse 2s infinite'
                    })
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        icon={urgenciaConfig?.icon}
                        label={urgenciaConfig?.label}
                        color={urgenciaConfig?.color}
                        size="small"
                      />
                      <Typography variant="caption" color="textSecondary">
                        #{reporte.id}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {reporte.titulo}
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={colegio?.nombre || 'N/A'}
                          secondary="Colegio"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tiempoTranscurrido}
                          secondary="Tiempo transcurrido"
                        />
                      </ListItem>
                    </List>
                    
                    {/* Indicador de tiempo */}
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption">
                          Tiempo límite: {urgenciaConfig?.tiempoLimite}h
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color={vencido ? 'error' : 'textSecondary'}
                          fontWeight={vencido ? 'bold' : 'normal'}
                        >
                          {vencido ? 'VENCIDO' : `${Math.round(porcentajeTiempo)}%`}
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 20 }}>
                        <Gauge
                          value={porcentajeTiempo}
                          startAngle={-90}
                          endAngle={90}
                          sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                              fontSize: 10,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                              fill: vencido ? '#f44336' : (porcentajeTiempo > 75 ? '#ff9800' : '#4caf50'),
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    
                    {vencido && (
                      <Alert severity="error" size="small">
                        Este reporte ha excedido el tiempo límite
                      </Alert>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewDetails(reporte)}
                      startIcon={<VisibilityIcon />}
                    >
                      Ver
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      color={urgenciaConfig?.color}
                      onClick={() => handleTakeAction(reporte)}
                      startIcon={<AssignmentIcon />}
                    >
                      Actuar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialog para ver detalles */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles del Reporte Urgente #{selectedReporte?.id}
        </DialogTitle>
        <DialogContent>
          {selectedReporte && (
            <Box>
              {/* Contenido similar al de GestionReportes pero enfocado en urgencia */}
              <Alert 
                severity={URGENCIA_CONFIG[selectedReporte.urgencia]?.color}
                sx={{ mb: 2 }}
              >
                Reporte de urgencia {URGENCIA_CONFIG[selectedReporte.urgencia]?.label.toLowerCase()} - 
                Tiempo transcurrido: {calcularTiempoTranscurrido(selectedReporte.fecha_creacion)}
              </Alert>
              
              <Typography variant="h6" gutterBottom>
                {selectedReporte.titulo}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Colegio:</Typography>
                  <Typography variant="body1">
                    {colegios.find(c => c.id === selectedReporte.colegio)?.nombre || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Tipo de Incidente:</Typography>
                  <Typography variant="body1">
                    {tiposIncidente.find(t => t.id === selectedReporte.tipo_incidente)?.nombre || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Lugar:</Typography>
                  <Typography variant="body1">{selectedReporte.lugar_incidente}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Fecha del Incidente:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedReporte.fecha_incidente).toLocaleString('es-CL')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Descripción:</Typography>
                  <Typography variant="body1">{selectedReporte.descripcion}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Cerrar</Button>
          <Button 
            variant="contained"
            color={selectedReporte ? URGENCIA_CONFIG[selectedReporte.urgencia]?.color : 'primary'}
            onClick={() => {
              setDetailsOpen(false);
              handleTakeAction(selectedReporte);
            }}
          >
            Tomar Acción Inmediata
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para tomar acción */}
      <Dialog 
        open={actionOpen} 
        onClose={() => setActionOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Acción Inmediata - Reporte #{selectedReporte?.id}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nuevo Estado</InputLabel>
                <Select
                  name="estado"
                  value={actionFormData.estado}
                  onChange={handleActionFormChange}
                  label="Nuevo Estado"
                >
                  <MenuItem value="en_investigacion">En Investigación</MenuItem>
                  <MenuItem value="resuelto">Resuelto</MenuItem>
                  <MenuItem value="cerrado">Cerrado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Asignar a</InputLabel>
                <Select
                  name="asignado_a"
                  value={actionFormData.asignado_a}
                  onChange={handleActionFormChange}
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
                name="accion_inmediata"
                label="Acción Inmediata Tomada"
                value={actionFormData.accion_inmediata}
                onChange={handleActionFormChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Describe las acciones inmediatas tomadas..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="observaciones"
                label="Observaciones Adicionales"
                value={actionFormData.observaciones}
                onChange={handleActionFormChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Observaciones sobre el caso, próximos pasos, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained"
            color="error"
            onClick={handleSaveAction}
            disabled={!actionFormData.accion_inmediata.trim()}
          >
            Guardar Acción
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

      {/* Estilos para la animación pulse */}
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(255, 0, 0, 0.6);
            }
            100% {
              box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
            }
          }
        `}
      </style>
    </Box>
  );
}

export default ReportesUrgentes;