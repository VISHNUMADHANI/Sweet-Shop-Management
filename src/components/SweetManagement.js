import {
  Add as AddIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  Store as StoreIcon,
  AccessTime as TimeIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSweetContext } from '../context/SweetContext';
import './SweetManagement.css';

function SweetManagement() {
  const { sweets, addSweet, deleteSweet } = useSweetContext();
  const navigate = useNavigate();
  
  const [formState, setFormState] = useState({ 
    name: '', 
    price: '', 
    category: '',
    quantity: '' 
  });
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ['Chocolate', 'Candy', 'Pastry', 'Nut-Based', 'Milk-Based'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    return sweets.filter(sweet => {
      const matchesName = searchCriteria.name 
        ? sweet.name.toLowerCase().includes(searchCriteria.name.toLowerCase())
        : true;
      const matchesCategory = searchCriteria.category 
        ? sweet.category === searchCriteria.category
        : true;
      const matchesMinPrice = searchCriteria.minPrice 
        ? sweet.price >= parseFloat(searchCriteria.minPrice)
        : true;
      const matchesMaxPrice = searchCriteria.maxPrice 
        ? sweet.price <= parseFloat(searchCriteria.maxPrice)
        : true;
      
      return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  };

  const handleSort = (sweetsToSort) => {
    if (!sortBy) return sweetsToSort;
    
    return [...sweetsToSort].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === '-name') return b.name.localeCompare(a.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === '-price') return b.price - a.price;
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      if (sortBy === '-quantity') return b.quantity - a.quantity;
      return 0;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formState.name || !formState.price || !formState.category || !formState.quantity) return;

  try {
    await addSweet(formState);
    setFormState({ name: '', price: '', category: '', quantity: '' });
    setShowAddForm(false);
  } catch (err) {
    const message = err.response?.data?.message || 'Something went wrong';
    alert(message); // Show popup box
  }
};

  const handleEditClick = (sweet) => {
    navigate(`/edit/${sweet._id || sweet.id}`);
  };

  const handleDeleteClick = (sweet) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      deleteSweet(sweet._id || sweet.id);
    }
  };

  const clearFilters = () => {
    setSearchCriteria({ name: '', category: '', minPrice: '', maxPrice: '' });
    setSortBy('');
  };

  const filteredAndSortedSweets = handleSort(handleSearch());

  // Statistics
  const totalSweets = sweets.length;
  const lowStockItems = sweets.filter(sweet => sweet.quantity < 5).length;
  const outOfStockItems = sweets.filter(sweet => sweet.quantity === 0).length;


  const getStatusColor = (status) => {
    switch (status) {
      case 'Well Stocked': return 'success';
      case 'In Stock': return 'primary';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'default';
    }
  };





  return (
    <div className="sweet-management-container">
      {/* Real-time Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <StoreIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalSweets}</div>
            <div className="stat-label">Total Products</div>
            <div className="stat-change">
              <TimeIcon className="time-icon" />
              Live Count
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <InventoryIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{lowStockItems}</div>
            <div className="stat-label">Low Stock</div>
            <div className="stat-change">
              <TrendingDownIcon className="trend-icon" />
              {outOfStockItems} out of stock
            </div>
          </div>
        </div>

      </div>

      {/* Add Sweet Section */}
      <Card className="add-sweet-card">
        <CardContent className="add-sweet-content">
          <div className="add-sweet-header">
            <div className="add-sweet-title-section">
              <div className="add-sweet-icon">
                <AddIcon />
              </div>
              <div>
                <Typography variant="h6" className="add-sweet-title">
                  Add New Sweet
                </Typography>
                <Typography variant="body2" className="add-sweet-subtitle">
                  Bring a new flavor to your sweet shop.
                </Typography>
              </div>
            </div>
            <Button
              variant="contained"
              className="toggle-form-button"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add New Sweet'}
            </Button>
          </div>
          
          <Collapse in={showAddForm}>
            <Divider className="form-divider" />
            <form onSubmit={handleSubmit} className="add-sweet-form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sweet Name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" className="form-field" required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formState.category}
                      onChange={handleInputChange}
                      label="Category"
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
                    label="Price (₹) "
                    name="price"
                    type="number"
                    value={formState.price}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    inputProps={{ step: "0.01", min: "0" }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity "
                    name="quantity"
                    type="number"
                    value={formState.quantity}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    className="form-field"
                    inputProps={{ min: "0" }}
                    required
                  />
                </Grid>
              </Grid>
              
              <div className="form-actions">
                <Button 
                  type="submit" 
                  variant="contained" 
                  className="submit-button"
                  startIcon={<AddIcon />}
                >
                  Add Sweet (Auto-values will be calculated)
                </Button>
              </div>
            </form>
          </Collapse>
        </CardContent>
      </Card>

      {/* Inventory Section */}
      <Card className="inventory-card">
        <CardContent className="inventory-content">
          <div className="inventory-header">
            <div className="inventory-title-section">
              <div className="inventory-icon">
                <InventoryIcon />
              </div>
              <div>
                <Typography variant="h6" className="inventory-title">
                  Live Sweet Inventory ({filteredAndSortedSweets.length})
                </Typography>
                <Typography variant="body2" className="inventory-subtitle">
                  Real-time updates • Auto-pricing • Live stock tracking
                </Typography>
              </div>
            </div>
            <div className="inventory-actions">
              <Button
                variant="outlined"
                className="filter-button"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterIcon />}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              {(searchCriteria.name || searchCriteria.category || searchCriteria.minPrice || searchCriteria.maxPrice || sortBy) && (
                <Button
                  variant="outlined"
                  className="clear-button"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <Collapse in={showFilters}>
            <div className="search-controls">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Search by name"
                    name="name"
                    value={searchCriteria.name}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <SearchIcon className="search-icon" />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={searchCriteria.category}
                      onChange={handleSearchChange}
                      label="Category"
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    fullWidth
                    label="Min Price"
                    name="minPrice"
                    type="number"
                    value={searchCriteria.minPrice}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    fullWidth
                    label="Max Price"
                    name="maxPrice"
                    type="number"
                    value={searchCriteria.maxPrice}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Sort By"
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="name">Name (A-Z)</MenuItem>
                      <MenuItem value="-name">Name (Z-A)</MenuItem>
                      <MenuItem value="price">Price (Low to High)</MenuItem>
                      <MenuItem value="-price">Price (High to Low)</MenuItem>
                      <MenuItem value="quantity">Quantity (Low to High)</MenuItem>
                      <MenuItem value="-quantity">Quantity (High to Low)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </Collapse>

          <div className="sweets-list">
            {filteredAndSortedSweets.map((sweet) => (
              <div key={sweet.id} className="sweet-item">
                <div className="sweet-content">
                  <div className="sweet-header">
                    <Typography variant="h6" className="sweet-name">
                      {sweet.name}
                    </Typography>
                    <div className="sweet-badges">
                      <Chip 
                        label={sweet.category}
                        size="small"
                        className={`category-chip category-${sweet.category.toLowerCase().replace('-', '')}`}
                      />
                      <Chip 
                        label={sweet.status}
                        size="small"
                        color={getStatusColor(sweet.status)}
                        className="status-chip"
                      />
                    </div>
                  </div>
                  
                  <div className="sweet-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        {/* <MoneyIcon className="detail-icon price-icon" /> */}
                        <span className="detail-label">Price: ₹</span>
                        <span className="detail-value price-value">{sweet.price !== undefined && typeof sweet.price === 'number' ? sweet.price.toFixed(2) : '0.00'}</span>
                        
                      </div>
                      <div className="detail-item">
                        <InventoryIcon className="detail-icon quantity-icon" />
                        <span className="detail-label">Qty:</span>
                        <span className="detail-value">{sweet.quantity}</span>
                        {sweet.quantity < 5 && sweet.quantity > 0 && (
                          <span className="low-stock-indicator">Low Stock</span>
                        )}
                        
                      </div>
                    </div>
                    

                    

                  </div>
                </div>
                
                <div className="sweet-actions">
                  <Tooltip title="Edit Sweet">
                    <IconButton 
                      className="action-button edit-button"
                      onClick={() => handleEditClick(sweet)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Sweet">
                    <IconButton 
                      className="action-button delete-button"
                      onClick={() => handleDeleteClick(sweet)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedSweets.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <StoreIcon />
              </div>
              <Typography variant="h6" className="empty-title">
                No sweets found
              </Typography>
              <Typography variant="body2" className="empty-description">
                Try adjusting your search criteria or add a new sweet to get started.
                All values will update automatically once added!
              </Typography>
              <Button
                variant="contained"
                className="empty-action-button"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SweetManagement;