const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const PORT = config.get('port')

const app = express()

app.use('/api/calls', require('./router/voxi.router'))
app.use('/api/orders', require('./router/orders.router'))


async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })  
    app.listen(PORT, ()=>{ console.log(`App run on ${PORT}...`)})
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}

start()
