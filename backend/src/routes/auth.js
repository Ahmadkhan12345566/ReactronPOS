// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });
   const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userObject = user.toObject();
    userObject.id = userObject._id;
    delete userObject._id;
    delete userObject.__v;
    res.json({ user: userObject, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userObject = user.toObject();
    userObject.id = userObject._id;
    delete userObject._id;
    delete userObject.__v;
    res.status(201).json({ user: userObject, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
