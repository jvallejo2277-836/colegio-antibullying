import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { colegioService } from '../../services/colegioService';
import { Colegio } from '../../types/colegio';
import ColegioForm from './ColegioForm';

const ColegiosManager: React.FC = () => {
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para formulario de colegio
  const [openForm, setOpenForm] = useState(false);
  const [editingColegio, setEditingColegio] = useState<Colegio | null>(null);
  
  // Estados para confirmación de eliminación
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [colegioToDelete, setColegioToDelete] = useState<Colegio | null>(null);

  useEffect(() => {
    loadColegios();
  }, []);

  const loadColegios = async () => {
    try {
      setLoading(true);
      const data = await colegioService.getAll();
      console.log('Colegios cargados:', data);
      setColegios(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading colegios:', err);
      setError('Error al cargar colegios: ' + err.message);
      setColegios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingColegio(null);
    setOpenForm(true);
  };

  const handleEdit = (colegio: Colegio) => {
    setEditingColegio(colegio);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingColegio(null);
  };

  const handleFormSuccess = (message: string) => {
    setSuccess(message);
    handleFormClose();
    loadColegios();
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteClick = (colegio: Colegio) => {
    setColegioToDelete(colegio);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (colegioToDelete) {
      try {
        await colegioService.delete(colegioToDelete.id);
        setSuccess('Colegio eliminado correctamente');
        setDeleteConfirmOpen(false);
        setColegioToDelete(null);
        loadColegios();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError('Error al eliminar colegio: ' + err.message);
        setDeleteConfirmOpen(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setColegioToDelete(null);
  };

  const filteredColegios = colegios.filter(colegio =>
    colegio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegio.rbd.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colegio.director.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon color="primary" />
            <Typography variant="h5" component="h1">
              Mantenedor de Colegios
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nuevo Colegio
          </Button>
        </Box>

        {/* Mensajes */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Búsqueda */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, RBD o director..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Tabla de colegios */}
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>RBD</strong></TableCell>
                <TableCell><strong>Director</strong></TableCell>
                <TableCell><strong>Contacto</strong></TableCell>
                <TableCell><strong>Reportes</strong></TableCell>
                <TableCell><strong>Creado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Cargando...</TableCell>
                </TableRow>
              ) : filteredColegios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm ? 'No se encontraron colegios que coincidan con la búsqueda' : 'No hay colegios registrados'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredColegios.map((colegio) => (
                  <TableRow key={colegio.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {colegio.nombre}
                        </Typography>
                        {colegio.direccion && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon fontSize="inherit" />
                            {colegio.direccion}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={colegio.rbd || 'Sin RBD'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {colegio.director || 'No asignado'}
                      </Typography>
                      {colegio.encargado_convivencia && (
                        <Typography variant="caption" color="text.secondary">
                          Enc. Conv.: {colegio.encargado_convivencia}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {colegio.telefono && (
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="inherit" />
                            {colegio.telefono}
                          </Typography>
                        )}
                        {colegio.email && (
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="inherit" />
                            {colegio.email}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={colegio.reportes_count ?? 0} 
                        size="small" 
                        color={(colegio.reportes_count ?? 0) > 0 ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {formatDate(colegio.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => handleEdit(colegio)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteClick(colegio)}
                            disabled={(colegio.reportes_count ?? 0) > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Formulario de Colegio */}
      <ColegioForm
        open={openForm}
        colegio={editingColegio}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro que deseas eliminar el colegio <strong>{colegioToDelete?.nombre}</strong>?
            {colegioToDelete?.reportes_count && colegioToDelete.reportes_count > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="warning.dark">
                  <strong>Advertencia:</strong> Este colegio tiene {colegioToDelete.reportes_count} reporte(s) asociado(s). 
                  La eliminación no está permitida.
                </Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={(colegioToDelete?.reportes_count ?? 0) > 0}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ColegiosManager;