const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
  });
});

module.exports = router;
