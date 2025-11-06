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
  Tooltip,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Report as ReportIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Interfaces para el sistema antibullying
interface Denuncia {
  id: number;
  folio: string;
  tipo_incidente: string;
  gravedad: 'Leve' | 'Grave' | 'Muy Grave' | 'Crítico';
  fecha_ocurrencia: string;
  fecha_denuncia: string;
  denunciante: {
    nombre: string;
    relacion: 'Estudiante' | 'Apoderado' | 'Docente' | 'Directivo' | 'Funcionario';
    anonimo: boolean;
  };
  involucrados: {
    agresores: string[];
    victimas: string[];
    testigos: string[];
  };
  establecimiento: string;
  descripcion: string;
  evidencias: string[];
  estado: 'Recibida' | 'En Investigación' | 'Medidas Aplicadas' | 'Cerrada' | 'Derivada a Fiscalía';
  plazo_investigacion: string;
  encargado_caso: string;
  medidas_aplicadas: string[];
  requiere_denuncia_obligatoria: boolean;
  seguimientos: Array<{
    fecha: string;
    accion: string;
    responsable: string;
    observaciones: string;
  }>;
}

interface EstadisticasAntibullying {
  total_denuncias: number;
  casos_activos: number;
  casos_criticos: number;
  denuncias_24h: number;
  cumplimiento_plazos: number;
  establecimientos_alertas: number;
}

// Datos mock para el sistema antibullying
const denunciasMock: Denuncia[] = [
  {
    id: 1,
    folio: "AB-2025-001",
    tipo_incidente: "Acoso escolar físico",
    gravedad: "Grave",
    fecha_ocurrencia: "2025-11-05",
    fecha_denuncia: "2025-11-05",
    denunciante: {
      nombre: "María González",
      relacion: "Apoderado",
      anonimo: false
    },
    involucrados: {
      agresores: ["Juan Pérez (8°A)"],
      victimas: ["Pedro Silva (8°A)"],
      testigos: ["Ana López (8°A)", "Carlos Rivera (8°A)"]
    },
    establecimiento: "Escuela Municipal Santiago Centro",
    descripcion: "Agresión física reiterada durante recreos. Estudiante presenta moretones en brazos.",
    evidencias: ["Fotografías de lesiones", "Testimonio de testigos"],
    estado: "En Investigación",
    plazo_investigacion: "2025-11-12",
    encargado_caso: "Sra. Patricia Morales (Encargada Convivencia)",
    medidas_aplicadas: ["Separación preventiva", "Citación a apoderados"],
    requiere_denuncia_obligatoria: true,
    seguimientos: [
      {
        fecha: "2025-11-05",
        accion: "Recepción de denuncia",
        responsable: "Patricia Morales",
        observaciones: "Caso requiere derivación a fiscalía por lesiones"
      },
      {
        fecha: "2025-11-06",
        accion: "Citación a involucrados",
        responsable: "Patricia Morales",
        observaciones: "Entrevistas programadas para mañana"
      }
    ]
  },
  {
    id: 2,
    folio: "AB-2025-002",
    tipo_incidente: "Ciberacoso",
    gravedad: "Muy Grave",
    fecha_ocurrencia: "2025-11-04",
    fecha_denuncia: "2025-11-04",
    denunciante: {
      nombre: "Anónimo",
      relacion: "Estudiante",
      anonimo: true
    },
    involucrados: {
      agresores: ["Usuario desconocido"],
      victimas: ["Estudiante 7°B"],
      testigos: []
    },
    establecimiento: "Liceo Técnico Las Condes",
    descripcion: "Amenazas y publicación de información personal en redes sociales",
    evidencias: ["Capturas de pantalla", "URLs de publicaciones"],
    estado: "Derivada a Fiscalía",
    plazo_investigacion: "2025-11-11",
    encargado_caso: "Sr. Roberto Campos (Encargado Convivencia)",
    medidas_aplicadas: ["Denuncia a PDI", "Apoyo psicológico a víctima"],
    requiere_denuncia_obligatoria: true,
    seguimientos: [
      {
        fecha: "2025-11-04",
        accion: "Denuncia a PDI realizada",
        responsable: "Roberto Campos",
        observaciones: "Caso N° 2025-11-0445 en PDI"
      }
    ]
  }
];

