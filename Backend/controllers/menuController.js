import Menu from '../models/Menu.js';

// @desc    Get all menu items (with Search and Category Filter)
// @route   GET /api/menu
export const getMenuItems = async (req, res) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // 1. Filter by Category (e.g., /api/menu?category=Lunch)
        if (req.query.category) {
            query = Menu.find({ category: req.query.category });
        } 
        // 2. Search by Name (e.g., /api/menu?search=Burger)
        else if (req.query.search) {
            query = Menu.find({ name: { $regex: req.query.search, $options: 'i' } });
        } 
        else {
            query = Menu.find();
        }

        const menu = await query;
        res.status(200).json({ success: true, count: menu.length, data: menu });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Add a new menu item
// @route   POST /api/menu
export const addMenuItem= async (req, res) => {
    try {
        const newItem = await Menu.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update menu item (Details or Sold Out Toggle)
// @route   PUT /api/menu/:id
export const updateMenuItem  = async (req, res) => {
    try {
        const item = await Menu.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id

export const deleteMenuItem = async (req, res) => {
    try {
        const item = await Menu.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, message: "Item removed" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};