import config from 'config';

import jwt from 'jsonwebtoken';

const configJwt: any = config.get('tokenLife');
export async function JwtSign(payload: any) {
  return jwt.sign({ ...payload }, 'secret', {
    expiresIn: configJwt,
  });
}
