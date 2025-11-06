import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Interfaces
interface Sostenedor {
  id: number;
  nombre: string;
  rut: string;
  tipo: 'Municipal' | 'Particular Subvencionado' | 'Particular Pagado' | 'Corporación Municipal';
  email: string;
  telefono: string;
  direccion: string;
  establecimientos: number;
  estudiantes_total: number;
  casos_abiertos: number;
  estado: 'Activo' | 'Inactivo' | 'Suspendido';
  fecha_registro: string;
  ultimo_reporte: string;
}

interface EstadisticasSostenedor {
  total_sostenedores: number;
  total_establecimientos: number;
  total_estudiantes: number;
  casos_criticos: number;
  cumplimiento_promedio: number;
}

// Datos de ejemplo (simulando API)
const sostenedoresMock: Sostenedor[] = [
  {
    id: 1,
    nombre: "Municipalidad de Santiago",
    rut: "60.910.000-1",
    tipo: "Municipal",
    email: "educacion@munistgo.cl",
    telefono: "+56 2 2927 4000",
    direccion: "Plaza de Armas 444, Santiago",
    establecimientos: 85,
    estudiantes_total: 35420,
    casos_abiertos: 12,
    estado: "Activo",
    fecha_registro: "2020-03-15",
    ultimo_reporte: "2025-11-05"
  },
  {
    id: 2,
    nombre: "Fundación Educacional Oportunidad",
    rut: "72.567.890-K",
    tipo: "Particular Subvencionado",
    email: "contacto@oportunidad.cl",
    telefono: "+56 2 2555 1234",
    direccion: "Av. Providencia 1208, Providencia",
    establecimientos: 12,
    estudiantes_total: 8950,
    casos_abiertos: 3,
    estado: "Activo",
    fecha_registro: "2019-08-20",
    ultimo_reporte: "2025-11-06"
  },
  {
    id: 3,
    nombre: "Colegio San Patricio",
    rut: "81.234.567-2",
    tipo: "Particular Pagado",
    email: "administracion@sanpatricio.cl",
    telefono: "+56 2 2777 8888",
    direccion: "Av. Las Condes 7700, Las Condes",
    establecimientos: 3,
    estudiantes_total: 2100,
    casos_abiertos: 1,
    estado: "Activo",
    fecha_registro: "2021-01-10",
    ultimo_reporte: "2025-11-04"
  }
];

const estadisticasMock: EstadisticasSostenedor = {
  total_sostenedores: 3,
  total_establecimientos: 100,
  total_estudiantes: 46470,
  casos_criticos: 16,
  cumplimiento_promedio: 94.2
};

function SostenedoresDashboardContent() {
  const { enqueueSnackbar } = useSnackbar();
  const [sostenedores, setSostenedores] = useState<Sostenedor[]>(sostenedoresMock);
  const [estadisticas, setEstadisticas] = useState<EstadisticasSostenedor>(estadisticasMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSostenedor, setEditingSostenedor] = useState<Sostenedor | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    tipo: 'Municipal' as Sostenedor['tipo'],
    email: '',
    telefono: '',
    direccion: ''
  });

  const handleOpenDialog = (sostenedor?: Sostenedor) => {
    if (sostenedor) {
      setEditingSostenedor(sostenedor);
      setFormData({
        nombre: sostenedor.nombre,
        rut: sostenedor.rut,
        tipo: sostenedor.tipo,
        email: sostenedor.email,
        telefono: sostenedor.telefono,
        direccion: sostenedor.direccion
      });
    } else {
      setEditingSostenedor(null);
      setFormData({
        nombre: '',
        rut: '',
        tipo: 'Municipal',
        email: '',
        telefono: '',
        direccion: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSostenedor(null);
  };

  const handleSave = () => {
    if (editingSostenedor) {
      // Editar sostenedor existente
      setSostenedores(sostenedores.map(s => 
        s.id === editingSostenedor.id 
          ? { ...s, ...formData }
          : s
      ));
      enqueueSnackbar('Sostenedor actualizado exitosamente', { variant: 'success' });
    } else {
      // Crear nuevo sostenedor
      const newSostenedor: Sostenedor = {
        id: Math.max(...sostenedores.map(s => s.id)) + 1,
        ...formData,
        establecimientos: 0,
        estudiantes_total: 0,
        casos_abiertos: 0,
        estado: 'Activo',
        fecha_registro: new Date().toISOString().split('T')[0],
        ultimo_reporte: '-'
      };
      setSostenedores([...sostenedores, newSostenedor]);
      enqueueSnackbar('Sostenedor creado exitosamente', { variant: 'success' });
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    setSostenedores(sostenedores.filter(s => s.id !== id));
    enqueueSnackbar('Sostenedor eliminado', { variant: 'info' });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activo':
        return 'success';
      case 'Suspendido':
        return 'error';
      case 'Inactivo':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Municipal':
        return 'primary';
      case 'Particular Subvencionado':
        return 'secondary';
      case 'Particular Pagado':
        return 'info';
      case 'Corporación Municipal':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Sostenedores
      </Typography>
      
      {/* Estadísticas Generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Sostenedores
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.total_sostenedores}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SchoolIcon color="secondary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Establecimientos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.total_establecimientos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <GroupIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Estudiantes
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.total_estudiantes.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Casos Críticos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.casos_criticos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Cumplimiento Legal
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.cumplimiento_promedio}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerta de Cumplimiento Legal */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Ley 20.536:</strong> Todos los sostenedores deben mantener protocolos de convivencia actualizados 
          y reportar incidentes críticos dentro de 24 horas según normativa MINEDUC.
        </Typography>
      </Alert>

      {/* Botón para agregar nuevo sostenedor */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Sostenedor
        </Button>
      </Box>

      {/* Tabla de Sostenedores */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sostenedor</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Establecimientos</TableCell>
              <TableCell>Estudiantes</TableCell>
              <TableCell>Casos Abiertos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Último Reporte</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sostenedores.map((sostenedor) => (
              <TableRow key={sostenedor.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {sostenedor.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {sostenedor.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{sostenedor.rut}</TableCell>
                <TableCell>
                  <Chip 
                    label={sostenedor.tipo} 
                    color={getTipoColor(sostenedor.tipo) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{sostenedor.establecimientos}</TableCell>
                <TableCell>{sostenedor.estudiantes_total.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={sostenedor.casos_abiertos}
                    color={sostenedor.casos_abiertos > 5 ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={sostenedor.estado}
                    color={getEstadoColor(sostenedor.estado) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{sostenedor.ultimo_reporte}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(sostenedor)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(sostenedor.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para agregar/editar sostenedor */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSostenedor ? 'Editar Sostenedor' : 'Agregar Nuevo Sostenedor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Sostenedor"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="RUT"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                placeholder="12.345.678-9"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Sostenedor</InputLabel>
                <Select
                  value={formData.tipo}
                  label="Tipo de Sostenedor"
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Sostenedor['tipo'] })}
                >
                  <MenuItem value="Municipal">Municipal</MenuItem>
                  <MenuItem value="Particular Subvencionado">Particular Subvencionado</MenuItem>
                  <MenuItem value="Particular Pagado">Particular Pagado</MenuItem>
                  <MenuItem value="Corporación Municipal">Corporación Municipal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+56 2 2xxx xxxx"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={!formData.nombre || !formData.rut || !formData.email}
          >
            {editingSostenedor ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function SostenedoresDashboard() {
  return (
    <SnackbarProvider maxSnack={3}>
      <SostenedoresDashboardContent />
    </SnackbarProvider>
  );
}