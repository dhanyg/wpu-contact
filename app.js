require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const contactRoutes = require('./routes/contact.route');
const app = express();

/** connect DB */
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => console.log(`Server listening on ${process.env.BASE_URL}`));
        console.log('db connected..');
    })
    .catch(err => console.log(err));

/** config & middleware */
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'dikalasepimelanda',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(methodOverride('_method'))

/** routes */
app.use(contactRoutes);
app.get('/', (req, res) => {
    res.redirect('/contact');
});
app.use((req, res) => {
    res.status(404).render('errors/404', { layout: false });
});


// app.post('/contact',
//     [
//         body('fullName').custom(async (value) => {
//             const isContactExist = await Contact.findOne({ fullName: value });
//             if (isContactExist) {
//                 throw new Error('Contact is already exist!');
//             }
//             return true;
//         }),
//         check('email', 'Invalid email!').isEmail(),
//         check('phone', 'Invalid phone number!').isMobilePhone('id-ID')
//     ],
//     async (req, res) => {
//         const errors = validationResult(req);
//         const newErrors = errors.mapped(error => newErrors[error.param].push(error));
//         // console.log(newErrors);

//         if (!errors.isEmpty()) {
//             return res.render('contact/create', { errors: newErrors, old: req.body });
//         }
//         else {
//             await Contact.insertMany(req.body);
//             req.flash('message', 'Contact has been saved!');
//             res.redirect('/');
//         }
//     }
// )
// app.delete('/contact', async (req, res) => {
//     await Contact.deleteOne({ fullName: req.body.fullName });
//     req.flash('message', 'Contact has been removed!');
//     res.redirect('/');
// });
// app.put('/contact',
//     [
//         body('fullName').custom(async (value, { req }) => {
//             const contact = await Contact.findOne({ fullName: value });
//             if (value !== req.body.oldName && contact) {
//                 throw new Error('Contact is already exist!');
//             }
//             return true;
//         }),
//         check('email', 'Invalid email!').isEmail(),
//         check('phone', 'Invalid phone number!').isMobilePhone('id-ID')
//     ],
//     async (req, res) => {
//         const contact = await Contact.findOne({ fullName: req.body.fullName })
//         const errors = validationResult(req);
//         const newErrors = errors.mapped(error => newErrors[error.param].push(error));

//         if (!errors.isEmpty()) {
//             return res.render('contact/edit', { contact, errors: newErrors, old: req.body });
//         }
//         else {
//             // res.send('OK');
//             await Contact.updateOne(
//                 { _id: req.body._id },
//                 {
//                     fullName: req.body.fullName,
//                     phone: req.body.phone,
//                     email: req.body.email
//                 }
//             );
//             req.flash('message', 'Contact has been updated!');
//             res.redirect('/');
//         }
//     });
// app.get('/contact/create', (req, res) => res.render('contact/create', { old: null }));
// app.get('/contact/edit/:name', async (req, res) => {
//     const contact = await Contact.findOne({ fullName: req.params.name });
//     res.render('contact/edit', { contact, old: null });
// });

// app.get('/contact/all', async (req, res) => {
//     const contacts = await Contact.find({});
//     res.json(contacts);
// })

