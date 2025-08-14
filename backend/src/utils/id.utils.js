const { v4: uuidv4 } = require('uuid');

const idUtils = {
  generateUUID() {
    return uuidv4();
  }
};

module.exports = { idUtils }; 