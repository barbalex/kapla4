import { ipcRenderer } from 'electron'

const options = {
  title: 'Datenbank für Kapla wählen',
  properties: ['openFile'],
  filters: [{ name: 'sqlite-Datenbanken', extensions: ['db'] }],
}

const chooseDb = async () => {
  const path = await ipcRenderer.invoke('open-dialog-get-path', options)
  return path.filePaths[0]
}

export default chooseDb
