import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Badge
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as CompleteIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { format, differenceInHours, addHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import { procesosAPI, ejecucionesAPI } from '../../services/api';
import { useAuthContext } from '../../contexts/AuthContext';

const ESTADO_COLORS = {
  'no_iniciado': 'default',
  'en_curso': 'primary',
  'pausado': 'warning',
  'completado': 'success',
  'vencido': 'error'
};

const ESTADO_LABELS = {
  'no_iniciado': 'No Iniciado',
  'en_curso': 'En Curso',
  'pausado': 'Pausado',
  'completado': 'Completado',
  'vencido': 'Vencido'
};

export default function ProcesoTracker({ incidenteId, onClose }) {
  const [proceso, setProceso] = useState(null);
  const [ejecuciones, setEjecuciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEjecucion, setSelectedEjecucion] = useState(null);
  const [observaciones, setObservaciones] = useState('');

  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (incidenteId) {
      loadProceso();
    }
  }, [incidenteId]);

  const loadProceso = async () => {
    try {
      setLoading(true);
      const response = await procesosAPI.getProcesos({
        incidente: incidenteId
      });
      
      const procesoData = response.data.results?.[0] || response.data[0];
      if (procesoData) {
        setProceso(procesoData);
        loadEjecuciones(procesoData.id);
      }
    } catch (error) {
      enqueueSnackbar('Error al cargar proceso', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadEjecuciones = async (procesoId) => {
    try {
      const response = await ejecucionesAPI.getEjecuciones({
        proceso: procesoId
      });
      setEjecuciones(response.data.results || response.data);
    } catch (error) {
      enqueueSnackbar('Error al cargar ejecuciones', { variant: 'error' });
    }
  };

  const handleAvanzarEtapa = async () => {
    try {
      await procesosAPI.avanzarEtapa(proceso.id);
      enqueueSnackbar('Etapa avanzada correctamente', { variant: 'success' });
      loadProceso();
    } catch (error) {
      enqueueSnackbar('Error al avanzar etapa', { variant: 'error' });
    }
  };

  const handlePausarProceso = async () => {
    try {
      await procesosAPI.pausar(proceso.id);
      enqueueSnackbar('Proceso pausado', { variant: 'info' });
      loadProceso();
    } catch (error) {
      enqueueSnackbar('Error al pausar proceso', { variant: 'error' });
    }
  };

  const handleReanudarProceso = async () => {
    try {
      await procesosAPI.reanudar(proceso.id);
      enqueueSnackbar('Proceso reanudado', { variant: 'success' });
      loadProceso();
    } catch (error) {
      enqueueSnackbar('Error al reanudar proceso', { variant: 'error' });
    }
  };

  const handleCompletarEtapa = async () => {
    try {
      await ejecucionesAPI.completar(selectedEjecucion.id, {
        observaciones: observaciones
      });
      enqueueSnackbar('Etapa completada correctamente', { variant: 'success' });
      setOpenDialog(false);
      setObservaciones('');
      loadProceso();
    } catch (error) {
      enqueueSnackbar('Error al completar etapa', { variant: 'error' });
    }
  };

  const calcularProgreso = () => {
    if (!proceso || !ejecuciones.length) return 0;
    
    const completadas = ejecuciones.filter(ej => ej.estado === 'completada').length;
    return (completadas / ejecuciones.length) * 100;
  };

  const getProgresoColor = () => {
    const progreso = calcularProgreso();
    if (progreso === 100) return 'success';
    if (progreso >= 60) return 'primary';
    if (progreso >= 30) return 'warning';
    return 'error';
  };

  const esEtapaVencida = (ejecucion) => {
    if (ejecucion.estado === 'completada') return false;
    
    const ahora = new Date();
    const fechaLimite = addHours(new Date(ejecucion.fecha_inicio), ejecucion.etapa.plazo_horas);
    return ahora > fechaLimite;
  };

  const getTiempoRestante = (ejecucion) => {
    if (ejecucion.estado === 'completada') return null;
    
    const ahora = new Date();
    const fechaLimite = addHours(new Date(ejecucion.fecha_inicio), ejecucion.etapa.plazo_horas);
    const horasRestantes = differenceInHours(fechaLimite, ahora);
    
    if (horasRestantes < 0) return 'Vencida';
    if (horasRestantes < 24) return `${horasRestantes}h restantes`;
    
    const dias = Math.floor(horasRestantes / 24);
    const horas = horasRestantes % 24;
    return `${dias}d ${horas}h restantes`;
  };

  const getIconoEtapa = (ejecucion) => {
    if (ejecucion.estado === 'completada') return <CompleteIcon color="success" />;
    if (esEtapaVencida(ejecucion)) return <WarningIcon color="error" />;
    if (ejecucion.estado === 'en_curso') return <ScheduleIcon color="primary" />;
    return <ScheduleIcon color="action" />;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!proceso) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          No se ha iniciado un proceso para este incidente.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header del proceso */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h5" component="h1">
                Proceso de Incidente
              </Typography>
              <Chip
                label={ESTADO_LABELS[proceso.estado]}
                color={ESTADO_COLORS[proceso.estado]}
              />
            </Box>
            
            <Typography variant="h6" color="primary" gutterBottom>
              {proceso.protocolo.nombre}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Gravedad: {proceso.protocolo.gravedad} | 
              Plazo Total: {proceso.protocolo.plazo_total_dias} días
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h4" color={getProgresoColor()}>
                {Math.round(calcularProgreso())}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calcularProgreso()}
                color={getProgresoColor()}
                sx={{ mt: 1, mb: 2, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                Progreso del Proceso
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Controles del proceso */}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" gap={2}>
          {proceso.estado === 'en_curso' && (
            <>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleAvanzarEtapa}
                disabled={!proceso.etapa_actual}
              >
                Avanzar Etapa
              </Button>
              <Button
                variant="outlined"
                startIcon={<PauseIcon />}
                onClick={handlePausarProceso}
              >
                Pausar
              </Button>
            </>
          )}
          
          {proceso.estado === 'pausado' && (
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={handleReanudarProceso}
            >
              Reanudar
            </Button>
          )}
          
          {proceso.estado === 'completado' && (
            <Alert severity="success" sx={{ flexGrow: 1 }}>
              Proceso completado exitosamente
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Timeline de etapas */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Timeline del Proceso
        </Typography>

        <Timeline>
          {ejecuciones.map((ejecucion, index) => (
            <TimelineItem key={ejecucion.id}>
              <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                <Box textAlign="right">
                  <Typography variant="caption" display="block">
                    {format(new Date(ejecucion.fecha_inicio), 'dd MMM yyyy', { locale: es })}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {format(new Date(ejecucion.fecha_inicio), 'HH:mm')}
                  </Typography>
                  {getTiempoRestante(ejecucion) && (
                    <Typography
                      variant="caption"
                      display="block"
                      color={esEtapaVencida(ejecucion) ? 'error' : 'warning.main'}
                    >
                      {getTiempoRestante(ejecucion)}
                    </Typography>
                  )}
                </Box>
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot variant="outlined">
                  {getIconoEtapa(ejecucion)}
                </TimelineDot>
                {index < ejecuciones.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Card
                  elevation={ejecucion.estado === 'en_curso' ? 3 : 1}
                  sx={{
                    border: ejecucion.estado === 'en_curso' ? 2 : 0,
                    borderColor: 'primary.main'
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="h6" component="h3">
                        {ejecucion.etapa.nombre}
                      </Typography>
                      <Box display="flex" gap={1}>
                        {ejecucion.estado === 'en_curso' && (
                          <Badge badge color="primary" variant="dot" />
                        )}
                        {esEtapaVencida(ejecucion) && ejecucion.estado !== 'completada' && (
                          <Badge badgeContent="!" color="error" />
                        )}
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {ejecucion.etapa.descripcion}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            {ejecucion.ejecutado_por?.nombre || 'No asignado'}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ScheduleIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            Plazo: {ejecucion.etapa.plazo_horas}h
                            {ejecucion.etapa.es_plazo_habiles && ' (hábiles)'}
                          </Typography>
                        </Box>
                      </Grid>

                      {ejecucion.etapa.acciones_requeridas && (
                        <Grid item xs={12}>
                          <Typography variant="caption" display="block">
                            <strong>Acciones:</strong> {ejecucion.etapa.acciones_requeridas}
                          </Typography>
                        </Grid>
                      )}

                      {ejecucion.observaciones && (
                        <Grid item xs={12}>
                          <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="caption">
                              <strong>Observaciones:</strong> {ejecucion.observaciones}
                            </Typography>
                          </Alert>
                        </Grid>
                      )}
                    </Grid>

                    {ejecucion.estado === 'en_curso' && (
                      <Box mt={2} display="flex" gap={1}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CompleteIcon />}
                          onClick={() => {
                            setSelectedEjecucion(ejecucion);
                            setOpenDialog(true);
                          }}
                        >
                          Completar Etapa
                        </Button>
                        
                        <Tooltip title="Añadir comentario">
                          <IconButton size="small">
                            <CommentIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    {ejecucion.fecha_completada && (
                      <Alert severity="success" sx={{ mt: 1 }}>
                        Completada el {format(new Date(ejecucion.fecha_completada), 'dd/MM/yyyy HH:mm')}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>

      {/* Dialog para completar etapa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Completar Etapa: {selectedEjecucion?.etapa.nombre}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Describa las acciones realizadas, resultados obtenidos y cualquier observación relevante..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCompletarEtapa}
            variant="contained"
            startIcon={<CompleteIcon />}
          >
            Completar Etapa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}