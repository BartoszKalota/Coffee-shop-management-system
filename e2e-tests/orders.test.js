import MongoClient from 'mongodb';
import axios from 'axios';

import { connectToDB } from '../src/db';
import { DB_NAME } from '../src/config/db';
import { APP_HOST, APP_PORT } from '../src/config/app';

const { ObjectID } = MongoClient;

describe('Orders API', () => {
  let appUrl;
  let connection;

  beforeAll(async () => {
    appUrl = `http://${APP_HOST}:${APP_PORT}/api/1/orders`;
    connection = await connectToDB();

    const db = connection.db(DB_NAME);
    try {
      await db.dropDatabase();
    } catch (err) {
      console.log('Could not drop DB, continuing...');
    }
  });

  it('should expose the API endpoints', async () => {
    const { data } = await axios.get(appUrl);

    expect(data).toBeDefined();
    expect(data.availableMethods).toBeDefined();
    expect(data.availableMethods).toEqual([
      'GET /:id?dateFrom&dateTo&page',
      'POST /:id',
      'PUT',
      'DELETE /:id',
    ]);
  });

  describe('Add Order', () => {
    it('should stop at validation - missing data', async () => {
      const orderData = {
        date: new Date('2020-02-01T10:10:10.100Z'),
        location: '2',
        staffId: new ObjectID('123123123123123123123213'),
        products: [
          {
            productId: new ObjectID('123123123123123123123213'),
            name: 'Mocha',
            amount: 2,
            unitPrice: 2,
          },
        ],
        total: 4,
      };

      try {
        await axios.put(appUrl, orderData);
        throw new Error('SHOULD NOT THROW');
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(400);
        expect(data.error).toEqual('Validation error');
        expect(data.message).toEqual('"paidIn" is required');
      }
    });

    it('should add a new order', async () => {
      const order = {
        date: new Date('2020-02-01T10:10:10.100Z'),
        location: '2',
        paidIn: 'cash',
        staffId: new ObjectID('123123123123123123123213'),
        products: [
          {
            productId: new ObjectID('123123123123123123123213'),
            name: 'Mocha',
            amount: 2,
            unitPrice: 2,
          },
        ],
        total: 4,
      };

      const result = await axios.put(appUrl, order);
      const { data } = result;

      expect(data).toBeDefined();
      expect(data && data.id).toEqual(expect.stringMatching(/[a-f0-9]{24}/));
    });
  });

  describe('Delete order', () => {
    beforeEach(async () => {
      const collection = connection.db(DB_NAME).collection('orders');
      await collection.updateOne(
        { _id: new ObjectID('123123123123123123123123') },
        {
          $set: {
            date: new Date('2020-02-01T10:10:10.100Z'),
            location: '2',
            paidIn: 'cash',
            staffId: new ObjectID('123123123123123123123213'),
            products: [
              {
                productId: new ObjectID('123123123123123123123213'),
                name: 'Mocha',
                amount: 2,
                unitPrice: 2,
              },
            ],
            total: 4,
          },
        },
        {
          upsert: true,
        }
      );
    });

    it('should not delete order if id is incorrect', async () => {
      try {
        await axios.delete(`${appUrl}/123123123`);
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(400);
        expect(data.error).toEqual('Validation error');
        expect(data.message).toEqual(
          '"value" length must be 24 characters long'
        );
      }
    });

    it('should return error when deleting non-existing order', async () => {
      try {
        await axios.delete(`${appUrl}/123123123123456456456456`);
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(404);
        expect(data.error).toEqual('Entity not found');
      }
    });

    it('should return ok if order was deleted', async () => {
      const result = await axios.delete(`${appUrl}/123123123123123123123123`);
      const { data } = result;

      expect(data).toEqual({
        ok: true,
      });
    });
  });

  describe('Get orders', () => {
    beforeEach(async () => {
      const orders = connection.db(DB_NAME).collection('orders');
      const staff = connection.db(DB_NAME).collection('staff');
      const products = connection.db(DB_NAME).collection('products');

      try {
        await Promise.all([orders.drop(), staff.drop(), products.drop()]);
      } catch (err) {
        console.log(
          'Could not drop some of the collections, proceeding further'
        );
      }

      await staff.updateOne(
        { _id: new ObjectID('123123123123123123123213') },
        {
          $set: {
            firstName: 'Jan',
            lastName: 'Kowalski',
            startedAt: '2020-04-19T20:50:13.995Z',
            rating: 4.5,
            position: ['waiter'],
            monthlySalary: 4000,
          },
        },
        {
          upsert: true,
        }
      );

      await products.updateOne(
        { _id: new ObjectID('123123123123123123123213') },
        {
          $set: {
            name: 'Mocha 3',
            brand: 'Five Elephant',
            lastOrderDate: '2020-04-19T20:10:05.681Z',
            unitPrice: 2,
            supplierName: 'EuroKawexpol',
            available: 15,
            expirationDate: '2020-04-19T20:10:05.681Z',
            categories: ['coffee', 'premium'],
          },
        },
        {
          upsert: true,
        }
      );

      await orders.insertMany([
        {
          _id: new ObjectID('123123123123123123123123'),
          date: new Date('2020-02-01T10:10:10.100Z'),
          location: '2',
          paidIn: 'cash',
          staffId: new ObjectID('123123123123123123123213'),
          products: [
            {
              productId: new ObjectID('123123123123123123123213'),
              name: 'Mocha',
              amount: 2,
              unitPrice: 2,
            },
          ],
          total: 4,
        },
        {
          _id: new ObjectID('123123123123123123123321'),
          date: new Date('2020-01-01T10:10:10.100Z'),
          location: '2',
          paidIn: 'cash',
          staffId: new ObjectID('123123123123123123123213'),
          products: [
            {
              productId: new ObjectID('123123123123123123123213'),
              name: 'Mocha',
              amount: 2,
              unitPrice: 2,
            },
          ],
          total: 4,
        },
        {
          _id: new ObjectID('123123123123123123123456'),
          date: new Date('2020-03-01T10:10:10.100Z'),
          location: '2',
          paidIn: 'cash',
          staffId: new ObjectID('123123123123123123123213'),
          products: [
            {
              productId: new ObjectID('123123123123123123123213'),
              name: 'Mocha',
              amount: 2,
              unitPrice: 2,
            },
          ],
          total: 4,
        },
      ]);
    });

    it('should return all orders when queried', async () => {
      const result = await axios.get(`${appUrl}/all`);

      const { data } = result;
      expect(data).toBeDefined();

      const { orders } = data;
      expect(orders).toBeDefined();
      expect(orders.length).toEqual(3);
    });

    it('should return orders later than given date', async () => {
      const result = await axios.get(`${appUrl}/all?dateFrom=1580551810100`);

      const { data } = result;
      expect(data).toBeDefined();

      const { orders } = data;
      expect(orders).toBeDefined();
      expect(orders.length).toEqual(2);
      expect(orders[0]._id).toEqual('123123123123123123123123');
    });

    it('should return orders earlier than given date', async () => {
      const result = await axios.get(`${appUrl}/all?dateTo=1580551810099`);

      const { data } = result;
      expect(data).toBeDefined();

      const { orders } = data;
      expect(orders).toBeDefined();
      expect(orders.length).toEqual(1);
      expect(orders[0]._id).toEqual('123123123123123123123321');
    });
  });

  describe('Update order', () => {
    beforeEach(async () => {
      const staff = connection.db(DB_NAME).collection('staff');
      await staff.updateOne(
        { _id: new ObjectID('123123123123123123123213') },
        {
          $set: {
            firstName: 'Jan',
            lastName: 'Kowalski',
            startedAt: '2020-04-19T20:50:13.995Z',
            rating: 4.5,
            position: ['waiter'],
            monthlySalary: 4000,
          },
        },
        {
          upsert: true,
        }
      );

      const products = connection.db(DB_NAME).collection('products');
      await products.updateOne(
        { _id: new ObjectID('123123123123123123123213') },
        {
          $set: {
            name: 'Mocha 3',
            brand: 'Five Elephant',
            lastOrderDate: '2020-04-19T20:10:05.681Z',
            unitPrice: 2,
            supplierName: 'EuroKawexpol',
            available: 15,
            expirationDate: '2020-04-19T20:10:05.681Z',
            categories: ['coffee', 'premium'],
          },
        },
        {
          upsert: true,
        }
      );

      const orders = connection.db(DB_NAME).collection('orders');
      await orders.updateOne(
        { _id: new ObjectID('123123123123123123123213') },
        {
          $set: {
            date: '2020-01-01T10:10:10.100Z',
            location: '2',
            paidIn: 'cash',
            staffId: new ObjectID('123123123123123123123213'),
            products: [
              {
                productId: new ObjectID('123123123123123123123213'),
                name: 'Mocha',
                amount: 2,
                unitPrice: 2,
              },
            ],
            total: 4,
          },
        },
        {
          upsert: true,
        }
      );
    });

    it('should throw error when one of peer entities are missing', async () => {
      const products = connection.db(DB_NAME).collection('products');
      await products.deleteOne({
        _id: new ObjectID('123123123123123123123213'),
      });

      try {
        await axios.post(`${appUrl}/123123123123123123123213`, {
          date: '2020-01-01T10:10:10.100Z',
          location: `2${Math.random()}`,
          paidIn: 'cash',
          staffId: '123123123123123123123213',
          products: [
            {
              productId: '123123123123123123123213',
              name: 'Mocha',
              amount: 2,
              unitPrice: 2,
            },
          ],
          total: 4,
        });
        throw new Error('NOT_THROWN');
      } catch (err) {
        expect(err.response.data).toBeDefined();
        expect(err.response.data.error).toEqual('Peer resource does not exist');
        expect(err.response.data.message).toEqual(
          'Missing following products: 123123123123123123123213'
        );
      }
    });

    it('should return error for empty update data', async () => {
      try {
        await axios.post(`${appUrl}/123123123123456456456456`);
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(400);
        expect(data.error).toEqual('Missing input parameters');
      }
    });

    it('should return validation error if field does not match schema', async () => {
      try {
        await axios.post(`${appUrl}/123123123123456456456456`, {
          some: 'field',
        });
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(400);
        expect(data.error).toEqual('Validation error');
        expect(data.message).toEqual('"some" is not allowed');
      }
    });

    it('should update order', async () => {
      const result = await axios.post(`${appUrl}/123123123123123123123213`, {
        date: '2020-01-01T10:10:10.100Z',
        location: `2${Math.random()}`,
        paidIn: 'cash',
        staffId: '123123123123123123123213',
        products: [
          {
            productId: '123123123123123123123213',
            name: 'Mocha',
            amount: 2,
            unitPrice: 2,
          },
        ],
        total: 4,
      });

      expect(result.data).toBeDefined();
      expect(result.data.updated).toEqual(1);
    });
  });
});
