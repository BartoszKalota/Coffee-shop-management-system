import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  position: {
    type: [String],
    required: true,
    enum: ['waiter', 'waitress', 'barista', 'cleaning', 'temp']
  },
  monthlySalary: {
    type: Number,
    required: true,
    min: 2000
  }
});

export const Employee = mongoose.model('Employee', employeeSchema, 'staff');

export const getAllEmployees = async () => {
  return await Employee
    .find()
    .exec();
};

export const getEmployee = async (employeeId) => {
  return await Employee
    .findById(employeeId)
    .exec();
};

export const addEmployee = async (employeeData) => {
  const employeeInstance = new Employee(employeeData);
  const result = await employeeInstance.save();
  return result._id;
};

export const updateEmployee = async (employeeData) => {
  const dataToUpdate = { ...employeeData };
  delete dataToUpdate._id;  // need to delete _id for correct update procedure

  const result = await Employee
    .updateOne(
      {
        _id: employeeData._id
      },
      {
        '$set': dataToUpdate
      },
      { upsert: false }
    )
    .exec();
  return result.nModified;
};

export const deleteEmployee = async (employeeId) => {
  const result = await Employee
    .deleteOne({
      _id: employeeId
    })
    .exec();
  return result.deletedCount;
};