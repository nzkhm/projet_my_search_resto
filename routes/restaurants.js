const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //liste des resto
    mongoose.model('Restaurant').find({}, (err, items) => res.render('index', { restaurants: items }));
});

router.get('/search', (req, res) => {
    //res.render('restaurants/search', { items: search_results });
});

router.get('/create', (req, res) => {
    //res.render('restaurants/create');
});

router.post('/create', (req, res, next) => {
    const restaurant = req.body;
    mongoose.model('Restaurant').create(restaurant, (err, item) => {
        if (!err) return res.redirect('/');
        res.send(err);
    })
});

router.get('/view/:id', (req, res) => {
    //TODO
    // res.render('restaurants/view', { page: 'restaurant', restaurant : item , meals : [] /* TODO */ });

});

router.get('/edit/:id', (req, res) => {
    // TODO
    // res.render('restaurants/edit', { restaurant : item });
});


router.get('/delete/:id', (req, res) => {
    // TODO
    // if(!err)
    //     res.redirect('/restaurants');
    // else
    //     res.send(err);
});

router.post('/edit/:id', (req, res) => {
    // TODO
    // if(!err)
    //     res.redirect('/restaurants/view/' + req.params.id);
    // else
    //     res.send(err);
});


module.exports = router;