import express from 'express';

import Staff from '../services/staff.js';
import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';
import errorResponse from '../utils/errorResponse.js';

const staff = new Staff();

export const staffRouter = express.Router();

staffRouter.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /all', 'GET /:id', 'POST', 'PUT /:id', 'DELETE /:id']
  });
});

staffRouter.get('/all', async (req, res) => {
  console.log('GET Staff - All available employees');
  try {
    const foundItems = await staff.getAllEmployees();
    console.log(foundItems);
    res.json(foundItems);
  } catch (err) {
    errorResponse(err, res);
  }
});

staffRouter.get('/:id', async (req, res) => {
  console.log(`GET Staff id:${req.params.id}`);
  try {
    const foundItem = await staff.getEmployee(req.params.id);
    if (foundItem) {
      res.json(foundItem);
    }
    throw new Error(NOT_FOUND);
  } catch (err) {
    errorResponse(err, res);
  }
});

staffRouter.post('/:id?', async (req, res) => {
  console.log(`POST Staff`);
  console.log(req.body);
  try {
    if (!Object.keys(req.body).length) throw new Error(MISSING_DATA);
    const addResult = await staff.addEmployee( { _id: req.params.id, ...req.body } );
    if (addResult) {
      console.log('Employee added!');
      res.json({
        ok: true
      });
    }
    throw new Error(CONFLICT);
  } catch (err) {
    errorResponse(err, res);
  }
});

staffRouter.put('/:id', async (req, res) => {
  console.log(`PUT Staff id:${req.params.id}`);
  console.log(req.body);
  try {
    if (!Object.keys(req.body).length) throw new Error(MISSING_DATA);
    const updateResult = await staff.updateEmployee( { _id: req.params.id, ...req.body } );
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
    const deleteResult = await staff.deleteEmployee(req.params.id);
    if (deleteResult) {
      console.log('Employee deleted!');
      res.json({
        ok: true
      });
    }
    throw new Error(NOT_FOUND);
  } catch (err) {
    errorResponse(err, res);
  }
});