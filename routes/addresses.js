const express = require('express');
const Boom = require('boom');
const AddressService = require('../services/address-service');

const router = express.Router();

// Add a new address to the db
router.post('/', async (req, res, next) => {
  try {
    const address = await AddressService.create(req.body);
    res.json(address);
  } catch(err) {
    if(err.name === 'ValidationError'){
      next(Boom.badRequest(err));
    }

    next(Boom.badImplementation(err));
  }

});

// List all address
router.get('/', async (req, res) => {
  const {contactid} = req.query;
  // If the team id was passed as a query param it will filter address for that team
  const address = await AddressService.retrieve({contactid});

  res.json(address);
});

// Get a single address by id
router.get('/:id', async (req, res, next) => {
  const {id} = req.params;
  try {
    const address = await AddressService.retrieve({id});
    res.json(address);
  } catch(err) {
    next(Boom.notFound(`No such address with id: ${id}`));
  }
});

// Update a address
router.put('/:id', async (req, res, next) => {
  const {id} = req.params;

  try {
    const updated = await AddressService.update(id, req.body);
    res.json(updated);
  } catch (err) {
    if(err.name === 'ValidationError'){
      next(Boom.badRequest(err));
    } else {
      next(Boom.notFound(`No such address with id: ${id}`));
    }
  }
});

// Delete a address
router.delete('/:id', async (req, res, next) => {
  const {id} = req.params;

  try {
    const deleted = await AddressService.delete(id);
    res.json(deleted);
  } catch (err) {
    next(Boom.notFound(`No such address with id: ${id}`));
  }

});

module.exports = router;
