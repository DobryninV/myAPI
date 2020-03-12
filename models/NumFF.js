const {Schema, model} = require('mongoose')

const schema = new Schema({
  date: {type: Date, default: Date.now},
  number: {type: Number},
  source: {type: String}, 
  keyword: {type: String}, 
  region: {type: String}
})

module.exports = model('NumFF', schema)