/**
 * gets save path
 */

import { remote, shell } from 'electron'
import writeExport from './writeExport'

const { dialog } = remote

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

export default async (geschaefte, messageShow) => {
  const { filePath: path } = await dialog.showSaveDialog(dialogOptions)
  if (path) {
    messageShow(true, 'Der Export wird aufgebaut...', '')
    // set timeout so message appears before exceljs starts working
    // and possibly blocks execution of message
    setTimeout(async () => {
      const dataArray = getDataArrayFromExportObjects(geschaefte)
      const callback = () => {
        messageShow(false, '', '')
        shell.openPath(path)
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
