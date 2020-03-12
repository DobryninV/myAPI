const {google} = require('googleapis')
const keys = require('../keys')

module.exports = (number, source, keyword, region) => {
  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  )
  /**
   * авторизация через JWT, для этого получаем пользователя его ключ, даём ему права для таблицы и работаем
   */

  client.authorize( async ()=>{
    try {
      ghrun(client)
    } catch (e) {
      console.log(e.message)
    }
  })

  const ghrun = async (cl) => {
    const gsapi = google.sheets({version:"v4", auth: cl })
    await gsapi.spreadsheets.values.get({
      spreadsheetId: "1LUAy0JcLlWyHqopNn24W_Im6P6LWztomMZXskY1_b3M",
      range: '\'Номера с формы\'!A:H'
    }, (err, res) => {
      try {
        // по другому я хз как получить номер свободной строки
        const rows = res.data.values.length + 1
        const rengeForNew = `\'Номера с формы\'!A${rows}:H${rows}`
        const date = new Date()
        const a = date.toLocaleString() 
        
        const newRowText = async () => {
          let values = [
            [a, number, null, source, keyword, region],
          ]
          const resource = {values,}

          await gsapi.spreadsheets.values.update(
            {
              spreadsheetId: "1LUAy0JcLlWyHqopNn24W_Im6P6LWztomMZXskY1_b3M",
              range: rengeForNew,
              valueInputOption: "USER_ENTERED",
              resource,
            },
            (err, result) => {
              console.log(`${rengeForNew} cells updated. ${result}`)
            }
          )
        }
        newRowText()

      } catch (e) {
        console.log(e.message)
      }
    })
  }
}
