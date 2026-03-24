import express from 'express';
import {
    getMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItemById
} from '../controllers/menuController.js';

const router = express.Router();

// Route: /api/menus
router.route('/')
    .get(getMenuItems)
    .post(addMenuItem);

// Route: /api/menus/:id
router.route('/:id')
.get(getMenuItemById)
    .put(updateMenuItem)
    .delete(deleteMenuItem);

export default router;