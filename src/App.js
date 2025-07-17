import { Store } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import EditSweet from './components/EditSweet';
import SweetManagement from './components/SweetManagement';
import { SweetProvider } from './context/SweetContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SweetProvider>
        <Router>
          <div className="app-container">
            <AppBar position="static" className="app-header" elevation={0}>
              <Toolbar className="app-toolbar">
                <Box className="header-content">
                  <div className="header-logo">
                    <Store className="header-icon" />
                  </div>
                  <div className="header-text">
                    <Typography variant="h6" className="header-title">
                      Sweet Shop Management
                    </Typography>
                    <Typography variant="body2" className="header-subtitle">
                      Professional Inventory System
                    </Typography>
                  </div>
                </Box>
                <div className="header-status">
                  <div className="status-indicator"></div>
                  <Typography variant="body2" className="status-text">
                    System Online
                  </Typography>
                </div>
              </Toolbar>
            </AppBar>
            
            <main className="main-content">
              <Container maxWidth="xl" className="main-container">
                <Routes>
                  <Route path="/" element={<SweetManagement />} />
                  <Route path="/edit/:id" element={<EditSweet />} />
                </Routes>
              </Container>
            </main>
          </div>
        </Router>
      </SweetProvider>
    </ThemeProvider>
  );
}

export default App;