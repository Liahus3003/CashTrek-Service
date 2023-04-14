import express from 'express';
import {
  createLookup,
  getAllLookups,
  getLookup,
  updateLookup,
  deleteLookup
} from '../controllers/lookup.controller';

const router = express.Router();

// Create lookup
router.post('/', createLookup);

// Get all lookups
router.get('/', getAllLookups);

// Get a single lookup
router.get('/:id', getLookup);

// Update an lookup
router.put('/:id', updateLookup);

// Delete an lookup
router.delete('/:id', deleteLookup);

export default router;
