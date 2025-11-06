import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Report as ReportIcon,
  Attachment as AttachmentIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiService from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGraphs();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  const { resumen, reportes_por_estado, reportes_por_tipo, reportes_por_gravedad } = dashboardData;

  // Preparar datos para gráficos
  const estadoData = reportes_por_estado?.map(item => ({
    name: item.estado,
    value: item.count,
  })) || [];

  const gravedadData = reportes_por_gravedad?.map(item => ({
    name: item.tipo_incidente__gravedad || 'Sin clasificar',
    value: item.count,
  })) || [];

  const tipoData = reportes_por_tipo?.slice(0, 8).map(item => ({
    name: item.tipo_incidente__nombre?.substring(0, 20) || 'Sin tipo',
    value: item.count,
    categoria: item.tipo_incidente__categoria,
  })) || [];

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid`, borderColor: `${color}.main` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value || 0}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: `${color}.main`, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard - Sistema de Convivencia Escolar
      </Typography>
      
      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Colegios Registrados"
            value={resumen?.colegios_count}
            icon={<SchoolIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reportes Totales"
            value={resumen?.reportes_count}
            icon={<ReportIcon sx={{ fontSize: 40 }} />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Evidencias"
            value={resumen?.evidencias_count}
            icon={<AttachmentIcon sx={{ fontSize: 40 }} />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Casos Críticos"
            value={resumen?.reportes_criticos}
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            color="error"
            subtitle={resumen?.reportes_criticos > 0 ? "Requieren atención inmediata" : "Todo bajo control"}
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de Estados */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ mr: 1 }} />
              Reportes por Estado
            </Typography>
            {estadoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={estadoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {estadoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                <Typography color="textSecondary">No hay datos disponibles</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Gráfico de Gravedad */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              Reportes por Gravedad
            </Typography>
            {gravedadData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gravedadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                <Typography color="textSecondary">No hay datos disponibles</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Tipos de Incidente más comunes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ReportIcon sx={{ mr: 1 }} />
              Tipos de Incidentes más Reportados
            </Typography>
            {tipoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tipoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      value, 
                      'Cantidad',
                      `Categoría: ${props.payload.categoria}`
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                <Typography color="textSecondary">No hay datos disponibles</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Alertas y notificaciones */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estado del Sistema
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Chip 
                label={`${resumen?.colegios_count || 0} Colegios Activos`}
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`${resumen?.reportes_count || 0} Reportes Registrados`}
                color="info" 
                variant="outlined" 
              />
              {resumen?.reportes_criticos > 0 && (
                <Chip 
                  label={`${resumen.reportes_criticos} Casos Críticos`}
                  color="error" 
                  icon={<WarningIcon />}
                />
              )}
              {resumen?.reportes_criticos === 0 && (
                <Chip 
                  label="Sin casos críticos pendientes"
                  color="success" 
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;