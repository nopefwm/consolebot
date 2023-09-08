const { model, Schema } = require('mongoose');

let antinuke = new Schema({
    GuildID: String,
    Active: Boolean
})

module.exports = model('an', antinuke);