/* eslint-disable testing-library/no-wait-for-side-effects */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sweetService from '../../services/sweetService';
import Sweet from './Sweet';

// Mock the sweetService
jest.mock('../../services/sweetService');

const mockSweets = [
  {
    _id: '1',
    name: 'Chocolate Bar',
    category: 'Chocolate',
    price: 2.99,
    quantity: 100
  },
  {
    _id: '2',
    name: 'Gummy Bears',
    category: 'Candy',
    price: 1.99,
    quantity: 150
  }
];

describe('Sweet Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the getAllSweets function
    sweetService.getAllSweets.mockResolvedValue(mockSweets);
  });

  it('renders sweet list successfully', async () => {
    render(<Sweet />);
    
    // Wait for sweets to be loaded
    await waitFor(() => {
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText('Gummy Bears')).toBeInTheDocument();
    });
  });

  it('opens add sweet dialog when clicking add button', async () => {
    render(<Sweet />);
    
    const addButton = screen.getByText('Add New Sweet');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Add New Sweet')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
  });

  it('adds new sweet successfully', async () => {
    const newSweet = {
      name: 'New Sweet',
      category: 'Chocolate',
      price: '3.99',
      quantity: '50'
    };

    sweetService.addSweet.mockResolvedValue({
      _id: '3',
      ...newSweet,
      price: parseFloat(newSweet.price),
      quantity: parseInt(newSweet.quantity)
    });

    render(<Sweet />);
    
    // Open add dialog
    fireEvent.click(screen.getByText('Add New Sweet'));
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Name'), newSweet.name);
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: newSweet.category } });
    await userEvent.type(screen.getByLabelText('Price'), newSweet.price);
    await userEvent.type(screen.getByLabelText('Quantity'), newSweet.quantity);
    
    // Submit form
    fireEvent.click(screen.getByText('Add Sweet'));
    
    await waitFor(() => {
      expect(sweetService.addSweet).toHaveBeenCalledWith({
        name: newSweet.name,
        category: newSweet.category,
        price: parseFloat(newSweet.price),
        quantity: parseInt(newSweet.quantity)
      });
    });
  });

  it('deletes sweet successfully', async () => {
    sweetService.deleteSweet.mockResolvedValue({ message: 'Sweet deleted successfully' });
    
    render(<Sweet />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      fireEvent.click(deleteButtons[0]);
    });
    
    await waitFor(() => {
      expect(sweetService.deleteSweet).toHaveBeenCalledWith('1');
    });
  });

  it('searches sweets successfully', async () => {
    const searchResults = [mockSweets[0]];
    sweetService.searchSweets.mockResolvedValue(searchResults);
    
    render(<Sweet />);
    
    // Enter search criteria
    await userEvent.type(screen.getByLabelText('Search by name'), 'Chocolate');
    
    // Click search button
    fireEvent.click(screen.getByText('Search'));
    
    await waitFor(() => {
      expect(sweetService.searchSweets).toHaveBeenCalledWith({
        name: 'Chocolate',
        category: '',
        minPrice: '',
        maxPrice: ''
      });
    });
  });

  it('sorts sweets successfully', async () => {
    const sortedSweets = [...mockSweets].sort((a, b) => a.price - b.price);
    sweetService.getAllSweets.mockResolvedValue(sortedSweets);
    
    render(<Sweet />);
    
    // Change sort option
    fireEvent.change(screen.getByLabelText('Sort By'), { target: { value: 'price' } });
    
    await waitFor(() => {
      expect(sweetService.getAllSweets).toHaveBeenCalledWith('price');
    });
  });

  it('handles purchase successfully', async () => {
    sweetService.purchaseSweet.mockResolvedValue({
      ...mockSweets[0],
      quantity: mockSweets[0].quantity - 1
    });
    
    render(<Sweet />);
    
    await waitFor(() => {
      const purchaseButtons = screen.getAllByTestId('RemoveIcon');
      fireEvent.click(purchaseButtons[0]);
    });
    
    await waitFor(() => {
      expect(sweetService.purchaseSweet).toHaveBeenCalledWith('1', 1);
    });
  });

  it('handles restock successfully', async () => {
    sweetService.restockSweet.mockResolvedValue({
      ...mockSweets[0],
      quantity: mockSweets[0].quantity + 10
    });
    
    render(<Sweet />);
    
    await waitFor(() => {
      const restockButtons = screen.getAllByTestId('AddIcon');
      fireEvent.click(restockButtons[0]);
    });
    
    await waitFor(() => {
      expect(sweetService.restockSweet).toHaveBeenCalledWith('1', 10);
    });
  });
});