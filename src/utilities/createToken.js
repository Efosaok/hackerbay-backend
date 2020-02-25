import jwt from 'jsonwebtoken';

const createToken = (data) => jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data,
}, process.env.SECRET);

export default createToken;
