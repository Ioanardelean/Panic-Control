import bcrypt from 'bcryptjs';
/**
 *
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 */
export async function hashPassword(password: string, saltRound = 10) {
  return bcrypt.hash(password, saltRound);
}
