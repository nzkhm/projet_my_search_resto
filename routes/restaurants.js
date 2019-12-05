var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    res.redirect('/');
});

//res.render('restaurants/search', { items: search_results });
router.get('/search', (req, res, next) => {
    mongoose.model('Restaurant').search({
        // dis_max => Permet de faire une union de n requêtes tout en conservant l'element qui à le scole le plus elevé
        dis_max: {
            queries: [
                {
                    // permet de tweaker un score en utilisant un script
                    function_score: {
                        query: {
                            // va matcher les termes selon le découpage (whitespace/symbols etc.) défini 
                            match: {
                                'name.ngram': {
                                    query: req.query.name,
                                    // permet les fautes de frappes
                                    fuzziness: 'AUTO'
                                }
                            }
                        },
                        script_score: {
                            script: '_score * 0.7'
                        }
                    }
                },
                {
                    match: {
                        'name.keyword': {
                            'query': req.query.name,
                            'operator': 'or',
                            'boost': 5.0,
                        }
                    }
                }
            ]
        }
    }, (err, items) => {
        if (!err && items) {
            // Vu que les resultats sont fournis dans une forme un peu particulière un element qui contient un _id, _source et _score
            // on l'applati
            const restaurants = items.hits.hits.map(item => {
                const restaurant = item._source;
                restaurant._id = item._id;
                restaurant._score = item._score;
                return restaurant;
            })
            res.render('restaurants/search', { restaurants })
        }
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
    mongoose.model('Restaurant').findById(req.params.id, (err, restaurant) => {
        if (err) return res.send(err);
        res.render('restaurants/edit', { restaurant: item });
    });
});


router.get('/delete/:id', (req, res) => {

    if (!err) res.redirect('/restaurants');
    else res.send(err);
});

router.post('/edit/:id', (req, res) => {
    if (!err) res.redirect('/restaurants/view/' + req.params.id);
    else res.send(err);
});


module.exports = router;