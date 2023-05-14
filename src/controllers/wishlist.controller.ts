import { Request, Response } from 'express';
import Wishlist, { IWishlist } from '../models/wishlist.model';

// Create wishlist
export const createWishlist = async (req: Request, res: Response) => {
  try {
    const { name, userId, budget, notes, priority }: IWishlist = req.body;

    const wishlist = new Wishlist({ name, userId, budget, notes, priority, createdDate: new Date() });
    const savedWishlist = await wishlist.save();

    res.status(201).json(savedWishlist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all wishlists
export const getAllWishlists = async (req: Request, res: Response) => {
  try {
    const wishlists = await Wishlist.find({userId: req.query.userId});
    res.json(wishlists);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.status(200).json(wishlist);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update an wishlist
export const updateWishlist = async (req: Request, res: Response) => {
  try {
    const data = {...req.body, updatedDate: new Date()};
    const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    res.json(wishlist);
  }
  catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an wishlist
export const deleteWishlist = async (req: Request, res: Response) => {
    try {
      const wishlist = await Wishlist.findByIdAndDelete(req.params.id);
      if (!wishlist) {
        return res.status(404).json({ error: 'Wishlist not found' });
      }
      res.json({ message: 'Wishlist deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
};
