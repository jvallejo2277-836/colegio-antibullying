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

  // No mostrar si no hay colegio activo o si solo hay un colegio disponible
  if (!colegioActivo || colegiosDisponibles.length <= 1) {
    return null;
  }

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
            selected={colegio.id === colegioActivo.id}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              {colegio.id === colegioActivo.id ? (
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
                  {colegio.id === colegioActivo.id && (
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
};

export default ColegioSelector;