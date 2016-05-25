'use strict';

function generateSchema(mongoose) {
  return new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    receipt: {
      type: Buffer
    },
    output: {
      type: String
    }
  }, {
    collection: 'receipts'
  });
}

function generateUserModel(mongoose) {
  const schema = generateSchema(mongoose);
  return mongoose.model('Receipt', schema);
}

module.exports = generateUserModel;
