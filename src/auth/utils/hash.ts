import * as bcrypt from 'bcrypt';

export const passwordHashing = async (password: string) => {
  const salt = await bcrypt.genSalt();

  return bcrypt.hash(password, salt);
};
