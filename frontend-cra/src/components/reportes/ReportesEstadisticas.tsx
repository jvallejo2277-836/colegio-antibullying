import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Container,
  TextField,
  Alert
} from '@mui/material';
// Recharts temporalmente removido para evitar errores de contexto
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Cell
// } from 'recharts';

// Interfaces
interface TipoIncidenteEstadistica {
  nombre: string;
  cantidad: number;
  color: string;
}

interface TendenciaEstadistica {
  periodo: string;
  incidentes: number;
  graves: number;
  leves: number;
}

interface EstadisticasGenerales {
  totalIncidentes: number;
  incidentesEsteMes: number;
  porcentajeCambio: number;
  promedioMensual: number;
  colegiosAfectados: number;
}

const ReportesEstadisticas: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>('2025-01-01');
  const [fechaFin, setFechaFin] = useState<string>('2025-11-06');
  const [tipoReporte, setTipoReporte] = useState<string>('TODOS');
  const [loading, setLoading] = useState(false);

  // Datos mock
  const estadisticasGenerales: EstadisticasGenerales = {
    totalIncidentes: 156,
    incidentesEsteMes: 23,
    porcentajeCambio: -8.2,
    promedioMensual: 26,
    colegiosAfectados: 12
  };

  const tiposIncidente: TipoIncidenteEstadistica[] = [
    { nombre: 'Acoso Verbal', cantidad: 45, color: '#8884d8' },
    { nombre: 'Cyberbullying', cantidad: 32, color: '#82ca9d' },
    { nombre: 'Exclusión Social', cantidad: 28, color: '#ffc658' },
    { nombre: 'Agresión Física', cantidad: 18, color: '#ff7300' },
    { nombre: 'Otros', cantidad: 33, color: '#8dd1e1' }
  ];

  const tendenciaMensual: TendenciaEstadistica[] = [
    { periodo: 'Ene', incidentes: 28, graves: 8, leves: 20 },
    { periodo: 'Feb', incidentes: 32, graves: 12, leves: 20 },
    { periodo: 'Mar', incidentes: 25, graves: 7, leves: 18 },
    { periodo: 'Abr', incidentes: 30, graves: 10, leves: 20 },
    { periodo: 'May', incidentes: 18, graves: 5, leves: 13 },
    { periodo: 'Jun', incidentes: 23, graves: 6, leves: 17 }
  ];

  const generarReporte = () => {
    setLoading(true);
    console.log('Generando reporte...', { fechaInicio, fechaFin, tipoReporte });
    setTimeout(() => {
      setLoading(false);
      alert('Reporte generado exitosamente');
    }, 2000);
  };

  const exportarExcel = () => {
    console.log('Exportando a Excel...');
    alert('Funcionalidad de exportación en desarrollo');
  };

  const exportarPDF = () => {
    console.log('Exportando a PDF...');
    alert('Funcionalidad de exportación en desarrollo');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reportes Estadísticos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Análisis estadístico detallado de incidentes de convivencia escolar
        </Typography>

        {/* Filtros */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <TextField
                label="Fecha Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                label="Fecha Fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Tipo de Reporte</InputLabel>
                <Select
                  value={tipoReporte}
                  onChange={(e) => setTipoReporte(e.target.value)}
                  label="Tipo de Reporte"
                >
                  <MenuItem value="TODOS">Todos los Incidentes</MenuItem>
                  <MenuItem value="GRAVES">Solo Graves</MenuItem>
                  <MenuItem value="DENUNCIAS">Denuncias Obligatorias</MenuItem>
                  <MenuItem value="POR_COLEGIO">Por Colegio</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={generarReporte}
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? 'Generando...' : 'Generar Reporte'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Estadísticas Generales */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Total Incidentes
                  </Typography>
                  <Typography variant="h4">
                    {estadisticasGenerales.totalIncidentes}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Este Mes
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {estadisticasGenerales.incidentesEsteMes}
                  </Typography>
                  <Typography variant="body2" color={estadisticasGenerales.porcentajeCambio >= 0 ? 'error' : 'success'}>
                    {estadisticasGenerales.porcentajeCambio >= 0 ? '+' : ''}{estadisticasGenerales.porcentajeCambio}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Promedio Mensual
                  </Typography>
                  <Typography variant="h4">
                    {estadisticasGenerales.promedioMensual}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Box sx={{ flex: 1 }}>
                  <Typography color="textSecondary" gutterBottom>
                    Colegios Afectados
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {estadisticasGenerales.colegiosAfectados}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Gráficos */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 4 }}>
          {/* Tendencia de Incidentes */}
          <Card sx={{ flex: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencia Mensual de Incidentes
              </Typography>
              <Box width="100%" height={300} display="flex" flexDirection="column" gap={2}>
                <Typography variant="body2" color="text.secondary">Tendencia mensual por tipo</Typography>
                {tendenciaMensual.map((item, index) => (
                  <Box key={index}>
                    <Typography variant="body2" fontWeight="bold">{item.periodo}</Typography>
                    <Box display="flex" gap={2} alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#8884d8', borderRadius: 1 }} />
                        <Typography variant="caption">Total: {item.incidentes}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#ff7300', borderRadius: 1 }} />
                        <Typography variant="caption">Graves: {item.graves}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, backgroundColor: '#82ca9d', borderRadius: 1 }} />
                        <Typography variant="caption">Leves: {item.leves}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Distribución por Tipo */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución por Tipo
              </Typography>
              <Box width="100%" height={300} display="flex" flexDirection="column" gap={2}>
                <Typography variant="body2" color="text.secondary">Distribución por tipo de incidente</Typography>
                {tiposIncidente.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={2}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        backgroundColor: item.color, 
                        borderRadius: '50%' 
                      }} 
                    />
                    <Typography variant="body2" sx={{ minWidth: 140 }}>{item.nombre}</Typography>
                    <Typography variant="body2" fontWeight="bold">{item.cantidad}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({((item.cantidad / tiposIncidente.reduce((sum, d) => sum + d.cantidad, 0)) * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Stack>

        {/* Tabla de Resumen */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumen por Tipo de Incidente
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo de Incidente</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Porcentaje</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tiposIncidente.map((tipo) => {
                    const porcentaje = (tipo.cantidad / estadisticasGenerales.totalIncidentes * 100).toFixed(1);
                    return (
                      <TableRow key={tipo.nombre}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box 
                              sx={{ 
                                width: 12, 
                                height: 12, 
                                backgroundColor: tipo.color, 
                                borderRadius: 1, 
                                mr: 1 
                              }} 
                            />
                            {tipo.nombre}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{tipo.cantidad}</TableCell>
                        <TableCell align="right">{porcentaje}%</TableCell>
                        <TableCell>
                          <Chip 
                            label={tipo.cantidad > 30 ? 'Alto' : tipo.cantidad > 15 ? 'Medio' : 'Bajo'}
                            color={tipo.cantidad > 30 ? 'error' : tipo.cantidad > 15 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Acciones de Exportación */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Exportar Reportes
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="outlined" 
                onClick={exportarExcel}
                sx={{ minWidth: 150 }}
              >
                Exportar a Excel
              </Button>
              <Button 
                variant="outlined" 
                onClick={exportarPDF}
                sx={{ minWidth: 150 }}
              >
                Exportar a PDF
              </Button>
            </Stack>
            <Alert severity="info" sx={{ mt: 2 }}>
              Los reportes incluyen análisis detallado de tendencias, distribución por colegios y seguimiento de casos críticos.
            </Alert>
          </CardContent>
        </Card>
      </Container>
  );
};

export default ReportesEstadisticas;