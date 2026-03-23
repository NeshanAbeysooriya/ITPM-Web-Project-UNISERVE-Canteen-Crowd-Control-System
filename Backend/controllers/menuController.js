const Menu = require('../models/Menu');

// @desc    Get all menu items (with Search and Category Filter)
// @route   GET /api/menu
exports.getMenuItems = async (req, res) => {
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
exports.addMenuItem = async (req, res) => {
    try {
        // Generate menuID safely (avoid replace on undefined) and avoid duplicates.
        delete req.body.menuID; // always backend-generated
        delete req.body.menuId; // remove legacy field if submitted

        const lastMenuItem = await Menu.find()
            .sort({ createdAt: -1 })
            .limit(1);
        let newMenuID = "M0000001";

        if (lastMenuItem.length !== 0) {
            const candidate = lastMenuItem[0].menuID || lastMenuItem[0].menuId || "";
            const lastMenuID = String(candidate).trim();
            const match = /^M(\d+)$/.exec(lastMenuID);
            if (match) {
                const lastNumber = Number.parseInt(match[1], 10);
                if (!Number.isNaN(lastNumber)) {
                    const nextNumber = lastNumber + 1;
                    newMenuID = "M" + nextNumber.toString().padStart(7, "0");
                }
            }
        }

        req.body.menuID = newMenuID;

        const newItem = await Menu.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update menu item (Details or Sold Out Toggle)
// @route   PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
    try {
        // Prevent menuID changes: keep identity stable and avoid unique conflict.
        if (req.body.menuID) delete req.body.menuID;

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
exports.deleteMenuItem = async (req, res) => {
    try {
        const item = await Menu.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, message: "Item removed" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};