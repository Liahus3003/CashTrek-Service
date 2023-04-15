import { Request, Response } from 'express';
import Lookup, { ILookup } from '../models/lookup.model';

// Create lookup
export const createLookup = async (req: Request, res: Response) => {
  try {
    const { name, type, description }: ILookup = req.body;

    const lookup = new Lookup({ name, type, description, isActive: true, createdDate: new Date() });
    const savedLookup = await lookup.save();

    res.status(201).json(savedLookup);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all lookups
export const getAllLookups = async (req: Request, res: Response) => {
  try {
    const lookups = await Lookup.find();
    res.json(lookups);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single lookup
export const getLookup = async (req: Request, res: Response) => {
  try {
    const lookup = await Lookup.findById(req.params.id);
    if (!lookup) {
      return res.status(404).json({ error: 'Lookup not found' });
    }
    res.status(200).json(lookup);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update an lookup
export const updateLookup = async (req: Request, res: Response) => {
  try {
    const data = {...req.body, updatedDate: new Date()};
    const lookup = await Lookup.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!lookup) {
      return res.status(404).json({ error: 'Lookup not found' });
    }
    res.json(lookup);
  }
  catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an lookup
export const deleteLookup = async (req: Request, res: Response) => {
    try {
      const lookup = await Lookup.findByIdAndDelete(req.params.id);
      if (!lookup) {
        return res.status(404).json({ error: 'Lookup not found' });
      }
      res.json({ message: 'Lookup deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
};
