const jwt = require('jsonwebtoken');

const generateToken = (payload) => {  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'supersecretkey', 
    { expiresIn: '1d' } 
  );
};

module.exports = generateToken;
