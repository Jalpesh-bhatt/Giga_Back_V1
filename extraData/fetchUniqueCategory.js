// extractSubcategories.js
const fs = require("fs");
const data = require("./supermarketjson.json"); // import your JSON array

// Create a Set to store unique subcategories
const subcategorySet = new Set();

// Loop through data to collect unique subcategories
data.forEach(item => {
  if (item.subcategory) {
    subcategorySet.add(item.subcategory.trim());
  }
});

// Convert the set to an array
const uniqueSubcategories = Array.from(subcategorySet);

// Write the array to a new file
fs.writeFileSync("subcategories.json", JSON.stringify(uniqueSubcategories, null, 2));

console.log("✅ Unique subcategories extracted and written to subcategories.json");
