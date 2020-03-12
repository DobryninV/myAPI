/**
 * этот роутер служит судя по наванию для создания записей с данными о заявке в БД и ГТ
 * что тут особенного и интересного?
 * Посмотреть на numcap и setTimeout и попробуй понять почему это костыль?
 */

const {Router} = require('express')
const router = Router()
const numcap = require('numcap')

const NumFF = require('../models/NumFF')
const Order = require('../models/Orders')
const orderGH = require('../gshAPI/ordersToGSH')
const numFFGH = require('../gshAPI/numFFormGSH')



// http://194.67.113.113/api/orders/order?city=ростов&address=богдана&number=79673084717&source=yandex&keyword=rostelekom
router.get('/order', async (req, res) => {
  try{
    
    const city = req.query.city
    const address = req.query.address
    const number = req.query.number
    const source = req.query.source
    const keyword = req.query.keyword  
    var region = ''

    const findReg = new numcap()
    /**
     * новый объект класса numcap обращается к методу который первым параметром принимет номер а второй парам функция
     * которая принимает обработанные данные номера и присваивает их переменной region но долго
     * и получается что orderGH не ждет пока region поменяет значение и отправляет ничего дальше
     * И тут помагает костыль в виде таймаута(работает и збс)
     */
    findReg.getData(number, function (err, data) {
      if(!err){
        region = data.region
      } 
    })
    const order = new Order({
      city, address, number, source, keyword, region
    })
    
    await order.save()
    setTimeout(async()=>{
      try {
        await orderGH(city, address, number, source, keyword, region)
      } catch (e) {
        console.log(e.message)
      }
      res.json({message: 'Заявка принята'})
    }, 500)
    /*res.json({order})*/
  }catch(e){
    console.log(e.message)
    res.status(400).json({message: 'Ошибка отправки данных'})
  }
})

/**
 * http://194.67.113.113/api/orders/number?number=<number>&source=<utm_source>&keyword=<utm_term>
 * Роутер для обработки формы с одним только номером
 */
router.get('/number', async (req, res) => {
  try{
    const number = req.query.number
    const source = req.query.source
    const keyword = req.query.keyword  
    var region = ''

    const findReg = new numcap()
    
    findReg.getData(number, function (err, data) {
      if(!err){
        region = data.region
      } 
    })
    const numff = new NumFF({
      number, source, keyword, region
    })
    
    await numff.save()
    setTimeout(async()=>{
      try {
        await numFFGH(number, source, keyword, region)
      } catch (e) {
        console.log(e.message)
      }
      res.json({message: 'Заявка принята'})
    }, 500)
    
  }catch(e){
    console.log(e.message)
    res.status(400).json({message: 'Ошибка отправки данных'})
  }
})

module.exports = router