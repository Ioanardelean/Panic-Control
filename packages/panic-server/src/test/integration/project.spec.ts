
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

describe('GET /projects', () => {
  it('respond with 401 unauthorized ', async () => {
    await request(app.callback()).get('/projects/').expect(401);
  });
});

describe('GET /projects', () => {
  it('respond with  200 and return a list of projects ', async () => {
    await request(app.callback()).get('/projects/').set('Authorization', `Bearer ${token}`)
      .expect(200);

  });
});
describe('GET /projects/count-monitors', () => {
  it('respond with  200 and return number of monitors ', async () => {
    await request(app.callback()).get('/projects/count-monitors').set('Authorization', `Bearer ${token}`)
      .expect(200);

  });
});

describe('GET /projects/count-status', () => {
  it('respond with  200 and return all monitors by status', async () => {
    await request(app.callback()).get('/projects/count-status').set('Authorization', `Bearer ${token}`)
      .expect(200);

  });
});

describe('POST /projects', () => {
  it('respond with 400 email is wrong', async () => {
    await request(app.callback()).post('/projects/').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ name: 'test', url: 'http://test.com', receiver: 'test.com', ping: 10, monitorInterval: 10 })
      .expect(400);

  });
});
describe('POST /projects  ', () => {
  it('respond with 400 name is wrong', async () => {
    await request(app.callback()).post('/projects/').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ name: 't', url: 'http://test.com', receiver: 'test@test.com', ping: 10, monitorInterval: 10 })
      .expect(400);

  });
});
describe('POST /projects  ', () => {
  it('respond with 400 url is wrong', async () => {
    await request(app.callback()).post('/projects/').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ name: 'test', url: 'test/wrong', receiver: 'test@test.com', ping: 10, monitorInterval: 10 })
      .expect(400);

  });
});
let id: any = null;
describe('POST /projects creation', () => {
  it('respond with 200 created', async (done) => {
    await request(app.callback()).post('/projects/').set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ name: 'test', url: 'http://test.com', receiver: 'test@test.com', ping: 10, monitorInterval: 10 })
      .expect((res) => {
        id = res.body.data.id;
        done();
      });
  });
});
describe('GET /projects/:id', () => {
  it('respond with  200 return project by id', async () => {
    await request(app.callback()).get(`/projects/${id}`).set('Authorization', `Bearer ${token}`)
      .expect(200);

  });
});
describe('Put /projects ', () => {
  it('respond with 200 updated', async () => {
    await request(app.callback()).put(`/projects/${id}/update`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ name: 'test2', url: 'http://test.com', receiver: 'test@test.com', ping: 10, monitorInterval: 10 })
      .expect(200);
  });
});
describe('POST /projects ', () => {
  it('respond with 200 started', async () => {
    await request(app.callback()).post(`/projects/${id}/start`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ testRunning: true })
      .expect(200);
  });
});

describe('POST /projects ', () => {
  it('respond with 200 stopped', async () => {
    await request(app.callback()).post(`/projects/${id}/stop`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .send({ testRunning: false, status: 'stopped' })
      .expect(200);
  });
});

describe('DELETE /projects ', () => {
  it('respond with 200 deleted', async () => {
    await request(app.callback()).del(`/projects/${id}/delete`).set('Authorization', `Bearer ${token}`).set('Accept', 'application/json')
      .expect(200);
  });
});