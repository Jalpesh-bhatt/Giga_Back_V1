const Category = require('../../models/AdminModel/CategoryModel');
const path = require('path');
const fs = require('fs');
// Create Category
exports.addCategory = async (req, res) => {
  try {
    const { categoryname,  description } = req.body;
    let subcategory = req.body.subcategory

     if (typeof subcategory === 'string') {
      subcategory = JSON.parse(subcategory);
    }
    const image = req.file ? req.file.filename : null;

     const existing = await Category.findOne({ categoryname });
        if (existing) {
          return res.status(400).json({ message: "category with this name already exists." });
        }
    const newCategory = new Category({
      categoryname,
      subcategory,
      description,
      image
    });
    console.log(newCategory)
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', data: newCategory });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 5, category = "", paginate = "true" } = req.query;

    let query = {};

    if (category && category.trim() !== "") {
      query = {
        $or: [
          { categoryname: { $regex: category, $options: "i" } },
          { subcategory: { $elemMatch: { $regex: category, $options: "i" } } }
        ]
      };
    }

    let categories;
    let total = await Category.countDocuments(query);

    if (paginate === "false") {
      categories = await Category.find(query).sort({ createdAt: -1 });
    } else {
      categories = await Category.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    res.status(200).json({
      data: categories,
      totalPages: paginate === "false" ? 1 : Math.ceil(total / limit),
      currentPage: Number(page),
      totalRecords: total
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};




// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.query;
        const {categoryname,  description } = req.body;
        
    let subcategory = req.body.subcategory;
       if (typeof subcategory ==='string')
        {
          subcategory=JSON.parse(subcategory)
        }

      const existingCategory = await Category.findById(id);
          if (!existingCategory) {
            return res.status(404).json({ message: "Package not found" });
          }
        
   // ✅ Delete old icon if new file uploaded
   if (req.file) {
  // Only try to delete old image if it exists
  if (existingCategory.image) {
    // console.log(existingCategory.image)
    // return
    const oldIconPath = path.join(__dirname, '..', '..', 'uploads', 'categories', existingCategory.image);

    if (fs.existsSync(oldIconPath)) {
      fs.unlinkSync(oldIconPath);
    }
  }

  // Assign new uploaded image filename
  existingCategory.image = req.file.filename;
}
   
     existingCategory.categoryname = categoryname;
    existingCategory.subcategory = subcategory;
    existingCategory.description = description;

    await existingCategory.save();

    const updatedCategory = await Category.findByIdAndUpdate(id, existingCategory, { new: true });
    if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
  
    res.status(200).json({ message: 'Category updated', data: updatedCategory });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update category' });
  }
};
