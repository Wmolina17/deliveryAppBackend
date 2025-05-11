const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    address: String
});

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const ShipmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    status: { type: String, enum: ['En preparacion', 'En camino', 'Entregado'], default: 'En preparacion' },
    address: String,
    totalPrice: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Product: mongoose.model('Product', ProductSchema),
    Shipment: mongoose.model('Shipment', ShipmentSchema)
};