const express = require('express');
require('./db/mongoDB.js');
const routerUser = require('./routers/users.js');
const routerTask = require('./routers/tasks.js');

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(routerUser);
app.use(routerTask);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
