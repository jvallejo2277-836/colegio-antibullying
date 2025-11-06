import React from 'react';import React from 'react';import React from 'react';import React, { useState } from 'react';import React, { useState } from 'react';

import { Container, Typography, Alert } from '@mui/material';

import {

export default function ProcesoTracker() {

  return (  Container,import {

    <Container maxWidth="lg" sx={{ py: 4 }}>

      <Alert severity="info" sx={{ mb: 3 }}>  Paper,

        <Typography variant="h6">Seguimiento de Proceso - Demo</Typography>

        <Typography>Sistema de seguimiento en tiempo real.</Typography>  Typography,  Container,import {import {

      </Alert>

      <Typography variant="h4">Proceso Tracker</Typography>  Box,

      <Typography>Vista de demostración del seguimiento de procesos.</Typography>

    </Container>  Button,  Paper,

  );

}  Alert,

  Grid,  Typography,  Container,  Container,

  Chip,

  LinearProgress  Box,

} from '@mui/material';

import {  Button,  Paper,  Paper,

  PlayArrow as PlayIcon,

  CheckCircle as CompleteIcon,  Alert

  Schedule as ScheduleIcon

} from '@mui/icons-material';} from '@mui/material';  Typography,  Typography,



export default function ProcesoTracker({ incidenteId, onClose }) {

  const handleDemo = (action) => {

    alert(`Demo: ${action}\nFuncionalidad disponible en versión completa.`);export default function ProcesoTracker({ incidenteId, onClose }) {  Box,  Box,

  };

  const handleDemo = (action) => {

  return (

    <Container maxWidth="lg" sx={{ py: 4 }}>    alert(`Demo: ${action}\nFuncionalidad disponible en versión completa.`);  Grid,  Grid,

      <Alert severity="info" sx={{ mb: 3 }}>

        <Typography variant="h6">Seguimiento de Proceso - Vista Demo</Typography>  };

        <Typography>

          Sistema de seguimiento de procesos en tiempo real.  Button,  Button,

        </Typography>

      </Alert>  return (



      <Paper sx={{ p: 3, mb: 3 }}>    <Container maxWidth="lg" sx={{ py: 4 }}>  Chip,  Chip,

        <Grid container spacing={3} alignItems="center">

          <Grid item xs={12} md={8}>      <Alert severity="info" sx={{ mb: 3 }}>

            <Box display="flex" alignItems="center" gap={2} mb={2}>

              <Typography variant="h5">        <Typography variant="h6">Seguimiento de Proceso - Vista Demo</Typography>  LinearProgress,  LinearProgress,

                Proceso de Incidente

              </Typography>        <Typography>

              <Chip label="En Curso" color="primary" />

            </Box>          Sistema de seguimiento de procesos en tiempo real.  Alert,  Alert,

            

            <Typography variant="h6" color="primary" gutterBottom>        </Typography>

              Protocolo de Acoso Verbal Moderado

            </Typography>      </Alert>  Divider,  Divider,

            

            <Typography variant="body2" color="text.secondary">

              Gravedad: moderada | Plazo Total: 30 días

            </Typography>      <Paper sx={{ p: 3 }}>  List,  List,

          </Grid>

        <Typography variant="h5" gutterBottom>

          <Grid item xs={12} md={4}>

            <Box textAlign="center">          Proceso de Incidente  ListItem,  ListItem,

              <Typography variant="h4" color="primary">

                60%        </Typography>

              </Typography>

              <LinearProgress          ListItemIcon,  ListItemIcon,

                variant="determinate"

                value={60}        <Typography variant="body1" paragraph>

                color="primary"

                sx={{ mt: 1, mb: 2, height: 8, borderRadius: 4 }}          Aquí se mostraría el seguimiento detallado del proceso,   ListItemText  ListItemText

              />

              <Typography variant="caption" color="text.secondary">          incluyendo etapas, responsables y progreso en tiempo real.

                Progreso del Proceso

              </Typography>        </Typography>} from '@mui/material';} from '@mui/material';

            </Box>

          </Grid>

        </Grid>

        <Box display="flex" gap={2}>import {import {

        <Box display="flex" gap={2} mt={3}>

          <Button          <Button

            variant="contained"

            startIcon={<PlayIcon />}            variant="contained"  PlayArrow as PlayIcon,  PlayArrow as PlayIcon,

            onClick={() => handleDemo('Avanzar Etapa')}

          >            onClick={() => handleDemo('Ver Timeline')}

            Avanzar Etapa

          </Button>          >  CheckCircle as CompleteIcon,  CheckCircle as CompleteIcon,

          <Button

            variant="outlined"            Ver Timeline

            onClick={() => handleDemo('Ver Timeline')}

          >          </Button>  Schedule as ScheduleIcon  Schedule as ScheduleIcon

            Ver Timeline

          </Button>          <Button

          <Button

            variant="outlined"            variant="outlined"} from '@mui/icons-material';} from '@mui/icons-material';

            onClick={() => handleDemo('Pausar Proceso')}

          >            onClick={() => handleDemo('Avanzar Etapa')}

            Pausar

          </Button>          >

        </Box>

      </Paper>            Avanzar Etapa



      <Paper sx={{ p: 3 }}>          </Button>export default function ProcesoTracker({ incidenteId, onClose }) {export default function ProcesoTracker({ incidenteId, onClose }) {

        <Typography variant="h6" gutterBottom>

          Etapas del Proceso        </Box>

        </Typography>

              </Paper>  // Datos de demostración  // Datos de demostración

        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>

            <Box display="flex" alignItems="center" gap={2} p={2} bgcolor="success.light" borderRadius={1}>

              <CompleteIcon color="success" />      {onClose && (  const procesoDemo = {  const procesoDemo = {

              <Box>

                <Typography variant="subtitle1">Recepción de Denuncia</Typography>        <Box mt={3} display="flex" justifyContent="flex-end">

                <Typography variant="caption">Completada - 01/11/2025</Typography>

              </Box>          <Button onClick={onClose} variant="outlined">    protocolo: {    protocolo: {

            </Box>

          </Grid>            Cerrar

          

          <Grid item xs={12} md={6}>          </Button>      nombre: 'Protocolo de Acoso Verbal Moderado',      nombre: 'Protocolo de Acoso Verbal Moderado',

            <Box display="flex" alignItems="center" gap={2} p={2} bgcolor="success.light" borderRadius={1}>

              <CompleteIcon color="success" />        </Box>

              <Box>

                <Typography variant="subtitle1">Investigación Preliminar</Typography>      )}      gravedad: 'moderada',      gravedad: 'moderada',

                <Typography variant="caption">Completada - 02/11/2025</Typography>

              </Box>    </Container>

            </Box>

          </Grid>  );      plazo_total_dias: 30      plazo_total_dias: 30

          

          <Grid item xs={12} md={6}>}

            <Box display="flex" alignItems="center" gap={2} p={2} bgcolor="primary.light" borderRadius={1}>    },    },

              <PlayIcon color="primary" />

              <Box>    progreso: 60    progreso: 60

                <Typography variant="subtitle1">Entrevista con Involucrados</Typography>

                <Typography variant="caption">En Curso - Iniciada 05/11/2025</Typography>  };  };

              </Box>

            </Box>

          </Grid>

            const etapasDemo = [  const etapasDemo = [

          <Grid item xs={12} md={6}>

            <Box display="flex" alignItems="center" gap={2} p={2} bgcolor="grey.100" borderRadius={1}>    {    {

              <ScheduleIcon color="action" />

              <Box>      id: 1,      id: 1,

                <Typography variant="subtitle1">Resolución y Seguimiento</Typography>

                <Typography variant="caption">Pendiente</Typography>      nombre: 'Recepción de Denuncia',      nombre: 'Recepción de Denuncia',

              </Box>

            </Box>      estado: 'completada',      estado: 'completada',

          </Grid>

        </Grid>      fecha: '2025-11-01',      fecha: '2025-11-01',

      </Paper>

      responsable: 'Director',      responsable: 'Director',

      {onClose && (

        <Box mt={3} display="flex" justifyContent="flex-end">      descripcion: 'Denuncia recibida y registrada'      descripcion: 'Denuncia recibida y registrada'

          <Button onClick={onClose} variant="outlined">

            Cerrar    },    },

          </Button>

        </Box>    {    {

      )}

    </Container>      id: 2,      id: 2,

  );

}      nombre: 'Investigación Preliminar',      nombre: 'Investigación Preliminar',

      estado: 'completada',      estado: 'completada',

      fecha: '2025-11-02',      fecha: '2025-11-02',

      responsable: 'Orientadora',      responsable: 'Orientadora',

      descripcion: 'Recopilación de información inicial'      descripcion: 'Recopilación de información inicial'

    },    },

    {    {

      id: 3,      id: 3,

      nombre: 'Entrevista con Involucrados',      nombre: 'Entrevista con Involucrados',

      estado: 'en_curso',      estado: 'en_curso',

      fecha: '2025-11-05',      fecha: '2025-11-05',

      responsable: 'Psicóloga',      responsable: 'Psicóloga',

      descripcion: 'Entrevistas individuales'      descripcion: 'Entrevistas individuales'

    },    },

    {    {

      id: 4,      id: 4,

      nombre: 'Resolución y Seguimiento',      nombre: 'Resolución y Seguimiento',

      estado: 'pendiente',      estado: 'pendiente',

      fecha: null,      fecha: null,

      responsable: 'Director',      responsable: 'Director',

      descripcion: 'Aplicación de medidas correctivas'      descripcion: 'Aplicación de medidas correctivas'

    }    }

  ];  ];



  const handleDemo = (action) => {  const handleDemo = (action) => {

    alert(`Demo: ${action}\nFuncionalidad disponible en versión completa.`);    alert(`Demo: ${action}\nFuncionalidad disponible en versión completa.`);

  };  };



  const getEstadoColor = (estado) => {  const getEstadoColor = (estado) => {

    switch (estado) {    switch (estado) {

      case 'completada': return 'success';      case 'completada': return 'success';

      case 'en_curso': return 'primary';      case 'en_curso': return 'primary';

      default: return 'default';      default: return 'default';

    }    }

  };  };



  const getEstadoIcon = (estado) => {  const getEstadoIcon = (estado) => {

    switch (estado) {    switch (estado) {

      case 'completada': return <CompleteIcon color="success" />;      case 'completada': return <CompleteIcon color="success" />;

      case 'en_curso': return <PlayIcon color="primary" />;      case 'en_curso': return <PlayIcon color="primary" />;

      default: return <ScheduleIcon color="action" />;      default: return <ScheduleIcon color="action" />;

    }    }

  };  };



  return (  return (

    <Container maxWidth="lg" sx={{ py: 4 }}>    <Container maxWidth="lg" sx={{ py: 4 }}>

      <Alert severity="info" sx={{ mb: 3 }}>      <Alert severity="info" sx={{ mb: 3 }}>

        <Typography variant="h6">Seguimiento de Proceso - Vista Demo</Typography>        <Typography variant="h6">Seguimiento de Proceso - Vista Demo</Typography>

        <Typography>        <Typography>

          Esta es una demostración del sistema de seguimiento de procesos en tiempo real.          Esta es una demostración del sistema de seguimiento de procesos en tiempo real.

        </Typography>        </Typography>

      </Alert>      </Alert>



      {/* Header del proceso */}  const loadEjecuciones = async (procesoId) => {

      <Paper sx={{ p: 3, mb: 3 }}>    try {

        <Grid container spacing={3} alignItems="center">      const response = await ejecucionesAPI.getEjecuciones({

          <Grid item xs={12} md={8}>        proceso: procesoId

            <Box display="flex" alignItems="center" gap={2} mb={2}>      });

              <Typography variant="h5" component="h1">      setEjecuciones(response.data.results || response.data);

                Seguimiento de Proceso    } catch (error) {

              </Typography>      enqueueSnackbar('Error al cargar ejecuciones', { variant: 'error' });

              <Chip    }

                label="En Curso"  };

                color="primary"

              />  const handleAvanzarEtapa = async () => {

            </Box>    try {

                  await procesosAPI.avanzarEtapa(proceso.id);

            <Typography variant="h6" color="primary" gutterBottom>      enqueueSnackbar('Etapa avanzada correctamente', { variant: 'success' });

              {procesoDemo.protocolo.nombre}      loadProceso();

            </Typography>    } catch (error) {

                  enqueueSnackbar('Error al avanzar etapa', { variant: 'error' });

            <Typography variant="body2" color="text.secondary">    }

              Gravedad: {procesoDemo.protocolo.gravedad} |   };

              Plazo Total: {procesoDemo.protocolo.plazo_total_dias} días

            </Typography>  const handlePausarProceso = async () => {

          </Grid>    try {

      await procesosAPI.pausar(proceso.id);

          <Grid item xs={12} md={4}>      enqueueSnackbar('Proceso pausado', { variant: 'info' });

            <Box textAlign="center">      loadProceso();

              <Typography variant="h4" color="primary">    } catch (error) {

                {procesoDemo.progreso}%      enqueueSnackbar('Error al pausar proceso', { variant: 'error' });

              </Typography>    }

              <LinearProgress  };

                variant="determinate"

                value={procesoDemo.progreso}  const handleReanudarProceso = async () => {

                color="primary"    try {

                sx={{ mt: 1, mb: 2, height: 8, borderRadius: 4 }}      await procesosAPI.reanudar(proceso.id);

              />      enqueueSnackbar('Proceso reanudado', { variant: 'success' });

              <Typography variant="caption" color="text.secondary">      loadProceso();

                Progreso del Proceso    } catch (error) {

              </Typography>      enqueueSnackbar('Error al reanudar proceso', { variant: 'error' });

            </Box>    }

          </Grid>  };

        </Grid>

  const handleCompletarEtapa = async () => {

        {/* Controles del proceso */}    try {

        <Divider sx={{ my: 2 }} />      await ejecucionesAPI.completar(selectedEjecucion.id, {

        <Box display="flex" gap={2}>        observaciones: observaciones

          <Button      });

            variant="contained"      enqueueSnackbar('Etapa completada correctamente', { variant: 'success' });

            startIcon={<PlayIcon />}      setOpenDialog(false);

            onClick={() => handleDemo('Avanzar Etapa')}      setObservaciones('');

          >      loadProceso();

            Avanzar Etapa    } catch (error) {

          </Button>      enqueueSnackbar('Error al completar etapa', { variant: 'error' });

          <Button    }

            variant="outlined"  };

            onClick={() => handleDemo('Pausar Proceso')}

          >  const calcularProgreso = () => {

            Pausar    if (!proceso || !ejecuciones.length) return 0;

          </Button>    

          <Button    const completadas = ejecuciones.filter(ej => ej.estado === 'completada').length;

            variant="outlined"    return (completadas / ejecuciones.length) * 100;

            onClick={() => handleDemo('Ver Historial')}  };

          >

            Ver Historial  const getProgresoColor = () => {

          </Button>    const progreso = calcularProgreso();

        </Box>    if (progreso === 100) return 'success';

      </Paper>    if (progreso >= 60) return 'primary';

    if (progreso >= 30) return 'warning';

      {/* Lista de etapas */}    return 'error';

      <Paper sx={{ p: 3 }}>  };

        <Typography variant="h6" gutterBottom>

          Etapas del Proceso  const esEtapaVencida = (ejecucion) => {

        </Typography>    if (ejecucion.estado === 'completada') return false;

    

        <List>    const ahora = new Date();

          {etapasDemo.map((etapa, index) => (    const fechaLimite = addHours(new Date(ejecucion.fecha_inicio), ejecucion.etapa.plazo_horas);

            <React.Fragment key={etapa.id}>    return ahora > fechaLimite;

              <ListItem>  };

                <ListItemIcon>

                  {getEstadoIcon(etapa.estado)}  const getTiempoRestante = (ejecucion) => {

                </ListItemIcon>    if (ejecucion.estado === 'completada') return null;

                <ListItemText    

                  primary={    const ahora = new Date();

                    <Box display="flex" alignItems="center" gap={2}>    const fechaLimite = addHours(new Date(ejecucion.fecha_inicio), ejecucion.etapa.plazo_horas);

                      <Typography variant="subtitle1">    const horasRestantes = differenceInHours(fechaLimite, ahora);

                        {etapa.nombre}    

                      </Typography>    if (horasRestantes < 0) return 'Vencida';

                      <Chip    if (horasRestantes < 24) return `${horasRestantes}h restantes`;

                        label={etapa.estado}    

                        color={getEstadoColor(etapa.estado)}    const dias = Math.floor(horasRestantes / 24);

                        size="small"    const horas = horasRestantes % 24;

                      />    return `${dias}d ${horas}h restantes`;

                    </Box>  };

                  }

                  secondary={  const getIconoEtapa = (ejecucion) => {

                    <Box>    if (ejecucion.estado === 'completada') return <CompleteIcon color="success" />;

                      <Typography variant="body2" color="text.secondary">    if (esEtapaVencida(ejecucion)) return <WarningIcon color="error" />;

                        {etapa.descripcion}    if (ejecucion.estado === 'en_curso') return <ScheduleIcon color="primary" />;

                      </Typography>    return <ScheduleIcon color="action" />;

                      <Typography variant="caption" color="text.secondary">  };

                        Responsable: {etapa.responsable}

                        {etapa.fecha && ` | Fecha: ${etapa.fecha}`}  if (loading) {

                      </Typography>    return (

                    </Box>      <Container maxWidth="lg" sx={{ py: 4 }}>

                  }        <LinearProgress />

                />      </Container>

                {etapa.estado === 'en_curso' && (    );

                  <Button  }

                    variant="outlined"

                    size="small"  if (!proceso) {

                    onClick={() => handleDemo('Completar Etapa')}    return (

                  >      <Container maxWidth="lg" sx={{ py: 4 }}>

                    Completar        <Alert severity="info">

                  </Button>          No se ha iniciado un proceso para este incidente.

                )}        </Alert>

              </ListItem>      </Container>

              {index < etapasDemo.length - 1 && <Divider />}    );

            </React.Fragment>  }

          ))}

        </List>  return (

      </Paper>    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* Header del proceso */}

      {onClose && (      <Paper sx={{ p: 3, mb: 3 }}>

        <Box mt={3} display="flex" justifyContent="flex-end">        <Grid container spacing={3} alignItems="center">

          <Button onClick={onClose} variant="outlined">          <Grid item xs={12} md={8}>

            Cerrar            <Box display="flex" alignItems="center" gap={2} mb={2}>

          </Button>              <Typography variant="h5" component="h1">

        </Box>                Proceso de Incidente

      )}              </Typography>

    </Container>              <Chip

  );                label={ESTADO_LABELS[proceso.estado]}

}                color={ESTADO_COLORS[proceso.estado]}
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