import {
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSweetContext } from '../context/SweetContext';
import './EditSweet.css';

function EditSweet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSweetById, updateSweet } = useSweetContext();
  
  const [formState, setFormState] = useState({ 
    id: null,
    name: '', 
    price: '', 
    category: '',
    quantity: '',
    createdAt: null,
    totalValue: 0,
    status: '',
    popularity: 0,
    lastUpdated: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [originalValues, setOriginalValues] = useState({});


  const categories = ['Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based'];

  useEffect(() => {
    // MongoDB uses string IDs, so we should not parse the ID as an integer
    const sweet = getSweetById(id);
    if (sweet) {
      setFormState(sweet);
      setOriginalValues({
        price: sweet.price,
        quantity: sweet.quantity,
        totalValue: sweet.totalValue,
        popularity: sweet.popularity
      });
    } else {
      setError('Sweet not found');
    }
    setLoading(false);
  }, [id, getSweetById]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.price || !formState.category || !formState.quantity) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      updateSweet(formState);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError('Failed to update sweet');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Well Stocked': return 'success';
      case 'In Stock': return 'primary';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={48} />
        <Typography variant="h6" className="loading-text">
          Loading sweet details...
        </Typography>
      </div>
    );
  }

  if (error && !formState.name) {
    return (
      <div className="error-container">
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleBack}
          className="back-to-home-button"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="edit-sweet-container">
      <Fade in={true} timeout={600}>
        <Card className="edit-sweet-card">
          <CardContent className="edit-sweet-content">
            <div className="edit-header">
              <IconButton 
                onClick={handleBack}
                className="back-button"
                size="large"
              >
                <ArrowBackIcon />
              </IconButton>
              <div className="header-content">
                <div className="header-icon">
                  <EditIcon />
                </div>
                <div className="header-text">
                  <Typography variant="h5" className="edit-title">
                    Edit Sweet
                  </Typography>
                  <Typography variant="body2" className="edit-subtitle">
                    Update "{formState.name}"
                  </Typography>
                </div>
              </div>
            </div>
            

            
            {/* Real-time Status Display */}
            <div className="status-display">
              <div className="status-item">
                <Typography variant="body2" className="status-label">Current Status:</Typography>
                <Chip 
                  label={formState.status}
                  color={getStatusColor(formState.status)}
                  size="small"
                />
              </div>
              <div className="status-item">
                <Typography variant="body2" className="status-label">Total Value:</Typography>
                <Typography variant="body2" className="status-value">
                  {formState.totalValue?.toFixed(2)}
                </Typography>
              </div>
              <div className="status-item">
                <Typography variant="body2" className="status-label">Popularity:</Typography>
                <Typography variant="body2" className="status-value">
                  {formState.popularity?.toFixed(0)}%
                </Typography>
              </div>
              <div className="status-item">
                <Typography variant="body2" className="status-label">Last Updated:</Typography>
                <Typography variant="body2" className="status-value">
                  <TimeIcon className="time-icon" />
                  {formatTimeAgo(formState.lastUpdated)}
                </Typography>
              </div>
            </div>
            
            {error && (
              <Alert severity="error" className="form-alert">
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" className="form-alert">
                Sweet updated successfully! Redirecting...
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="edit-form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sweet Name (Manual Edit)"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    className="edit-field"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" className="edit-field" required>
                    <InputLabel>Category (Manual Edit)</InputLabel>
                    <Select
                      name="category"
                      value={formState.category}
                      onChange={handleInputChange}
                      label="Category (Manual Edit)"
                    >
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price (₹) - Auto-adjusts based on demand"
                    name="price"
                    type="number"
                    value={formState.price}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    className="edit-field"
                    inputProps={{ step: "0.01", min: "0" }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity - Decreases from simulated sales"
                    name="quantity"
                    type="number"
                    value={formState.quantity}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    className="edit-field"
                    inputProps={{ min: "0" }}
                    required
                  />
                </Grid>
              </Grid>
              

              
              <div className="form-actions">
                <Button 
                  type="button"
                  variant="outlined" 
                  onClick={handleBack}
                  className="cancel-button"
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  className="save-button"
                  startIcon={<SaveIcon />}
                  disabled={success}
                >
                  {success ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
}

export default EditSweet;