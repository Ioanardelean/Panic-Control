import request from 'supertest';
import app from '../../app';
let token: any = null;

beforeEach(async (done) => {
  await request(app.callback())
    .post('/auth/login')
    .send({ username: 'test', password: 'Passtest123' })
    .set('Accept', 'application/json')
    .expect((res) => {
      token = res.body.token;
      done();
    });
});
let id: any = null;

describe('POST /projects creation', () => {
  it('respond with 200 new project created', async (done) => {
    await request(app.callback()).post('/projects/').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ name: 'test', url: 'http://test2.com', receiver: 'test@test2.com', ping: 10, monitorInterval: 1, testRunning: true })
      .expect((res) => {
        id = res.body.data.id;

        done();
      });
  });
});

describe('GET /history stats', () => {
  it('respond with 200 get last static', async () => {
    await request(app.callback()).get('/history/last').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .expect(200);
  });
});

describe('GET /history stats on year', () => {
  it('respond with 200 all on year', async () => {
    await request(app.callback()).get(`/history/${id}/downtime-year`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .expect(200);
  });
});


describe('GET /history stats on month', () => {
  it('respond with 200 all on month', async () => {
    await request(app.callback()).get(`/history/downtime-month`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .expect(200);
  });
});

describe('GET /history stats since creation', () => {
  it('respond with 200 all since creation', async () => {
    await request(app.callback()).get(`/history/${id}/downtime`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .expect(200);
  });
});