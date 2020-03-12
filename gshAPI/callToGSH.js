const keys = require('../keys')
const {google} = require('googleapis')

const sheetId = '1XGsAh-77rAx8ATrkF_Egfsw-Jih9YbJfACI87NqF1l4'


module.exports = (number, ivrTone, operator, region) => {
  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  )

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
      spreadsheetId: sheetId,
      range: '\'Лист1\'!A:G',
    }, (err, res) => {
      try {
        const rows = res.data.values.length + 1
        const rengeForNew = `A${rows}:G${rows}`
        const date = new Date()
        const a = date.toLocaleString() 

        const newRowText = async () => {
          let values = [
            [a, number, ivrTone, operator, region],
          ]
          const resource = {values,}

          await gsapi.spreadsheets.values.update(
            {
              spreadsheetId: sheetId,
              range: rengeForNew,
              valueInputOption: "USER_ENTERED",
              resource,
            },
            (result) => {
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