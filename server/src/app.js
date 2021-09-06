const express = require('express');
const app = express();
require('./db/mongoDB.js');
const routerUser = require('./routers/users.js');
const routerTask = require('./routers/tasks.js');

app.use(express.json());
app.use(routerUser);
app.use(routerTask);

module.exports = app

