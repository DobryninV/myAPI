const {Schema, model} = require('mongoose')

const schema = new Schema({
  date: {type: Date, default: Date.now},
  city: {type: String},
  address: {type: String}, 
  number: {type: Number, required: true}, 
  source: {type: String}, 
  keyword: {type: String}, 
  region: {type: String}
})

module.exports = model('Order', schema)