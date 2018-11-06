const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/footie-api', { useNewUrlParser: true });

const db = mongoose.connection;
const Contact = require('../models/contact');

db.on('error', console.error);

class ContactService {
  static async create(data){
    const contact = new Contact(data);

    return await contact.save();
  }

  static async retrieve(id) {
    let data;
    if (id) {
      data = await Contact.findById(id)
        .populate('addresses')
        .exec();
      console.log(data.addresses);
    } else {
      data = await Contact.find().exec();
    }
    if (!data) {
      throw new Error('Cannot retireve data');
    }
    return data;
  }
  static async update(id, data){
    const contact = await Contact.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if(!contact){
      throw new Error('Cannot update data');
    }

    return contact;
  }

  static async delete(id){
    const deleted = await Contact.findByIdAndDelete(id);

    if(!deleted) {
      throw new Error('Cannot delete data');
    }

    return deleted;
  }
}

module.exports = ContactService;
