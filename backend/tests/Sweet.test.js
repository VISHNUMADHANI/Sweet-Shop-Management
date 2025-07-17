/* eslint-env jest */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Sweet = require('../models/Sweet');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
    await Sweet.syncIndexes();
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Sweet.deleteMany();
});

describe('Sweet Model Test', () => {
  it('should create & save sweet successfully', async () => {
    const validSweet = new Sweet({
      name: 'Chocolate Truffle',
      category: 'Chocolate',
      price: 2.99,
      quantity: 100
    });
    const savedSweet = await validSweet.save();

    expect(savedSweet._id).toBeDefined();
    expect(savedSweet.name).toBe(validSweet.name);
    expect(savedSweet.category).toBe(validSweet.category);
    expect(savedSweet.price).toBe(validSweet.price);
    expect(savedSweet.quantity).toBe(validSweet.quantity);
  });

  it('should fail to save sweet without required fields', async () => {
    const sweet = new Sweet({ name: 'Test Sweet' });
    let err;
    try {
      await sweet.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save sweet with invalid category', async () => {
    const sweet = new Sweet({
      name: 'Invalid Sweet',
      category: 'Invalid',
      price: 1.99,
      quantity: 10
    });
    let err;
    try {
      await sweet.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.category).toBeDefined();
  });

  it('should fail to save sweet with negative price', async () => {
    const sweet = new Sweet({
      name: 'Negative Price Sweet',
      category: 'Chocolate',
      price: -5,
      quantity: 10
    });
    let err;
    try {
      await sweet.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.price).toBeDefined();
  });

  it('should fail to save sweet with negative quantity', async () => {
    const sweet = new Sweet({
      name: 'Negative Quantity Sweet',
      category: 'Chocolate',
      price: 5,
      quantity: -10
    });
    let err;
    try {
      await sweet.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.quantity).toBeDefined();
  });

  it('should fail to save duplicate sweet name', async () => {
    const sweet1 = new Sweet({
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.99,
      quantity: 100
    });
    await sweet1.save();

    const sweet2 = new Sweet({
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 3.99,
      quantity: 50
    });
    let err;
    try {
      await sweet2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });
});