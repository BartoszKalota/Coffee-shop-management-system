import express from 'express';

export const ordersRouter = express.Router();

ordersRouter.get('/', (req, res) => {
  res.json({
    availableMethods: ['GET /:id', 'POST', 'PUT /:id', 'DELETE /:id']
  });
});

ordersRouter.get('/:id', (req, res) => {
  console.log(`GET Order id:${req.params.id}`);
  // temporary mock
  res.json({
    _id: '1',
    date: new Date(),
    location: '2',
    paidIn: 'cash',
    staffId: '2',
    products: [
      {
        productId: '3',
        name: 'Mocha',
        amount: 2,
        unitPrice: 2,
      },
    ],
    total: 4
  });
});

ordersRouter.post('/:id?', (req, res) => {
  console.log(`POST Order`);
  console.log(req.body);
  // temporary mock
  res.json({
    ok: true
  });
});

ordersRouter.put('/:id', (req, res) => {
  console.log(`PUT Order id:${req.params.id}`);
  console.log(req.body);
  // temporary mock
  res.json({
    ok: true
  });
});

ordersRouter.delete('/:id', (req ,res) => {
  console.log(`DELETE Order id:${req.params.id}`);
  // temporary mock
  res.json({
    ok: true
  });
});