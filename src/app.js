const express = require('express');
require('./db/mongoDB.js');
const path = require('path');
const routerUser = require('./routers/users.js');
const routerTask = require('./routers/tasks.js');

const publicPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, './templates/views');

const app = express();

app.set('view engine','hbs');
app.set('views',templatePath);

app.use(express.static(publicPath));
app.use(express.json());
app.use(routerUser);
app.use(routerTask);

module.exports = app

