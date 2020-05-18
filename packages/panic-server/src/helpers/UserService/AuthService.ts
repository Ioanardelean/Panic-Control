import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
export class AuthService {
  configJwt: any = config.get('tokenLife');
  constructor() {}

  /**
   *
   * @param {string} userId
   * @returns {string}
   */
  generateToken(payload: any): string {
    return jwt.sign({ ...payload }, process.env.JWT_SECRET, {
      expiresIn: this.configJwt,
    });
  }

  /**
   *
   * @param {string} token
   * @returns {string | object}
   */
  verifyToken(token: string): void {
    return jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err: jwt.JsonWebTokenError, data: string | object) => {
        if (err) {
          throw Error(`${err}`);
        }
        return data;
      }
    );
  }

  /**
   *
   * @param {string} password - The password to hash
   * @returns {Promise<string>} - The hashed password
   * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
   * password in the database, the salt and hash are stored for security
   */
  async hashPassword(password: string): Promise<string> {
    const salt: string = await this.generateSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   *
   * @param {string} passwordRequest
   * @param {string} passwordResponse
   * @returns {Promise<boolean>}
   */
  verifyPassword(passwordRequest: string, passwordResponse: string): boolean {
    return bcrypt.compareSync(passwordRequest, passwordResponse);
  }

  private async generateSalt(rounds: number): Promise<string> {
    return bcrypt.genSalt(rounds);
  }
}