const estadisticasMock: EstadisticasAntibullying = {
  total_denuncias: 28,
  casos_activos: 12,
  casos_criticos: 3,
  denuncias_24h: 2,
  cumplimiento_plazos: 89.3,
  establecimientos_alertas: 5
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AntibullyingDashboardContent() {
  const { enqueueSnackbar } = useSnackbar();
  const [denuncias, setDenuncias] = useState<Denuncia[]>(denunciasMock);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAntibullying>(estadisticasMock);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case 'Leve':
        return 'success';
      case 'Grave':
        return 'warning';
      case 'Muy Grave':
        return 'error';
      case 'Crítico':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Recibida':
        return 'info';
      case 'En Investigación':
        return 'warning';
      case 'Medidas Aplicadas':
        return 'primary';
      case 'Cerrada':
        return 'success';
      case 'Derivada a Fiscalía':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDiasRestantes = (fecha: string) => {
    const hoy = new Date();
    const fechaPlazo = new Date(fecha);
    const diffTime = fechaPlazo.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleVerDetalle = (denuncia: Denuncia) => {
    setSelectedDenuncia(denuncia);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sistema Antibullying - Convivencia Escolar
      </Typography>
      
      {/* Alerta Legal */}
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Ley 20.536 - Art. 16C:</strong> Los directores de establecimientos educacionales deben denunciar 
          cualquier hecho constitutivo de delito que afecte a estudiantes dentro de 24 horas a Ministerio Público, 
          Carabineros o PDI.
        </Typography>
      </Alert>

      {/* Estadísticas Críticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReportIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Denuncias
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.total_denuncias}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Casos Activos
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.casos_activos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ErrorIcon color="error" sx={{ mr: 1 }} />
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
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Denuncias 24h
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.denuncias_24h}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Cumplimiento
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.cumplimiento_plazos}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FlagIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    EE en Alerta
                  </Typography>
                  <Typography variant="h4">
                    {estadisticas.establecimientos_alertas}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para diferentes vistas */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Denuncias Activas" />
          <Tab label="Casos Críticos" />
          <Tab label="Reportes Legales" />
        </Tabs>
      </Box>

      {/* Panel de Denuncias Activas */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="error"
          >
            Nueva Denuncia
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Folio</TableCell>
                <TableCell>Tipo de Incidente</TableCell>
                <TableCell>Gravedad</TableCell>
                <TableCell>Establecimiento</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Plazo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {denuncias.map((denuncia) => {
                const diasRestantes = getDiasRestantes(denuncia.plazo_investigacion);
                return (
                  <TableRow key={denuncia.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {denuncia.folio}
                      </Typography>
                      {denuncia.requiere_denuncia_obligatoria && (
                        <Chip label="24h" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{denuncia.tipo_incidente}</TableCell>
                    <TableCell>
                      <Chip 
                        label={denuncia.gravedad} 
                        color={getGravedadColor(denuncia.gravedad) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {denuncia.establecimiento}
                      </Typography>
                    </TableCell>
                    <TableCell>{denuncia.fecha_denuncia}</TableCell>
                    <TableCell>
                      <Chip 
                        label={denuncia.estado}
                        color={getEstadoColor(denuncia.estado) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography 
                          variant="body2" 
                          color={diasRestantes <= 1 ? 'error' : 'text.primary'}
                        >
                          {diasRestantes}d
                        </Typography>
                        {diasRestantes <= 1 && (
                          <WarningIcon color="error" sx={{ ml: 0.5, fontSize: 16 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver Detalle">
                        <IconButton 
                          size="small"
                          onClick={() => handleVerDetalle(denuncia)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Panel de Casos Críticos */}
      <TabPanel value={tabValue} index={1}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="bold">
            Casos que requieren denuncia obligatoria según Art. 175 Código Procesal Penal
          </Typography>
        </Alert>
        
        <Grid container spacing={3}>
          {denuncias
            .filter(d => d.requiere_denuncia_obligatoria)
            .map((denuncia) => (
              <Grid item xs={12} md={6} key={denuncia.id}>
                <Card sx={{ border: '2px solid', borderColor: 'error.main' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" color="error">
                        {denuncia.folio}
                      </Typography>
                      <Chip 
                        label={denuncia.gravedad}
                        color="error"
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body1" gutterBottom>
                      <strong>Tipo:</strong> {denuncia.tipo_incidente}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Establecimiento:</strong> {denuncia.establecimiento}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Descripción:</strong> {denuncia.descripcion}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Seguimientos:</strong>
                    </Typography>
                    <List dense>
                      {denuncia.seguimientos.map((seg, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <AssignmentIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={seg.accion}
                            secondary={`${seg.fecha} - ${seg.responsable}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box mt={2}>
                      <Button 
                        variant="contained" 
                        color="error" 
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleVerDetalle(denuncia)}
                      >
                        Ver Detalle Completo
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </TabPanel>

      {/* Panel de Reportes Legales */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Reportes Obligatorios según Ley 20.536
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reporte Mensual MINEDUC
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Próximo envío: 30 de Noviembre, 2025
                </Typography>
                <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />
                <Button variant="outlined" size="small">
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cumplimiento de Plazos
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Investigaciones en plazo: {estadisticas.cumplimiento_plazos}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={estadisticas.cumplimiento_plazos} 
                  color={estadisticas.cumplimiento_plazos > 90 ? "success" : "warning"}
                  sx={{ mb: 2 }}
                />
                <Button variant="outlined" size="small">
                  Ver Detalle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dialog de detalle de denuncia */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        {selectedDenuncia && (
          <>
            <DialogTitle>
              Detalle de Denuncia - {selectedDenuncia.folio}
              {selectedDenuncia.requiere_denuncia_obligatoria && (
                <Chip label="REQUIERE DENUNCIA 24H" color="error" sx={{ ml: 2 }} />
              )}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Información General</Typography>
                  <Typography><strong>Tipo:</strong> {selectedDenuncia.tipo_incidente}</Typography>
                  <Typography><strong>Gravedad:</strong> {selectedDenuncia.gravedad}</Typography>
                  <Typography><strong>Fecha Ocurrencia:</strong> {selectedDenuncia.fecha_ocurrencia}</Typography>
                  <Typography><strong>Establecimiento:</strong> {selectedDenuncia.establecimiento}</Typography>
                  <Typography><strong>Encargado:</strong> {selectedDenuncia.encargado_caso}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Involucrados</Typography>
                  <Typography><strong>Víctimas:</strong> {selectedDenuncia.involucrados.victimas.join(', ')}</Typography>
                  <Typography><strong>Agresores:</strong> {selectedDenuncia.involucrados.agresores.join(', ')}</Typography>
                  <Typography><strong>Testigos:</strong> {selectedDenuncia.involucrados.testigos.join(', ')}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Descripción</Typography>
                  <Typography>{selectedDenuncia.descripcion}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Seguimiento del Caso</Typography>
                  <List>
                    {selectedDenuncia.seguimientos.map((seg, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {index + 1}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={seg.accion}
                          secondary={`${seg.fecha} - ${seg.responsable}: ${seg.observaciones}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
              <Button variant="contained" color="primary">
                Agregar Seguimiento
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default function AntibullyingDashboard() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AntibullyingDashboardContent />
    </SnackbarProvider>
  );
}