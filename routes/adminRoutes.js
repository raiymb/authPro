const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const router = express.Router();

const isAdmin = (req, res, next) => {
    const currentUser = req.session.user;
    if (currentUser && (currentUser.username === 'raiymbek_batyr' || currentUser.isAdmin)) {
        next();
    } else {
        res.status(403).send('Unauthorized'); 
    }
};

router.use(isAdmin);

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin', { users, currentUser: req.session.user }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('editUser', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Both fields are required');
        }

        await User.findByIdAndUpdate(req.params.id, { username, password });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/add', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Both fields are required');
        }
  
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }
  
        const user = new User({ username, password });
        await user.save();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to handle deleting a user
router.post('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
