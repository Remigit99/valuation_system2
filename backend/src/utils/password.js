import argon2 from "argon2";

/*
|--------------------------------------------------------------------------
| Hash Password
|--------------------------------------------------------------------------
*/

export const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,

    memoryCost: 2 ** 16,

    timeCost: 5,

    parallelism: 1,
  });
};

/*
|--------------------------------------------------------------------------
| Verify Password
|--------------------------------------------------------------------------
*/

export const verifyPassword = async (hashedPassword, plainPassword) => {
  return await argon2.verify(hashedPassword, plainPassword);
};