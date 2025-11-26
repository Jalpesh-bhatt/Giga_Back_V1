const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use(express.static("build")); 
//app.get("*", (req, res) => {res.sendFile(path.join(__dirname, "build", "index.html"));
//});


// mongoose.connect('mongodb://localhost:27017/business', {

// MongoDB Atlas Connection (from .env)
mongoose.connect(`mongodb+srv://dharmadip:Dharmadip%40123@cluster0.ix79shm.mongodb.net/
`, 
//   {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }
)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Make mongoose connection globally accessible
global.connection = mongoose.connection;

// Routes
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const AdminListingRoutes = require('./routes/AdminRoutes/AdminlistingRoutes');
const AdminUserRoutes = require('./routes/AdminRoutes/AdminUserRoutes');
const PackageRoutes = require('./routes/AdminRoutes/AdminPackageRoutes');
const CategoryRoutes = require('./routes/AdminRoutes/AdminCategoryRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/getlistings', listingRoutes);
app.use('/api/getAllistings', listingRoutes);
app.use('/api/getPartListings', listingRoutes);
app.use('/api/categoryListings', listingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin/getpartListings', AdminListingRoutes);
app.use('/api/admin/users', AdminUserRoutes);
app.use('/api/admin/package', PackageRoutes);
app.use('/api/admin/category', CategoryRoutes);

// Start the server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


