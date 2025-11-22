const data = require('./provisionaljson')

const generalStores = data.filter(item => item.subcategory === "Provision Stores");
// console.log(generalStores); // print to console

const fs = require('fs');
fs.writeFileSync('provisionstore.json', JSON.stringify(generalStores, null, 2))