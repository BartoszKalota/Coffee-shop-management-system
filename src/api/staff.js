import express from 'express';

import Staff from '../services/staff.js';
import errorResponse from '../utils/errorResponse.js';

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
    errorResponse(err, res);
  }
});

staffRouter.post('/:id?', async (req, res) => {
  console.log(`POST Staff`);
  console.log(req.body);
  try {
    await staff.addEmployee( { _id: req.params.id , ...req.body } )
    res.json({
      ok: true
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

staffRouter.put('/:id', async (req, res) => {
  console.log(`PUT Staff id:${req.params.id}`);
  console.log(req.body);
  try {
    await staff.updateEmployee(req.params.id, req.body);
    res.json({
      ok: true
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

staffRouter.delete('/:id', async (req ,res) => {
  console.log(`DELETE Staff id:${req.params.id}`);
  try {
    await staff.deleteEmployee(req.params.id);
    res.json({
      ok: true
    });
  } catch (err) {
    errorResponse(err, res);
  }
});