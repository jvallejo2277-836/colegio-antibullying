import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Gavel as GavelIcon, Build as BuildIcon } from '@mui/icons-material';

function SancionesManager() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <GavelIcon sx={{ mr: 2, fontSize: 40 }} />
        Mantenedor de Sanciones
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <BuildIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          En Desarrollo
        </Typography>
        <Typography color="textSecondary" paragraph>
          Este módulo permitirá gestionar el catálogo de sanciones disciplinarias: 
          amonestaciones, suspensiones, condicionalidades, etc.
        </Typography>
        <Button variant="outlined" disabled>
          Próximamente
        </Button>
      </Paper>
    </Box>
  );
}

export default SancionesManager;