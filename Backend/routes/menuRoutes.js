const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');

// Route: /api/menu
router.route('/')
    .get(getMenuItems)
    .post(addMenuItem);

// Route: /api/menu/:id
router.route('/:id')
    .put(updateMenuItem)
    .delete(deleteMenuItem);

module.exports = router;