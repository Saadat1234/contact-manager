const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contact-api-app', { useNewUrlParser: true });


const db = mongoose.connection;
const Address = require('../models/address');

db.on('error', console.error);

class AddressService {
  static async create(data){
    const newItem = new Address(data);

    return await newItem.save();
  }

  static async retrieve({id, contactid}){
    let data;

    if (id) {
      data = await Address.findById(id)
        .populate('contact')
        .exec();
    } else if(contactid) {
      data = await Address.find({contact: contactid}).exec();
    } else {
      data = await Address.find().exec();
    }

    if(!data) {
      throw new Error('Cannot retireve data');
    }

    return data;
  }

  static async update(id, data){
    const updated = await Address.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if(!updated){
      throw new Error('Cannot update data');
    }

    return updated;
  }

  static async delete(id){
    const deleted = await Address.findByIdAndDelete(id);

    if(!deleted) {
      throw new Error('Cannot delete data');
    }

    return deleted;
  }
}

module.exports = AddressService;
