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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(methodOverride('_method'))

/** routes */
app.use('/contact', contactRoutes);
app.get('/', (req, res) => {
    res.redirect('/contact');
});
app.use((req, res) => {
    res.status(404).render('errors/404', { layout: false });
});