'use strict';
const express = require('express'); // nodejs framework
const morgan = require('morgan'); // http request logger
const nconf = require('nconf'); // config file
const pkg = require('./package.json');

nconf.argv().env('__');
nconf.defaults({
  conf: `${__dirname}/config.json`
});


nconf.file(nconf.get('conf'));

//console.log(pkg.version, nconf.get('port'),  nconf.get('es')['bundles_index'],  nconf.get('es:host'));

const ht = nconf.get('es:host');
const app = express();
app.use(morgan('dev'));
app.get('/api/version', (req, res) => res.status(200).send(pkg.version));
app.get('/api/bundles', (req, res) => res.status(200).send(ht));


require('./lib/search.js')(app, nconf.get('es'));
require('./lib/bundle.js')(app, nconf.get('es'));

app.listen(nconf.get('port'), () => console.log('ready!'));
