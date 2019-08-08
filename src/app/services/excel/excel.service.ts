import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const XML_TYPE = 'application/xml;charset=UTF-8';
const XML_EXTENSION = '.xml';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

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

 
}
