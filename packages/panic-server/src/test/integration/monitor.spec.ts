import request from 'supertest';
import app from '../../app';

let token: any = null;
const contentType = 'application/json';
const email = 'test@test.com';
const url = 'http://test.com';

beforeEach(async done => {
  await request(app.callback())
    .post('/auth/login')
    .send({ username: 'test', password: process.env.USER_PASSWORD_TEST })
    .set('Accept', contentType)
    .expect(res => {
      token = res.body.token;
      done();
    });
});

describe('GET /monitors', () => {
  it('respond with 401 unauthorized ', async () => {
    await request(app.callback())
      .get('/monitors/')
      .expect(401);
  });
});

describe('GET /monitors', () => {
  it('respond with  200 and return a list of monitors ', async () => {
    await request(app.callback())
      .get('/monitors/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
describe('GET /monitors/count-monitors', () => {
  it('respond with  200 and return number of monitors ', async () => {
    await request(app.callback())
      .get('/monitors/count-monitors')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

describe('GET /monitors/count-status', () => {
  it('respond with  200 and return all monitors by status', async () => {
    await request(app.callback())
      .get('/monitors/count-status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

describe('POST /monitors', () => {
  it('respond with 400 email is wrong', async () => {
    await request(app.callback())
      .post('/monitors/')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .send({
        name: 'test',
        url,
        receiver: 'test.com',
        ping: 10,
        monitorInterval: 10,
      })
      .expect(400);
  });
});
describe('POST /monitors  ', () => {
  it('respond with 400 name is wrong', async () => {
    await request(app.callback())
      .post('/monitors/')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .send({
        name: 't',
        url,
        receiver: email,
        ping: 10,
        monitorInterval: 10,
      })
      .expect(400);
  });
});
describe('POST /monitors  ', () => {
  it('respond with 400 url is wrong', async () => {
    await request(app.callback())
      .post('/monitors/')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .send({
        name: 'test',
        url: 'test/wrong',
        receiver: email,
        ping: 10,
        monitorInterval: 10,
      })
      .expect(400);
  });
});
let id: any = null;
describe('POST /monitors creation', () => {
  it('respond with 200 created', async done => {
    await request(app.callback())
      .post('/monitors/')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .send({
        name: 'test',
        url,
        receiver: email,
        ping: 10,
        monitorInterval: 10,
      })
      .expect(res => {
        id = res.body.data.id;
        done();
      });
  });
});
describe('GET /monitors/:id', () => {
  it('respond with  200 return monitor by id', async () => {
    await request(app.callback())
      .get(`/monitors/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
describe('Put /monitors ', () => {
  it('respond with 200 updated', async () => {
    await request(app.callback())
      .put(`/monitors/${id}/update`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .send({
        name: 'test2',
        url,
        receiver: email,
        ping: 10,
        monitorInterval: 10,
      })
      .expect(200);
  });
});
describe('POST /monitors ', () => {
  it('respond with 200 started', async () => {
    await request(app.callback())
      .post(`/monitors/${id}/start`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .send({ testRunning: true })
      .expect(200);
  });
});

describe('POST /monitors ', () => {
  it('respond with 200 stopped', async () => {
    await request(app.callback())
      .post(`/monitors/${id}/stop`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .send({ testRunning: false, status: 'stopped' })
      .expect(200);
  });
});

describe('DELETE /monitors ', () => {
  it('respond with 200 deleted', async () => {
    await request(app.callback())
      .del(`/monitors/${id}/delete`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', contentType)
      .expect(200);
  });
});
