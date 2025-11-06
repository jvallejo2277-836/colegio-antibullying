import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assignment,
  CheckCircle
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Casos Activos',
      value: '12',
      icon: <Assignment color="primary" />,
      color: 'primary.main'
    },
    {
      title: 'Casos Resueltos',
      value: '45',
      icon: <CheckCircle color="success" />,
      color: 'success.main'
    },
    {
      title: 'Estudiantes',
      value: '850',
      icon: <People color="info" />,
      color: 'info.main'
    },
    {
      title: 'Protocolos Activos',
      value: '8',
      icon: <TrendingUp color="warning" />,
      color: 'warning.main'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Principal
      </Typography>
      
      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        {stats.map((stat, index) => (
          <Card key={index} elevation={2} sx={{ minWidth: 200, flexGrow: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">
                    {stat.value}
                  </Typography>
                </Box>
                <Box>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box mt={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bienvenido al Sistema de Convivencia Escolar
          </Typography>
          <Typography variant="body1" paragraph>
            Este sistema implementa un enfoque integral para la gestión de la convivencia escolar, 
            incluyendo protocolos flexibles, seguimiento en tiempo real y control granular de anonimato.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Navega por el menú lateral para explorar las diferentes funcionalidades del sistema.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;