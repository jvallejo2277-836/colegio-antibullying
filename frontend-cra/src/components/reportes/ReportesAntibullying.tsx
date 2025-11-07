import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  Stack,
  Container
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
// Removed date-fns imports - using native Date methods instead

// Interfaces
interface ReporteIncidente {
  id: number;
  fecha: string;
  tipo: string;
  gravedad: 'LEVE' | 'GRAVE' | 'GRAVISIMA';
  colegio: string;
  estado: 'ABIERTO' | 'EN_INVESTIGACION' | 'CERRADO';
  requiere_denuncia_obligatoria: boolean;
  descripcion: string;
}

interface EstadisticasResumen {
  totalIncidentes: number;
  incidentesGraves: number;
  denunciasObligatorias: number;
  casosAbiertos: number;
  porcentajeCrecimiento: number;
}

const ReportesAntibullying: React.FC = () => {
  const [reportes, setReportes] = useState<ReporteIncidente[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasResumen | null>(null);
  const [tipoFiltro, setTipoFiltro] = useState<string>('TODOS');
  const [gravedadFiltro, setGravedadFiltro] = useState<string>('TODOS');
  const [loading, setLoading] = useState(false);

  // Datos mock para desarrollo
  const mockReportes: ReporteIncidente[] = [
    {
      id: 1,
      fecha: '2025-11-01',
      tipo: 'ACOSO_VERBAL',
      gravedad: 'GRAVE',
      colegio: 'Liceo Experimental Manuel de Salas',
      estado: 'EN_INVESTIGACION',
      requiere_denuncia_obligatoria: true,
      descripcion: 'Incidente de acoso verbal entre estudiantes'
    },
    {
      id: 2,
      fecha: '2025-11-02',
      tipo: 'CYBERBULLYING',
      gravedad: 'GRAVISIMA',
      colegio: 'Colegio San Patricio',
      estado: 'ABIERTO',
      requiere_denuncia_obligatoria: true,
      descripcion: 'Caso de cyberbullying en redes sociales'
    },
    {
      id: 3,
      fecha: '2025-11-03',
      tipo: 'EXCLUSION_SOCIAL',
      gravedad: 'LEVE',
      colegio: 'Instituto Nacional',
      estado: 'CERRADO',
      requiere_denuncia_obligatoria: false,
      descripcion: 'Exclusión social en actividades grupales'
    }
  ];

  const mockEstadisticas: EstadisticasResumen = {
    totalIncidentes: 45,
    incidentesGraves: 12,
    denunciasObligatorias: 8,
    casosAbiertos: 15,
    porcentajeCrecimiento: -12.5
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // TODO: Reemplazar con llamadas reales al API
      setTimeout(() => {
        setReportes(mockReportes);
        setEstadisticas(mockEstadisticas);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const reportesFiltrados = reportes.filter(reporte => {
    const coincideTipo = tipoFiltro === 'TODOS' || reporte.tipo === tipoFiltro;
    const coincideGravedad = gravedadFiltro === 'TODOS' || reporte.gravedad === gravedadFiltro;
    return coincideTipo && coincideGravedad;
  });

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case 'LEVE': return 'success';
      case 'GRAVE': return 'warning';
      case 'GRAVISIMA': return 'error';
      default: return 'default';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ABIERTO': return 'error';
      case 'EN_INVESTIGACION': return 'warning';
      case 'CERRADO': return 'success';
      default: return 'default';
    }
  };

  // Datos para gráficos
  const datosGraficoPorTipo = [
    { nombre: 'Acoso Verbal', cantidad: 15 },
    { nombre: 'Cyberbullying', cantidad: 8 },
    { nombre: 'Exclusión Social', cantidad: 12 },
    { nombre: 'Agresión Física', cantidad: 6 },
    { nombre: 'Otros', cantidad: 4 }
  ];

  const datosGraficoPorMes = [
    { mes: 'Ene', cantidad: 8 },
    { mes: 'Feb', cantidad: 12 },
    { mes: 'Mar', cantidad: 15 },
    { mes: 'Abr', cantidad: 10 },
    { mes: 'May', cantidad: 18 },
    { mes: 'Jun', cantidad: 14 }
  ];

  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Cargando reportes de antibullying...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reportes de Antibullying
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Análisis y seguimiento de incidentes de convivencia escolar
      </Typography>

      {/* Estadísticas Resumen */}
      {estadisticas && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Incidentes
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.totalIncidentes}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Incidentes Graves
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {estadisticas.incidentesGraves}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Denuncias Obligatorias
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {estadisticas.denunciasObligatorias}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Casos Abiertos
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {estadisticas.casosAbiertos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Filtros de Búsqueda" />
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Incidente</InputLabel>
              <Select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                label="Tipo de Incidente"
              >
                <MenuItem value="TODOS">Todos</MenuItem>
                <MenuItem value="ACOSO_VERBAL">Acoso Verbal</MenuItem>
                <MenuItem value="CYBERBULLYING">Cyberbullying</MenuItem>
                <MenuItem value="EXCLUSION_SOCIAL">Exclusión Social</MenuItem>
                <MenuItem value="AGRESION_FISICA">Agresión Física</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Gravedad</InputLabel>
              <Select
                value={gravedadFiltro}
                onChange={(e) => setGravedadFiltro(e.target.value)}
                label="Gravedad"
              >
                <MenuItem value="TODOS">Todas</MenuItem>
                <MenuItem value="LEVE">Leve</MenuItem>
                <MenuItem value="GRAVE">Grave</MenuItem>
                <MenuItem value="GRAVISIMA">Gravísima</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              onClick={cargarDatos}
              sx={{ minWidth: 150 }}
            >
              Actualizar Datos
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardHeader title="Tendencia Mensual" />
          <CardContent>
            <Box width="100%" height={300} display="flex" flexDirection="column" gap={2}>
              <Typography variant="body2" color="text.secondary">Gráfico de tendencia mensual</Typography>
              {datosGraficoPorMes.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" sx={{ minWidth: 80 }}>{item.mes}</Typography>
                  <Box 
                    sx={{ 
                      height: 20, 
                      backgroundColor: '#8884d8', 
                      width: `${(item.cantidad / Math.max(...datosGraficoPorMes.map(d => d.cantidad))) * 200}px`,
                      borderRadius: 1
                    }} 
                  />
                  <Typography variant="body2">{item.cantidad}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardHeader title="Distribución por Tipo" />
          <CardContent>
            <Box width="100%" height={300} display="flex" flexDirection="column" gap={2}>
              <Typography variant="body2" color="text.secondary">Distribución por tipo de incidente</Typography>
              {datosGraficoPorTipo.map((item, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2}>
                  <Box 
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      backgroundColor: colores[index % colores.length], 
                      borderRadius: '50%' 
                    }} 
                  />
                  <Typography variant="body2" sx={{ minWidth: 120 }}>{item.nombre}</Typography>
                  <Typography variant="body2" fontWeight="bold">{item.cantidad}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({((item.cantidad / datosGraficoPorTipo.reduce((sum, d) => sum + d.cantidad, 0)) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Tabla de Reportes */}
      <Card>
        <CardHeader title={`Incidentes Reportados (${reportesFiltrados.length})`} />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Gravedad</TableCell>
                  <TableCell>Colegio</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Denuncia Obligatoria</TableCell>
                  <TableCell>Descripción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportesFiltrados.map((reporte) => (
                  <TableRow key={reporte.id}>
                    <TableCell>{reporte.id}</TableCell>
                    <TableCell>
                      {new Date(reporte.fecha).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>{reporte.tipo.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={reporte.gravedad}
                        color={getGravedadColor(reporte.gravedad) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{reporte.colegio}</TableCell>
                    <TableCell>
                      <Chip 
                        label={reporte.estado.replace('_', ' ')}
                        color={getEstadoColor(reporte.estado) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {reporte.requiere_denuncia_obligatoria ? (
                        <Chip label="SÍ" color="error" size="small" />
                      ) : (
                        <Chip label="NO" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {reporte.descripcion}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {reportesFiltrados.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No se encontraron incidentes que coincidan con los filtros seleccionados.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportesAntibullying;