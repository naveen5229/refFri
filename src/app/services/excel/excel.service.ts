import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const XML_TYPE = 'application/xml;charset=UTF-8';
const XML_EXTENSION = '.xml';
import { CommonService } from '../common.service';
import { Workbook } from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(public common: CommonService) { }

  getMultipleSheetsInExcel(sheetNamesdata, foName, address, gstNo, csvdata) {
      let sheets = {};
      
      //console.log('sheet',sheetNamesdata,'csvdata',csvdata);
    for(let sheet in csvdata) {
      sheets[sheet] = XLSX.utils.json_to_sheet((csvdata[sheet]) ? csvdata[sheet] :[] );
    }
    const workbook: XLSX.WorkBook = { Sheets: { ...sheets }, SheetNames: sheetNamesdata};
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'GST Report');
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  saveAsXMLFile(buffer: any, fileName: string,xmldata): void {
    const data: Blob = new Blob([xmldata], { type: XML_TYPE });
    FileSaver.saveAs(data, fileName + XML_EXTENSION);
  }



  jrxExcel(title:string,headerDetail:any[], headers: any[], json: any[], filename: string, autoWidth = true): void {
    console.log("HeaderDetails:",headerDetail);
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(filename);

    let firstRow = worksheet.getCell('A1');
    let secondRow = worksheet.getCell('A2');
    let thirdRow = worksheet.getCell('A3');
    let fourthRow = worksheet.getCell('A4');

    firstRow.value = "Report Name :"+" "+title ;
    firstRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: '000000' }
    }

    if(headerDetail){
    secondRow.value = "Customer Name: "+headerDetail[2]['name'];
    secondRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: '000000' }
    }

    thirdRow.value = "Start Date : "+headerDetail[0]['sDate'];
    thirdRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: '000000' }
    }

    fourthRow.value = "End Date : "+headerDetail[1]['eDate'];
    fourthRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: '000000' }
    }
  }

    // let titleRow1 = worksheet.getCell('A2');

    // titleRow1.value = "Start Date : "+headerDetail[0]['sDate'] +"    "+"End Date : "+headerDetail[1]['eDate'];;
    // titleRow1.font = {
    //   name: 'Calibri',
    //   size: 16,
    //   bold: true,
    //   color: { argb: '0085A3' }
    // }

    // worksheet.addRow([]);

    this.jrxExcelHeader(worksheet, headers);
    this.jrxExcelData(worksheet, json, headers);
    autoWidth && this.jrxExcelCellAutoWidth(worksheet);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, filename + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  jrxExcelHeader(worksheet, headers){
    let headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
  }
  
  jrxExcelData(worksheet, data, headers,){
    data.forEach((element) => {
      let eachRow = [];
      headers.forEach((header) => {
        eachRow.push(element[header] ? (element[header].text || element[header]) : '')
      })
      if (element.isDeleted === "Y") {
        let deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell, number) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
        })
      } else {
        let insertedRow = worksheet.addRow(eachRow);
        insertedRow.eachCell((cell, number) => {
          let ele = element[headers[number - 1]];
          cell.font = {};
          // if (ele && ele.color) cell.font.color = { argb: this.common.jrxGetHexByColorName(ele.color).replace('#', '') };
        })
      }
    });
  }

  jrxExcelCellAutoWidth(worksheet){
     worksheet.columns.forEach((column) => {
      let dataMax = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value) {
          let columnLength = cell.value['length'];
          if (columnLength > dataMax) {
            dataMax = columnLength;
          }
        }
      })
      column.width = dataMax < 10 ? 10 : dataMax + 1;
    });
  }





 
}
