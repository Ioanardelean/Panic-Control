import config from 'config';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const PRIV_KEY = fs.readFileSync(`./id_rsa_priv.pem`, 'utf8');
const configJwt: any = config.get('tokenLife');
export async function JwtSign(payload: any) {
  return jwt.sign({ ...payload }, PRIV_KEY, {
    expiresIn: configJwt,
  });
}
