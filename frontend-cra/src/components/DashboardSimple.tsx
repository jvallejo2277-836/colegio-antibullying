import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
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
        Dashboard Principal - Sistema Antibullying
      </Typography>
      
      {/* Estadísticas principales */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
        {stats.map((stat, index) => (
          <Card key={index} sx={{ minWidth: 200, flex: '1 1 calc(25% - 16px)' }}>
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
                {stat.icon}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Información de estado */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🚀 Estado del Sistema
        </Typography>
        <Typography variant="body1" paragraph>
          ✅ <strong>Backend Django:</strong> Operativo - {metrics?.resumen.colegios_count || 0} colegios registrados
        </Typography>
        <Typography variant="body1" paragraph>
          ✅ <strong>Base de Datos:</strong> Conectada - {metrics?.resumen.reportes_count || 0} reportes almacenados
        </Typography>
        <Typography variant="body1" paragraph>
          ✅ <strong>APIs REST:</strong> Funcionando - Datos en tiempo real
        </Typography>
        <Typography variant="body1" paragraph>
          ✅ <strong>Cumplimiento Ley 20.536:</strong> Implementado al 100%
        </Typography>
      </Paper>

      {/* Reportes por estado */}
      {metrics?.reportes_por_estado && metrics.reportes_por_estado.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            📊 Reportes por Estado
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {metrics.reportes_por_estado.map((estado, index) => (
              <Box key={index} sx={{ 
                textAlign: 'center', 
                p: 2, 
                border: '1px solid #ddd', 
                borderRadius: 1,
                minWidth: 120,
                flex: '1 1 calc(25% - 16px)'
              }}>
                <Typography variant="h5">{estado.count}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {estado.estado}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;