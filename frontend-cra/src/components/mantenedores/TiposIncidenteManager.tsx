import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Alert,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Lock as LockIcon,
  Edit as EditableIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { tipoIncidenteService } from '../../services/tipoIncidenteService';
import { TipoIncidente } from '../../types/tipoIncidente';
import { useColegio } from '../../context/ColegioContext';
import TipoIncidenteForm from './TipoIncidenteForm';

const TiposIncidenteManager: React.FC = () => {
  const { colegioActivo } = useColegio();
  const [tipos, setTipos] = useState<TipoIncidente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSoloPersonalizados, setMostrarSoloPersonalizados] = useState(false);
  
  // Estados para el diálogo
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<TipoIncidente | null>(null);
  const [modoCreacion, setModoCreacion] = useState(false);
  
  // Estados para confirmación de eliminación
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [tipoAEliminar, setTipoAEliminar] = useState<TipoIncidente | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // Estado para mostrar/ocultar detalles de categorías legales
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<number, boolean>>({});

  // Cargar tipos de incidente
  const cargarTipos = useCallback(async () => {
    if (!colegioActivo) return;

    setLoading(true);
    setError(null);

    try {
      const datos = await tipoIncidenteService.obtenerPorColegio(colegioActivo.id);
      setTipos(datos);
    } catch (error) {
      console.error('Error al cargar tipos de incidente:', error);
      setError('Error al cargar los tipos de incidente');
    } finally {
      setLoading(false);
    }
  }, [colegioActivo]);

  useEffect(() => {
    cargarTipos();
  }, [cargarTipos]);

  // Filtrar tipos según búsqueda y filtros
  const tiposFiltrados = tipos.filter(tipo => {
    const coincideBusqueda = !busqueda || 
      tipo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      tipo.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      tipo.categoria_display.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFiltro = !mostrarSoloPersonalizados || !tipo.es_categoria_legal;

    return coincideBusqueda && coincideFiltro;
  });

  // Manejar creación
  const handleCrear = () => {
    setModoCreacion(true);
    setTipoEditando(null);
    setDialogoAbierto(true);
  };

  // Manejar edición
  const handleEditar = (tipo: TipoIncidente) => {
    setModoCreacion(false);
    setTipoEditando(tipo);
    setDialogoAbierto(true);
  };

  // Manejar eliminación
  const handleEliminar = (tipo: TipoIncidente) => {
    setTipoAEliminar(tipo);
    setDialogoEliminar(true);
  };

  const confirmarEliminacion = async () => {
    if (!tipoAEliminar) return;

    setEliminando(true);
    try {
      await tipoIncidenteService.eliminar(tipoAEliminar.id!);
      await cargarTipos(); // Recargar lista
      setDialogoEliminar(false);
      setTipoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setError('Error al eliminar el tipo de incidente');
    } finally {
      setEliminando(false);
    }
  };

  // Manejar guardado exitoso
  const handleGuardadoExitoso = () => {
    setDialogoAbierto(false);
    setTipoEditando(null);
    cargarTipos(); // Recargar lista
  };

  // Toggle expansión de categoría legal
  const toggleExpansion = (tipoId: number) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [tipoId]: !prev[tipoId]
    }));
  };

  const getChipColorGravedad = (gravedad: string) => {
    switch (gravedad) {
      case 'muy_grave': return 'error';
      case 'grave': return 'warning';
      case 'leve': return 'success';
      default: return 'default';
    }
  };

  if (!colegioActivo) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="warning" icon={<WarningIcon />}>
          Debe seleccionar un colegio activo para gestionar los tipos de incidente.
        </Alert>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 Tipos de Incidente
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCrear}
            sx={{ borderRadius: 2 }}
          >
            Crear Tipo
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Colegio:</strong> {colegioActivo.nombre} • 
          Gestiona tipos de incidentes: categorías legales (🔒) y personalizados (✏️)
        </Typography>

        {/* Filtros y búsqueda */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Buscar tipos de incidente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={mostrarSoloPersonalizados}
                onChange={(e) => setMostrarSoloPersonalizados(e.target.checked)}
                size="small"
              />
            }
            label="Solo personalizados"
          />
        </Box>
      </Paper>

      {/* Contenido principal */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabla de tipos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Gravedad</TableCell>
              <TableCell>Denuncia</TableCell>
              <TableCell>Plazo</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : tiposFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron tipos de incidente
                </TableCell>
              </TableRow>
            ) : (
              tiposFiltrados.map((tipo) => (
                <React.Fragment key={tipo.id}>
                  <TableRow hover>
                    <TableCell>
                      <Tooltip title={tipo.es_categoria_legal ? "Categoría legal (no editable)" : "Tipo personalizable"}>
                        <Chip
                          icon={tipo.es_categoria_legal ? <LockIcon /> : <EditableIcon />}
                          label={tipo.es_categoria_legal ? "Legal" : "Personalizado"}
                          size="small"
                          color={tipo.es_categoria_legal ? "default" : "primary"}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {tipo.nombre}
                        </Typography>
                        {tipo.colegio_nombre && (
                          <Typography variant="caption" color="text.secondary">
                            {tipo.colegio_nombre}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{tipo.categoria_display}</TableCell>
                    <TableCell>
                      <Chip 
                        label={tipo.gravedad_display} 
                        size="small"
                        color={getChipColorGravedad(tipo.gravedad) as any}
                      />
                    </TableCell>
                    <TableCell>
                      {tipo.requiere_denuncia ? "Sí" : "No"}
                    </TableCell>
                    <TableCell>
                      {tipo.plazo_investigacion_dias} días
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {tipo.es_categoria_legal && (
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => toggleExpansion(tipo.id!)}
                            >
                              {categoriasExpandidas[tipo.id!] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        <Tooltip title={tipo.es_categoria_legal ? "Editar protocolo" : "Editar tipo"}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditar(tipo)}
                          >
                            {tipo.es_categoria_legal ? <ViewIcon /> : <EditIcon />}
                          </IconButton>
                        </Tooltip>

                        {tipo.puede_eliminar && (
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleEliminar(tipo)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Fila expandible para categorías legales */}
                  {tipo.es_categoria_legal && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ p: 0 }}>
                        <Collapse in={categoriasExpandidas[tipo.id!]}>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              📝 Descripción Legal:
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {tipo.descripcion}
                            </Typography>
                            
                            {tipo.protocolo_especifico && (
                              <>
                                <Typography variant="subtitle2" gutterBottom>
                                  📋 Protocolo Específico:
                                </Typography>
                                <Typography variant="body2">
                                  {tipo.protocolo_especifico}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de formulario */}
      <Dialog 
        open={dialogoAbierto} 
        onClose={() => setDialogoAbierto(false)}
        maxWidth="md"
        fullWidth
      >
        <TipoIncidenteForm
          tipo={tipoEditando}
          modoCreacion={modoCreacion}
          onGuardar={handleGuardadoExitoso}
          onCancelar={() => setDialogoAbierto(false)}
          colegioId={colegioActivo.id}
        />
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={dialogoEliminar} onClose={() => !eliminando && setDialogoEliminar(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar el tipo de incidente "{tipoAEliminar?.nombre}"?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoEliminar(false)} disabled={eliminando}>
            Cancelar
          </Button>
          <LoadingButton
            onClick={confirmarEliminacion}
            loading={eliminando}
            color="error"
            variant="contained"
          >
            Eliminar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TiposIncidenteManager;