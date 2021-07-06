const { Router } = require('express');
const router = Router();
const ContactController = require('../controllers/contact.controller');

router.get('/', ContactController.index);
router.post('/', ContactController.validate('save'), ContactController.save);
router.put('/', ContactController.validate('update'), ContactController.update);
router.delete('/', ContactController.delete);
router.get('/create', ContactController.create);
router.get('/all', ContactController.getAllContacts);
router.get('/edit/:name', ContactController.edit);

module.exports = router;