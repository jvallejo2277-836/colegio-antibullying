import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

export default function AnonimatoManager() {
  const handleDemo = (action) => {
    alert(`Demo: ${action}\nFuncionalidad disponible en versión completa.`);
  };

  const reglasDemo = [
    {
      id: 1,
      nivel: 'Público',
      descripcion: 'Identidad visible para todos los involucrados',
      color: 'success',
      icon: <VisibilityIcon />
    },
    {
      id: 2,
      nivel: 'Restringido',
      descripcion: 'Identidad visible solo para personal autorizado',
      color: 'warning',
      icon: <SecurityIcon />
    },
    {
      id: 3,
      nivel: 'Anónimo Total',
      descripcion: 'Identidad protegida completamente',
      color: 'error',
      icon: <VisibilityOffIcon />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6">Gestión de Anonimato - Vista Demo</Typography>
        <Typography>
          Sistema de control granular de anonimato por roles y etapas.
        </Typography>
      </Alert>

      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Anonimato
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Reglas de Anonimato Configuradas
        </Typography>

        <Grid container spacing={3}>
          {reglasDemo.map((regla) => (
            <Grid item xs={12} md={4} key={regla.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    {regla.icon}
                    <Typography variant="h6">
                      {regla.nivel}
                    </Typography>
                    <Chip
                      label={regla.nivel.toLowerCase()}
                      color={regla.color}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    {regla.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={() => handleDemo('Crear Regla')}
          >
            Nueva Regla
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDemo('Ver Accesos Activos')}
          >
            Ver Accesos Activos
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDemo('Configurar Permisos')}
          >
            Configurar Permisos
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Características del Sistema
        </Typography>
        
        <Typography variant="body1" paragraph>
          • Control granular de acceso a identidad por rol y etapa del proceso
        </Typography>
        <Typography variant="body1" paragraph>
          • Registro de auditoría de todos los accesos a información sensible
        </Typography>
        <Typography variant="body1" paragraph>
          • Configuración flexible de niveles de anonimato según la gravedad
        </Typography>
        <Typography variant="body1" paragraph>
          • Protección automática con tiempos configurables
        </Typography>
      </Paper>
    </Container>
  );
}