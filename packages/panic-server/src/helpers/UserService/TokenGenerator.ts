import config from 'config';
import fs from 'fs';
import jwt from 'jsonwebtoken';
const cwd = process.cwd();

const configJwt: any = config.get('tokenLife');
export async function JwtSign(payload: any) {
  return jwt.sign({ ...payload }, 'secret', {
    expiresIn: configJwt,
  });
}
