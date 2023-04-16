import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import AuthMock from '../../mocks/auth.json';

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe('Testing the palette routes module', () => {
  test('Calling create palette route with correct body should return created palette', async () => {
    const paletteData = {
      primaryColor: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
      secondaryColor: [],
      textColor: [],
      backgroundColors: [],
      extraColors: [],
    };
    const res = await request(app)
      .post(`/api/palette/`)
      .send(paletteData)
      .set(AuthMock);
    expect(res.body).toHaveProperty('primaryColor');
    expect(res.body).toHaveProperty('secondaryColor');
    expect(res.body).toHaveProperty('textColor');
    expect(res.body).toHaveProperty('backgroundColors');
    expect(res.body).toHaveProperty('extraColors');
    expect(res.statusCode).toBe(201);
    const { _id: id } = res.body;
    await request(app).delete(`/api/palette/${id}`).send().set(AuthMock);
  });

  test('Calling create palette route with incorrect body should return error message', async () => {
    const paletteData = {
      primaryColor: '',
      secondaryColor: [],
      textColor: [],
      backgroundColors: [],
      extraColors: [],
    };
    const res = await request(app)
      .post(`/api/palette/`)
      .send(paletteData)
      .set(AuthMock);
    expect(res.body.result).toBe(
      'primaryColor is of type string but should be object'
    );
    expect(res.statusCode).toBe(400);
  });

  test('Calling delete palette route with correct params should return successfully delete message', async () => {
    const paletteData = {
      primaryColor: [{ hexCode: '#FFFFFA' }, { hexCode: '#000001' }],
      secondaryColor: [],
      textColor: [],
      backgroundColors: [],
      extraColors: [],
    };
    const response = await request(app)
      .post(`/api/palette/`)
      .send(paletteData)
      .set(AuthMock);
    const { _id: id } = response.body;
    const res = await request(app)
      .delete(`/api/palette/${id}`)
      .send()
      .set(AuthMock);
    expect(res.body.message).toBe(
      `Palette with id: ${id} successfully removed`
    );
    expect(res.statusCode).toBe(200);
  });

  test('Calling delete palette route with incorrect id should return error message', async () => {
    const paletteData = {
      primaryColor: [{ hexCode: '#FFFFFA' }, { hexCode: '#000001' }],
      secondaryColor: [],
      textColor: [],
      backgroundColors: [],
      extraColors: [],
    };
    const response = await request(app)
      .post(`/api/palette/`)
      .send(paletteData)
      .set(AuthMock);
    const { _id: id } = response.body;
    const res = await request(app)
      .delete(`/api/palette/${'000000000000000000000000'}`)
      .send()
      .set(AuthMock);
    expect(res.body.message).toBe(
      'No palette with id: 000000000000000000000000'
    );
    expect(res.statusCode).toBe(404);
  });

  test('Calling update palette route with correct params and body should return updated message and new palette', async () => {
    const paletteData = {
      primaryColor: [{ hexCode: '#FFFFFC' }, { hexCode: '#000003' }],
      secondaryColor: [],
      textColor: [],
      backgroundColors: [],
      extraColors: [],
    };
    const updatedPaletteData = {
      primaryColor: [],
      secondaryColor: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
      textColor: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
      backgroundColors: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
      extraColors: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
    };
    const response = await request(app)
      .post(`/api/palette/`)
      .send(paletteData)
      .set(AuthMock);
    const { _id: id } = response.body;
    const res = await request(app)
      .patch(`/api/palette/${id}`)
      .send(updatedPaletteData)
      .set(AuthMock);
    expect(res.body).toHaveProperty('acknowledged');
    expect(res.body).toHaveProperty('modifiedCount');
    expect(res.body).toHaveProperty('upsertedId');
    expect(res.body).toHaveProperty('upsertedCount');
    expect(res.body).toHaveProperty('matchedCount');
    expect(res.statusCode).toBe(200);
    await request(app).delete(`/api/palette/${id}`).send().set(AuthMock);
  });

  test('Calling update palette route with incorrect id return error message', async () => {
    const paletteData = {
      primaryColor: [{ hexCode: '#FFFFFC' }, { hexCode: '#000003' }],
      secondaryColor: [],
      textColor: [],
      backgroundColors: [],
      extraColors: [],
    };
    const updatedPaletteData = {
      primaryColor: [],
      secondaryColor: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
      textColor: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
      backgroundColors: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
      extraColors: [{ hexCode: '#FFFFFF' }, { hexCode: '#000000' }],
    };
    const response = await request(app)
      .post(`/api/palette/`)
      .send(paletteData)
      .set(AuthMock);
    const { _id: id } = response.body;
    const res = await request(app)
      .patch(`/api/palette/${'000000000000000000000000'}`)
      .send(updatedPaletteData)
      .set(AuthMock);
    expect(res.body.message).toBe(
      'No palette with id: 000000000000000000000000'
    );
    expect(res.statusCode).toBe(404);
    await request(app).delete(`/api/palette/${id}`).send().set(AuthMock);
  });
});
