const { model, Schema } = require('mongoose');

let fmModel = new Schema({
    UserID: String,
    Username: String
})

module.exports = model('fm', fmModel);