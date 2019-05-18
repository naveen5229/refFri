import { Injectable } from '@angular/core';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

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

  voucherPDF(pdfData) {
    console.log('Test');
    // var data = document.getElementById('voucher-pdf');
    let data = this.createPdfHtml(pdfData);
    html2canvas(data, { scale: 2 }).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const context = canvas.getContext('2d');
      context.scale(2, 2);
      context['dpi'] = 144;
      context['imageSmoothingEnabled'] = false;
      context['mozImageSmoothingEnabled'] = false;
      context['oImageSmoothingEnabled'] = false;
      context['webkitImageSmoothingEnabled'] = false;
      context['msImageSmoothingEnabled'] = false;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('report.pdf'); // Generated PDF
      var elem = document.querySelector('#voucher-pdf');
      elem.parentNode.removeChild(elem);

      // var imgData = canvas.toDataURL('image/png');
      // var imgWidth = 210;
      // var pageHeight = 295;
      // var imgHeight = canvas.height * imgWidth / canvas.width;
      // var heightLeft = imgHeight;
      // var doc = new jsPDF('p', 'mm');
      // var position = 0;

      // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      // heightLeft -= pageHeight;

      // while (heightLeft >= 0) {
      //   position = heightLeft - imgHeight;
      //   doc.addPage({ margin: { top: 80 } });
      //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      //   heightLeft -= pageHeight;
      // }
      // doc.save('file.pdf');
    });
  }

  createPdfHtml(pdfData) {
    // let pdfData = {
    //   company: 'Elogist Solutions Private Limited',
    //   address: '310, Shree Gopal Nagar,Gopalpura Bypass',
    //   city: 'Jaipur',
    //   reportName: 'Bank Payment Voucher',
    //   details: [
    //     {
    //       name: 'Voucher Number',
    //       value: 'BPV/01027'
    //     },
    //     {
    //       name: 'Branch',
    //       value: 'Affordable Site'
    //     },
    //     {
    //       name: 'Voucher Date',
    //       value: '28 Oct 2013'
    //     }
    //   ],
    //   headers: [
    //     {
    //       name: 'GL Code',
    //       textAlign: 'left'
    //     },
    //     {
    //       name: 'Particulars',
    //       textAlign: 'left'
    //     },
    //     {
    //       name: 'Debit Amount',
    //       textAlign: 'right'
    //     },
    //     {
    //       name: 'Credit Amount',
    //       textAlign: 'right'
    //     }
    //   ],
    //   table: [
    //     ['GL00184', 'By Packing Charges (Recd)', '110.0', ''],
    //     ['GL00094', 'To IDBI Bank', '', '110.0'],
    //   ],
    //   total: ['110.0', '110.0'],
    //   inWords: 'One Hundred Rupees TenPaisa Only',
    //   narration: ''
    // };

    let mainElement = document.createElement('div');
    mainElement.className = 'voucher-pdf';
    mainElement.id = 'voucher-pdf';

    mainElement.innerHTML = `
      <div class="voucher-customer">
          <div class="voucher-company">${pdfData.company}</div>
          <div class="voucher-address">${pdfData.address}</div>
          <div class="voucher-city">${pdfData.city}</div>
        </div>
        <div class="voucher-name">${pdfData.reportName}</div>
        <div class="row">
          ${this.getDetailsHtml(pdfData.details)}
        </div>
        <div>
          <table class="table table-bordered">
            <tbody>
              <tr>
              ${this.getHeadersHTML(pdfData.headers)}
              </tr>
              ${this.getRowsHTML(pdfData.table, pdfData.headers)}
              <tr>
                <th colspan="2" class="text-right"><strong>Total</strong></th>
                ${this.getTotalHTML(pdfData.total)}
              </tr>
              <tr>
                <td colspan="4"><strong>In Words:</strong> ${pdfData.inWords}</td>
              </tr>
              <tr>
                <td colspan="4"><strong>Narration:</strong> ${pdfData.narration}</td>
              </tr>
            </tbody>
          </table>
          <div class="row voucher-footer">
            <div class="col-6"></div>
            <div class="col-3 voucher-signature">
              <div>Accountant</div>
            </div>
            <div class="col-3 voucher-signature">
              <div>Approved By</div>
            </div>
          </div>
        </div>`;
    console.log(mainElement);
    document.getElementsByTagName('BODY')[0].append(mainElement);
    return mainElement;
  }

  getDetailsHtml(details) {
    let html = '';
    details.map(detail => {
      html += `
        <div class="col-6 voucher-details">
          <strong>${detail.name}:</strong> <span>${detail.value}</span>
        </div>
      `;
    });

    return html;
  }

  getHeadersHTML(headers) {
    let html = '';
    headers.map(header => {
      html += `
        <th style="text-align: ${header.textAlign}">
          ${header.name}
        </th>
      `;
    });

    return html;
  }

  getRowsHTML(rows, headers) {
    let html = '';
    rows.map(row => {
      html += `
        <tr>
          ${this.getColsHTML(row, headers)}
        </tr>
      `;
    });

    return html;
  }

  getColsHTML(cols, headers) {
    let html = '';
    cols.map((col, i) => {
      html += `<td style="text-align: ${headers[i].textAlign}">${col}</td>`;
    });

    return html;
  }

  getTotalHTML(totals) {
    let html = '';
    totals.map((total, i) => {
      html += `<td class="text-right">${total}</td>`;
    });

    return html;
  }


}
