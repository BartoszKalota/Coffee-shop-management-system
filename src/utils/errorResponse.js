import {
  CONFLICT,
  NOT_FOUND,
  MISSING_DATA,
  PEER_ERROR
} from '../constants/error.js';

export default (err, res) => {
  switch (err.message) {
    case CONFLICT: {
      const msg = 'Item already exists';
      console.log(msg);
      return res.status(409).send(msg);
    }
    case NOT_FOUND: {
      const msg = 'Item not found';
      console.log(msg);
      return res.status(404).send(msg);
    }
    case MISSING_DATA: {
      const msg = 'Missing input data';
      console.log(msg);
      return res.status(400).send(msg);
    }
    case PEER_ERROR: {
      const msg = 'Missing related peer resource (product or staff)';  
      console.log(msg);
      return res.status(409).send(msg);
    }
    default: {
      const msg = `Server error: ${err.message} \n ${err.reason}`;
      console.log(msg);
      return res.status(500).send(msg);
    }
  }
};