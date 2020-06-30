const express = require('express');
const cors = require('cors');
const passport = require('passport');

// HTTP Logger
const morgan = require('morgan');

// Body Parse
const bodyParser = require('body-parser');

// Translations
const l10n = require('jm-ez-l10n');

l10n.setTranslationsFile('en', './language/translation.en.json');

const app = express();

require('../helper/passport')(passport);

app.use(passport.initialize());
app.use('/user', passport.authenticate('jwt', { session : false }), require('../modules/v1/user/userRoute') );
app.set('port', process.env.PORT);
app.use(l10n.enableL10NExpress);
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '1gb' }));
app.use(cors());
app.use('/api', require('../routes'));

module.exports = app;
