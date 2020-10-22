import MongoClient from 'mongodb';
import axios from 'axios';

import { connectToDB } from '../src/db';
import { DB_NAME } from '../src/config/db';
import { APP_HOST, APP_PORT } from '../src/config/app';

const { ObjectID } = MongoClient;

describe('Staff API', () => {
  let appUrl;
  let connection;

  beforeAll(async () => {
    appUrl = `http://${APP_HOST}:${APP_PORT}/api/1/staff`;
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
      'GET /:id?ratingAbove&ratingBelow&page&position',
      'POST /:id',
      'PUT',
      'DELETE /:id',
    ]);
  });

  describe('Add Employee', () => {
    it('should stop at validation - missing data', async () => {
      const employeeData = {
        startedAt: '2020-04-19T20:50:13.995Z',
        rating: 4.5,
        position: ['waiter'],
        monthlySalary: 4000,
      };

      try {
        await axios.put(appUrl, employeeData);
        throw new Error('SHOULD NOT THROW');
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(400);
        expect(data.error).toEqual('Validation error');
        expect(data.message).toEqual('"firstName" is required');
      }
    });

    it('should add a new employee', async () => {
      const employeeData = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        startedAt: '2020-04-19T20:50:13.995Z',
        rating: 4.5,
        position: ['waiter'],
        monthlySalary: 4000,
      };

      const result = await axios.put(appUrl, employeeData);
      const { data } = result;

      expect(data).toBeDefined();
      expect(data && data.id).toEqual(expect.stringMatching(/[a-f0-9]{24}/));
    });
  });

  describe('Delete employee', () => {
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
    });

    it('should not delete employee if id is incorrect', async () => {
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

    it('should return error when deleting non-existing employee', async () => {
      try {
        await axios.delete(`${appUrl}/123123123123456456456456`);
      } catch (err) {
        const data = (err.response && err.response.data) || {};

        expect(err.response && err.response.status).toEqual(404);
        expect(data.error).toEqual('Entity not found');
      }
    });

    it('should return ok if employee was deleted', async () => {
      const result = await axios.delete(`${appUrl}/123123123123123123123213`);
      const { data } = result;

      expect(data).toEqual({
        ok: true,
      });
    });
  });

  describe('Get employees', () => {
    beforeEach(async () => {
      const collection = connection.db(DB_NAME).collection('staff');
      try {
        await collection.drop();
      } catch (err) {
        console.log('Nothing to drop, going further');
      }

      await collection.insertMany([
        {
          _id: new ObjectID('123123123123123123123123'),
          firstName: 'Jan',
          lastName: 'Kowalski',
          startedAt: '2020-04-19T20:50:13.995Z',
          rating: 3.2,
          position: ['waiter', 'barista'],
          monthlySalary: 4000,
        },
        {
          _id: new ObjectID('456456456456456456456456'),
          firstName: 'Jan',
          lastName: 'Kowalski',
          startedAt: '2020-04-19T20:50:13.995Z',
          rating: 4.7,
          position: ['waiter', 'temp'],
          monthlySalary: 4000,
        },
      ]);
    });

    it('should return all employees when queried', async () => {
      const result = await axios.get(`${appUrl}/all`);

      const { data } = result;
      expect(data).toBeDefined();

      const { employees } = data;
      expect(employees).toBeDefined();
      expect(employees.length).toEqual(2);
    });

    it('should return employees with rating below 3.5', async () => {
      const result = await axios.get(`${appUrl}/all?ratingBelow=3.5`);

      const { data } = result;
      expect(data).toBeDefined();

      const { employees } = data;
      expect(employees).toBeDefined();
      expect(employees.length).toEqual(1);
      expect(employees[0]._id).toEqual('123123123123123123123123');
    });

    it('should return employees with rating above 4.5', async () => {
      const result = await axios.get(`${appUrl}/all?ratingAbove=4.5`);

      const { data } = result;
      expect(data).toBeDefined();

      const { employees } = data;
      expect(employees).toBeDefined();
      expect(employees.length).toEqual(1);
      expect(employees[0]._id).toEqual('456456456456456456456456');
    });

    it('should return only specified positions', async () => {
      const result = await axios.get(`${appUrl}/all?position=temp`);

      const { data } = result;
      expect(data).toBeDefined();

      const { employees } = data;
      expect(employees).toBeDefined();
      expect(employees.length).toEqual(1);
      expect(employees[0]._id).toEqual('456456456456456456456456');
    });
  });

  describe('Update employee', () => {
    beforeEach(async () => {
      const collection = connection.db(DB_NAME).collection('staff');
      await collection.updateOne(
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

    it('should update employee', async () => {
      const result = await axios.post(`${appUrl}/123123123123123123123123`, {
        firstName: `Johnny${Math.random()}`,
        lastName: 'Kowalsky',
        startedAt: '2020-04-19T20:50:13.995Z',
        rating: 4.5,
        position: ['waiter'],
        monthlySalary: 4000,
      });

      expect(result.data).toBeDefined();
      expect(result.data.updated).toEqual(1);
    });
  });
});
