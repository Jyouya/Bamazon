const express = require('express');
const db = require('./models');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));

require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app, express);

app.listen(PORT)