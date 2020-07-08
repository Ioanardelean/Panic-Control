import request from 'supertest';
import app from '../../app';

let token: any = null;
let id: any = null;

beforeEach(async done => {
  await request(app.callback())
    .post('/auth/login')
    .send({ username: 'test', password: process.env.USER_PASSWORD_TEST })
    .set('Accept', 'application/json')
    .expect(res => {
      token = res.body.token;
      done();
    });
});
describe('GET /profile', () => {
  it('respond with 401 unauthorized ', async () => {
    const response = await request(app.callback()).get('/users/profile');
    expect(response.status).toBe(401);
  });
});

describe('GET /profile', () => {
  it('respond with 200 authorized ', async () => {
    await request(app.callback())
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        id = res.body.currentUser.id;
      });
  });
});
describe('DELETE /:id  ', () => {
  it('respond with 404 bad request user not exist in db ', async () => {
    await request(app.callback())
      .del(`/users/${14525}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});
describe('PUT /:id', () => {
  it('respond with 200 updated ', async () => {
    await request(app.callback())
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'test', email: 'test1@test.com' })
      .expect(200);
  });
});
describe('PUT /:id', () => {
  it('respond with 200 updated ', async () => {
    await request(app.callback())
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'test', email: 'test@test.com' })
      .expect(200);
  });
});

describe('DELETE /:id', () => {
  it('respond with 401 unauthorized ', async () => {
    await request(app.callback())
      .del(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
