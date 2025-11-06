import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import {
  PolicyOutlined as PolicyIcon,
  TimelineOutlined as TimelineIcon,
} from '@mui/icons-material';

interface Protocolo {
  id: number;
  nombre: string;
  descripcion: string;
  gravedad: 'leve' | 'moderada' | 'grave' | 'muy_grave';
  plazo_total_dias: number;
  total_etapas: number;
  requiere_aprobacion_director: boolean;
}

const ProtocolosDashboard: React.FC = () => {
  const protocolosDemo: Protocolo[] = [
    {
      id: 1,
      nombre: 'Protocolo de Acoso Verbal Leve',
      descripcion: 'Protocolo para situaciones de acoso verbal de baja intensidad, como burlas ocasionales o comentarios inapropiados.',
      gravedad: 'leve',
      plazo_total_dias: 15,
      total_etapas: 3,
      requiere_aprobacion_director: false
    },
    {
      id: 2,
      nombre: 'Protocolo de Agresión Física Moderada',
      descripcion: 'Protocolo para casos de agresión física sin lesiones graves, empujones o peleas menores.',
      gravedad: 'moderada',
      plazo_total_dias: 30,
      total_etapas: 5,
      requiere_aprobacion_director: true
    },
    {
      id: 3,
      nombre: 'Protocolo de Bullying Sistemático Grave',
      descripcion: 'Protocolo para situaciones de acoso sistemático, cyberbullying persistente o discriminación grave.',
      gravedad: 'grave',
      plazo_total_dias: 45,
      total_etapas: 7,
      requiere_aprobacion_director: true
    }
  ];

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case 'leve': return 'success';
      case 'moderada': return 'warning';
      case 'grave': return 'error';
      case 'muy_grave': return 'error';
      default: return 'default';
    }
  };

  const getGravedadLabel = (gravedad: string) => {
    switch (gravedad) {
      case 'leve': return 'Leve';
      case 'moderada': return 'Moderada';
      case 'grave': return 'Grave';
      case 'muy_grave': return 'Muy Grave';
      default: return gravedad;
    }
  };

  const handleDemo = (action: string, protocolo?: Protocolo) => {
    alert(`Función demo: ${action}\n${protocolo ? `Protocolo: ${protocolo.nombre}` : ''}\nEsta funcionalidad estará disponible en la versión completa.`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard de Protocolos
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6">Protocolos Flexibles - Vista Demo</Typography>
        <Typography>
          Esta es una demostración del sistema de protocolos flexibles implementado. 
          En la versión completa podrá crear, editar y gestionar protocolos personalizados.
        </Typography>
      </Alert>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Protocolos Configurados ({protocolosDemo.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<PolicyIcon />}
          onClick={() => handleDemo('Crear Nuevo Protocolo')}
        >
          Nuevo Protocolo
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        {protocolosDemo.map((protocolo) => (
          <Card key={protocolo.id} elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {protocolo.nombre}
                </Typography>
                <Chip
                  label={getGravedadLabel(protocolo.gravedad)}
                  color={getGravedadColor(protocolo.gravedad) as any}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {protocolo.descripcion}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" gap={4} mb={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Plazo Total
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {protocolo.plazo_total_dias} días
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Etapas
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {protocolo.total_etapas} configuradas
                  </Typography>
                </Box>
              </Box>

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
                onClick={() => handleDemo('Editar Protocolo', protocolo)}
              >
                Editar
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Funcionalidades del Sistema de Protocolos Flexibles
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Protocolos Configurables:</strong> Cree protocolos personalizados según las necesidades específicas de cada tipo de incidente.
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Etapas Flexibles:</strong> Configure el número y tipo de etapas según la gravedad del caso.
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Control de Anonimato:</strong> Gestión granular de acceso a información sensible por rol y etapa.
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Seguimiento en Tiempo Real:</strong> Monitoree el progreso de cada caso con timestamps y responsables.
            </Typography>
            <Typography variant="body2">
              • <strong>Integración Completa:</strong> API REST robusta con Django y base de datos optimizada.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ProtocolosDashboard;