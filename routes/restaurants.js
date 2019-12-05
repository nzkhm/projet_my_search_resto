var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/search', (req, res) => {
    mongoose.model('Restaurant').find({}, (err, items) => res.render('restaurants/search', { restaurants: items }));
});

//res.render('restaurants/search', { items: search_results });
router.post('/search', (req, res) => {

    console.log(req);

    mongoose.model('Restaurant').find({

        dis_max: {
            queries: [
                {
                    function_score: {
                        query: {
                            match: {
                                'name.ngram': {
                                    query: req.params.name,
                                    // permet les fautes de frappes
                                    fuzziness: 'AUTO'
                                }
                            }
                        },
                        script_score: {
                            script: '_score * 0.3'
                        }
                    }
                },
                {
                    match: {
                        'name.keyword': {
                            'query': req.params.name,
                            'operator': 'or',
                            'boost': 3.0,
                        }
                    }
                }
            ]
        }

    }, (err, items) => {
        res.render('restaurants/search', { restaurants: items })
    });

});


router.get('/create', (req, res) => {
    res.render('restaurants/create');
});

router.post('/create', (req, res) => {
    const restaurant = req.body;
    mongoose.model('Restaurant').create(restaurant, (err, item) => {
        if (!err) return res.redirect('/restaurants');
        res.send(err);
    })
});

router.get('/view/:id', (req, res) => {
    //aff resto
    mongoose.model('Restaurant').findById(req.params.id, (err, restaurant) => {
        if (err) return res.send(err);
        //get meals
        mongoose.model('Meal').find({}, (err, meals) => {
            res.render('./restaurants/view', { restaurant, meals })
        })
    });
});

router.get('/edit/:id', (req, res) => {
    //aff resto & edit
    mongoose.model('Restaurant').findById(req.params.id, (err, item) => {
        if (err) return res.send(err);
        res.render('restaurants/edit', { restaurant: item });
    });
});


router.get('/delete/:id', (req, res) => {
    if (!err) res.redirect('/restaurants');
    else res.send(err);
});

router.post('/edit/:id', (req, res) => {

    const restaurant = req.body;
    mongoose.model('Restaurant').findByIdAndUpdate(req.params.id, restaurant, (err, restaurant) => {
        if (!err) res.redirect('/restaurants/view/' + req.params.id);
        else res.send(err);
    })
});


module.exports = router;