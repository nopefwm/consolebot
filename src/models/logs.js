const { model, Schema } = require('mongoose');

let logs = new Schema({
    Guild: String,
    Channel: String,
})

module.exports = model('logs', logs);