// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://user:pass@ds025429.mlab.com:25429/quantathon'); // connect to our database

var Stock = require('./app/models/stock');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    //console.log(req.body.name);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

//create frontpage
// ----------------------------------------------------
app.get('/', function (req, res) {
   Stock.findById(req.params.stock_id, function(err, stock) {
            if (err)
                res.send(err);
            res.json(stock);
        });
})

// more routes for our API will happen here
// on routes that end in /stocks
// ----------------------------------------------------
router.route('/stocks')

    // create a stock (accessed at POST http://localhost:8080/api/stocks)
    .post(function(req, res) {
        
        var stock = new Stock();      // create a new instance of the Stock model
        stock.name = req.body.name;  // set the stocks name (comes from the request)
        stock.price = req.body.price;

        // save the stock and check for errors
        stock.save(function(err) {
            if (err) {
                console.log("error");
                res.send(err);
            }
            res.json({ message: 'Stock created!' });
        });
    })

      // get all the stocks (accessed at GET http://localhost:8080/api/stocks)
    .get(function(req, res) {
        Stock.find(function(err, stocks) {
            if (err)
                res.send(err);

            res.json(stocks);
        });
    });

// on routes that end in /stocks/:stock_id
// ----------------------------------------------------
router.route('/stocks/:stock_id')

    // get the stock with that id (accessed at GET http://localhost:8080/api/stocks/:stock_id)
    .get(function(req, res) {
        Stock.findById(req.params.stock_id, function(err, stock) {
            if (err)
                res.send(err);
            res.json(stock);
        });
    })

    // update the stock with this id (accessed at PUT http://localhost:8080/api/stocks/:stock_id)
    .put(function(req, res) {

        // use our stock model to find the stock we want
        Stock.findById(req.params.stock_id, function(err, stock) {

            if (err)
                res.send(err);

            stock.name = req.body.name;  // update the stocks info
            stock.price = req.body.price;

            // save the stock
            stock.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Stock updated!' });
            });

        });
    })

      // delete the stock with this id (accessed at DELETE http://localhost:8080/api/stocks/:stock_id)
    .delete(function(req, res) {
        Stock.remove({
            _id: req.params.stock_id
        }, function(err, stock) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);






