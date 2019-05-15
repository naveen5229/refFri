import { Injectable } from '@angular/core';
import jsPDF from "jspdf";


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  mutliTablePdfWithId(tableIds) {
    let tablesHeadings = [];
    let tablesRows = [];
    tableIds.map(tableId => {
      tablesHeadings.push(this.findTableHeadings(tableId));
      tablesRows.push(this.findTableRows(tableId));
    });

    /**************** LOGO Creation *************** */
    let eltimg = document.createElement("img");
    eltimg.src = "assets/images/elogist.png";
    eltimg.alt = "logo";

    /**************** PDF Size ***************** */
    let maxHeadingLength = 0;
    tablesHeadings.map(tableHeadings => {
      if (maxHeadingLength < tableHeadings.length)
        maxHeadingLength = tableHeadings.length;
    });
    let pageOrientation = "Portrait";
    if (maxHeadingLength > 7) {
      pageOrientation = "Landscape";
    }

    let doc = new jsPDF({
      orientation: pageOrientation,
      unit: "px",
      format: "a4"
    });

    tablesHeadings.map((tableHeadings, index) => {
      doc = this.addTableInDoc(doc, tableHeadings, tablesRows[index]);
    });

    doc.save("report.pdf");
  }

  findTableHeadings(tableId) {
    let tblelt = document.getElementById(tableId);
    if (tblelt.nodeName != "TABLE") {
      tblelt = document.querySelector("#" + tableId + " table");
    }

    let hdg_coll = [];
    let hdgs = [];
    let hdgCols = tblelt.querySelectorAll("th");
    console.log("hdgcols:", hdgCols);
    console.log(hdgCols.length);
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
          hdgs.push(attrval);
        } else if (elthtml.indexOf('<img') > -1) {
          let eltinput = hdgCols[i].querySelector("img");
          let attrval = eltinput.getAttribute("title");
          hdgs.push(attrval);
        } else if (elthtml.indexOf('href') > -1) {
          let strval = hdgCols[i].innerHTML;
          hdgs.push(strval);
        } else {
          let plainText = elthtml.replace(/<[^>]*>/g, "");
          console.log("hdgval:" + plainText);
          hdgs.push(plainText);
        }
      }
    }

    hdg_coll.push(hdgs);
    return hdg_coll;
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
    return rows;
  }

  addTableInDoc(doc, headings, rows) {
    let tempLineBreak = { fontSize: 10, cellPadding: 3, minCellHeight: 11, minCellWidth: 10, cellWidth: 40, valign: 'middle', halign: 'center' };

    doc.autoTable({
      head: headings,
      body: rows,
      theme: 'grid',
      didDrawPage: this.didDrawPage,
      margin: { top: 80 },
      rowPageBreak: 'avoid',
      headStyles: {
        fillColor: [98, 98, 98],
        fontSize: 10,
        halign: 'center',
        valign: 'middle'

      },
      styles: tempLineBreak,
      columnStyles: { text: { cellWidth: 40, halign: 'center', valign: 'middle' } },

    });
    return doc;
  }

  didDrawPage(data) {
    console.log('-----', data);
    let doc = data.doc;
    //header
    let x = 35;
    let y = 40;


    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("elogist Solutions ", x, y);

    let pageWidth = parseInt(doc.internal.pageSize.width);
    y = 15;
    doc.setFontSize(12);
    doc.line(20, 70, pageWidth - 20, 70);

    // FOOTER
    var str = "Page " + data.pageCount;

    doc.setFontSize(10);
    doc.text(
      str,
      data.settings.margin.left,
      doc.internal.pageSize.height - 10
    );
  }


}
