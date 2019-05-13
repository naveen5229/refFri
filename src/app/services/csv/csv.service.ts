import { Injectable } from '@angular/core';
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  multiTableCSVWithId(tableIds) {
    let tablesHeadings = [];
    let tablesRows = [];
    tableIds.map((tableId, index) => {
      tablesHeadings.push(this.findTableHeadings(tableId));
      tablesRows.push(this.findTableRows(tableId));
    });

    let organization = { "elogist Solutions": "elogist Solutions" };
    let blankline = { "": "" };

    let info = [];
    info.push(organization);
    info.push(blankline);

    let headings = {};
    let rows = [];
    tablesHeadings.map((tableHeadings, index) => {
      tableHeadings.map((tableHeading, index2) => {
        headings[tableHeading + '-' + index] = tableHeading;
        tablesRows[index].map((row, index3) => {
          console.log('Ro---------:', row, index3);
          if (!rows[index3]) rows.push({});
          rows[index3][tableHeading + '-' + index] = row[index2];
        });
        console.log('=======:', rows);

      });
      console.log('++++++++++:', rows);
    });

    console.log('Headings:', headings);
    console.log('Rows:', rows);

    info.push(headings);
    info.push(...rows);

    new Angular5Csv(info, "report.csv");
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
        if (elthtml.indexOf('<input') > -1) {
          let eltinput = hdgCols[i].querySelector("input");
          let attrval = eltinput.getAttribute("placeholder");
          headings.push(attrval);
        } else if (elthtml.indexOf('<img') > -1) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");
          headings.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          headings.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, '');
          headings.push(plainText);
        }
      }
    }

    console.log('headings: ', headings);
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
          if (colhtml.indexOf('input') > -1) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute("placeholder");
            rowdata.push(attrval);
          } else if (colhtml.indexOf('img') > -1) {
            let eltinput = rowCols[j].querySelector("img");
            let attrval = eltinput.getAttribute("title");
            rowdata.push(attrval);
          } else if (colhtml.indexOf('href') > -1) {
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
    console.log('Rows:', rows);
    return rows;
  }

}
