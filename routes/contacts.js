const express = require('express');
const Boom = require('boom');
const ContactService = require('../services/contact-service');

const router = express.Router();

// Add a new contact to the db
router.post('/', async (req, res, next) => {
  try {
    const contact = await ContactService.create(req.body);
    res.json(contact);
  } catch(err) {
    if(err.name === 'ValidationError'){
      next(Boom.badRequest(err));
    }

    next(Boom.badImplementation(err));
  }

});

// List all contacts
router.get('/', async (req, res) => {
  const contacts = await ContactService.retrieve();

  res.json(contacts);
});

// Get a single contact by id
router.get('/:id', async (req, res, next) => {
  const {id} = req.params;
  try {
    const contact = await ContactService.retrieve(id);
    res.json(contact);
  } catch(err) {
    next(Boom.notFound(`No such contact with id: ${id}`));
  }
});

// Update a contact
router.put('/:id', async (req, res, next) => {
  const {id} = req.params;

  try {
    const updated = await ContactService.update(id, req.body);
    res.json(updated);
  } catch (err) {
    if(err.name === 'ValidationError'){
      next(Boom.badRequest(err));
    } else {
      next(Boom.notFound(`No such contact with id: ${id}`));
    }
  }
});

// Delete a contact
router.delete('/:id', async (req, res, next) => {
  const {id} = req.params;

  try {
    const deleted = await ContactService.delete(id);
    res.json(deleted);
  } catch (err) {
    next(Boom.notFound(`No such contact with id: ${id}`));
  }

});

module.exports = router;
