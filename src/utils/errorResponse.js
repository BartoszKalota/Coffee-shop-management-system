import {
  CONFLICT,
  NOT_FOUND,
  MISSING_DATA,
  PEER_ERROR
} from '../constants/error.js';

export default (err, res) => {
  switch (err.message) {
    case CONFLICT:
      return res.status(409).send('Item already exists');
    case NOT_FOUND:
      return res.status(404).send('Item not found');
    case MISSING_DATA:
      return res.status(400).send('Missing input data');
    case PEER_ERROR:
      return res.status(409).send('Peer resource does not exist');
    default:
      return res.status(500).send(`Server error: ${err.message}`);
  }
};