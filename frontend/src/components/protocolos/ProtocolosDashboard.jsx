import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Visibility as VisibilityIcon,
  Policy as PolicyIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useAuthContext } from '../../contexts/AuthContext';
import ProtocolosManager from './ProtocolosManager';
import EtapasManager from './EtapasManager';
import ProcesoTracker from './ProcesoTracker';
import AnonimatoManager from './AnonimatoManager';

const MENU_OPTIONS = [
  {
    id: 'protocolos',
    title: 'Gestión de Protocolos',
    description: 'Configure protocolos flexibles por gravedad de incidente',
    icon: <PolicyIcon />,
    color: 'primary',
    requiredRoles: ['director', 'subdirector', 'encargado_convivencia'],
    component: ProtocolosManager
  },
  {
    id: 'seguimiento',
    title: 'Seguimiento de Procesos',
    description: 'Monitoree el avance de procesos de incidentes',
    icon: <TimelineIcon />,
    color: 'info',
    requiredRoles: ['encargado_convivencia', 'orientador', 'director', 'subdirector'],
    component: ProcesoTracker
  },
  {
    id: 'anonimato',
    title: 'Reglas de Anonimato',
    description: 'Configure niveles de protección de identidad',
    icon: <SecurityIcon />,
    color: 'warning',
    requiredRoles: ['director', 'subdirector', 'encargado_convivencia'],
    component: AnonimatoManager
  },
  {
    id: 'reportes',
    title: 'Reportes y Estadísticas',
    description: 'Analice eficiencia de protocolos y cumplimiento de plazos',
    icon: <TrendingUpIcon />,
    color: 'success',
    requiredRoles: ['director', 'subdirector', 'encargado_convivencia'],
    component: null // Por implementar
  }
];

const GRAVEDAD_STATS = [
  { label: 'Protocolos Leves', count: 3, color: 'success' },
  { label: 'Protocolos Moderados', count: 2, color: 'warning' },
  { label: 'Protocolos Graves', count: 1, color: 'error' }
];

const PROCESO_STATS = [
  { label: 'Procesos Activos', count: 8, color: 'primary' },
  { label: 'Procesos Pausados', count: 2, color: 'warning' },
  { label: 'Procesos Completados', count: 23, color: 'success' }
];

export default function ProtocolosDashboard() {
  const [selectedOption, setSelectedOption] = useState(null);
  const { user } = useAuthContext();

  const userRole = user?.perfil?.rol || 'profesor';
  
  const hasPermission = (requiredRoles) => {
    return requiredRoles.includes(userRole) || userRole === 'superuser';
  };

  const getAvailableOptions = () => {
    return MENU_OPTIONS.filter(option => hasPermission(option.requiredRoles));
  };

  const handleOptionSelect = (option) => {
    if (option.component) {
      setSelectedOption(option);
    }
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  if (selectedOption) {
    const Component = selectedOption.component;
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button onClick={handleBack} variant="outlined">
            ← Volver al Dashboard
          </Button>
          <Typography variant="h4" component="h1">
            {selectedOption.title}
          </Typography>
        </Box>
        <Component onClose={handleBack} />
      </Container>
    );
  }

  const availableOptions = getAvailableOptions();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Sistema de Protocolos Flexibles
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Gestión integral de protocolos de convivencia escolar según Ley 20.536
        </Typography>
        <Chip
          label={`Colegio: ${user?.perfil?.colegio?.nombre || 'No asignado'}`}
          icon={<SchoolIcon />}
          color="primary"
          variant="outlined"
        />
      </Box>

      {availableOptions.length === 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="h6">Acceso Restringido</Typography>
          <Typography>
            Su rol ({userRole}) no tiene permisos para acceder a las funcionalidades de protocolos. 
            Contacte al administrador del sistema para solicitar los permisos necesarios.
          </Typography>
        </Alert>
      )}

      {/* Estadísticas Rápidas */}
      {availableOptions.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <PolicyIcon color="primary" />
                Protocolos Configurados
              </Typography>
              <Grid container spacing={2}>
                {GRAVEDAD_STATS.map((stat, index) => (
                  <Grid item xs={4} key={index}>
                    <Box textAlign="center">
                      <Typography variant="h4" color={`${stat.color}.main`}>
                        {stat.count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <TimelineIcon color="info" />
                Estado de Procesos
              </Typography>
              <Grid container spacing={2}>
                {PROCESO_STATS.map((stat, index) => (
                  <Grid item xs={4} key={index}>
                    <Box textAlign="center">
                      <Typography variant="h4" color={`${stat.color}.main`}>
                        {stat.count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Opciones del Menú */}
      <Grid container spacing={3}>
        {availableOptions.map((option) => (
          <Grid item xs={12} md={6} key={option.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: option.component ? 'pointer' : 'default',
                '&:hover': option.component ? { elevation: 4 } : {}
              }}
              onClick={() => handleOptionSelect(option)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: `${option.color}.main`,
                      width: 56,
                      height: 56
                    }}
                  >
                    {option.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {option.title}
                    </Typography>
                    <Chip
                      label={option.color === 'primary' ? 'Principal' : 
                             option.color === 'info' ? 'Operacional' :
                             option.color === 'warning' ? 'Configuración' : 'Reportes'}
                      size="small"
                      color={option.color}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {option.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary">
                  Roles permitidos: {option.requiredRoles.join(', ')}
                </Typography>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  color={option.color}
                  disabled={!option.component}
                  fullWidth
                  variant={option.component ? "contained" : "outlined"}
                >
                  {option.component ? 'Acceder' : 'Próximamente'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Información adicional */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
          <AdminIcon color="info" />
          Características del Sistema
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PolicyIcon fontSize="small" color="primary" />
              <Typography variant="body2">
                <strong>Protocolos Flexibles:</strong> Configure etapas personalizadas por gravedad
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <SecurityIcon fontSize="small" color="warning" />
              <Typography variant="body2">
                <strong>Anonimato Controlado:</strong> Protección de identidad con trazabilidad
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TimelineIcon fontSize="small" color="info" />
              <Typography variant="body2">
                <strong>Seguimiento Automático:</strong> Control de plazos y ejecución de etapas
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Este sistema cumple con los requisitos de la <strong>Ley 20.536 sobre Violencia Escolar</strong> 
            y permite adaptarse a las necesidades específicas de cada establecimiento educacional.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
}