import React, { useState, useEffect } from 'react';
import { useColegio } from '../../context/ColegioContext';
import SelectorColegioActivo from '../common/SelectorColegioActivo';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Stack
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth, useAuthFetch } from '../../contexts/AuthContext';

// Interfaces
interface TipoIncidente {
  id: number;
  nombre: string;
  categoria: string;
  gravedad: string;
  descripcion: string;
  requiere_denuncia: boolean;
  plazo_investigacion_dias: number;
}



interface PerfilUsuario {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  tipo_usuario: string;
  colegio: number;
  curso?: string;
}

interface Evidencia {
  tipo_evidencia: string;
  archivo?: File | null;
  descripcion: string;
  testimonio_texto?: string;
}

interface FormData {
  tipo_incidente: number | '';
  titulo: string;
  descripcion: string;
  fecha_incidente: Dayjs | null;
  lugar_incidente: string;
  estudiantes_involucrados: number[];
  testigos: number[];
  solicita_anonimato: boolean;
  nivel_anonimato: string;
  justificacion_anonimato: string;
  reportero_externo_nombre: string;
  reportero_externo_contacto: string;
  urgencia: string;
}

const steps = [
  'Información Básica',
  'Detalles del Incidente', 
  'Involucrados y Testigos',
  'Evidencias',
  'Revisión y Envío'
];

const urgenciaOptions = [
  { value: 'baja', label: 'Baja', color: '#4caf50' },
  { value: 'media', label: 'Media', color: '#ff9800' },
  { value: 'alta', label: 'Alta', color: '#f44336' },
  { value: 'critica', label: 'Crítica', color: '#9c27b0' }
];

const nivelAnonimatoOptions = [
  { value: 'publico', label: 'Público - Mi identidad puede ser conocida' },
  { value: 'restringido', label: 'Restringido - Solo autoridades del colegio' },
  { value: 'confidencial', label: 'Confidencial - Solo Encargado de Convivencia' },
  { value: 'judicial', label: 'Judicial - Solo para efectos legales' }
];

const tipoEvidenciaOptions = [
  { value: 'documento', label: 'Documento' },
  { value: 'foto', label: 'Fotografía' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'testimonio', label: 'Testimonio Escrito' },
  { value: 'otro', label: 'Otro' }
];

