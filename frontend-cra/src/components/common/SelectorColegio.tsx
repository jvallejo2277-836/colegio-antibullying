import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useColegio } from '../../context/ColegioContext';
import { useAuth } from '../../contexts/AuthContext';

interface SelectorColegioProps {
  open: boolean;
  onClose?: () => void;
  obligatorio?: boolean;
}

export const SelectorColegio: React.FC<SelectorColegioProps> = ({ 
  open, 
  onClose, 
  obligatorio = true 
}) => {
  const { user } = useAuth();
  const { 
    colegiosDisponibles, 
    cambiarColegio, 
    loading 
  } = useColegio();
  const [colegioSeleccionado, setColegioSeleccionado] = useState<number | ''>('');

  const handleSeleccionar = () => {
    if (colegioSeleccionado && typeof colegioSeleccionado === 'number') {
      cambiarColegio(colegioSeleccionado);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleClose = () => {
    if (!obligatorio && onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando colegios disponibles...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown={obligatorio}
    >
      <DialogTitle>
        <Typography variant="h6">
          Seleccionar Colegio de Trabajo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Seleccione el establecimiento educacional para continuar trabajando
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {user && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Usuario:</strong> {user.first_name} {user.last_name}<br />
              <strong>Rol:</strong> {user.role}
            </Typography>
          </Alert>
        )}

        {colegiosDisponibles.length === 0 ? (
          <Alert severity="warning">
            No hay colegios disponibles para su usuario. 
            Contacte al administrador del sistema.
          </Alert>
        ) : (
          <FormControl fullWidth>
            <InputLabel>Colegio</InputLabel>
            <Select
              value={colegioSeleccionado}
              label="Colegio"
              onChange={(e) => setColegioSeleccionado(e.target.value as number)}
            >
              {colegiosDisponibles.map((colegio) => (
                <MenuItem key={colegio.id} value={colegio.id}>
                  <Box>
                    <Typography variant="body1">{colegio.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      RBD: {colegio.rbd} - {colegio.direccion}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {colegiosDisponibles.length > 1 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Su usuario tiene acceso a múltiples colegios. 
              Puede cambiar de colegio en cualquier momento desde el menú superior.
            </Typography>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        {!obligatorio && (
          <Button onClick={handleClose}>
            Cancelar
          </Button>
        )}
        <Button 
          onClick={handleSeleccionar}
          variant="contained"
          disabled={!colegioSeleccionado || colegiosDisponibles.length === 0}
        >
          {obligatorio ? 'Continuar' : 'Seleccionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectorColegio;