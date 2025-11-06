import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import apiService from '../../services/api';

const URGENCIA_CHOICES = [
  { value: 'baja', label: 'Baja', color: 'success' },
  { value: 'media', label: 'Media', color: 'info' },
  { value: 'alta', label: 'Alta', color: 'warning' },
  { value: 'critica', label: 'Crítica', color: 'error' },
];

const steps = ['Información Básica', 'Detalles del Incidente', 'Confirmación'];

function ReportarIncidente() {
  const [activeStep, setActiveStep] = useState(0);
  const [colegios, setColegios] = useState([]);
  const [tiposIncidente, setTiposIncidente] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    colegio: '',
    tipo_incidente: '',
    titulo: '',
    urgencia: 'media',
    
    // Paso 2: Detalles
    descripcion: '',
    fecha_incidente: dayjs(),
    lugar_incidente: '',
    
    // Configuración de anonimato
    solicita_anonimato: false,
    nivel_anonimato: 'publico',
    justificacion_anonimato: '',
    
    // Reportero (siempre se registra)
    reportero_externo_nombre: '',
    reportero_externo_contacto: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [colegiosRes, tiposRes, usuariosRes] = await Promise.all([
        apiService.getColegios(),
        apiService.getTiposIncidente(),
        apiService.getUsuarios()
      ]);
      
      setColegios(colegiosRes.data.results || colegiosRes.data);
      setTiposIncidente(tiposRes.data.results || tiposRes.data);
      setUsuarios(usuariosRes.data.results || usuariosRes.data);
    } catch (error) {
      showSnackbar('Error al cargar los datos iniciales', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      fecha_incidente: date
    }));
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.colegio || !formData.tipo_incidente || !formData.titulo.trim()) {
          showSnackbar('Por favor complete todos los campos requeridos', 'warning');
          return false;
        }
        return true;
      case 1:
        if (!formData.descripcion.trim() || !formData.lugar_incidente.trim()) {
          showSnackbar('Por favor complete la descripción y lugar del incidente', 'warning');
          return false;
        }
        if (!formData.reportero_externo_nombre.trim() || !formData.reportero_externo_contacto.trim()) {
          showSnackbar('Debe proporcionar su nombre y contacto', 'warning');
          return false;
        }
        if (formData.solicita_anonimato && formData.nivel_anonimato === 'anonimo_total' && !formData.justificacion_anonimato.trim()) {
          showSnackbar('Debe justificar la solicitud de anonimato total', 'warning');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        fecha_incidente: formData.fecha_incidente.toISOString(),
      };

      await apiService.createReporte(submitData);
      showSnackbar('Reporte de incidente creado exitosamente');
      
      // Resetear formulario
      setFormData({
        colegio: '',
        tipo_incidente: '',
        titulo: '',
        urgencia: 'media',
        descripcion: '',
        fecha_incidente: dayjs(),
        lugar_incidente: '',
        solicita_anonimato: false,
        nivel_anonimato: 'publico',
        justificacion_anonimato: '',
        reportero_externo_nombre: '',
        reportero_externo_contacto: '',
      });
      setActiveStep(0);
      
    } catch (error) {
      showSnackbar('Error al crear el reporte de incidente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getUrgenciaColor = (urgencia) => {
    const choice = URGENCIA_CHOICES.find(c => c.value === urgencia);
    return choice ? choice.color : 'default';
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Colegio</InputLabel>
                <Select
                  name="colegio"
                  value={formData.colegio}
                  onChange={handleInputChange}
                  label="Colegio"
                >
                  {colegios.map((colegio) => (
                    <MenuItem key={colegio.id} value={colegio.id}>
                      {colegio.nombre} (RBD: {colegio.rbd})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Incidente</InputLabel>
                <Select
                  name="tipo_incidente"
                  value={formData.tipo_incidente}
                  onChange={handleInputChange}
                  label="Tipo de Incidente"
                >
                  {tiposIncidente.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre} ({tipo.categoria_display})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Urgencia</InputLabel>
                <Select
                  name="urgencia"
                  value={formData.urgencia}
                  onChange={handleInputChange}
                  label="Urgencia"
                >
                  {URGENCIA_CHOICES.map((choice) => (
                    <MenuItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="titulo"
                label="Título del Reporte"
                value={formData.titulo}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="Ej: Agresión física en el patio durante el recreo"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción Detallada del Incidente"
                value={formData.descripcion}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                rows={4}
                placeholder="Describa en detalle lo ocurrido, personas involucradas, circunstancias, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Fecha y Hora del Incidente"
                  value={formData.fecha_incidente}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lugar_incidente"
                label="Lugar del Incidente"
                value={formData.lugar_incidente}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="Ej: Patio principal, Sala 2°A, Baño segundo piso"
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Información del Reportero
                </Typography>
                <Typography variant="body2">
                  Su identidad siempre será registrada para fines de seguimiento, pero puede solicitar protección de anonimato.
                </Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="reportero_externo_nombre"
                label="Nombre Completo"
                value={formData.reportero_externo_nombre}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="Ingrese su nombre completo"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="reportero_externo_contacto"
                label="Contacto (Email o Teléfono)"
                value={formData.reportero_externo_contacto}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="Email o teléfono para seguimiento"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="solicita_anonimato"
                    checked={formData.solicita_anonimato}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Solicitar Protección de Anonimato"
              />
            </Grid>

            {formData.solicita_anonimato && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Nivel de Anonimato</InputLabel>
                    <Select
                      name="nivel_anonimato"
                      value={formData.nivel_anonimato}
                      onChange={handleInputChange}
                      label="Nivel de Anonimato"
                    >
                      <MenuItem value="publico">
                        Público - Identidad visible para involucrados
                      </MenuItem>
                      <MenuItem value="restringido">
                        Restringido - Solo personal autorizado
                      </MenuItem>
                      <MenuItem value="anonimo_total">
                        Anónimo Total - Máxima protección
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    name="justificacion_anonimato"
                    label="Justificación para Anonimato"
                    value={formData.justificacion_anonimato}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Explique por qué necesita protección de anonimato..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="warning">
                    <Typography variant="body2">
                      <strong>Importante:</strong> La solicitud de anonimato será evaluada según las políticas del colegio. 
                      Su identidad siempre será conocida por el encargado de convivencia para efectos de seguimiento.
                    </Typography>
                  </Alert>
                </Grid>
              </>
            )}
          </Grid>
        );

      case 2:
        const tipoSeleccionado = tiposIncidente.find(t => t.id === formData.tipo_incidente);
        const colegioSeleccionado = colegios.find(c => c.id === formData.colegio);
        
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Revise la información antes de enviar el reporte. Una vez enviado, se iniciará el proceso de investigación según los protocolos establecidos.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Resumen del Reporte</Typography>
                  <Typography><strong>Colegio:</strong> {colegioSeleccionado?.nombre}</Typography>
                  <Typography><strong>Tipo:</strong> {tipoSeleccionado?.nombre}</Typography>
                  <Typography><strong>Título:</strong> {formData.titulo}</Typography>
                  <Typography><strong>Urgencia:</strong> {URGENCIA_CHOICES.find(u => u.value === formData.urgencia)?.label}</Typography>
                  <Typography><strong>Fecha:</strong> {formData.fecha_incidente.format('DD/MM/YYYY HH:mm')}</Typography>
                  <Typography><strong>Lugar:</strong> {formData.lugar_incidente}</Typography>
                  <Typography><strong>Reportero:</strong> {formData.reportero_externo_nombre}</Typography>
                  <Typography><strong>Contacto:</strong> {formData.reportero_externo_contacto}</Typography>
                  <Typography><strong>Solicita Anonimato:</strong> {formData.solicita_anonimato ? `Sí (${formData.nivel_anonimato})` : 'No'}</Typography>
                  {formData.solicita_anonimato && formData.justificacion_anonimato && (
                    <Typography><strong>Justificación:</strong> {formData.justificacion_anonimato}</Typography>
                  )}
                  {tipoSeleccionado?.requiere_denuncia && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Este tipo de incidente requiere denuncia a las autoridades competentes.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return 'Paso desconocido';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AssignmentIcon sx={{ mr: 2, fontSize: 40 }} />
        Reportar Incidente de Convivencia
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3, mb: 3 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
            startIcon={<ArrowBackIcon />}
          >
            Anterior
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={loading}
              startIcon={<SendIcon />}
            >
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ReportarIncidente;