# Sweet Shop Management System

A comprehensive MERN stack application for managing a sweet shop's inventory with Test-Driven Development (TDD) approach.

## Features

- Add, delete, and manage sweets inventory
- Search and filter sweets by name, category, and price
- Purchase and restock functionality
- Sort sweets by various criteria
- Responsive UI with modern design



## Development Setup

1. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
├── backend/           # Backend server code
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── tests/        # Backend tests
│   └── server.js     # Server entry point

```

## Testing

This project follows Test-Driven Development (TDD) principles:

1. Write failing tests first
2. Implement the feature
3. Refactor the code

Test coverage includes:
- Unit tests for components and functions
- Integration tests for API endpoints
- Edge cases and error handling

## Sweet Model

```javascript
{
  id: String,          // Auto-generated unique ID
  name: String,        // Sweet name
  category: String,    // Category (Chocolate/Candy/Pastry/etc)
  price: Number,       // Price per unit
  quantity: Number     // Current stock quantity
}
```
