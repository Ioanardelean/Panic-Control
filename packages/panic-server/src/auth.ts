import bcrypt from 'bcryptjs';
import fs from 'fs';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { User } from './models/User';
import { UserService } from './services/UserService';
require('dotenv').config();
const publicKEY = fs.readFileSync('./cert/public.key', 'utf8');

async function validatePassword(userPassword: any, databasePassword: any) {
  return bcrypt.compare(userPassword, databasePassword);
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userService = new UserService();
    const user = await userService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy.Strategy(async (username, password, done) => {
    try {
      const userService = new UserService();
      const searchUser = new User();
      const user = await userService.findUserByName(username);

      if (!user) {
        done(null, false);
        return;
      }

      searchUser.Username = username;

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
      secretOrKey: publicKEY,
    },
    async (jwtPayload, done) => {
      done(null, jwtPayload);
    }
  )
);
