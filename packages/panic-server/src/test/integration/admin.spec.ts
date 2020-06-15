
import request from 'supertest';
import app from '../../app';



describe('Without access', () => {
  it('if not admin, don\'t return the list of projects ', async () => {
    const response = await request(app.callback()).get('/admin/projects');
    expect(response.status).toBe(401);
  });
})

describe('Admin dashboard', () => {

  let token: any = null;

  beforeEach(async (done) => {
    await request(app.callback())
      .post('/auth/login')
      // tslint:disable-next-line: no-hardcoded-credentials
      .send({ username: 'admin', password: 'Password2020' })
      .set('Accept', 'application/json')
      .expect((res) => {
        token = res.body.token;
        done();
      });
  });

  it('if  admin, should return the list of projects ', async () => {
    await request(app.callback()).get('/admin/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

  });

  // tslint:disable-next-line: no-identical-functions
  it('if  admin, should return the list of users ', async () => {
    await request(app.callback()).get('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

  });

});

