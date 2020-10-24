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