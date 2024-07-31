const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'Formbuilder_app'; // Use environment variable or fallback to default

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token format

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.refUserId= decoded.userID; // Use your payload key
    next();
  });
};

module.exports = verifyToken;
