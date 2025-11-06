import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Collapse,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Report as ReportIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Gavel as GavelIcon,
  Psychology as PsychologyIcon,
  ExpandLess,
  ExpandMore,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Policy as PolicyIcon,
} from '@mui/icons-material';

// Importar componentes (los crearemos después)
import Dashboard from './components/Dashboard';
import ColegiosManager from './components/mantenedores/ColegiosManager';
import TiposIncidenteManager from './components/mantenedores/TiposIncidenteManager';
import UsuariosManager from './components/mantenedores/UsuariosManager';
import MedidasFormativasManager from './components/mantenedores/MedidasFormativasManager';
import SancionesManager from './components/mantenedores/SancionesManager';
import ReportarIncidente from './components/operaciones/ReportarIncidente';
import GestionReportes from './components/operaciones/GestionReportes';
import ReportesUrgentes from './components/operaciones/ReportesUrgentes';

// Importar componentes del sistema de protocolos
import ProtocolosDashboard from './components/protocolos/ProtocolosDashboard';
import ProtocolosManager from './components/protocolos/ProtocolosManager';
import ProcesoTracker from './components/protocolos/ProcesoTracker';
import AnonimatoManager from './components/protocolos/AnonimatoManager';

const drawerWidth = 280;

// Tema personalizado para el sistema
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mantenedoresOpen, setMantenedoresOpen] = useState(false);
  const [operacionesOpen, setOperacionesOpen] = useState(false);
  const [protocolosOpen, setProtocolosOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'Mantenedores',
      icon: <SettingsIcon />,
      submenu: true,
      open: mantenedoresOpen,
      onClick: () => setMantenedoresOpen(!mantenedoresOpen),
      children: [
        {
          text: 'Colegios',
          icon: <SchoolIcon />,
          path: '/mantenedores/colegios',
        },
        {
          text: 'Tipos de Incidente',
          icon: <CategoryIcon />,
          path: '/mantenedores/tipos-incidente',
        },
        {
          text: 'Usuarios',
          icon: <PeopleIcon />,
          path: '/mantenedores/usuarios',
        },
        {
          text: 'Medidas Formativas',
          icon: <PsychologyIcon />,
          path: '/mantenedores/medidas-formativas',
        },
        {
          text: 'Sanciones',
          icon: <GavelIcon />,
          path: '/mantenedores/sanciones',
        },
      ],
    },
    {
      text: 'Operaciones',
      icon: <ReportIcon />,
      submenu: true,
      open: operacionesOpen,
      onClick: () => setOperacionesOpen(!operacionesOpen),
      children: [
        {
          text: 'Reportar Incidente',
          icon: <AssignmentIcon />,
          path: '/operaciones/reportar',
        },
        {
          text: 'Gestión de Reportes',
          icon: <AnalyticsIcon />,
          path: '/operaciones/reportes',
        },
        {
          text: 'Reportes Urgentes',
          icon: <WarningIcon />,
          path: '/operaciones/urgentes',
        },
      ],
    },
    {
      text: 'Protocolos Flexibles',
      icon: <PolicyIcon />,
      submenu: true,
      open: protocolosOpen,
      onClick: () => setProtocolosOpen(!protocolosOpen),
      children: [
        {
          text: 'Dashboard Protocolos',
          icon: <TimelineIcon />,
          path: '/protocolos',
        },
        {
          text: 'Gestión de Protocolos',
          icon: <PolicyIcon />,
          path: '/protocolos/gestion',
        },
        {
          text: 'Seguimiento de Procesos',
          icon: <AnalyticsIcon />,
          path: '/protocolos/seguimiento',
        },
        {
          text: 'Reglas de Anonimato',
          icon: <SecurityIcon />,
          path: '/protocolos/anonimato',
        },
      ],
    },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Sistema Convivencia
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <div key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={item.submenu ? item.onClick : () => window.location.hash = item.path}
                sx={item.submenu ? {} : { pl: 2 }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ '& .MuiListItemText-primary': { fontWeight: item.submenu ? 'bold' : 'normal' } }}
                />
                {item.submenu && (item.open ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {item.submenu && (
              <Collapse in={item.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.text} disablePadding>
                      <ListItemButton 
                        sx={{ pl: 4 }}
                        onClick={() => window.location.hash = child.path}
                      >
                        <ListItemIcon sx={{ color: 'text.secondary', minWidth: 35 }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Box sx={{ display: 'flex' }}>
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Sistema de Convivencia Escolar - Chile
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          
          <Box
            component="main"
            sx={{ 
              flexGrow: 1, 
              p: 3, 
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              bgcolor: 'background.default',
              minHeight: '100vh',
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Rutas de Mantenedores */}
              <Route path="/mantenedores/colegios" element={<ColegiosManager />} />
              <Route path="/mantenedores/tipos-incidente" element={<TiposIncidenteManager />} />
              <Route path="/mantenedores/usuarios" element={<UsuariosManager />} />
              <Route path="/mantenedores/medidas-formativas" element={<MedidasFormativasManager />} />
              <Route path="/mantenedores/sanciones" element={<SancionesManager />} />
              
              {/* Rutas de Operaciones */}
              <Route path="/operaciones/reportar" element={<ReportarIncidente />} />
              <Route path="/operaciones/reportes" element={<GestionReportes />} />
              <Route path="/operaciones/urgentes" element={<ReportesUrgentes />} />
              
              {/* Rutas del Sistema de Protocolos */}
              <Route path="/protocolos" element={<ProtocolosDashboard />} />
              <Route path="/protocolos/gestion" element={<ProtocolosManager />} />
              <Route path="/protocolos/seguimiento" element={<ProcesoTracker />} />
              <Route path="/protocolos/anonimato" element={<AnonimatoManager />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  </ThemeProvider>
);
}

export default App;
