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