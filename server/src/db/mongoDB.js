const mongoose = require('mongoose');
const {
    mongoUser,
    mongoPass,
    mongoIP,
    mongoPort,
} = require('../../config/config');

mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@${mongoIP}:${mongoPort}/?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
