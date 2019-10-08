const { dialog } = require('electron').remote

const options = {
  title: 'Datenbank für Kapla wählen',
  properties: ['openFile'],
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
}

export default () =>
  new Promise((resolve, reject) => {
    console.log('chooseDb running')
    dialog.showOpenDialog(options, result => {
      if (result && result[0]) resolve(result[0])
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('keine Datenbank gewählt')
    })
  })
