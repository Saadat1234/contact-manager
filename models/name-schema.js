const mongoose = require('mongoose');

const {Schema} = mongoose;

const NameSchema = new Schema({
  first: {
    type: String,
    required: true
  },
  last: String
}, {
  _id: false,
  toJSON: {virtuals: true}
});

NameSchema.virtual('full').get(function(){
  return `${this.first} ${this.last}`;
});

module.exports = NameSchema;
