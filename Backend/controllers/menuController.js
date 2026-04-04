import Menu from '../models/Menu.js';

// Validation function
const validateMenuData = (data) => {
    const errors = {};

    // Name validation
    if (!data.name || data.name.trim() === "") {
        errors.name = "Food name is required";
    } else if (data.name.trim().length < 2) {
        errors.name = "Food name must be at least 2 characters";
    } else if (data.name.trim().length > 50) {
        errors.name = "Food name must not exceed 50 characters";
    }

    // Description validation
    if (!data.description || data.description.trim() === "") {
        errors.description = "Description is required";
    } else if (data.description.trim().length < 10) {
        errors.description = "Description must be at least 10 characters";
    } else if (data.description.trim().length > 500) {
        errors.description = "Description must not exceed 500 characters";
    }

    // Price validation
    if (data.price === undefined || data.price === null || data.price === "") {
        errors.price = "Price is required";
    } else if (Number(data.price) <= 0) {
        errors.price = "Price must be greater than 0";
    } else if (isNaN(Number(data.price))) {
        errors.price = "Price must be a valid number";
    }

    // Category validation
    if (!data.category || data.category.trim() === "") {
        errors.category = "Category is required";
    } else {
        const validCategories = ['Breakfast', 'Lunch', 'Beverages', 'Snacks', 'Desserts'];
        if (!validCategories.includes(data.category)) {
            errors.category = "Invalid category selected";
        }
    }

    // Prep time validation
    if (data.prepTime !== undefined && data.prepTime !== null) {
        if (Number(data.prepTime) < 0) {
            errors.prepTime = "Prep time cannot be negative";
        } else if (!Number.isInteger(Number(data.prepTime))) {
            errors.prepTime = "Prep time must be a whole number";
        }
    }

    // Quantity validation
    if (data.quantity !== undefined && data.quantity !== null) {
        if (Number(data.quantity) < 0) {
            errors.quantity = "Quantity cannot be negative";
        } else if (!Number.isInteger(Number(data.quantity))) {
            errors.quantity = "Quantity must be a whole number";
        }
    }

    return errors;
};

// @desc    Get all menu items (with Search and Category Filter)
// @route   GET /api/menus
export const getMenuItems = async (req, res) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // 1. Filter by Category (e.g., /api/menus?category=Lunch)
        if (req.query.category) {
            query = Menu.find({ category: req.query.category });
        } 
        // 2. Search by Name (e.g., /api/menus?search=Burger)
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
// @route   POST /api/menus
export const addMenuItem= async (req, res) => {
    try {
        // Validate request data
        const validationErrors = validateMenuData(req.body);
        
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }

        const newItem = await Menu.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update menu item (Details or Sold Out Toggle)
// @route   PUT /api/menus/:id
export const updateMenuItem  = async (req, res) => {
    try {
        // Validate request data
        const validationErrors = validateMenuData(req.body);
        
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }

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
// @route   DELETE /api/menus/:id

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