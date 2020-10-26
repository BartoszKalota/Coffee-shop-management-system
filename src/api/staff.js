import express from 'express';

import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';
import Staff from '../services/staff.js';

const staff = new Staff();

export const staffRouter = express.Router();

staffRouter.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /:id', 'POST', 'PUT /:id', 'DELETE /:id']
  });
});

staffRouter.get('/:id', async (req, res) => {
  console.log(`GET Staff id:${req.params.id}`);
  try {
    res.json(await staff.getEmployee(req.params.id));
  } catch (err) {
    res.status(500).send(`Server error: ${err.message}`);
  }
});

staffRouter.post('/:id?', (req, res) => {
  console.log(`POST Staff`);
  console.log(req.body);
  // temporary mock
  res.json({
    ok: true
  });
});

staffRouter.put('/:id', (req, res) => {
  console.log(`PUT Staff id:${req.params.id}`);
  console.log(req.body);
  // temporary mock
  res.json({
    ok: true
  });
});

staffRouter.delete('/:id', (req ,res) => {
  console.log(`DELETE Staff id:${req.params.id}`);
  // temporary mock
  res.json({
    ok: true
  });
});