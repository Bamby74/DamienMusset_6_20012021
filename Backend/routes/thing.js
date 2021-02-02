const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const thingCtrl = require('../controllers/thing');

router.get('/', auth, thingCtrl.getAllThing);
router.post('/', auth, thingCtrl.createThing);
router.get('/:id', auth, thingCtrl.getOneThing);
router.put('/:id', auth, thingCtrl.modifyThing);
router.delete('/:id', auth, thingCtrl.deleteThing);


module.exports = router;
