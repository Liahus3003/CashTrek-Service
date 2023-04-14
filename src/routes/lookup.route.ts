import express from 'express';
import {
  createWishlist,
  getAllWishlists,
  getWishlist,
  updateWishlist,
  deleteWishlist
} from '../controllers/lookup.controller';

const router = express.Router();

// Create lookup
router.post('/', createWishlist);

// Get all lookups
router.get('/', getAllWishlists);

// Get a single lookup
router.get('/:id', getWishlist);

// Update an lookup
router.put('/:id', updateWishlist);

// Delete an lookup
router.delete('/:id', deleteWishlist);

export default router;
