import request from 'supertest';
import app from '../../app';

describe('Admin dashboard', () => {
  let token: any = null;

  beforeEach(async done => {
    await request(app.callback())
      .post('/auth/login')
      .send({ username: 'admin', password: process.env.ADMIN_PASSWORD_TEST })
      .set('Accept', 'application/json')
      .expect(res => {
        token = res.body.token;
        done();
      });
  });

  it('if not admin, return error for monitors list ', async () => {
    const response = await request(app.callback()).get('/admin/projects');
    expect(response.status).toBe(401);
  });

  it('if  admin, should return the list of projects ', async () => {
    await request(app.callback())
      .get('/admin/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('Into dashboard must return users list ', async () => {
    await request(app.callback())
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
