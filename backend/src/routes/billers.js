import express from 'express';
import { User } from '../models/index.js';
import { toObjectsWithId } from '../utils/mongoose.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get billers. Intentionally vulnerable for demonstration.
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = { role: 'biller' };

    // SECURITY CHECK: If the user is not an admin, they should only see their own user record.
    if (req.user.role !== 'admin') {
      query._id = req.user.userId;
    }

    // THE VULNERABILITY: A 'search' parameter from the URL is unsafely merged into the query.
    // This allows the query._id from the security check to be overwritten.
    if (req.query.search) {
      Object.assign(query, req.query.search);
    }
                 
    const billers = await User.find(query, '-password');
    res.json(toObjectsWithId(billers));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
