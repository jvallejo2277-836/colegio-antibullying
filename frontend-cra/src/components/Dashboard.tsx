import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assignment,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { apiService, DashboardMetrics } from '../services/api';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar métricas del dashboard');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const stats = [
    {
      title: 'Colegios',
      value: metrics?.resumen.colegios_count.toString() || '0',
      icon: <People color="primary" />,
      color: 'primary.main'
    },
    {
      title: 'Reportes Totales',
      value: metrics?.resumen.reportes_count.toString() || '0',
      icon: <Assignment color="info" />,
      color: 'info.main'
    },
    {
      title: 'Reportes Críticos',
      value: metrics?.resumen.reportes_criticos.toString() || '0',
      icon: <Warning color="error" />,
      color: 'error.main'
    },
    {
      title: 'Evidencias',
      value: metrics?.resumen.evidencias_count.toString() || '0',
      icon: <CheckCircle color="success" />,
      color: 'success.main'
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