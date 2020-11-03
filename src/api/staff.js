import express from 'express';

import Staff from '../services/staff.js';
import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';
import errorResponse from '../utils/errorResponse.js';

const staff = new Staff();

export const staffRouter = express.Router();

staffRouter.get('/', (req, res) => {
  res.json({
    availableMethods: [
      'GET /all',
      'GET /all?ratingAbove&ratingBelow&position',
      'GET /:id',
      'POST',
      'PUT /:id',
      'DELETE /:id'
    ]
  });
});

staffRouter.get('/all', async (req, res) => {
  // message
  const searchFilters = req.query;
  const areFiltersUsed = !!Object.keys(searchFilters).length;
  if (!areFiltersUsed) {
    console.log('GET Staff - All available employees');
  } else {
    const usedFilters = Object.keys(searchFilters).map(queryKey => ` * ${queryKey}: ${searchFilters[queryKey]}`);
    console.log(`GET Staff - Used filters: \n${usedFilters.join('\n')}`);
  }
  // data
  try {
    const foundItems = await staff.getAllEmployees(searchFilters);
    console.log(foundItems);
    res.json(foundItems);
  } catch (err) {
    errorResponse(err, res);
  }
});

staffRouter.get('/:id', async (req, res) => {
  // message
  console.log(`GET Staff id:${req.params.id}`);
  // data
  try {
    const foundItem = await staff.getEmployee(req.params.id);
    if (foundItem) {
      console.log(foundItem);
      res.json(foundItem);
    }
    throw new Error(NOT_FOUND);
  } catch (err) {
    errorResponse(err, res);
  }
});

staffRouter.post('/', async (req, res) => {
  // message
  console.log(`POST Staff`);
  console.log(req.body);
  // data
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
  // message
  console.log(`PUT Staff id:${req.params.id}`);
  console.log(req.body);
  // data
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
  // message
  console.log(`DELETE Staff id:${req.params.id}`);
  // data
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