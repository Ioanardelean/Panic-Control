import bcrypt from 'bcryptjs';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import {
  findUserById,
  findUserByName,
} from './helpers/UserService/AuthorizationMiddleware';
import { User } from './models/User';
require('dotenv').config();

async function validatePassword(userPassword: any, databasePassword: any) {
  return bcrypt.compare(userPassword, databasePassword);
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy.Strategy(async (username, password, done) => {
    try {
      const searchUser = new User();
      const user = await findUserByName(username);

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
      secretOrKey: 'secret',
    },
    async (jwtPayload, done) => {
      done(null, jwtPayload);
    }
  )
);
