import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe('Testing the user routes module', () => {
  test('Calling register route with correct password should return a token', async () => {
    const userData = {
      name: 'User',
      email: `test.${Math.random().toString(36).slice(2)}@test.com`,
      password: 'Password$',
    };
    const res = await request(app).post('/api/users').send(userData);
    expect(res.body.token).toBeDefined();
    expect(res.status).toBe(201);
  });

  test('Calling register route with incorrect password (less than 8 characters) should return an error', async () => {
    const userData = {
      name: 'User',
      email: 'user',
      password: 'pa',
    };
    const res = await request(app).post('/api/users').send(userData);
    expect(res.body.message).toBe(
      'Password must have at least 8 characters'
    );
    expect(res.status).toBe(400);
  });

  test('Calling register route with incorrect password (with no uppercase letter) should return an error', async () => {
    const userData = {
      name: 'User',
      email: 'user',
      password: 'password$',
    };
    const res = await request(app).post('/api/users').send(userData);
    expect(res.body.message).toBe(
      'The password must contain at least one uppercase letter, one lowercase letter, and one special character (., -, *, $, #, etc)'
    );
    expect(res.status).toBe(400);
  });

  test('Calling register route with incorrect password (with no lowercase letter) should return an error', async () => {
    const userData = {
      name: 'User',
      email: 'user',
      password: 'PASSWORD$',
    };
    const res = await request(app).post('/api/users').send(userData);
    expect(res.body.message).toBe(
      'The password must contain at least one uppercase letter, one lowercase letter, and one special character (., -, *, $, #, etc)'
    );
    expect(res.status).toBe(400);
  });

  test('Calling register route with incorrect password (with no special character) should return an error', async () => {
    const userData = {
      name: 'User',
      email: 'user',
      password: 'Password',
    };
    const res = await request(app).post('/api/users').send(userData);
    expect(res.body.message).toBe(
      'The password must contain at least one uppercase letter, one lowercase letter, and one special character (., -, *, $, #, etc)'
    );
    expect(res.status).toBe(400);
  });

  test('Calling register route with correct body and Google ID should return a token', async () => {
    const userData = {
      name: 'User',
      email: `test.${Math.random().toString(36).slice(2)}@test.com`,
      password: 'Password$',
      googleId: Math.random().toString(10).substring(2, 23),
    };
    const res = await request(app).post('/api/users').send(userData);
    expect(res.body.token).toBeDefined();
    expect(res.status).toBe(201);
  });

  test('Calling login route with correct data and Google ID should return a token', async () => {
    const googleId = Math.random().toString(10).substring(2, 23);
    const userRegisterData = {
      name: 'User',
      email: `test.${Math.random().toString(36).slice(2)}@test.com`,
      password: 'Password$',
      googleId,
    };
    await request(app).post('/api/users').send(userRegisterData);

    const userData = {
      googleId,
    };
    const res = await request(app).post('/api/users/login').send(userData);
    expect(res.body.token).toBeDefined();
    expect(res.status).toBe(200);
  });

  test('Calling login route with invalid Google ID should return an error message', async () => {
    const googleId = Math.random().toString(10).substring(2, 23);
    const userData = {
      googleId,
    };
    
    const res = await request(app).post('/api/users/login').send(userData);
    expect(res.body.message).toBe('User with associated Google ID not found');
    expect(res.status).toBe(400);
  });

  test('Calling login route with correct data and without a Google ID should return a token', async () => {
    const userEmail = `test.${Math.random().toString(36).slice(2)}@test.com`;
    const userRegisterData = {
      name: 'User',
      email: userEmail,
      password: 'Password$',
    };
    await request(app).post('/api/users').send(userRegisterData);

    const userData = {
      email: userEmail,
      password: 'Password$',
    };
    const res = await request(app).post('/api/users/login').send(userData);
    expect(res.body.token).toBeDefined();
    expect(res.status).toBe(200);
  });

  test('Calling login route with invalid email and password should return an error message', async () => {
    const userData = {
      email: 'user@test',
      password: 'password',
    };
    
    const res = await request(app).post('/api/users/login').send(userData);
    expect(res.body.message).toBe('Invalid email or password');
    expect(res.status).toBe(400);
  });
});
