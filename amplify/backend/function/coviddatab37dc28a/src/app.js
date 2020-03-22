var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var all = require('./apis/all'),
  countries = require('./apis/countries'),
  states = require('./apis/states'),
  historical = require('./apis/historical');

var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.get('', function (req, res) {
  countries().then((result) => {
    res.json(result);
  }).catch((error) => {
    console.log('error: ', error);
    res.json({
      body: null,
      error: error
    });
  });
});

app.get('/all', function (req, res) {
  all().then((result) => {
    res.json(result);
  }).catch((error) => {
    console.log('error: ', error);
    res.json({
      error: error
    });
  });
});

app.get('/countries', function (req, res) {
  countries().then((result) => {
    res.json(result);
  }).catch((error) => {
    console.log('error: ', error);
    res.json({
      error: error
    });
  });
});

app.get('/states', function (req, res) {
  states().then((result) => {
    res.json(result);
  }).catch((error) => {
    console.log('error: ', error);
    res.json({
      error: error
    });
  });
});

app.get("/historical", async function (req, res) {
  let data = await historical.historical();
  res.json(data);
});

app.get("/historical/:country", async function (req, res) {
  let data = await historical.historical();
  if (req.params.country) {
    states().then(async (states) => {
      const countryData = await historical.getHistoricalCountryData(data, req.params.country.toLowerCase(), states);
      res.json(countryData);
    }).catch((error) => res.json({
      error
    }));
  } else {
    res.json(data);
  }
});

app.listen(3000, function () {
  console.log("App started")
});

module.exports = app