export const ReportarIncidente: React.FC = () => {
  const { user } = useAuth();
  const { colegioActivo } = useColegio();
  const { fetchWithAuth } = useAuthFetch();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mostrarSelectorColegio, setMostrarSelectorColegio] = useState(false);

  // Estados para datos del servidor
  const [tiposIncidente, setTiposIncidente] = useState<TipoIncidente[]>([]);
  const [usuarios, setUsuarios] = useState<PerfilUsuario[]>([]);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<PerfilUsuario[]>([]);

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    tipo_incidente: '',
    titulo: '',
    descripcion: '',
    fecha_incidente: dayjs(),
    lugar_incidente: '',
    estudiantes_involucrados: [],
    testigos: [],
    solicita_anonimato: false,
    nivel_anonimato: 'publico',
    justificacion_anonimato: '',
    reportero_externo_nombre: '',
    reportero_externo_contacto: '',
    urgencia: 'media'
  });

  // Función para rellenar datos de prueba
  const rellenarDatosPrueba = () => {
    setFormData({
      tipo_incidente: 1,
      titulo: 'Incidente de Prueba en Patio Principal',
      descripcion: 'Este es un reporte de prueba para verificar el funcionamiento del sistema.',
      fecha_incidente: dayjs(),
      lugar_incidente: 'Patio principal del colegio',
      estudiantes_involucrados: [],
      testigos: [],
      solicita_anonimato: false,
      nivel_anonimato: 'publico',
      justificacion_anonimato: '',
      reportero_externo_nombre: 'Usuario de Prueba',
      reportero_externo_contacto: 'prueba@test.com',
      urgencia: 'media'
    });
  };

  // Estados para evidencias
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [openEvidenciaDialog, setOpenEvidenciaDialog] = useState(false);
  const [nuevaEvidencia, setNuevaEvidencia] = useState<Evidencia>({
    tipo_evidencia: 'documento',
    descripcion: '',
    testimonio_texto: ''
  });

  // Cargar datos iniciales - simplificado sin loading infinito
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Datos estáticos de ejemplo para evitar problemas de API
        setTiposIncidente([
          { id: 1, nombre: 'Bullying Físico', categoria: 'violencia', gravedad: 'alta', descripcion: 'Agresión física', requiere_denuncia: true, plazo_investigacion_dias: 5 },
          { id: 2, nombre: 'Bullying Verbal', categoria: 'violencia', gravedad: 'media', descripcion: 'Insultos o burlas', requiere_denuncia: false, plazo_investigacion_dias: 3 },
          { id: 3, nombre: 'Ciberbullying', categoria: 'tecnologica', gravedad: 'alta', descripcion: 'Acoso por medios digitales', requiere_denuncia: true, plazo_investigacion_dias: 7 }
        ]);
        
        setUsuarios([]);
        setEstudiantesDisponibles([]);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error al cargar los datos necesarios');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []); // Sin dependencias para evitar bucle

  // Efecto para mostrar alerta si no hay colegio activo
  useEffect(() => {
    if (user && !colegioActivo) {
      console.warn('Usuario logueado pero no hay colegio activo seleccionado');
    }
  }, [user, colegioActivo]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const agregarEvidencia = () => {
    if (nuevaEvidencia.descripcion.trim()) {
      setEvidencias(prev => [...prev, { ...nuevaEvidencia }]);
      setNuevaEvidencia({
        tipo_evidencia: 'documento',
        descripcion: '',
        testimonio_texto: ''
      });
      setOpenEvidenciaDialog(false);
    }
  };

  const eliminarEvidencia = (index: number) => {
    setEvidencias(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (file: File | null) => {
    setNuevaEvidencia(prev => ({
      ...prev,
      archivo: file
    }));
  };

  const validarFormulario = (): string[] => {
    const errores: string[] = [];
    
    // Verificar que hay colegio activo
    if (!colegioActivo) {
      errores.push('Debe seleccionar un colegio activo para reportar incidentes');
      return errores;
    }
    
    // CAMPOS OBLIGATORIOS SEGÚN LEY 20.536
    if (!formData.titulo.trim()) errores.push('El título es obligatorio');
    if (!formData.tipo_incidente) errores.push('Debe seleccionar un tipo de incidente');
    if (!formData.descripcion.trim()) errores.push('La descripción es obligatoria');
    if (!formData.fecha_incidente) errores.push('La fecha del incidente es obligatoria');
    if (!formData.lugar_incidente.trim()) errores.push('El lugar del incidente es obligatorio');
    
    if (formData.solicita_anonimato && !formData.justificacion_anonimato.trim()) {
      errores.push('Debe justificar la solicitud de anonimato');
    }
    
    if (!user && (!formData.reportero_externo_nombre.trim() || !formData.reportero_externo_contacto.trim())) {
      errores.push('Debe proporcionar datos de contacto si reporta externamente');
    }
    
    return errores;
  };

  const enviarReporte = async () => {
    console.log('Iniciando envío de reporte...');
    const errores = validarFormulario();
    console.log('Errores de validación:', errores);
    if (errores.length > 0) {
      setError(errores.join(', '));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Preparar datos para envío
      const reporteData = {
        tipo_incidente: formData.tipo_incidente,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fecha_incidente: formData.fecha_incidente?.toISOString(),
        lugar_incidente: formData.lugar_incidente,
        estudiantes_involucrados: formData.estudiantes_involucrados,
        testigos: formData.testigos,
        solicita_anonimato: formData.solicita_anonimato,
        nivel_anonimato: formData.nivel_anonimato,
        justificacion_anonimato: formData.justificacion_anonimato,
        reportero_externo_nombre: formData.reportero_externo_nombre,
        reportero_externo_contacto: formData.reportero_externo_contacto,
        urgencia: formData.urgencia,
        colegio: colegioActivo?.id
      };

      console.log('Datos a enviar:', reporteData);

      // Enviar reporte principal
      const response = await fetch('http://127.0.0.1:8000/api/reportes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reporteData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        console.log('Error response status:', response.status);
        const responseText = await response.text();
        console.log('Error response text:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.detail || 'Error al enviar el reporte');
        } catch (jsonError) {
          throw new Error(`Error del servidor: ${response.status} - ${responseText}`);
        }
      }

      const reporteCreado = await response.json();

      // Enviar evidencias si las hay
      if (evidencias.length > 0) {
        await enviarEvidencias(reporteCreado.id);
      }

      setSuccess(true);
      setActiveStep(steps.length); // Ir al paso de éxito
    } catch (error) {
      console.error('Error enviando reporte:', error);
      setError(error instanceof Error ? error.message : 'Error al enviar el reporte');
    } finally {
      setSubmitting(false);
    }
  };

  const enviarEvidencias = async (reporteId: number) => {
    for (const evidencia of evidencias) {
      try {
        const formDataEvidencia = new FormData();
        formDataEvidencia.append('reporte', reporteId.toString());
        formDataEvidencia.append('tipo_evidencia', evidencia.tipo_evidencia);
        formDataEvidencia.append('descripcion', evidencia.descripcion);
        
        if (evidencia.testimonio_texto) {
          formDataEvidencia.append('testimonio_texto', evidencia.testimonio_texto);
        }
        
        if (evidencia.archivo) {
          formDataEvidencia.append('archivo', evidencia.archivo);
        }

        await fetchWithAuth('/evidencias/', {
          method: 'POST',
          headers: {},
          body: formDataEvidencia,
        });
      } catch (error) {
        console.error('Error enviando evidencia:', error);
      }
    }
  };

  const renderInformacionBasica = () => (
    <Stack spacing={3} sx={{ mt: 2 }}>
      {/* Información del Colegio Activo */}
      {colegioActivo && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2, 
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                📍 Reportando incidente para: {colegioActivo.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                RBD: {colegioActivo.rbd} • {colegioActivo.direccion}
                {colegioActivo.director && ` • Director: ${colegioActivo.director}`}
              </Typography>
            </Box>
          </Box>
        </Alert>
      )}
      
      <FormControl fullWidth required>
        <InputLabel>Tipo de Incidente</InputLabel>
        <Select
          value={formData.tipo_incidente}
          label="Tipo de Incidente"
          onChange={(e) => handleInputChange('tipo_incidente', e.target.value)}
        >
          {tiposIncidente.map((tipo) => (
            <MenuItem key={tipo.id} value={tipo.id}>
              <Box>
                <Typography variant="body1">{tipo.nombre}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {tipo.categoria} - {tipo.gravedad}
                  {tipo.requiere_denuncia && ' (Requiere denuncia)'}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        fullWidth
        required
        label="Título del Incidente"
        value={formData.titulo}
        onChange={(e) => handleInputChange('titulo', e.target.value)}
        placeholder="Resumen breve del incidente"
        helperText="Ejemplo: 'Agresión física en el recreo' o 'Cyberbullying en redes sociales'"
      />
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Fecha y Hora del Incidente *"
            value={formData.fecha_incidente}
            onChange={(newValue) => handleInputChange('fecha_incidente', newValue)}
            slotProps={{
              textField: { fullWidth: true, required: true }
            }}
          />
        </LocalizationProvider>
        
        <FormControl fullWidth>
          <InputLabel>Urgencia</InputLabel>
          <Select
            value={formData.urgencia}
            label="Urgencia"
            onChange={(e) => handleInputChange('urgencia', e.target.value)}
          >
            {urgenciaOptions.map((opcion) => (
              <MenuItem key={opcion.value} value={opcion.value}>
                <Chip 
                  label={opcion.label} 
                  size="small" 
                  sx={{ backgroundColor: opcion.color, color: 'white' }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      
      <TextField
        fullWidth
        required
        label="Lugar del Incidente"
        value={formData.lugar_incidente}
        onChange={(e) => handleInputChange('lugar_incidente', e.target.value)}
        placeholder="Ej: Sala 3°A, Patio central, Baños del segundo piso"
        helperText="Especifique el lugar exacto donde ocurrió el incidente"
      />
    </Stack>
  );

  const renderDetallesIncidente = () => (
    <Stack spacing={3} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        required
        multiline
        rows={6}
        label="Descripción Detallada del Incidente"
        value={formData.descripcion}
        onChange={(e) => handleInputChange('descripcion', e.target.value)}
        placeholder="Describa de manera clara y objetiva lo que ocurrió..."
        helperText="Incluya: ¿Qué pasó? ¿Cómo ocurrió? ¿Había antecedentes? ¿Qué consecuencias inmediatas hubo?"
      />

      <Divider />

      <Typography variant="h6">
        Configuración de Privacidad
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={formData.solicita_anonimato}
            onChange={(e) => handleInputChange('solicita_anonimato', e.target.checked)}
          />
        }
        label="Solicitar anonimato en este reporte"
      />

      {formData.solicita_anonimato && (
        <Stack spacing={2} sx={{ ml: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Nivel de Anonimato</InputLabel>
            <Select
              value={formData.nivel_anonimato}
              label="Nivel de Anonimato"
              onChange={(e) => handleInputChange('nivel_anonimato', e.target.value)}
            >
              {nivelAnonimatoOptions.map((opcion) => (
                <MenuItem key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            multiline
            rows={3}
            label="Justificación para Solicitud de Anonimato"
            value={formData.justificacion_anonimato}
            onChange={(e) => handleInputChange('justificacion_anonimato', e.target.value)}
            placeholder="Explique por qué necesita mantener su identidad protegida..."
            helperText="Esta información ayudará a las autoridades a entender la necesidad de privacidad"
          />
        </Stack>
      )}
    </Stack>
  );

  const renderInvolucradosTestigos = () => (
    <Stack spacing={3} sx={{ mt: 2 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Estudiantes Involucrados
        </Typography>
        <Autocomplete
          multiple
          options={estudiantesDisponibles}
          getOptionLabel={(option) => 
            `${option.user.first_name} ${option.user.last_name} ${option.curso ? `(${option.curso})` : ''}`
          }
          value={estudiantesDisponibles.filter(est => 
            formData.estudiantes_involucrados.includes(est.id)
          )}
          onChange={(_, newValue) => {
            handleInputChange('estudiantes_involucrados', newValue.map(v => v.id));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar y seleccionar estudiantes involucrados..."
              helperText="Seleccione los estudiantes que participaron directamente en el incidente"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={`${option.user.first_name} ${option.user.last_name} ${option.curso ? `(${option.curso})` : ''}`}
                {...getTagProps({ index })}
              />
            ))
          }
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          Testigos
        </Typography>
        <Autocomplete
          multiple
          options={usuarios}
          getOptionLabel={(option) => 
            `${option.user.first_name} ${option.user.last_name} - ${option.tipo_usuario} ${option.curso ? `(${option.curso})` : ''}`
          }
          value={usuarios.filter(usr => 
            formData.testigos.includes(usr.id)
          )}
          onChange={(_, newValue) => {
            handleInputChange('testigos', newValue.map(v => v.id));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar y seleccionar testigos del incidente..."
              helperText="Seleccione las personas que presenciaron o tienen conocimiento del incidente"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={`${option.user.first_name} ${option.user.last_name} (${option.tipo_usuario})`}
                {...getTagProps({ index })}
              />
            ))
          }
        />
      </Box>
    </Stack>
  );

  const renderEvidencias = () => (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Evidencias</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenEvidenciaDialog(true)}
        >
          Agregar Evidencia
        </Button>
      </Box>

      {evidencias.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography color="text.secondary">
            No hay evidencias agregadas. Las evidencias son opcionales pero ayudan a documentar mejor el incidente.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {evidencias.map((evidencia, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Chip 
                      label={tipoEvidenciaOptions.find(t => t.value === evidencia.tipo_evidencia)?.label} 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {evidencia.descripcion}
                    </Typography>
                    {evidencia.archivo && (
                      <Typography variant="body2" color="text.secondary">
                        Archivo: {evidencia.archivo.name}
                      </Typography>
                    )}
                    {evidencia.testimonio_texto && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        "{evidencia.testimonio_texto}"
                      </Typography>
                    )}
                  </Box>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => eliminarEvidencia(index)}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Dialog para agregar evidencia */}
      <Dialog open={openEvidenciaDialog} onClose={() => setOpenEvidenciaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Evidencia</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Evidencia</InputLabel>
              <Select
                value={nuevaEvidencia.tipo_evidencia}
                label="Tipo de Evidencia"
                onChange={(e) => setNuevaEvidencia(prev => ({ ...prev, tipo_evidencia: e.target.value }))}
              >
                {tipoEvidenciaOptions.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              required
              label="Descripción de la Evidencia"
              value={nuevaEvidencia.descripcion}
              onChange={(e) => setNuevaEvidencia(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Ej: Captura de pantalla de mensajes, Foto de daño material..."
            />

            {nuevaEvidencia.tipo_evidencia === 'testimonio' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Testimonio"
                value={nuevaEvidencia.testimonio_texto}
                onChange={(e) => setNuevaEvidencia(prev => ({ ...prev, testimonio_texto: e.target.value }))}
                placeholder="Escriba el testimonio completo..."
              />
            )}

            {nuevaEvidencia.tipo_evidencia !== 'testimonio' && (
              <Box>
                <input
                  accept="*/*"
                  style={{ display: 'none' }}
                  id="evidencia-file-input"
                  type="file"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
                <label htmlFor="evidencia-file-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    {nuevaEvidencia.archivo ? nuevaEvidencia.archivo.name : 'Seleccionar Archivo'}
                  </Button>
                </label>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEvidenciaDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={agregarEvidencia} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderRevisionEnvio = () => {
    const tipoSeleccionado = tiposIncidente.find(t => t.id === formData.tipo_incidente);
    
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Typography variant="h6">
          Revisión Final del Reporte
        </Typography>
        
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Tipo de Incidente</Typography>
                  <Typography variant="body1">{tipoSeleccionado?.nombre}</Typography>
                  {tipoSeleccionado?.requiere_denuncia && (
                    <Chip label="Requiere Denuncia" color="warning" size="small" sx={{ mt: 0.5 }} />
                  )}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Urgencia</Typography>
                  <Chip 
                    label={urgenciaOptions.find(u => u.value === formData.urgencia)?.label} 
                    sx={{ 
                      backgroundColor: urgenciaOptions.find(u => u.value === formData.urgencia)?.color,
                      color: 'white'
                    }}
                    size="small"
                  />
                </Box>
              </Stack>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Título</Typography>
                <Typography variant="body1">{formData.titulo}</Typography>
              </Box>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Fecha del Incidente</Typography>
                  <Typography variant="body1">{formData.fecha_incidente?.format('DD/MM/YYYY HH:mm')}</Typography>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Lugar</Typography>
                  <Typography variant="body1">{formData.lugar_incidente}</Typography>
                </Box>
              </Stack>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Descripción</Typography>
                <Typography variant="body1">{formData.descripcion}</Typography>
              </Box>
              
              {formData.estudiantes_involucrados.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Estudiantes Involucrados</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {formData.estudiantes_involucrados.map(id => {
                      const estudiante = estudiantesDisponibles.find(e => e.id === id);
                      return estudiante ? (
                        <Chip key={id} label={`${estudiante.user.first_name} ${estudiante.user.last_name}`} size="small" />
                      ) : null;
                    })}
                  </Box>
                </Box>
              )}
              
              {formData.testigos.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Testigos</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {formData.testigos.map(id => {
                      const testigo = usuarios.find(u => u.id === id);
                      return testigo ? (
                        <Chip key={id} label={`${testigo.user.first_name} ${testigo.user.last_name}`} size="small" />
                      ) : null;
                    })}
                  </Box>
                </Box>
              )}
              
              {evidencias.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Evidencias</Typography>
                  <Typography variant="body2">{evidencias.length} evidencia(s) adjunta(s)</Typography>
                </Box>
              )}
              
              {formData.solicita_anonimato && (
                <Alert severity="info">
                  <Typography variant="subtitle2">Reporte Anónimo</Typography>
                  <Typography variant="body2">
                    Nivel: {nivelAnonimatoOptions.find(n => n.value === formData.nivel_anonimato)?.label}
                  </Typography>
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <Button
          variant="outlined"
          size="medium"
          fullWidth
          onClick={rellenarDatosPrueba}
          sx={{ mb: 2 }}
        >
          Rellenar Datos de Prueba
        </Button>
        
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={enviarReporte}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {submitting ? 'Enviando Reporte...' : 'Enviar Reporte de Incidente'}
        </Button>
      </Stack>
    );
  };

  const renderExito = () => (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" color="success.main" gutterBottom>
        ✓ Reporte Enviado Exitosamente
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Su reporte ha sido registrado correctamente y será procesado por las autoridades correspondientes.
      </Typography>
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Próximos pasos:</strong>
          <br />• Recibirá una confirmación por email
          <br />• El caso será asignado a un encargado
          <br />• Se iniciará la investigación correspondiente
          <br />• Será notificado sobre el progreso del caso
        </Typography>
      </Alert>
      <Button 
        variant="contained" 
        onClick={() => window.location.reload()}
      >
        Reportar Otro Incidente
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando datos del formulario...</Typography>
      </Box>
    );
  }

  if (success && activeStep >= steps.length) {
    return (
      <Paper sx={{ p: 4 }}>
        {renderExito()}
      </Paper>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 4 }}>
        {/* Verificación de colegio activo */}
        {!colegioActivo && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              No hay colegio activo seleccionado
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Para poder reportar un incidente, necesitas tener un colegio activo seleccionado.
            </Typography>
            {(user?.role === 'admin' || user?.role === 'sostenedor') && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setMostrarSelectorColegio(true)}
                sx={{ mt: 1 }}
              >
                Seleccionar Colegio
              </Button>
            )}
            {user?.role !== 'admin' && user?.role !== 'sostenedor' && (
              <Typography variant="body2" color="text.secondary">
                Contacta al administrador para que te asigne a un colegio.
              </Typography>
            )}
          </Alert>
        )}
        
        <Typography variant="h4" gutterBottom align="center">
          Reportar Incidente de Convivencia Escolar
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Complete todos los pasos para registrar un incidente según la Ley 20.536 sobre Violencia Escolar
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400, opacity: colegioActivo ? 1 : 0.5, pointerEvents: colegioActivo ? 'auto' : 'none' }}>
          {activeStep === 0 && renderInformacionBasica()}
          {activeStep === 1 && renderDetallesIncidente()}
          {activeStep === 2 && renderInvolucradosTestigos()}
          {activeStep === 3 && renderEvidencias()}
          {activeStep === 4 && renderRevisionEnvio()}
        </Box>

        {activeStep < steps.length && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || !colegioActivo}
            >
              Anterior
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1 || !colegioActivo}
            >
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Selector de Colegio */}
      <SelectorColegioActivo 
        open={mostrarSelectorColegio} 
        onClose={() => setMostrarSelectorColegio(false)}
      />
    </LocalizationProvider>
  );
};

export default ReportarIncidente;