import express from 'express';
import {
    getMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuController.js';

const router = express.Router();

// Route: /api/menu
router.route('/')
    .get(getMenuItems)
    .post(addMenuItem);

// Route: /api/menu/:id
router.route('/:id')
    .put(updateMenuItem)
    .delete(deleteMenuItem);

export default router;