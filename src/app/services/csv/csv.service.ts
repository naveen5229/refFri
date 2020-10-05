import { Injectable } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import * as _ from "lodash";
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private common: CommonService) { }

  /**
   * Single Or Multi Table CSV Creator
   * @param tableIds : array of tables example - ['report'] 
   * @param fileName : name of the file
   * @param details : array of obects example - [{org: 'Elogist Solutions Pvt Ltd.'}]
   */
  byMultiIds(tableIds: string[], fileName: string = 'report', details?: any[]) {
    let xrows: any[] = [{}];
    let headings = [{}];
    tableIds.map((tableId, index) => {
      this.findTableHeadings(tableId).map((col, index2) => {
        xrows[0]['tabel-' + index + '-col-' + index2] = col;
        headings[0]['tabel-' + index + '-col-' + index2] = col;
      });
    });

    tableIds.map((tableId, index) => {
      xrows = this.handleRows(this.findTableRows(tableId), index, xrows);
    });

    let blankline: any = { "": "" };
    let info: any[] = [];

    if (details) {
      details.forEach(detail => info.push({ "": "", ...detail }))
    }
    info.push(blankline);
    info.push(...headings, ...xrows);
    console.log(xrows);
    new AngularCsv(info, fileName);
  }

  findTableHeadings(tableId) {
    let headings = [];
    let tblelt = document.getElementById(tableId);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tableId + " table");
    }
    let hdgCols = tblelt.querySelectorAll('th');
    if (hdgCols.length >= 1) {
      for (let i = 0; i < hdgCols.length; i++) {
        if (hdgCols[i].innerHTML.toLowerCase().includes(">image<"))
          continue;
        if (hdgCols[i].classList.contains('del'))
          continue;
        let elthtml = hdgCols[i].innerHTML;
        if (hdgCols[i].querySelector("input")) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute("placeholder");
          headings.push(attrval);
        } else if (hdgCols[i].querySelector("img")) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");
          headings.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          headings.push(strval);
        } else {
          let plainText = hdgCols[i].innerText;
          headings.push(plainText);
        }
      }
    }
    return headings;
  }

  findTableRows(tableId) {
    //remove table cols with del class
    let tblelt = document.getElementById(tableId);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tableId + " table");
    }

    let rows = [];
    let tblrows = tblelt.querySelectorAll('tbody tr');
    if (tblrows.length >= 1) {
      for (let i = 0; i < tblrows.length; i++) {
        if (tblrows[i].classList.contains('cls-hide'))
          continue;
        let rowCols = tblrows[i].querySelectorAll('td');
        let rowdata = [];
        for (let j = 0; j < rowCols.length; j++) {
          if (rowCols[j].classList.contains('del'))
            continue;
          let colhtml = rowCols[j].innerHTML;
          if (colhtml.indexOf('<input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute("placeholder");
            rowdata.push(attrval);
          } else if (colhtml.indexOf('<img') > -1) {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput.getAttribute("title");
            rowdata.push(attrval);
          } else if (colhtml.indexOf('href=') > -1) {
            let strval = rowCols[j].innerHTML;
            rowdata.push(strval);
          } else if (colhtml.indexOf('</i>') > -1) {
            let pattern = /<i.* title="([^"]+)/g;
            let match = pattern.exec(colhtml);
            if (match != null && match.length)
              rowdata.push(match[1]);
          } else {
            let plainText = colhtml.replace(/<[^>]*>/g, "");
            rowdata.push(plainText);
          }
        }
        rows.push(rowdata);
      }
    }
    return rows;
  }

  handleRows(tableRows, table, xrows) {
    tableRows.map((row, index) => {
      row.map((col, index2) => {
        if (!xrows[index]) {
          let keys = Object.keys(xrows[0]).sort();
          let newRow = {};
          keys.map(key => newRow[key] = '');
          xrows.push(newRow);
        }
        xrows[index]['tabel-' + table + '-col-' + index2] = col;
      });
    });

    return xrows;
  }

  /**
   * Convert JSON Array To Excel File
   * @param jsonArray - String
   * @param filName - String
   */
  async jsonToExcel(jsonArray: any[], filName: string = 'report') {
    let details = await this.common.getFoDetails();
    let info = [{ "blank": "", "fo": details.foname },
    { "blank": "", "address": `${details.addressline}, Phone: ${details.phonenumber}` },
    { "blank": "", "gst": `GST: ${details.gstno}` },
    ];
    info.push(...jsonArray);
    new AngularCsv(info, "report");
  }

}
