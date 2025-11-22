const mongoose = require("mongoose");
const data = require("./extraData/supermarketjson.json"); // Make sure this exports an array
const dotenv = require("dotenv");
dotenv.config();

// MongoDB Connection
mongoose.connect("mongodb+srv://atharvsoni63:uBdErDJ1SmVAc4FW@business.vihajd0.mongodb.net/business?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose Schema
const listingSchema = new mongoose.Schema({
  category: String,
  subcategory: [String],
  name: String,
  location: String,
  address: String,
  PIN: String,
  email: String,
  WhatsApp: String,
  phoneNumbers: [String],
  website: String
});

const Listing = mongoose.model("Listing", listingSchema);

// Import Function
async function importData() {
  try {
    const transformedData = data.map(item => {
      const phoneNumbers = [];
      if (item["Phone 1"]) phoneNumbers.push(item["Phone 1"].toString());
      if (item["Phone 2"]) phoneNumbers.push(item["Phone 2"].toString());
      if (item["Phone 3"]) phoneNumbers.push(item["Phone 3"].toString());

      let subcategories = [];
      if (Array.isArray(item.subcategory)) {
        subcategories = item.subcategory.flat().map(String);
      } else if (typeof item.subcategory === "string") {
        subcategories = [item.subcategory];
      }

      return {
        category: item.category || "",
        subcategory: subcategories,
        name: item.Company || item.name || "Unnamed",
        location: item.location || "",
        address: item.address || "",
        PIN: item.PIN || "",
        email: item.email || item["Email address"] || "",
        WhatsApp: item.whatsApp || item.WhatsApp || "",
        website: item.website || "",
        phoneNumbers
      };
    });

    await Listing.insertMany(transformedData);
    console.log("✅ Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error Importing Data:", error.message);
    process.exit(1);
  }
}

importData();
