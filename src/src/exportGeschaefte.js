/**
 * gets save path
 */

import { ipcRenderer } from 'electron'
import writeExport from './writeExport'

function getDataArrayFromExportObjects(exportObjects) {
  const dataArray = []
  // first the field names:
  dataArray.push(Object.keys(exportObjects[0]))
  // then the field values
  exportObjects.forEach((object) =>
    dataArray.push(
      Object.keys(object).map((key, index) => {
        /**
         * exceljs errors out if first member of array is null
         * see: https://github.com/guyonroche/exceljs/issues/111
         */
        if (object[key] === null && index === 0) {
          return ''
        }
        return object[key]
      }),
    ),
  )
  return dataArray
}

const dialogOptions = {
  title: 'exportierte Geschäfte speichern',
  filters: [
    {
      name: 'Excel-Datei',
      extensions: ['xlsx'],
    },
  ],
}

const exportGeschaefte = async (geschaefte, messageShow) => {
  const path = await ipcRenderer.invoke('save-dialog-get-path', dialogOptions)
  if (path) {
    messageShow(true, 'Der Export wird aufgebaut...', '')
    // set timeout so message appears before exceljs starts working
    // and possibly blocks execution of message
    setTimeout(async () => {
      const dataArray = getDataArrayFromExportObjects(geschaefte)
      const callback = () => {
        messageShow(false, '', '')
        ipcRenderer.invoke('open-url', path)
      }
      try {
        await writeExport(path, dataArray, callback)
      } catch (error) {
        messageShow(true, 'Fehler:', error.message)
        setTimeout(() => messageShow(false, '', ''), 8000)
        return
      }
    })
  }
}

export default exportGeschaefte
