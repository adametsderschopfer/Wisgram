const jwt = require('jsonwebtoken');
const config = require('config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  return jwt.verify(token, config.get('JWTSecret'), (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    
    next();
  });
}

module.exports = authenticateToken;
