import express from 'express';

import Staff from '../services/staff.js';
import { NOT_FOUND, MISSING_DATA } from '../constants/error.js';
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
    await staff.addEmployee( { _id: req.params.id , ...req.body } );
    console.log('Employee added!');
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
    if (!Object.keys(req.body).length) throw new Error(MISSING_DATA);
    const updateResult = await staff.updateEmployee( { _id: req.params.id , ...req.body } );
    if (updateResult) {
      console.log('Employee updated!');
      res.json({
        ok: true
      });
    }
    throw new Error(NOT_FOUND);
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