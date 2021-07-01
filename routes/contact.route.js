const { Router } = require('express');
const router = Router();
const ContactController = require('../controllers/contact.controller');

router.get('/contact', ContactController.index);
router.post('/contact', ContactController.validate('save'), ContactController.save);
router.put('/contact', ContactController.validate('update'), ContactController.update);
router.delete('/contact', ContactController.delete);
router.get('/contact/create', ContactController.create);
router.get('/contact/all', ContactController.getAllContacts);
router.get('/contact/edit/:name', ContactController.edit);

module.exports = router;