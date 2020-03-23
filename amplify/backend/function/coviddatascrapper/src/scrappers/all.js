var axios = require("axios");
var cheerio = require("cheerio");

var all = async (s3, bucket) => {
    let response;
    try {
        response = await axios.get("https://www.worldometers.info/coronavirus/");
        if (response.status !== 200) {
            console.log("ERROR");
        }
    } catch (err) {
        Promise.reject(err);
    }
    // to store parsed data
    const result = {};
    // get HTML and parse death rates
    const html = cheerio.load(response.data);
    html(".maincounter-number").filter((i, el) => {
        let count = el.children[0].next.children[0].data || "0";
        count = parseInt(count.replace(/,/g, "") || "0", 10);
        // first one is
        if (i === 0) {
            result.cases = count;
        } else if (i === 1) {
            result.deaths = count;
        } else {
            result.recovered = count;
        }
    });
    result.updated = Date.now();
    var params = {
        Body: new Buffer.from(JSON.stringify(result)),
        Bucket: bucket,
        Key: "all.json",
        ContentType: "application/json"
    };
    s3.putObject(params, (err, data) => {
        if (err) {
            console.log(err);
            return Promise.reject(err);
        } else {
            console.log(data);
            return Promise.resolve(result);
        }

    });
}

module.exports = all;