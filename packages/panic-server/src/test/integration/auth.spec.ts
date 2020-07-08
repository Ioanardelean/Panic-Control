import request from 'supertest';
import app from '../../app';

describe('Authentication register endpoint', () => {
  const email = 'test@test.com';
  const path = '/auth/register';
  const format = 'application/json';
  it('POST should return error if email is not valid', async () => {
    await request(app.callback())
      .post(path)
      .send({
        username: 'test',
        email: 'test@com',
        password: process.env.USER_PASSWORD_TEST,
      })
      .set('Accept', format)
      .expect(400);
  });
  it('POST should return error is password is not valid', async () => {
    await request(app.callback())
      .post(path)
      .send({
        username: 'test',
        email,
        password: process.env.WRONG_PASSWORD_TEST,
      })
      .set('Accept', format)
      .expect(400);
  });

  it('POST return error if the length of name is less then 2 characters', async () => {
    await request(app.callback())
      .post(path)
      .send({
        username: 't',
        email,
        password: process.env.USER_PASSWORD_TEST,
      })
      .set('Accept', format)
      .expect(400);
  });

  it('POST should register user', async () => {
    await request(app.callback())
      .post(path)
      .send({
        username: 'test',
        email,
        password: process.env.USER_PASSWORD_TEST,
      })
      .set('Accept', format)
      .expect(200);
  });
  it('POST should return error is user already exist', async () => {
    await request(app.callback())
      .post(path)
      .send({
        username: 'test',
        email,
        password: process.env.USER_PASSWORD_TEST,
      })
      .set('Accept', format)
      .expect({
        error: {
          statusCode: 400,
          code: 'BAD_REQUEST',
          message: 'User already exist',
          status: 400,
        },
      });
  });
});

describe('Auth login', () => {
  const path = '/auth/login';
  const format = 'application/json';
  it('POST should redirect when login fails', async () => {
    await request(app.callback())
      .post(path)
      .send({ username: 'te', password: process.env.USER_PASSWORD_TEST })
      .set('Accept', format)
      .expect(302);
  });
  it('POST should login', async () => {
    await request(app.callback())
      .post(path)
      .send({ username: 'test', password: process.env.USER_PASSWORD_TEST })
      .set('Accept', format)
      .expect(200);
  });
});
