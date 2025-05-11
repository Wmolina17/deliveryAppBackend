const express = require('express');
const router = express.Router();
const { User, Product, Shipment } = require('./models');
const bcrypt = require('bcrypt');

router.get("/", async (req, res) => {
    res.json({ message: "¡Hola, bienvenido!" });
})

router.post('/users', async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, address });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/shipments', async (req, res) => {
    try {
        const shipment = await Shipment.create(req.body);
        res.status(201).json(shipment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.patch('/shipments/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const shipment = await Shipment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        res.json(shipment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/shipments', async (req, res) => {
    try {
        const shipments = await Shipment.find().populate('user products');
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/shipments/user/:userId', async (req, res) => {
    try {
        const shipments = await Shipment.find({ user: req.params.userId }).populate('products');
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
