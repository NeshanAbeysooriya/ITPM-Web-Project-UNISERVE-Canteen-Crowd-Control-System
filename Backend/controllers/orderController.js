import Order from "../models/order.js";
import Menu from "../models/Menu.js";
import { isAdmin, isCustomer } from "./userController.js";

// ================= CREATE ORDER =================
export async function createOrder(req, res) {

    console.log("BODY:", req.body);
console.log("USER:", req.user);

    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized user"
            });
        }

        // ================= ORDER ID GENERATION =================
        const orderList = await Order.find().sort({ date: -1 }).limit(1);

        let newOrderID = "ODR0000001";

        if (orderList.length !== 0) {
            let lastOrderID = orderList[0].orderID;
            let lastNumber = parseInt(lastOrderID.replace("ODR", ""));
            let newNumber = lastNumber + 1;

            newOrderID = "ODR" + newNumber.toString().padStart(7, "0");
        }

        // ================= CUSTOMER DETAILS =================
        let customerName = req.body.customerName || (user.firstName + " " + user.lastName);
        let phone = req.body.phone || "Not Provided";

        const itemsInRequest = req.body.items;

        if (!itemsInRequest || !Array.isArray(itemsInRequest)) {
            return res.status(400).json({
                message: "Items should be an array"
            });
        }

        const itemsToBeAdded = [];
        let total = 0;

        // ================= LOOP ITEMS =================
        for (let i = 0; i < itemsInRequest.length; i++) {
            const item = itemsInRequest[i];

            const menuItem = await Menu.findById(item._id);

            if (!menuItem) {
                return res.status(400).json({
                    message: "Menu item not found",
                    _id: item._id
                });
            }

            // ✅ Check stock
            if (menuItem.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${menuItem.name}`,
                    availableStock: menuItem.quantity
                });
            }

            // ✅ Add item to order
            itemsToBeAdded.push({
                _id: menuItem._id,
                name: menuItem.name,
                description: menuItem.description,
                price: menuItem.price,
                category: menuItem.category,
                image: menuItem.image,
                prepTime: menuItem.prepTime,
                quantity: item.quantity
            });

            total += menuItem.price * item.quantity;
        }

        // ================= CREATE ORDER =================
        const newOrder = new Order({
            orderID: newOrderID,
            items: itemsToBeAdded,
            customerName,
            email: user.email,
            phone,
            address: req.body.address,
            total
        });

        const savedOrder = await newOrder.save();

        // ================= REDUCE STOCK =================
        for (let i = 0; i < itemsToBeAdded.length; i++) {
            const item = itemsToBeAdded[i];

            await Menu.findByIdAndUpdate(
                item._id,
                { $inc: { quantity: -item.quantity } }
            );
        }

        res.status(201).json({
            message: "Order Created Successfully",
            order: savedOrder
        });

    } catch (err) {
        console.error("ORDER ERROR:", err.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// ================= GET ORDERS =================
export async function getOrders(req, res) {

    try {
        if (isAdmin(req)) {

            const orders = await Order
                .find()
                .populate("items._id")
                .sort({ date: -1 });

            return res.json(orders);

        } else if (isCustomer(req)) {

            const user = req.user;

            const orders = await Order
                .find({ email: user.email })
                .populate("items._id")
                .sort({ date: -1 });

            return res.json(orders);

        } else {
            return res.status(403).json({
                message: "You are not authorized to view orders"
            });
        }

    } catch (err) {
        res.status(500).json({
            message: "Error fetching orders"
        });
    }
}

// ================= UPDATE ORDER STATUS =================
export async function updateOrderStatus(req, res) {

    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "You are not authorized to update order status"
        });
    }

    try {
        const { orderID } = req.params;
        const { status } = req.body;

        await Order.updateOne(
            { orderID: orderID },
            { status: status }
        );

        res.json({
            message: "Order status updated successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to update order status"
        });
    }
}