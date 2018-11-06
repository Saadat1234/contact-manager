const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;

function encrypt(password){
  if (!password) return '';

  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {

  if(!this.isModified('password')) return next();

  this.password = encrypt(this.password);

  next();
});

UserSchema.methods = {
  authenticate: function(plainText){
    return bcrypt.compareSync(plainText, this.password);
  },
  toJSON: function(){
    const user = this.toObject();
    delete user.password;
    return user;
  }
};
// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);
