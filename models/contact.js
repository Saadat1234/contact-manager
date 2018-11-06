const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const NameSchema = require('./name-schema');




const ContactSchema = new mongoose.Schema({
  name: {
    type: NameSchema,
    required: true
  },

  phone_Number: [Number],
  Email: [String],
  Birth_Date: Date,

},


{toJSON: {virtuals: true}});

ContactSchema.virtual('address', {
  ref: 'address',
  localField: '_id',
  foreignField: 'contact'
});


ContactSchema.plugin(idValidator);


module.exports = mongoose.model('Contact', ContactSchema);
