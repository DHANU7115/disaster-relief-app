// backend/routes/requests.js
const express = require('express');
const router = express.Router();
const { Request } = require('../services/dbService');

// GET all requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [['urgency', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST single request
router.post('/', async (req, res) => {
  try {
    const request = await Request.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST bulk requests (for syncing)
router.post('/bulk', async (req, res) => {
  try {
    const { requests } = req.body;
    const results = [];

    for (const reqData of requests) {
      try {
        if (reqData.localId) {
          const existing = await Request.findOne({ where: { localId: reqData.localId } });
          if (existing) {
            results.push({ localId: reqData.localId, status: 'duplicate', serverId: existing.id });
            continue;
          }
        }

        const request = await Request.create(reqData);
        results.push({ localId: reqData.localId, status: 'created', serverId: request.id });
      } catch (error) {
        results.push({ localId: reqData.localId, status: 'error', error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH update request
router.patch('/:id', async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    await request.update(req.body);
    res.json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
