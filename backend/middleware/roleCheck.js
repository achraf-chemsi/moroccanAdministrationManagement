const User = require('../models/User');

const roleCheck = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ msg: 'Access denied. Insufficient permissions.' });
      }

      next();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
};

module.exports = roleCheck; 