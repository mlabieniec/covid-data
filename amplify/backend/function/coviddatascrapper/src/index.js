/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageCoviddataBucketName = process.env.STORAGE_COVIDDATA_BUCKETNAME

Amplify Params - DO NOT EDIT */
const environment = process.env.ENV || "dev";
const region = process.env.REGION || "us-east-2";
const bucket = process.env.STORAGE_COVIDDATA_BUCKETNAME || "covid-dataed8bb23c0bdb4875a2b37d496f9e0282dev-dev";
const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    region: region
});
const getAll = require('./scrappers/all'),
    getCountries = require('./scrappers/countries'),
    getStates = require('./scrappers/states'),
    getHistorical = require('./scrappers/historical');

exports.handler = async (event, context, callback) => {
    console.log('running scrappers...');
    await getAll(S3, bucket);
    console.log('put overview data');
    await getCountries(S3, bucket);
    console.log('put countries data');
    await getStates(S3, bucket);
    console.log('put states data');
    await getHistorical.historical(S3, bucket);
    console.log('put historical data');
    return callback();
};