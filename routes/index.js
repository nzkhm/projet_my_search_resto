const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* GET home page. */
router.get('/', (req, res, next) => {
      mongoose.model('Restaurant').find({}, (err, items) => res.render('index', { restaurants: items }));
});



module.exports = router;
