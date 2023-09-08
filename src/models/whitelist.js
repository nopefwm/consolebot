const { model, Schema } = require('mongoose');

let whitelist = new Schema({
    GuildID: String,
    UserID: String,
    Whitelisted: Boolean
})

module.exports = model('wl', whitelist);