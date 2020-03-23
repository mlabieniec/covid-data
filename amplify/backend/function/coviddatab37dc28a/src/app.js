/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageCoviddataBucketName = process.env.STORAGE_COVIDDATA_BUCKETNAME

Amplify Params - DO NOT EDIT */const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const environment = process.env.ENV || "dev";
const region = process.env.REGION || "us-east-2";
const bucket =
  process.env.STORAGE_COVIDDATA_BUCKETNAME ||
  "covid-dataed8bb23c0bdb4875a2b37d496f9e0282dev-dev";
const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  region: region
});

const all = require("./apis/all"),
  countries = require("./apis/countries"),
  states = require("./apis/states"),
  historical = require("./apis/historical");

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/all", function (req, res) {
  S3.getObject({
    Bucket: bucket,
    Key: "all.json"
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.json({
        error: err
      });
    } else {
      res.json(JSON.parse(data.Body));
    }
  });
});

app.get("/countries", function (req, res) {
  S3.getObject({
    Bucket: bucket,
    Key: "countries.json"
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.json({
        error: err
      });
    } else {
      res.json(JSON.parse(data.Body));
    }
  });
});

app.get("/states", function (req, res) {
  S3.getObject({
    Bucket: bucket,
    Key: "states.json"
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.json({
        error: err
      });
    } else {
      res.json(JSON.parse(data.Body));
    }
  });
});

app.get("/historical", async function (req, res) {
  S3.getObject({
    Bucket: bucket,
    Key: "historical.json"
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.json({
        error: err
      });
    } else {
      res.json(JSON.parse(data.Body));
    }
  });
});

app.get("/historical/:country", async function (req, res) {
  S3.getObject({
    Bucket: bucket,
    Key: "historical.json"
  }, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.json({
        error: err
      });
    } else {
      let historicalData = JSON.parse(data.Body);
      S3.getObject({
        Bucket: bucket,
        Key: "states.json"
      }, async function (err, statesData) {
        if (err) {
          console.log(err, err.stack);
          res.json({
            error: err
          });
        } else {
          let states = JSON.parse(statesData.Body);
          let countryData = await historical.getHistoricalCountryData(
            historicalData,
            req.params.country.toLowerCase(),
            states
          );
          res.json(countryData);
        }
      });
    }
  });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;