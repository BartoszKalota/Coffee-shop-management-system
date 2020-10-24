import express from 'express';

export const staffRouter = express.Router();

staffRouter.get('/', (req, res) => {
  res.send('Staff router');
});