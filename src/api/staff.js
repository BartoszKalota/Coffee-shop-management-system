import express from 'express';

export const staffRouter = express.Router();

staffRouter.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /:id', 'POST', 'PUT /:id', 'DELETE /:id']
  });
});

staffRouter.get('/:id', (req, res) => {
  console.log(`GET Staff id:${req.params.id}`);
  // temporary mock
  res.json({
    _id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    startedAt: new Date(),
    rating: 4.5,
    position: ['waiter'],
    monthlySalary: 4000
  });
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