const { model, Schema } = require('mongoose');

let afkSchema = new Schema({
    Guild: String,
    Time: String,
    UserID: String,
    Afk: Boolean
})

module.exports = model('afk', afkSchema);