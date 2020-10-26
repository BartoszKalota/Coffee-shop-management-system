import { CONFLICT, NOT_FOUND, MISSING_DATA } from '../constants/error.js';

export default (err, res) => {
  switch (err.message) {
    case CONFLICT:
      return res.status(409).send('Item already exists');
    case NOT_FOUND:
      return res.status(404).send('Item not found');
    case MISSING_DATA:
      return res.status(400).send('Missing input data');
    default:
      return res.status(500).send(`Server error: ${err.message}`);
  }
};