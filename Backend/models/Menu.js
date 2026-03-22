import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Please add a food item name"], 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, "Please add a description"] 
    },
    price: { 
        type: Number, 
        required: [true, "Please add a price"] 
    },
    category: { 
        type: String, 
        required: [true, "Please select a category"],
        enum: ['Breakfast', 'Lunch', 'Beverages', 'Snacks', 'Desserts'] 
    },
    image: { 
        type: String, 
        default: "no-photo.jpg" 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    prepTime: { 
        type: Number, 
        default: 15 // Estimated preparation time in minutes
    }
}, { timestamps: true });

export default mongoose.model('Menu', menuSchema);