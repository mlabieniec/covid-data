var axios = require("axios");
var cheerio = require("cheerio");

var getcountries = async (s3, bucket) => {
    let response;
    try {
        response = await axios.get("https://www.worldometers.info/coronavirus/");
        if (response.status !== 200) {
            return Promise.reject(response.status);
        }
    } catch (err) {
        return Promise.reject(err);
    }
    // to store parsed data
    const result = [];
    // get HTML and parse death rates
    const html = cheerio.load(response.data);
    const countriesTable = html("table#main_table_countries_today");
    const countriesTableCells = countriesTable
        .children("tbody")
        .children("tr")
        .children("td");
    // NOTE: this will change when table format change in website
    const totalColumns = 9;
    const countryColIndex = 0;
    const casesColIndex = 1;
    const todayCasesColIndex = 2;
    const deathsColIndex = 3;
    const todayDeathsColIndex = 4;
    const curedColIndex = 5;
    const activeColIndex = 6;
    const criticalColIndex = 7;
    const casesPerOneMillionColIndex = 8;
    // minus totalColumns to skip last row, which is total
    for (let i = 0; i < countriesTableCells.length - totalColumns; i += 1) {
        const cell = countriesTableCells[i];

        // get country
        if (i % totalColumns === countryColIndex) {
            let country =
                cell.children[0].data ||
                cell.children[0].children[0].data ||
                // country name with link has another level
                cell.children[0].children[0].children[0].data ||
                cell.children[0].children[0].children[0].children[0].data ||
                "";
            country = country.trim();
            if (country.length === 0) {
                // parse with hyperlink
                country = cell.children[0].next.children[0].data || "";
            }
            result.push({
                country: country.trim() || ""
            });
        }
        // get cases
        if (i % totalColumns === casesColIndex) {
            let cases = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].cases = parseInt(
                cases.trim().replace(/,/g, "") || "0",
                10
            );
        }
        // get today cases
        if (i % totalColumns === todayCasesColIndex) {
            let cases = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].todayCases = parseInt(
                cases.trim().replace(/,/g, "") || "0",
                10
            );
        }
        // get deaths
        if (i % totalColumns === deathsColIndex) {
            let deaths = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].deaths = parseInt(
                deaths.trim().replace(/,/g, "") || "0",
                10
            );
        }
        // get today deaths
        if (i % totalColumns === todayDeathsColIndex) {
            let deaths = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].todayDeaths = parseInt(
                deaths.trim().replace(/,/g, "") || "0",
                10
            );
        }
        // get cured
        if (i % totalColumns === curedColIndex) {
            let cured = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].recovered = parseInt(
                cured.trim().replace(/,/g, "") || 0,
                10
            );
        }
        // get active
        if (i % totalColumns === activeColIndex) {
            let cured = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].active = parseInt(
                cured.trim().replace(/,/g, "") || 0,
                10
            );
        }
        // get critical
        if (i % totalColumns === criticalColIndex) {
            let critical = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].critical = parseInt(
                critical.trim().replace(/,/g, "") || "0",
                10
            );
        }
        // get total cases per one million population
        if (i % totalColumns === casesPerOneMillionColIndex) {
            let casesPerOneMillion = cell.children.length != 0 ? cell.children[0].data : "";
            result[result.length - 1].casesPerOneMillion = parseInt(
                casesPerOneMillion.trim().replace(/,/g, "") || "0",
                10
            );
        }
    }
    var params = {
        Body: new Buffer.from(JSON.stringify(result)),
        Bucket: bucket,
        Key: 'countries.json',
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

module.exports = getcountries;