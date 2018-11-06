const mongoose = require('mongoose');

const idValidator = require('mongoose-id-validator');
const {Schema} = mongoose;


const AddressSchema = new Schema({
  street: [String],
  street_number: [Number],
  city: [String],
  state: [String],
  country: [String],
  zip_code: [String],
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  }
});



AddressSchema.plugin(idValidator);

module.exports = mongoose.model('Address', AddressSchema);
