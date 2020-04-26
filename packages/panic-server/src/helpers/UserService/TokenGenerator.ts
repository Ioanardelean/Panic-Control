import config from 'config';
import fs from 'fs';
import jwt from 'jsonwebtoken';
const cwd = process.cwd();
const PRIV_KEY = fs.readFileSync(`${cwd}\private.key`, 'utf8');
const configJwt: any = config.get('tokenLife');
export async function JwtSign(payload: any) {
  return jwt.sign({ ...payload }, PRIV_KEY || 'secret', {
    expiresIn: configJwt,
  });
}
