const User = require('../../models/AdminModel/AdminUser');

const createUser = async (req, res) => {
    // console.log('hii')
  // console.log(req.body.role)
  try {
    const { user, email, role } = req.body;
    const avatar = req.file ? req.file.filename : null;

    const newUser = new User({ user, email, role, avatar });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

const getUsers = async (req, res) => {
  const { user, page = 1, limit = 10 } = req.query;
  const query = {};

  // Search by user field (case-insensitive)
  if (user) {
    query.user = { $regex: user, $options: 'i' };
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      data: users,
      totalPages,
      currentPage: parseInt(page),
      totalCount,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

const updateUsers = async(req,res)=>{
  // console.log(req.body)
  try {
    const {_id,user,email,role}=req.body
    const updateData ={
      user,email,role
    }

    if (req.file) {
      updateData.avatar = req.file.filename;
    } else if (req.body.image) {
      updateData.avatar = req.body.image;
    }
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
        // console.log(updatedUser)
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
    
}
module.exports = { createUser, getUsers,updateUsers };

