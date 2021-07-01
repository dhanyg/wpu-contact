const Contact = require('../models/Contact');
const { body, validationResult, check } = require('express-validator');

module.exports.index = (req, res) => {
    res.render('contact/index', { message: req.flash('message') });
}

module.exports.create = (req, res) => {
    res.render('contact/create', { old: null });
}

module.exports.save = async (req, res, next) => {
    const errors = validationResult(req);
    const newErrors = errors.mapped(error => newErrors[error.param].push(error));

    if (!errors.isEmpty()) {
        return res.render('contact/create', { errors: newErrors, old: req.body });
    }
    else {
        // res.send('OK');
        try {
            await Contact.insertMany(req.body);
            req.flash('message', 'Contact has been saved!');
            res.redirect('/');
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports.edit = async (req, res) => {
    try {
        const contact = await Contact.findOne({ fullName: req.params.name });
        res.render('contact/edit', { contact, old: null });
    } catch (error) {
        res.json(error);
    }
}

module.exports.update = async (req, res) => {
    try {
        const contact = await Contact.findOne({ fullName: req.body.fullName })
        const errors = validationResult(req);
        const newErrors = errors.mapped(error => newErrors[error.param].push(error));

        if (!errors.isEmpty()) {
            return res.render('contact/edit', { contact, errors: newErrors, old: req.body });
        }
        else {
            // res.send('OK');
            await Contact.updateOne(
                { _id: req.body._id },
                {
                    fullName: req.body.fullName,
                    phone: req.body.phone,
                    email: req.body.email
                }
            );
            req.flash('message', 'Contact has been updated!');
            res.redirect('/');
        }
    } catch (error) {
        res.json(error);
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Contact.deleteOne({ fullName: req.body.fullName });
        req.flash('message', 'Contact has been removed!');
        res.redirect('/');
    } catch (error) {
        res.json(error);
    }
}

module.exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ fullName: 1 });
        res.json(contacts);
    } catch (error) {
        res.json(error);
    }
}

module.exports.validate = (method) => {
    switch (method) {
        case 'save':
            return [
                body('fullName').custom(async (value) => {
                    const isContactExist = await Contact.findOne({ fullName: value });
                    if (isContactExist) {
                        throw new Error('Contact is already exist!');
                    }
                    return true;
                }),
                check('email', 'Invalid email!').optional({ checkFalsy: true }).isEmail(),
                check('phone', 'Invalid phone number!').optional({ checkFalsy: true }).isMobilePhone('id-ID'),
                check('contactType', 'Please choose contact type!').notEmpty()
            ];
        case 'update':
            return [
                body('fullName').custom(async (value, { req }) => {
                    const contact = await Contact.findOne({ fullName: value });
                    if (value !== req.body.oldName && contact) {
                        throw new Error('Contact is already exist!');
                    }
                    return true;
                }),
                check('email', 'Invalid email!').optional({ checkFalsy: true }).isEmail(),
                check('phone', 'Invalid phone number!').optional({ checkFalsy: true }).isMobilePhone('id-ID'),
                check('contactType', 'Please choose contact type!').notEmpty()
            ]
    }
}