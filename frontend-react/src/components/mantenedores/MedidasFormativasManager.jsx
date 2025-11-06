import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Psychology as PsychologyIcon, Build as BuildIcon } from '@mui/icons-material';

function MedidasFormativasManager() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <PsychologyIcon sx={{ mr: 2, fontSize: 40 }} />
        Mantenedor de Medidas Formativas
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <BuildIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          En Desarrollo
        </Typography>
        <Typography color="textSecondary" paragraph>
          Este módulo permitirá gestionar el catálogo de medidas formativas: 
          diálogos reflexivos, trabajos comunitarios, mediaciones, etc.
        </Typography>
        <Button variant="outlined" disabled>
          Próximamente
        </Button>
      </Paper>
    </Box>
  );
}

export default MedidasFormativasManager;