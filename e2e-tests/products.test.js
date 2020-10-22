import MongoClient from 'mongodb';
import axios from 'axios';

import { connectToDB } from '../src/db';
import { DB_NAME } from '../src/config/db';
import { APP_HOST, APP_PORT } from '../src/config/app';

const { ObjectID } = MongoClient;

describe('Products API', () => {
  let appUrl;
  let connection;

  beforeAll(async () => {
    appUrl = `http://${APP_HOST}:${APP_PORT}/api/1/products`;
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
      'GET /:id?amountAtLeast&brand&categories&page',
      'POST /:id',
      'PUT',
      'DELETE /:id',
    ]);
  });

  describe('Add Product', () => {
    it('should stop at validation - missing data', async () => {
      const productData = {
        name: 'Mocha',
        brand: 'Bialetti',
        lastOrderDate: '2020-04-19T20:10:05.681Z',
        unitPrice: 2,
        supplierName: 'EuroKawexpol',
        expirationDate: '2020-04-19T20:10:05.681Z',
        categories: ['coffee'],
      };

      try {
        await axios.put(appUrl, productData);
        throw new Error('SHOULD NOT THROW');
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(400);
        expect(data.error).toEqual('Validation error');
        expect(data.message).toEqual('"available" is required');
      }
    });

    it('should add a new product', async () => {
      const productData = {
        name: 'Mocha',
        brand: 'Bialetti',
        lastOrderDate: '2020-04-19T20:10:05.681Z',
        unitPrice: 2,
        supplierName: 'EuroKawexpol',
        available: 10,
        expirationDate: '2020-04-19T20:10:05.681Z',
        categories: ['coffee'],
      };

      const result = await axios.put(appUrl, productData);
      const { data } = result;

      expect(data).toBeDefined();
      expect(data && data.id).toEqual(expect.stringMatching(/[a-f0-9]{24}/));
    });
  });

  describe('Delete product', () => {
    beforeEach(async () => {
      const collection = connection.db(DB_NAME).collection('products');
      await collection.updateOne(
        { _id: new ObjectID('123123123123123123123213') },
        {
          $set: {
            name: 'Mocha',
            brand: 'Bialetti',
            lastOrderDate: '2020-04-19T20:10:05.681Z',
            unitPrice: 2,
            supplierName: 'EuroKawexpol',
            available: 10,
            expirationDate: '2020-04-19T20:10:05.681Z',
            categories: ['coffee'],
          },
        },
        {
          upsert: true,
        }
      );
    });

    it('should not delete product if id is incorrect', async () => {
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

    it('should return error when deleting non-existing product', async () => {
      try {
        await axios.delete(`${appUrl}/123123123123456456456456`);
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(404);
        expect(data.error).toEqual('Entity not found');
      }
    });

    it('should return ok if product was deleted', async () => {
      const result = await axios.delete(`${appUrl}/123123123123123123123213`);
      const { data } = result;

      expect(data).toEqual({
        ok: true,
      });
    });
  });

  describe('Get products', () => {
    beforeEach(async () => {
      const collection = connection.db(DB_NAME).collection('products');
      try {
        await collection.drop();
      } catch (err) {
        console.log('Nothing to drop, going further');
      }

      await collection.insertMany([
        {
          _id: new ObjectID('123123123123123123123123'),
          name: 'Mocha 1',
          brand: 'Bialetti',
          lastOrderDate: '2020-04-19T20:10:05.681Z',
          unitPrice: 2,
          supplierName: 'EuroKawexpol',
          available: 10,
          expirationDate: '2020-04-19T20:10:05.681Z',
          categories: ['coffee'],
        },
        {
          _id: new ObjectID('456456456456456456456456'),
          name: 'Mocha 2',
          brand: 'Five Elephant',
          lastOrderDate: '2020-04-19T20:10:05.681Z',
          unitPrice: 2,
          supplierName: 'EuroKawexpol',
          available: 5,
          expirationDate: '2020-04-19T20:10:05.681Z',
          categories: ['coffee'],
        },
        {
          _id: new ObjectID('789789789789789789789789'),
          name: 'Mocha 3',
          brand: 'Five Elephant',
          lastOrderDate: '2020-04-19T20:10:05.681Z',
          unitPrice: 2,
          supplierName: 'EuroKawexpol',
          available: 15,
          expirationDate: '2020-04-19T20:10:05.681Z',
          categories: ['coffee', 'premium'],
        },
      ]);
    });

    it('should return all products when queried', async () => {
      const result = await axios.get(`${appUrl}/all`);

      const { data } = result;
      expect(data).toBeDefined();

      const { products } = data;
      expect(products).toBeDefined();
      expect(products.length).toEqual(3);
    });

    it('should return products with rating amount of at least 6', async () => {
      const result = await axios.get(`${appUrl}/all?amountAtLeast=6`);

      const { data } = result;
      expect(data).toBeDefined();

      const { products } = data;
      expect(products).toBeDefined();
      expect(products.length).toEqual(2);
      expect(products[0]._id).toEqual('123123123123123123123123');
    });

    it('should return products with brand being "Five Elephant"', async () => {
      const result = await axios.get(`${appUrl}/all?brand=Five+Elephant`);

      const { data } = result;
      expect(data).toBeDefined();

      const { products } = data;
      expect(products).toBeDefined();
      expect(products.length).toEqual(2);
      expect(products[0]._id).toEqual('456456456456456456456456');
    });

    it('should return products in given categories', async () => {
      const result = await axios.get(`${appUrl}/all?categories=coffee,premium`);

      const { data } = result;
      expect(data).toBeDefined();

      const { products } = data;
      expect(products).toBeDefined();
      expect(products.length).toEqual(1);
      expect(products[0]._id).toEqual('789789789789789789789789');
    });
  });

  describe('Update product', () => {
    beforeEach(async () => {
      const collection = connection.db(DB_NAME).collection('staff');
      try {
        await collection.drop();
      } catch (err) {
        console.log('Nothing to drop, going further');
      }

      await collection.updateOne(
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

    it('should update product', async () => {
      const result = await axios.post(`${appUrl}/123123123123123123123123`, {
        name: `Mocha 3${Math.random()}`,
        brand: 'Five Elephant',
        lastOrderDate: '2020-04-19T20:10:05.681Z',
        unitPrice: 2,
        supplierName: 'EuroKawexpol',
        available: 15,
        expirationDate: '2020-04-19T20:10:05.681Z',
        categories: ['coffee', 'premium'],
      });

      expect(result.data).toBeDefined();
      expect(result.data.updated).toEqual(1);
    });
  });
});
