import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

// Interfaces para reportes
interface ReporteEstadistica {
  periodo: string;
  total_incidentes: number;
  incidentes_graves: number;
  casos_resueltos: number;
  tiempo_promedio_resolucion: number;
  cumplimiento_legal: number;
}

interface EstablecimientoReporte {
  id: number;
  nombre: string;
  total_incidentes: number;
  casos_criticos: number;
  cumplimiento: number;
  ultimo_reporte: string;
  estado_alerta: 'Normal' | 'Alerta' | 'Crítico';
}

interface TipoIncidenteEstadistica {
  tipo: string;
  cantidad: number;
  porcentaje: number;
  tendencia: 'up' | 'down' | 'stable';
}

// Datos mock para reportes
const estadisticasTiempoMock: ReporteEstadistica[] = [
  { periodo: 'Enero', total_incidentes: 45, incidentes_graves: 12, casos_resueltos: 42, tiempo_promedio_resolucion: 5.2, cumplimiento_legal: 95.5 },
  { periodo: 'Febrero', total_incidentes: 38, incidentes_graves: 9, casos_resueltos: 35, tiempo_promedio_resolucion: 4.8, cumplimiento_legal: 97.2 },
  { periodo: 'Marzo', total_incidentes: 52, incidentes_graves: 15, casos_resueltos: 48, tiempo_promedio_resolucion: 6.1, cumplimiento_legal: 92.3 },
  { periodo: 'Abril', total_incidentes: 41, incidentes_graves: 8, casos_resueltos: 39, tiempo_promedio_resolucion: 4.5, cumplimiento_legal: 98.0 },
  { periodo: 'Mayo', total_incidentes: 47, incidentes_graves: 11, casos_resueltos: 44, tiempo_promedio_resolucion: 5.0, cumplimiento_legal: 96.8 },
  { periodo: 'Junio', total_incidentes: 35, incidentes_graves: 7, casos_resueltos: 33, tiempo_promedio_resolucion: 4.2, cumplimiento_legal: 98.5 }
];

const establecimientosMock: EstablecimientoReporte[] = [
  { id: 1, nombre: 'Escuela República de Chile', total_incidentes: 12, casos_criticos: 2, cumplimiento: 95.5, ultimo_reporte: '2025-11-05', estado_alerta: 'Normal' },
  { id: 2, nombre: 'Liceo Técnico Industrial', total_incidentes: 18, casos_criticos: 5, cumplimiento: 87.2, ultimo_reporte: '2025-11-04', estado_alerta: 'Alerta' },
  { id: 3, nombre: 'Colegio Santa María', total_incidentes: 8, casos_criticos: 1, cumplimiento: 98.1, ultimo_reporte: '2025-11-06', estado_alerta: 'Normal' },
  { id: 4, nombre: 'Instituto Nacional', total_incidentes: 25, casos_criticos: 8, cumplimiento: 78.5, ultimo_reporte: '2025-11-03', estado_alerta: 'Crítico' }
];

