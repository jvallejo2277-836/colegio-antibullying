import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ColegioProvider } from './context/ColegioContext';
import { useColegio } from './context/ColegioContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SelectorColegioActivo from './components/common/SelectorColegioActivo';
import ColegioSelector from './components/common/ColegioSelector';
import { useAuth } from './contexts/AuthContext';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
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
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
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

// Componentes
import Dashboard from './components/DashboardSimple';
import ProtocolosDashboard from './components/protocolos/ProtocolosDashboard';
import AntibullyingDashboard from './components/antibullying/AntibullyingDashboard';
import ReportesAntibullying from './components/reportes/ReportesAntibullying';
import ReportarIncidente from './components/reportes/ReportarIncidente';
import ColegiosManager from './components/mantenedores/ColegiosManager';

// Componentes placeholder para mantenedores
// Importar componentes de mantenedores
import TiposIncidenteManager from './components/mantenedores/TiposIncidenteManager';

// Componentes placeholder para otros mantenedores
const UsuariosManager = () => <div><h2>Gestión de Usuarios</h2><p>Mantenedor de usuarios en desarrollo...</p></div>;
const MedidasFormativasManager = () => <div><h2>Medidas Formativas</h2><p>Mantenedor de medidas formativas en desarrollo...</p></div>;
const SancionesManager = () => <div><h2>Sanciones</h2><p>Mantenedor de sanciones en desarrollo...</p></div>;

// Componentes placeholder para operaciones
const GestionReportes = () => <div><h2>Gestión de Reportes</h2><p>Sistema de gestión de reportes en desarrollo...</p></div>;
const ReportesUrgentes = () => <div><h2>Reportes Urgentes</h2><p>Vista de reportes urgentes en desarrollo...</p></div>;

// Componentes placeholder para protocolos
const ProtocolosManager = () => <div><h2>Gestión de Protocolos</h2><p>Mantenedor de protocolos flexibles en desarrollo...</p></div>;
const ProcesoTracker = () => <div><h2>Seguimiento de Procesos</h2><p>Tracker de procesos de protocolos en desarrollo...</p></div>;
const AnonimatoManager = () => <div><h2>Reglas de Anonimato</h2><p>Gestor de reglas de anonimato en desarrollo...</p></div>;

const drawerWidth = 280;

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

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { necesitaSeleccionColegio } = useColegio();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [operacionesOpen, setOperacionesOpen] = React.useState(false);
  const [protocolosOpen, setProtocolosOpen] = React.useState(false);
  const [mantenedoresAnchor, setMantenedoresAnchor] = React.useState<null | HTMLElement>(null);
  const [mostrarSelectorColegio, setMostrarSelectorColegio] = React.useState(false);

  // Mostrar selector si el usuario necesita seleccionar colegio
  React.useEffect(() => {
    if (necesitaSeleccionColegio) {
      setMostrarSelectorColegio(true);
    } else {
      setMostrarSelectorColegio(false);
    }
  }, [necesitaSeleccionColegio]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMantenedoresClick = (event: React.MouseEvent<HTMLElement>) => {
    setMantenedoresAnchor(event.currentTarget);
  };

  const handleMantenedoresClose = () => {
    setMantenedoresAnchor(null);
  };

  const handleMantenedoresNavigation = (path: string) => {
    navigate(path);
    handleMantenedoresClose();
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'Antibullying',
      icon: <WarningIcon />,
      path: '/antibullying',
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
          text: 'Reportes Antibullying',
          icon: <AssignmentIcon />,
          path: '/operaciones/reportes-antibullying',
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

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

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
                onClick={item.submenu ? item.onClick : () => handleNavigation(item.path!)}
                sx={item.submenu ? {} : { 
                  pl: 2,
                  backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent'
                }}
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
                  {item.children?.map((child) => (
                    <ListItem key={child.text} disablePadding>
                      <ListItemButton 
                        sx={{ 
                          pl: 4,
                          backgroundColor: location.pathname === child.path ? 'action.selected' : 'transparent'
                        }}
                        onClick={() => handleNavigation(child.path)}
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Convivencia Escolar - Chile
          </Typography>
          
          {/* Selector de Colegio Activo */}
          <ColegioSelector />
          
          {/* Mantenedores, Usuario y Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Menú Mantenedores */}
            <IconButton 
              color="inherit" 
              onClick={handleMantenedoresClick}
              title="Mantenedores del Sistema"
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              anchorEl={mantenedoresAnchor}
              open={Boolean(mantenedoresAnchor)}
              onClose={handleMantenedoresClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={() => handleMantenedoresNavigation('/mantenedores/colegios')}>
                <ListItemIcon>
                  <SchoolIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Colegios</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleMantenedoresNavigation('/mantenedores/tipos-incidente')}>
                <ListItemIcon>
                  <CategoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Tipos de Incidente</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleMantenedoresNavigation('/mantenedores/usuarios')}>
                <ListItemIcon>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Usuarios</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleMantenedoresNavigation('/mantenedores/medidas-formativas')}>
                <ListItemIcon>
                  <PsychologyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Medidas Formativas</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleMantenedoresNavigation('/mantenedores/sanciones')}>
                <ListItemIcon>
                  <GavelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sanciones</ListItemText>
              </MenuItem>
            </Menu>
            
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.username} - {user?.role_display}
            </Typography>
            <IconButton color="inherit" onClick={logout} title="Cerrar Sesión">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
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
          
          {/* Ruta de Antibullying */}
          <Route path="/antibullying" element={<AntibullyingDashboard />} />
          
          {/* Rutas de Mantenedores */}
          <Route path="/mantenedores/colegios" element={<ColegiosManager />} />
          <Route path="/mantenedores/tipos-incidente" element={<TiposIncidenteManager />} />
          <Route path="/mantenedores/usuarios" element={<UsuariosManager />} />
          <Route path="/mantenedores/medidas-formativas" element={<MedidasFormativasManager />} />
          <Route path="/mantenedores/sanciones" element={<SancionesManager />} />
          
          {/* Rutas de Operaciones */}
          <Route path="/operaciones/reportar" element={<ReportarIncidente />} />
          <Route path="/operaciones/reportes" element={<GestionReportes />} />
          <Route path="/operaciones/reportes-antibullying" element={<ReportesAntibullying />} />
          <Route path="/operaciones/urgentes" element={<ReportesUrgentes />} />
          
          {/* Rutas del Sistema de Protocolos */}
          <Route path="/protocolos" element={<ProtocolosDashboard />} />
          <Route path="/protocolos/gestion" element={<ProtocolosManager />} />
          <Route path="/protocolos/seguimiento" element={<ProcesoTracker />} />
          <Route path="/protocolos/anonimato" element={<AnonimatoManager />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
      
      {/* Selector de Colegio Activo */}
      <SelectorColegioActivo 
        open={mostrarSelectorColegio} 
        onClose={() => setMostrarSelectorColegio(false)}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ColegioProvider>
          <Router>
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          </Router>
        </ColegioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;