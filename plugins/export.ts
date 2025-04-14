import ExcelJS from 'exceljs'
import {saveAs} from 'file-saver'
import {
  defineNuxtPlugin, useNuxtApp, Context,
} from '#app'

export default defineNuxtPlugin((nuxtApp: Context) => {
  const {nuxt2Context} = useNuxtApp()
  const getValues = (arr: any[], assay: string) => arr.reduce((acc: string | any[], c: { readAcross: { [x: string]: { toString: () => string } } }) => {
    let value = c.readAcross[assay]
    if (Number.isNaN(c.readAcross[assay])) {
      value = c.readAcross[assay].trim().split(' ')
    } else {
      value = c.readAcross[assay].toString().trim().split(' ')
    }
    if (value.length !== 1) {
      value[0] = parseFloat(value[0])
    }
    return acc.concat(value)
  }, [])

  const autoSizeColumns = (sheet: { columns: any[] }) => {
    sheet.columns.forEach((column: { eachCell: (arg0: { includeEmpty: boolean }, arg1: (cell: any) => void) => void; width: number }) => {
      let maxLength = 0
      column.eachCell({includeEmpty: true}, (cell: { value: { toString: () => { (): any; new(): any; length: any } }; font: string }) => {
        const columnLength = cell.value ? cell.value.toString().length : 10
        const isBold = cell.font && cell.font.bold
        if (columnLength > maxLength) {
          maxLength = isBold ? (columnLength * 1.5) : columnLength
        }
      })
      column.width = maxLength < 10 ? 10 : maxLength
    })
    return sheet
  }

  const formatSpreadSheet = (sheet: ExcelJS.Worksheet) => {
    // Freeze first 5 rows
    sheet.views = [{state: 'frozen', ySplit: 5}]
    sheet.columns.forEach((column: { eachCell: (arg0: (cell: any) => void) => void }) => {
      // eslint-disable-next-line max-len
      column.eachCell((cell: { row: number; col: number; font: { name?: string; size?: number; bold?: boolean; underline?: string; color?: { argb: string } }; alignment: { horizontal: string }; fill: { type: string; pattern: string; fgColor: { argb: string }; bgColor: { argb: string } }; border: { top: { style: string }; left: { style: string }; bottom: { style: string }; right: { style: string } } }) => {
        // Formatting of side headers
        if (cell.row < 6 && cell.col === 1) {
          cell.font = {
            name: 'Calibri',
            size: 14,
            bold: true,
          }
        }
        // Formatting for cell values of assays
        if (cell.row > 5 && cell.col > 1) {
          cell.alignment = {horizontal: 'center'}
        }
        // Underlining Assays
        if (cell.row > 5 && cell.col === 1) {
          cell.font = {
            underline: 'singleAccounting',
          }
        }
        // Formatting of header columns
        if (cell.row < 6 && cell.col > 1) {
          cell.alignment = {horizontal: 'center'}
        }
        // Formatting of perferred names
        if (cell.row === 2 && cell.col > 1) {
          cell.font = {
            color: {argb: '0E6993'},
            bold: true,
          }
        }
        // Formatting of target chemical
        if (cell.col === 2) {
          cell.fill = {
            type: 'pattern',
            pattern: 'lightGrid',
            fgColor: {argb: 'D0D0D0'},
            bgColor: {argb: 'D0D0D0'},
          }
          // Adding borders after fill
          cell.border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'},
          }
        }
      })
    })

    sheet = autoSizeColumns(sheet)

    return sheet
  }

  const generateFileBuffer = async(wb: ExcelJS.Workbook, isExcel: boolean) => {
    const returnBuffer = isExcel ? await wb.xlsx.writeBuffer() : await wb.csv.writeBuffer()
    return returnBuffer
  }

  const exportReadAcross = async() => {
    const isExcel = nuxt2Context.store.getters['readAcross/getDownloadValue'] === 'excel'
    const workbook = new ExcelJS.Workbook()
    let sheet = workbook.addWorksheet('GenRA')
    const target = nuxt2Context.store.getters['readAcross/getReadAcrossChemicals'][0]
    const analogs = nuxt2Context.store.getters['readAcross/getReadAcrossChemicals'].slice(1).filter((c: { selected: any }) => c.selected)
    const filter = nuxt2Context.store.getters['readAcross/getFilter']
    const chemicals = [target].concat(analogs)
    const label = ['preferred name'].concat(chemicals.reduce((acc, c) => acc.concat([c.name]), []))
    const dtxsid = ['dsstox_sid'].concat(chemicals.reduce((acc, c) => acc.concat([c.dtxsid]), []))
    const jaccard = ['similarity'].concat(chemicals.reduce((acc, c) => acc.concat([c.value]), []))
    const weight = ['molecular weight'].concat(chemicals.reduce((acc, c) => acc.concat([c.weight.toFixed(3)]), []))
    const headers = [label, dtxsid, weight, jaccard]
    const columns = [
      {
        header: 'role', key: 'role',
      },
      {
        header: 'target', key: 'target',
      },
    ].concat(analogs.reduce((acc: any[]) => acc.concat([{header: 'analog', key: 'analog'}])

      , []))

    sheet.columns = columns
    const allAssays = Object.keys(target.readAcross).sort()
    const assays = filter.length ? allAssays.filter((assay) => {
      const assay_ = RegExp(filter.toLowerCase()).test(assay.toLowerCase())
      return assay_
    }) : allAssays

    const data = assays.map((assay) => {
      if (target.predict.predicted && Object.prototype.hasOwnProperty.call(target.predict, assay)) {
        const predicted = target.predict[assay]

        const targetText = `GenRA ${predicted.text} Act=${predicted.value} (${predicted.a_s}) AUC=${predicted.auc} p=${predicted.pval}`

        return [assay, targetText].concat(getValues(analogs, assay))
      }

      return [assay].concat(getValues(chemicals, assay))
    })

    const allData = headers.concat(data)
    allData.forEach(i => sheet.addRow(i))
    sheet = isExcel ? formatSpreadSheet(sheet) : sheet
    const returnBuffer = await generateFileBuffer(workbook, isExcel)

    return returnBuffer
  }

  const download = (data: any, fileName: any, isJson = false) => {
    const dataToConvertToBlob = isJson ? JSON.stringify(data) : data
    const blob = new Blob([dataToConvertToBlob])
    saveAs(blob, `${fileName}`)
  }

  const exportFunctions = {
    exportReadAcross: exportReadAcross,
    download: download,
  }
  nuxtApp.provide('export', exportFunctions)
  // now available on `nuxtApp.$export`
})