const tiposIncidenteMock: TipoIncidenteEstadistica[] = [
  { tipo: 'Acoso escolar físico', cantidad: 45, porcentaje: 32.1, tendencia: 'down' },
  { tipo: 'Acoso verbal/psicológico', cantidad: 38, porcentaje: 27.1, tendencia: 'up' },
  { tipo: 'Ciberacoso', cantidad: 28, porcentaje: 20.0, tendencia: 'up' },
  { tipo: 'Discriminación', cantidad: 15, porcentaje: 10.7, tendencia: 'stable' },
  { tipo: 'Violencia sexual', cantidad: 8, porcentaje: 5.7, tendencia: 'down' },
  { tipo: 'Otros', cantidad: 6, porcentaje: 4.3, tendencia: 'stable' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ReportesEstadisticas() {
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(dayjs().subtract(6, 'month'));
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(dayjs());
  const [tipoReporte, setTipoReporte] = useState('general');
  const [establecimientos, setEstablecimientos] = useState<EstablecimientoReporte[]>(establecimientosMock);
  const [estadisticasTiempo, setEstadisticasTiempo] = useState<ReporteEstadistica[]>(estadisticasTiempoMock);
  const [tiposIncidente, setTiposIncidente] = useState<TipoIncidenteEstadistica[]>(tiposIncidenteMock);
  const [loading, setLoading] = useState(false);
  const [dialogReporte, setDialogReporte] = useState(false);

  const handleGenerarReporte = async () => {
    setLoading(true);
    try {
      // Aquí se haría la llamada real al backend Django
      // const response = await axios.post('http://localhost:8000/api/reportes/generar/', {
      //   fecha_inicio: fechaInicio?.format('YYYY-MM-DD'),
      //   fecha_fin: fechaFin?.format('YYYY-MM-DD'),
      //   tipo: tipoReporte
      // });
      
      // Simulamos una llamada API
      setTimeout(() => {
        setLoading(false);
        setDialogReporte(true);
      }, 2000);
    } catch (error) {
      console.error('Error generando reporte:', error);
      setLoading(false);
    }
  };

  const handleDescargarReporte = () => {
    // Implementar descarga de reporte en PDF o Excel
    const data = {
      fecha_generacion: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      periodo: `${fechaInicio?.format('DD/MM/YYYY')} - ${fechaFin?.format('DD/MM/YYYY')}`,
      estadisticas: estadisticasTiempo,
      establecimientos: establecimientos,
      tipos_incidente: tiposIncidente
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_convivencia_${dayjs().format('YYYYMMDD')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getEstadoAlertaColor = (estado: string) => {
    switch (estado) {
      case 'Normal':
        return 'success';
      case 'Alerta':
        return 'warning';
      case 'Crítico':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Reportes y Estadísticas de Convivencia Escolar
        </Typography>

        {/* Alerta Legal */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Reporte Mensual Obligatorio:</strong> Según Ley 20.536, todos los establecimientos deben 
            reportar mensualmente al MINEDUC las estadísticas de convivencia escolar y medidas implementadas.
          </Typography>
        </Alert>

        {/* Controles de Filtros */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generar Reporte Personalizado
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <MUIDatePicker
                label="Fecha Inicio"
                value={fechaInicio}
                onChange={setFechaInicio}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <MUIDatePicker
                label="Fecha Fin"
                value={fechaFin}
                onChange={setFechaFin}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Reporte</InputLabel>
                <Select
                  value={tipoReporte}
                  label="Tipo de Reporte"
                  onChange={(e) => setTipoReporte(e.target.value)}
                >
                  <MenuItem value="general">Reporte General</MenuItem>
                  <MenuItem value="legal">Cumplimiento Legal</MenuItem>
                  <MenuItem value="tendencias">Análisis de Tendencias</MenuItem>
                  <MenuItem value="establecimientos">Por Establecimiento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
                onClick={handleGenerarReporte}
                disabled={loading}
              >
                {loading ? 'Generando...' : 'Generar Reporte'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Estadísticas Generales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Incidentes (6 meses)
                    </Typography>
                    <Typography variant="h4">
                      {estadisticasTiempo.reduce((sum, item) => sum + item.total_incidentes, 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Casos Graves
                    </Typography>
                    <Typography variant="h4">
                      {estadisticasTiempo.reduce((sum, item) => sum + item.incidentes_graves, 0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Tasa de Resolución
                    </Typography>
                    <Typography variant="h4">
                      {Math.round((estadisticasTiempo.reduce((sum, item) => sum + item.casos_resueltos, 0) / 
                        estadisticasTiempo.reduce((sum, item) => sum + item.total_incidentes, 0)) * 100)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Cumplimiento Legal Promedio
                    </Typography>
                    <Typography variant="h4">
                      {Math.round(estadisticasTiempo.reduce((sum, item) => sum + item.cumplimiento_legal, 0) / 
                        estadisticasTiempo.length)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Tendencia de Incidentes */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tendencia de Incidentes por Mes
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={estadisticasTiempo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total_incidentes" stroke="#8884d8" name="Total Incidentes" />
                    <Line type="monotone" dataKey="incidentes_graves" stroke="#82ca9d" name="Casos Graves" />
                    <Line type="monotone" dataKey="casos_resueltos" stroke="#ffc658" name="Casos Resueltos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Distribución por Tipo */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribución por Tipo de Incidente
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tiposIncidente}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                      nameKey="tipo"
                    >
                      {tiposIncidente.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de Establecimientos */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estado por Establecimiento
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Establecimiento</TableCell>
                    <TableCell>Total Incidentes</TableCell>
                    <TableCell>Casos Críticos</TableCell>
                    <TableCell>Cumplimiento Legal</TableCell>
                    <TableCell>Último Reporte</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {establecimientos.map((establecimiento) => (
                    <TableRow key={establecimiento.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          {establecimiento.nombre}
                        </Box>
                      </TableCell>
                      <TableCell>{establecimiento.total_incidentes}</TableCell>
                      <TableCell>
                        <Chip 
                          label={establecimiento.casos_criticos}
                          color={establecimiento.casos_criticos > 3 ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{establecimiento.cumplimiento}%</TableCell>
                      <TableCell>{establecimiento.ultimo_reporte}</TableCell>
                      <TableCell>
                        <Chip 
                          label={establecimiento.estado_alerta}
                          color={getEstadoAlertaColor(establecimiento.estado_alerta) as any}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Tabla de Tipos de Incidente */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Análisis por Tipo de Incidente
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo de Incidente</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Porcentaje</TableCell>
                    <TableCell>Tendencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tiposIncidente.map((tipo, index) => (
                    <TableRow key={index}>
                      <TableCell>{tipo.tipo}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box 
                            sx={{ 
                              width: '20px', 
                              height: '20px', 
                              backgroundColor: COLORS[index % COLORS.length],
                              borderRadius: '50%',
                              mr: 1
                            }} 
                          />
                          {tipo.cantidad}
                        </Box>
                      </TableCell>
                      <TableCell>{tipo.porcentaje}%</TableCell>
                      <TableCell>
                        <Typography component="span">
                          {getTendenciaIcon(tipo.tendencia)} {tipo.tendencia}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog de Reporte Generado */}
        <Dialog open={dialogReporte} onClose={() => setDialogReporte(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Reporte Generado Exitosamente</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Su reporte de convivencia escolar ha sido generado correctamente para el período seleccionado.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Período: {fechaInicio?.format('DD/MM/YYYY')} - {fechaFin?.format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tipo: {tipoReporte}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogReporte(false)}>
              Cerrar
            </Button>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              onClick={handleDescargarReporte}
            >
              Descargar Reporte
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}