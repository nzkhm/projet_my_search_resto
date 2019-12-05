var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;


var MealsSchema = new Schema({
    name: {
        type: String,
        es_indexed: true,
        es_fields: {
            ngram: { type: 'text', analyzer: 'ngram_analyzer', index: 'analyzed' },
            keyword: { type: 'text', analyzer: 'keyword_analyzer', index: 'analyzed' }
        }
    },
    allergies: [{
        type: String,
        es_indexed: true,
        es_fields: {
            ngram: { type: 'text', analyzer: 'ngram_analyzer', index: 'analyzed' },
            keyword: { type: 'text', analyzer: 'keyword_analyzer', index: 'analyzed' }
        }
    }],
    ingredients: [{
        type: String,
        es_indexed: true,
        es_fields: {
            ngram: { type: 'text', analyzer: 'ngram_analyzer', index: 'analyzed' },
            keyword: { type: 'text', analyzer: 'keyword_analyzer', index: 'analyzed' }
        }
    }],

    vegan: { type: Boolean, default: false, es_indexed: true },
    halal: { type: Boolean, default: false, es_indexed: true },
    kosher: { type: Boolean, default: false, es_indexed: true },

    //jointure clef etrangere
    fk_restaurant: {
        type: String,
        es_indexed: true,
        es_fields: {
            ngram: { type: 'text', analyzer: 'ngram_analyzer', index: 'analyzed' },
            keyword: { type: 'text', analyzer: 'keyword_analyzer', index: 'analyzed' }
        }
    },
});

MealsSchema.plugin(mongoosastic, {});

var Meal = mongoose.model('Meal', MealsSchema);

Meal.createMapping({
    analysis: {
        filter: {
            ngram_filter: {
                type: 'nGram',
                min_gram: 3,
                max_gram: 10,
                token_chars: [
                    'letter', 'digit', 'symbol', 'punctuation'
                ]
            }
        },
        analyzer: {
            ngram_analyzer: {
                type: 'custom',
                tokenizer: 'whitespace',
                filter: [
                    'lowercase',
                    'asciifolding',
                    'ngram_filter'
                ]
            },
            keyword_analyzer: {
                tokenizer: 'standard',
                filter: [
                    'lowercase',
                    'asciifolding'
                ]
            }
        }
    }
}, (err, mapping) => { if (err) return console.log(err); console.log(mapping); });


var stream = Meal.synchronize();
var count = 0;

stream.on('data', function (err, doc) {
    count++;
});

stream.on('close', function () {
    console.log('indexed' + count + 'documents');
});

stream.on('error', function (err) {
    console.log('Error : Crashed');
});

module.exports = Meal;

