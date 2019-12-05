var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

router.get('/create/:restaurantId', (req, res) => {

    mongoose.model('Restaurant').findById(req.params.id, (err, restaurant) => {

        mongoose.model('Meal').find({}, (err, meal) => {
            if (err) return res.send(err);
            res.render('meals/create', { restaurant, meal })
        })
    });
});

router.post('/create/:restaurantId', (req, res) => {
    mongoose.model('Restaurant').findById(req.params.id, (err, restaurant) => {
        if (err) return res.send(err);
        res.render('restaurants/edit', { restaurant: item });
    });
});

module.exports = router;