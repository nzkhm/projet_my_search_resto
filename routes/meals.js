var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

router.get('/create/:restaurantId', (req, res) => {

    var restaurant_ = "";
    mongoose.model('Restaurant').findById(req.params.id, (err, restaurant) => {
        restaurant_ = restaurant;
    });

    mongoose.model('Meal').find({}, (err, meal) => {
        if (err) return res.send(err);
        res.render('meals/create', {restaurant, meal})
    });

});

router.post('/create', (req, res) => {

    const meal = req.body;
    
    meal.allergies = meal.allergies.split(',');
    meal.ingredients = meal.ingredients.split(',');
    
    meal.vegan = meal.vegan  === 'on';
    meal.halal = meal.halal  === 'on';
    meal.kosher = meal.kosher=== 'on';

    mongoose.model('Restaurant').create(meal, (err, item) => {
      if (!err) return res.redirect('restaurants/view/'+req.params.id);
      res.send(err);
    });
});

module.exports = router;