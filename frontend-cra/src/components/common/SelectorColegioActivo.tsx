import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Paper,
  Button,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useColegio } from '../../context/ColegioContext';
import { useAuth } from '../../contexts/AuthContext';

interface SelectorColegioActivoProps {
  open: boolean;
  onClose?: () => void;
}

const SelectorColegioActivo: React.FC<SelectorColegioActivoProps> = ({ open, onClose }) => {
  const { colegiosDisponibles, cambiarColegio, loading } = useColegio();
  const { user } = useAuth();

  const handleSeleccionarColegio = (colegioId: number) => {
    cambiarColegio(colegioId);
    if (onClose) {
      onClose();
    }
  };

  const esUsuarioMultiColegio = user?.role === 'admin' || user?.role === 'sostenedor';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={!onClose}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6">
            {esUsuarioMultiColegio ? 'Seleccionar Colegio' : 'Confirmar Colegio'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {esUsuarioMultiColegio 
            ? 'Tienes acceso a múltiples colegios. Selecciona con cuál deseas trabajar:'
            : 'Confirma el colegio con el que vas a trabajar:'
          }
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Cargando colegios...</Typography>
          </Box>
        ) : colegiosDisponibles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error">
              No tienes colegios asignados. Contacta al administrador.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {colegiosDisponibles.map((colegio) => (
              <ListItem key={colegio.id} disablePadding sx={{ mb: 1 }}>
                <Paper 
                  sx={{ 
                    width: '100%', 
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemButton 
                    onClick={() => handleSeleccionarColegio(colegio.id)}
                    sx={{ p: 2 }}
                  >
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="h6" component="span">
                            {colegio.nombre}
                          </Typography>
                          <Chip 
                            label={colegio.rbd || 'Sin RBD'} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          {colegio.direccion && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                            >
                              <LocationIcon fontSize="inherit" />
                              {colegio.direccion}
                            </Typography>
                          )}
                          {colegio.director && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              <PersonIcon fontSize="inherit" />
                              Director: {colegio.director}
                            </Typography>
                          )}
                          {colegio.reportes_count !== undefined && (
                            <Typography variant="caption" color="text.secondary">
                              {colegio.reportes_count} reportes registrados
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </Paper>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      {onClose && (
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default SelectorColegioActivo;