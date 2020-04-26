import bcrypt from 'bcryptjs';
import fs from 'fs';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { getUserById, getUserByName } from './helpers/UserService/UserService';
import { User } from './models/UserModel';
require('dotenv').config();
const PRIV_KEY = fs.readFileSync(`./private.key`, 'utf8');
async function validatePassword(userPassword: any, databasePassword: any) {
  return bcrypt.compare(userPassword, databasePassword);
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy.Strategy(async (username, password, done) => {
    try {
      const searchUser = new User();
      const user = await getUserByName(username);

      if (!user) {
        done(null, false);
        return;
      }

      searchUser.username = username;

      const isValidPassword = await validatePassword(password, user.password);

      if (username === user.username && isValidPassword) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      console.log(error);
    }
  })
);
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: PRIV_KEY || 'secret',
    },
    async (jwtPayload, done) => {
      done(null, jwtPayload);
    }
  )
);
