# Sweet Shop Management System

A comprehensive MERN stack application for managing a sweet shop's inventory with Test-Driven Development (TDD) approach.

## Features

- Add, delete, and manage sweets inventory
- Search and filter sweets by name, category, and price
- Purchase and restock functionality
- Sort sweets by various criteria
- Responsive UI with modern design

## Tech Stack

- MongoDB - Database
- Express.js - Backend framework
- React.js - Frontend library
- Node.js - Runtime environment
- Jest + Supertest - Backend testing
- React Testing Library - Frontend testing
- Mongoose - MongoDB ODM

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /sweets | Add new sweet |
| GET | /sweets | List all sweets |
| GET | /sweets/search | Search sweets |
| DELETE | /sweets/:id | Delete sweet |
| POST | /sweets/:id/purchase | Purchase sweet |
| POST | /sweets/:id/restock | Restock sweet |
| PUT | /sweets/:id | Update sweet |

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Run tests:
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
├── src/              # Frontend React code
│   ├── components/   # React components
│   ├── services/     # API services
│   ├── tests/        # Frontend tests
│   └── App.js        # Main App component
└── package.json      # Project dependencies
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
