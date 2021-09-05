const mongoose = require('mongoose');
const {
    mongoUser,
    mongoPass,
    mongoIP,
    mongoPort,
} = require('../../config/config');

mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@${mongoIP}:${mongoPort}/?authSource=admin`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
