import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  School as SchoolIcon,
  ArrowDropDown as ArrowDropDownIcon,
  SwapHoriz as SwapIcon
} from '@mui/icons-material';
import { useColegio } from '../../context/ColegioContext';

const ColegioSelector: React.FC = () => {
  const { colegioActivo, colegiosDisponibles, cambiarColegio } = useColegio();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSeleccionar = (colegioId: number) => {
    cambiarColegio(colegioId);
    handleClose();
  };

  // No mostrar si no hay colegios disponibles
  if (colegiosDisponibles.length === 0) {
    return null;
  }

  // Si no hay colegio activo pero hay colegios disponibles, mostrar botón para seleccionar
  if (!colegioActivo && colegiosDisponibles.length > 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          onClick={handleClick}
          startIcon={<SchoolIcon />}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            color: 'inherit',
            textTransform: 'none',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Seleccionar Colegio
          </Typography>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'colegio-selector-button',
          }}
          PaperProps={{
            sx: { minWidth: 300 }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Seleccionar colegio para trabajar:
            </Typography>
          </Box>
          <Divider />
          
          {colegiosDisponibles.map((colegio) => (
            <MenuItem 
              key={colegio.id}
              onClick={() => handleSeleccionar(colegio.id)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <SchoolIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {colegio.nombre}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption">
                      RBD: {colegio.rbd || 'No asignado'}
                    </Typography>
                    {colegio.director && (
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        Dir: {colegio.director}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Si hay colegio activo, mostrar selector normal (independientemente del número de colegios)
  if (colegioActivo) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          onClick={handleClick}
          startIcon={<SchoolIcon />}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            color: 'inherit',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="caption" sx={{ lineHeight: 1, fontSize: '0.7rem' }}>
              Colegio Activo:
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: 'bold' }}>
              {colegioActivo.nombre}
            </Typography>
          </Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'colegio-selector-button',
          }}
          PaperProps={{
            sx: { minWidth: 300 }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Seleccionar colegio para trabajar:
            </Typography>
          </Box>
          <Divider />
          
          {colegiosDisponibles.map((colegio) => (
            <MenuItem 
              key={colegio.id}
              onClick={() => handleSeleccionar(colegio.id)}
              selected={colegio.id === colegioActivo?.id}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                {colegio.id === colegioActivo?.id ? (
                  <SchoolIcon color="primary" />
                ) : (
                  <SwapIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {colegio.nombre}
                    </Typography>
                    {colegio.id === colegioActivo?.id && (
                      <Chip label="Activo" size="small" color="primary" />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption">
                      RBD: {colegio.rbd || 'No asignado'}
                    </Typography>
                    {colegio.director && (
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        Dir: {colegio.director}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Si no hay colegio activo, no mostrar nada (caso que no debería ocurrir después de nuestras correcciones)
  return null;
};

export default ColegioSelector;
