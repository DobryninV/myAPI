/**
 * модель для сохранения номера в базе данных монго 
*/

const {Schema, model} = require('mongoose')

const schema = new Schema({
  date: {type: Date, default: Date.now},
  number: {type: Number, required: true},
  operator: {type: String},
  ivrTone: {type: Number}
})

module.exports = model('Call1', schema)