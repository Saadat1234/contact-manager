const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/footie-api', { useNewUrlParser: true });

const db = mongoose.connection;
const User = require('../models/user');

db.on('error', console.error);

class UserService {
  static async create(data){
    const user = new User(data);
    return await user.save();
  }

  static async retrieve(id) {
    let data;
    if (id) {
      data = await User.findById(id)
        .populate('contacts')
        .exec();
      console.log(data.contacts);
    } else {
      data = await User.find().exec();
    }
    if (!data) {
      throw new Error('Cannot retireve data');
    }
    return data;
  }
  static async update(id, data){
    const contact = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if(!contact){
      throw new Error('Cannot update data');
    }

    return contact;
  }

  static async delete(id){
    const deleted = await User.findByIdAndDelete(id);

    if(!deleted) {
      throw new Error('Cannot delete data');
    }

    return deleted;
  }
}

module.exports = UserService;
