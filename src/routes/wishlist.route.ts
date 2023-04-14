import express from 'express';
import {
  createWishlist,
  getAllWishlists,
  getWishlist,
  updateWishlist,
  deleteWishlist
} from '../controllers/wishlist.controller';

const router = express.Router();

// Create wishlist
router.post('/', createWishlist);

// Get all wishlists
router.get('/', getAllWishlists);

// Get a single wishlist
router.get('/:id', getWishlist);

// Update an wishlist
router.put('/:id', updateWishlist);

// Delete an wishlist
router.delete('/:id', deleteWishlist);

export default router;
