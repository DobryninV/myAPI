/**
 * данный файл служит для расспределения api запросов
 * на данный момент цель создать только один запрос
*/
const {Router} = require('express')
const router = Router()
const Call1 = require('../models/Call')
const useGHS = require('../gshAPI/callToGSH')
const numcap = require('numcap');


// http://194.67.113.113/api/calls/?callerid=79024214715&tone=2&operator=
router.get('/', async (req, res) => {
  try{
    const number = req.query.callerid
    const ivrTone = req.query.tone
    const operator = req.query.operator 
    var region = ''

    const finder = new numcap()
    /**
     * замечу что тут костыля в виде таймаута нет так как сначала скрипт ждёт сохрания call1 и только потом
     * передаёт данные дальше, за это время вроде как region успеет получить новое значение
     * На сервере такое может не прокатить...
     * придумал...
     */
    try {
    finder.getData(number, function (err, data) {
      if(data.region){
        region = data.region
      } 
    })
    } catch(e) {
      region = "noone"
    }
    
    const call1 = new Call1({
      number, ivrTone, operator
    }) 
    await call1.save()
    try {
      await useGHS(number, ivrTone, operator , region)
    } catch (e) {console.log(e.message)}
    console.log(`Call add on DB ${call1.number}`)
    res.json({call1})
    
  }catch(e){
    res.status(400).json({message: 'Ошибка отправки данных'})
  }
})

module.exports = router