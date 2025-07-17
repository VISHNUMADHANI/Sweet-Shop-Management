import { Add, Add as AddIcon, Delete as DeleteIcon, Remove } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import sweetService from '../../services/sweetService';

const categories = ['Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based'];

const Sweet = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Form states
  const [newSweet, setNewSweet] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  // Search and sort states
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchSweets();
  }, [sortBy]);

  const fetchSweets = async () => {
    try {
      const data = await sweetService.getAllSweets(sortBy);
      setSweets(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch sweets');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await sweetService.searchSweets(searchCriteria);
      setSweets(data);
    } catch (err) {
      showNotification('Search failed', 'error');
    }
  };

  const handleAddSweet = async () => {
    try {
      await sweetService.addSweet({
        ...newSweet,
        price: parseFloat(newSweet.price),
        quantity: parseInt(newSweet.quantity)
      });
      setOpenDialog(false);
      showNotification('Sweet added successfully');
      fetchSweets();
      setNewSweet({ name: '', category: '', price: '', quantity: '' });
    } catch (err) {
      showNotification('Failed to add sweet', 'error');
    }
  };

  const handleDeleteSweet = async (id) => {
    try {
      await sweetService.deleteSweet(id);
      showNotification('Sweet deleted successfully');
      fetchSweets();
    } catch (err) {
      showNotification('Failed to delete sweet', 'error');
    }
  };

  const handlePurchase = async (id, currentQuantity) => {
    try {
      await sweetService.purchaseSweet(id, 1);
      showNotification('Purchase successful');
      fetchSweets();
    } catch (err) {
      showNotification('Purchase failed', 'error');
    }
  };

  const handleRestock = async (id) => {
    try {
      await sweetService.restockSweet(id, 10);
      showNotification('Restock successful');
      fetchSweets();
    } catch (err) {
      showNotification('Restock failed', 'error');
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Sweet Shop Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 2 }}
        >
          Add New Sweet
        </Button>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search by name"
              value={searchCriteria.name}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={searchCriteria.category}
                label="Category"
                onChange={(e) => setSearchCriteria({ ...searchCriteria, category: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={searchCriteria.minPrice}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, minPrice: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={searchCriteria.maxPrice}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, maxPrice: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ height: '100%' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="price">Price (Low to High)</MenuItem>
            <MenuItem value="-price">Price (High to Low)</MenuItem>
            <MenuItem value="quantity">Quantity (Low to High)</MenuItem>
            <MenuItem value="-quantity">Quantity (High to Low)</MenuItem>
            <MenuItem value="name">Name (A-Z)</MenuItem>
            <MenuItem value="-name">Name (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {sweets.map((sweet) => (
          <Grid item xs={12} sm={6} md={4} key={sweet._id || sweet.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{sweet.name}</Typography>
                <Typography color="textSecondary">{sweet.category}</Typography>
                <Typography>Price: {sweet.price.toFixed(2)}</Typography>
                <Typography>
                  In Stock: {sweet.quantity}
                  {sweet.quantity < 5 && sweet.quantity > 0 && (
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#f97316',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      marginLeft: '0.5rem',
                    }}>Low Stock</span>
                  )}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => handlePurchase(sweet._id || sweet.id)}
                      disabled={sweet.quantity === 0}
                    >
                      <Remove />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleRestock(sweet._id || sweet.id)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteSweet(sweet._id || sweet.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Sweet</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newSweet.name}
            onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newSweet.category}
              label="Category"
              onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={newSweet.price}
            onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={newSweet.quantity}
            onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSweet} variant="contained">
            Add Sweet
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Sweet;