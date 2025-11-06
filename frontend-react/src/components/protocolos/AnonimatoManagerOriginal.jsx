import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '../../contexts/AuthContext';
import { reglasAnonimatoAPI, accesoIdentidadAPI } from '../../services/api';

const NIVELES_ANONIMATO = [
  {
    value: 'publico',
    label: 'Público',
    description: 'Identidad visible para todos los involucrados',
    icon: <VisibilityIcon />,
    color: 'success'
  },
  {
    value: 'restringido',
    label: 'Restringido',
    description: 'Identidad visible solo para personal autorizado',
    icon: <LockIcon />,
    color: 'warning'
  },
  {
    value: 'anonimo_total',
    label: 'Anónimo Total',
    description: 'Identidad protegida completamente',
    icon: <VisibilityOffIcon />,
    color: 'error'
  }
];

const ROLES_ACCESO = [
  { value: 'director', label: 'Director', icon: <AdminIcon /> },
  { value: 'subdirector', label: 'Subdirector', icon: <AdminIcon /> },
  { value: 'encargado_convivencia', label: 'Encargado de Convivencia', icon: <SecurityIcon /> },
  { value: 'orientador', label: 'Orientador', icon: <PersonIcon /> },
  { value: 'psicologo', label: 'Psicólogo', icon: <PersonIcon /> },
  { value: 'trabajador_social', label: 'Trabajador Social', icon: <PersonIcon /> }
];

