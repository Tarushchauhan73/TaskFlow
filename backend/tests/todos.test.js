const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Todo = require('../src/models/Todo');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await Todo.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Todo API', () => {
  test('GET /api/todos returns an empty array initially', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/todos creates a new todo', async () => {
    const res = await request(app).post('/api/todos').send({ title: 'Learn testing' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Learn testing');
    expect(res.body.completed).toBe(false);
  });

  test('POST /api/todos returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/todos').send({});
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/todos/:id returns the matching todo', async () => {
    const created = await Todo.create({ title: 'Test todo' });
    const res = await request(app).get(`/api/todos/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test todo');
  });

  test('GET /api/todos/:id returns 404 for a missing todo', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/todos/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/todos/:id updates title and completed', async () => {
    const created = await Todo.create({ title: 'Old title' });
    const res = await request(app)
      .put(`/api/todos/${created._id}`)
      .send({ title: 'New title', completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New title');
    expect(res.body.completed).toBe(true);
  });

  test('DELETE /api/todos/:id removes the todo', async () => {
    const created = await Todo.create({ title: 'Delete me' });
    const res = await request(app).delete(`/api/todos/${created._id}`);
    expect(res.statusCode).toBe(200);
    const found = await Todo.findById(created._id);
    expect(found).toBeNull();
  });
});
