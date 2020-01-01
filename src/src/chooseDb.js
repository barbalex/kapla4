const { dialog } = require('electron').remote

const options = {
  title: 'Datenbank für Kapla wählen',
  properties: ['openFile'],
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
}

const chooseDb = async () => {
  const result = await dialog.showOpenDialog(options)
  return result.filePaths[0]
}

export default chooseDb