export default function AnonimatoManager() {
  const [reglas, setReglas] = useState([]);
  const [accesos, setAccesos] = useState([]);
  const [openReglasDialog, setOpenReglasDialog] = useState(false);
  const [openAccesosDialog, setOpenAccesosDialog] = useState(false);
  const [selectedRegla, setSelectedRegla] = useState(null);
  const [formDataReglas, setFormDataReglas] = useState({
    nivel_anonimato: '',
    descripcion: '',
    requiere_justificacion: false,
    permite_revelacion: false,
    tiempo_proteccion_dias: '',
    roles_acceso_permitido: []
  });

  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadReglas();
    loadAccesos();
  }, []);

  const loadReglas = async () => {
    try {
      const response = await reglasAnonimatoAPI.getReglas({
        colegio: user.perfil?.colegio?.id
      });
      setReglas(response.data.results || response.data);
    } catch (error) {
      enqueueSnackbar('Error al cargar reglas de anonimato', { variant: 'error' });
    }
  };

  const loadAccesos = async () => {
    try {
      const response = await accesoIdentidadAPI.getAccesos({
        activo: true
      });
      setAccesos(response.data.results || response.data);
    } catch (error) {
      enqueueSnackbar('Error al cargar accesos', { variant: 'error' });
    }
  };

  const handleOpenReglasDialog = (regla = null) => {
    if (regla) {
      setFormDataReglas({
        nivel_anonimato: regla.nivel_anonimato,
        descripcion: regla.descripcion,
        requiere_justificacion: regla.requiere_justificacion,
        permite_revelacion: regla.permite_revelacion,
        tiempo_proteccion_dias: regla.tiempo_proteccion_dias,
        roles_acceso_permitido: regla.roles_acceso_permitido || []
      });
      setSelectedRegla(regla);
    } else {
      setFormDataReglas({
        nivel_anonimato: '',
        descripcion: '',
        requiere_justificacion: false,
        permite_revelacion: false,
        tiempo_proteccion_dias: '',
        roles_acceso_permitido: []
      });
      setSelectedRegla(null);
    }
    setOpenReglasDialog(true);
  };

  const handleCloseReglasDialog = () => {
    setOpenReglasDialog(false);
    setSelectedRegla(null);
  };

  const handleSubmitReglas = async () => {
    try {
      const dataToSubmit = {
        ...formDataReglas,
        colegio: user.perfil?.colegio?.id,
        tiempo_proteccion_dias: parseInt(formDataReglas.tiempo_proteccion_dias) || null
      };

      if (selectedRegla) {
        await reglasAnonimatoAPI.updateRegla(selectedRegla.id, dataToSubmit);
        enqueueSnackbar('Regla actualizada correctamente', { variant: 'success' });
      } else {
        await reglasAnonimatoAPI.createRegla(dataToSubmit);
        enqueueSnackbar('Regla creada correctamente', { variant: 'success' });
      }

      handleCloseReglasDialog();
      loadReglas();
    } catch (error) {
      enqueueSnackbar('Error al guardar regla', { variant: 'error' });
    }
  };

  const handleDeleteRegla = async (reglaId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta regla?')) {
      try {
        await reglasAnonimatoAPI.deleteRegla(reglaId);
        enqueueSnackbar('Regla eliminada correctamente', { variant: 'success' });
        loadReglas();
      } catch (error) {
        enqueueSnackbar('Error al eliminar regla', { variant: 'error' });
      }
    }
  };

  const getNivelInfo = (nivel) => {
    return NIVELES_ANONIMATO.find(n => n.value === nivel) || NIVELES_ANONIMATO[0];
  };

  const getRolInfo = (rol) => {
    return ROLES_ACCESO.find(r => r.value === rol) || { label: rol, icon: <PersonIcon /> };
  };

  const toggleRolAcceso = (rol) => {
    const roles = [...formDataReglas.roles_acceso_permitido];
    const index = roles.indexOf(rol);
    
    if (index > -1) {
      roles.splice(index, 1);
    } else {
      roles.push(rol);
    }
    
    setFormDataReglas({ ...formDataReglas, roles_acceso_permitido: roles });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Anonimato
      </Typography>

      <Grid container spacing={4}>
        {/* Sección de Reglas de Anonimato */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" component="h2">
                Reglas de Anonimato
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenReglasDialog()}
              >
                Nueva Regla
              </Button>
            </Box>

            {reglas.length === 0 ? (
              <Alert severity="info">
                No hay reglas de anonimato configuradas. Configure las reglas para establecer los niveles de protección de identidad.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {reglas.map((regla) => {
                  const nivelInfo = getNivelInfo(regla.nivel_anonimato);
                  return (
                    <Grid item xs={12} md={6} lg={4} key={regla.id}>
                      <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            {nivelInfo.icon}
                            <Typography variant="h6" component="h3">
                              {nivelInfo.label}
                            </Typography>
                            <Chip
                              label={regla.nivel_anonimato}
                              color={nivelInfo.color}
                              size="small"
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" paragraph>
                            {regla.descripcion}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                {regla.requiere_justificacion ? <LockIcon color="warning" /> : <LockOpenIcon color="success" />}
                              </ListItemIcon>
                              <ListItemText
                                primary="Justificación"
                                secondary={regla.requiere_justificacion ? 'Requerida' : 'No requerida'}
                              />
                            </ListItem>

                            <ListItem>
                              <ListItemIcon>
                                {regla.permite_revelacion ? <VisibilityIcon color="warning" /> : <VisibilityOffIcon color="error" />}
                              </ListItemIcon>
                              <ListItemText
                                primary="Revelación"
                                secondary={regla.permite_revelacion ? 'Permitida' : 'No permitida'}
                              />
                            </ListItem>

                            {regla.tiempo_proteccion_dias && (
                              <ListItem>
                                <ListItemIcon>
                                  <SecurityIcon color="info" />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Protección"
                                  secondary={`${regla.tiempo_proteccion_dias} días`}
                                />
                              </ListItem>
                            )}
                          </List>

                          {regla.roles_acceso_permitido && regla.roles_acceso_permitido.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="caption" color="text.secondary" gutterBottom>
                                Roles con Acceso:
                              </Typography>
                              <Box display="flex" flexWrap="wrap" gap={0.5}>
                                {regla.roles_acceso_permitido.map((rol) => (
                                  <Chip
                                    key={rol}
                                    label={getRolInfo(rol).label}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </CardContent>

                        <CardActions>
                          <Tooltip title="Editar regla">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenReglasDialog(regla)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar regla">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteRegla(regla.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Sección de Accesos Activos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Accesos a Identidades Activos
            </Typography>

            {accesos.length === 0 ? (
              <Alert severity="info">
                No hay accesos a identidades registrados actualmente.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {accesos.map((acceso) => (
                  <Grid item xs={12} key={acceso.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Usuario
                            </Typography>
                            <Typography variant="body2">
                              {acceso.usuario_autorizado?.nombre || 'Usuario no especificado'}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Tipo de Acceso
                            </Typography>
                            <Chip
                              label={acceso.tipo_acceso}
                              size="small"
                              color={acceso.tipo_acceso === 'completo' ? 'error' : 'warning'}
                            />
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Accesos Registrados
                            </Typography>
                            <Typography variant="body2">
                              {acceso.numero_accesos || 0} veces
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Autorizado por
                            </Typography>
                            <Typography variant="body2">
                              {acceso.autorizado_por?.nombre || 'Sistema'}
                            </Typography>
                          </Grid>
                        </Grid>

                        {acceso.justificacion && (
                          <Box mt={2}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Justificación:
                            </Typography>
                            <Typography variant="body2">
                              {acceso.justificacion}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para crear/editar reglas */}
      <Dialog open={openReglasDialog} onClose={handleCloseReglasDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRegla ? 'Editar Regla de Anonimato' : 'Nueva Regla de Anonimato'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Nivel de Anonimato</InputLabel>
                <Select
                  value={formDataReglas.nivel_anonimato}
                  onChange={(e) => setFormDataReglas({ 
                    ...formDataReglas, 
                    nivel_anonimato: e.target.value 
                  })}
                  label="Nivel de Anonimato"
                >
                  {NIVELES_ANONIMATO.map((nivel) => (
                    <MenuItem key={nivel.value} value={nivel.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {nivel.icon}
                        <Box>
                          <Typography variant="body2">{nivel.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {nivel.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                value={formDataReglas.descripcion}
                onChange={(e) => setFormDataReglas({ 
                  ...formDataReglas, 
                  descripcion: e.target.value 
                })}
                placeholder="Describa cuándo y cómo se aplica esta regla"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Días de Protección"
                value={formDataReglas.tiempo_proteccion_dias}
                onChange={(e) => setFormDataReglas({ 
                  ...formDataReglas, 
                  tiempo_proteccion_dias: e.target.value 
                })}
                placeholder="Opcional: tiempo de protección automática"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formDataReglas.requiere_justificacion}
                      onChange={(e) => setFormDataReglas({ 
                        ...formDataReglas, 
                        requiere_justificacion: e.target.checked 
                      })}
                    />
                  }
                  label="Requiere Justificación"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formDataReglas.permite_revelacion}
                      onChange={(e) => setFormDataReglas({ 
                        ...formDataReglas, 
                        permite_revelacion: e.target.checked 
                      })}
                    />
                  }
                  label="Permite Revelación Posterior"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Roles con Acceso Permitido:
              </Typography>
              <Grid container spacing={1}>
                {ROLES_ACCESO.map((rol) => (
                  <Grid item key={rol.value}>
                    <Chip
                      icon={rol.icon}
                      label={rol.label}
                      clickable
                      color={formDataReglas.roles_acceso_permitido.includes(rol.value) ? 'primary' : 'default'}
                      variant={formDataReglas.roles_acceso_permitido.includes(rol.value) ? 'filled' : 'outlined'}
                      onClick={() => toggleRolAcceso(rol.value)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReglasDialog}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitReglas}
            variant="contained"
            disabled={!formDataReglas.nivel_anonimato}
          >
            {selectedRegla ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}