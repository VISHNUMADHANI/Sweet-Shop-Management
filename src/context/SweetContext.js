import { createContext, useContext, useState, useEffect } from 'react';
import sweetService from '../services/sweetService';

const SweetContext = createContext();

export const useSweetContext = () => {
  const context = useContext(SweetContext);
  if (!context) {
    throw new Error('useSweetContext must be used within a SweetProvider');
  }
  return context;
};

export const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]);

  const fetchSweets = async () => {
    try {
      const data = await sweetService.getAllSweets();
      setSweets(data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    }
  };

  // Fetch sweets when component mounts
  useEffect(() => {
    fetchSweets();
  }, []);

  // Auto-update functions
  const calculateTotalValue = (price, quantity) => {
    return parseFloat((parseFloat(price) * parseInt(quantity)).toFixed(2));
  };

  const determineStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 5) return 'Low Stock';
    if (quantity < 50) return 'In Stock';
    return 'Well Stocked';
  };





  const addSweet = async (sweetData) => {
    try {
      const totalValue = calculateTotalValue(sweetData.price, sweetData.quantity);
      const status = determineStatus(parseInt(sweetData.quantity));
      const newSweet = {
        ...sweetData,
        price: parseFloat(sweetData.price),
        quantity: parseInt(sweetData.quantity),
        totalValue: parseFloat(totalValue),
        status: status
      };

      const response = await sweetService.addSweet(newSweet);
      setSweets(prev => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error adding sweet:', error);
      throw error;
    }
  };

  const updateSweet = async (updatedSweet) => {
    try {
      const totalValue = calculateTotalValue(updatedSweet.price, updatedSweet.quantity);
      const status = determineStatus(parseInt(updatedSweet.quantity));

      const sweetData = {
        ...updatedSweet,
        price: parseFloat(updatedSweet.price),
        quantity: parseInt(updatedSweet.quantity),
        totalValue: parseFloat(totalValue),
        status: status
      };

      // Use the _id from MongoDB instead of id
      const id = updatedSweet._id || updatedSweet.id;
      const response = await sweetService.updateSweet(id, sweetData);

      setSweets(prev => prev.map(sweet => 
        (sweet._id === id || sweet.id === id) ? response : sweet
      ));
      return response;
    } catch (error) {
      console.error('Error updating sweet:', error);
      throw error;
    }
  };

  const deleteSweet = async (id) => {
    try {
      await sweetService.deleteSweet(id);
      setSweets(prev => prev.filter(sweet => sweet._id !== id && sweet.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting sweet:', error);
      throw error;
    }
  };

  const getSweetById = (id) => {
    return sweets.find(sweet => sweet._id === id || sweet.id === id);
  };

  const purchaseSweet = async (id, quantity) => {
    try {
      const response = await sweetService.purchaseSweet(id, quantity);
      setSweets(prev => prev.map(sweet => 
        (sweet._id === id || sweet.id === id) ? response : sweet
      ));
      return response;
    } catch (error) {
      console.error('Error purchasing sweet:', error);
      throw error;
    }
  };

  const restockSweet = async (id, quantity) => {
    try {
      const response = await sweetService.restockSweet(id, quantity);
      setSweets(prev => prev.map(sweet => 
        (sweet._id === id || sweet.id === id) ? response : sweet
      ));
      return response;
    } catch (error) {
      console.error('Error restocking sweet:', error);
      throw error;
    }
  };

  return (
    <SweetContext.Provider value={{
      sweets,
      fetchSweets,
      addSweet,
      updateSweet,
      deleteSweet,
      getSweetById,
      purchaseSweet,
      restockSweet
    }}>
      {children}
    </SweetContext.Provider>
  );
};