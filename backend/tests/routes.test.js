/* eslint-env jest */
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Sweet = require('../models/Sweet');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Sweet.deleteMany({});
});

describe('Sweet Shop API', () => {
  describe('POST /sweets', () => {
    it('should create a new sweet', async () => {
      const sweetData = {
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      const response = await request(app)
        .post('/sweets')
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.category).toBe(sweetData.category);
      expect(response.body.price).toBe(sweetData.price);
      expect(response.body.quantity).toBe(sweetData.quantity);
    });

    it('should return 400 for invalid sweet data', async () => {
      const invalidData = {
        name: 'Bad Sweet',
        category: 'Invalid',
        price: -1
      };

      await request(app)
        .post('/sweets')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.99, quantity: 100 },
        { name: 'Gummy Bears', category: 'Candy', price: 1.99, quantity: 150 },
        { name: 'Almond Cookies', category: 'Nut-Based', price: 3.99, quantity: 50 }
      ]);
    });

    it('should return all sweets', async () => {
      const res = await request(app).get('/sweets').expect(200);
      expect(res.body).toHaveLength(3);
    });

    it('should search sweets by name', async () => {
      const res = await request(app).get('/sweets/search?name=Chocolate').expect(200);
      expect(res.body[0].name).toBe('Chocolate Bar');
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/sweets/search?category=Candy').expect(200);
      expect(res.body[0].category).toBe('Candy');
    });

    it('should filter by price range', async () => {
      const res = await request(app).get('/sweets/search?minPrice=2&maxPrice=3').expect(200);
      expect(res.body[0].name).toBe('Chocolate Bar');
    });

    it('should sort ascending', async () => {
      const res = await request(app).get('/sweets?sort=price').expect(200);
      expect(res.body[0].name).toBe('Gummy Bears');
    });

    it('should sort descending', async () => {
      const res = await request(app).get('/sweets?sort=-price').expect(200);
      expect(res.body[0].name).toBe('Almond Cookies');
    });
  });

  describe('DELETE /sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Delete Me',
        category: 'Candy',
        price: 2,
        quantity: 10
      });
      sweetId = sweet._id;
    });

    it('should delete a sweet', async () => {
      await request(app).delete(`/sweets/${sweetId}`).expect(200);
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should return 404 if not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).delete(`/sweets/${fakeId}`).expect(404);
    });
  });

  describe('POST /sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Purchase Me',
        category: 'Chocolate',
        price: 2.99,
        quantity: 50
      });
      sweetId = sweet._id;
    });

    it('should decrease quantity', async () => {
      const res = await request(app)
        .post(`/sweets/${sweetId}/purchase`)
        .send({ quantity: 10 })
        .expect(200);
      expect(res.body.quantity).toBe(40);
    });

    it('should return 400 if too much', async () => {
      await request(app)
        .post(`/sweets/${sweetId}/purchase`)
        .send({ quantity: 100 })
        .expect(400);
    });
  });

  describe('POST /sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Restock Me',
        category: 'Pastry',
        price: 3,
        quantity: 20
      });
      sweetId = sweet._id;
    });

    it('should increase quantity', async () => {
      const res = await request(app)
        .post(`/sweets/${sweetId}/restock`)
        .send({ quantity: 30 })
        .expect(200);
      expect(res.body.quantity).toBe(50);
    });

    it('should reject negative quantity', async () => {
      await request(app)
        .post(`/sweets/${sweetId}/restock`)
        .send({ quantity: -5 })
        .expect(400);
    });
  });

  describe('PUT /sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Update Me',
        category: 'Candy',
        price: 1.50,
        quantity: 20
      });
      sweetId = sweet._id;
    });

    it('should update a sweet successfully', async () => {
      const updatedData = {
        name: 'Updated Sweet',
        category: 'Chocolate',
        price: 2.00,
        quantity: 25
      };

      const res = await request(app)
        .put(`/sweets/${sweetId}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.name).toBe(updatedData.name);
      expect(res.body.category).toBe(updatedData.category);
      expect(res.body.price).toBe(updatedData.price);
      expect(res.body.quantity).toBe(updatedData.quantity);

      const sweetInDb = await Sweet.findById(sweetId);
      expect(sweetInDb.name).toBe(updatedData.name);
    });

    it('should return 404 if sweet not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/sweets/${fakeId}`)
        .send({ name: 'Non Existent' })
        .expect(404);
    });

    it('should return 400 for invalid update data', async () => {
      await request(app)
        .put(`/sweets/${sweetId}`)
        .send({ price: -10 })
        .expect(400);
    });

    it('should return 400 for duplicate name', async () => {
      await Sweet.create({
        name: 'Existing Sweet',
        category: 'Candy',
        price: 1.00,
        quantity: 10
      });

      await request(app)
        .put(`/sweets/${sweetId}`)
        .send({ name: 'Existing Sweet' })
        .expect(400);
    });
  });
});
