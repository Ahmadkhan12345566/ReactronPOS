// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { toObjectWithId } from '../utils/transform.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT secret is not configured' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' });
    const userObject = toObjectWithId(user);
    delete userObject.password;
    res.json({ user: userObject, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, ...rest } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT secret is not configured' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    const userCount = await User.count();
    let nextRole = 'biller';
    if (userCount === 0) {
      nextRole = role === 'biller' ? 'biller' : 'admin';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...rest,
      email,
      password: hashedPassword,
      role: nextRole
    });
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' });
    const userObject = toObjectWithId(user);
    delete userObject.password;
    res.status(201).json({ user: userObject, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
