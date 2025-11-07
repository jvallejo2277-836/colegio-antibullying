import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Alert,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Timeline as TimelineIcon,
  Policy as PolicyIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '../../contexts/AuthContext';

// Datos de ejemplo para demostración
const PROTOCOLOS_DEMO = [
  {
    id: 1,
    nombre: 'Protocolo Incidentes Leves',
    descripcion: 'Proceso para manejo de incidentes de gravedad leve como disrupciones menores en clase.',
    gravedad: 'leve',
    plazo_total_dias: 5,
    total_etapas: 3,
    requiere_aprobacion_director: false
  },
  {
    id: 2,
    nombre: 'Protocolo Bullying Moderado',
    descripcion: 'Proceso para casos de bullying de gravedad moderada que requieren intervención especializada.',
    gravedad: 'moderada',
    plazo_total_dias: 15,
    total_etapas: 5,
    requiere_aprobacion_director: true
  },
  {
    id: 3,
    nombre: 'Protocolo Agresiones Graves',
    descripcion: 'Proceso para agresiones físicas graves que requieren denuncia y seguimiento exhaustivo.',
    gravedad: 'grave',
    plazo_total_dias: 30,
    total_etapas: 7,
    requiere_aprobacion_director: true
  }
];

const GRAVEDAD_OPTIONS = [
  { value: 'leve', label: 'Leve', color: 'success' },
  { value: 'moderada', label: 'Moderada', color: 'warning' },
  { value: 'grave', label: 'Grave', color: 'error' }
];

export default function ProtocolosManager() {
  const [protocolos] = useState(PROTOCOLOS_DEMO);
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleDemo = (action, protocolo = null) => {
    enqueueSnackbar(`Funcionalidad "${action}" estará disponible en la versión completa`, { 
      variant: 'info' 
    });
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

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6">Protocolos Configurados - Vista Demo</Typography>
        <Typography>
          Esta es una vista de demostración de los protocolos flexibles implementados. 
          En la versión completa podrá crear, editar y gestionar protocolos personalizados.
        </Typography>
      </Alert>

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
                    label={GRAVEDAD_OPTIONS.find(g => g.value === protocolo.gravedad)?.label}
                    color={GRAVEDAD_OPTIONS.find(g => g.value === protocolo.gravedad)?.color}
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
                      {protocolo.total_etapas} configuradas
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
                <Button 
                  size="small" 
                  startIcon={<TimelineIcon />}
                  onClick={() => handleDemo('Ver Etapas', protocolo)}
                >
                  Ver Etapas
                </Button>
                <Button 
                  size="small" 
                  startIcon={<PolicyIcon />}
                  onClick={() => handleDemo('Editar', protocolo)}
                >
                  Editar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para mostrar funcionalidad demo */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Funcionalidad de Demostración
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Esta es una versión de demostración del sistema de protocolos flexibles. 
            </Typography>
            <Typography variant="body2" gutterBottom>
              Las funcionalidades completas incluyen:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              <li>Creación y edición de protocolos personalizados</li>
              <li>Configuración de etapas y plazos flexibles</li>
              <li>Gestión de reglas de anonimato</li>
              <li>Seguimiento de procesos en tiempo real</li>
              <li>Integración completa con la API backend</li>
            </Box>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}