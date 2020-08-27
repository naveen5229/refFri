import { Injectable } from '@angular/core';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { CommonService } from '../common.service';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';
import html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';

interface jrxPdfOptions {
  logo?: string;
}


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(public common: CommonService,
    public user: UserService,
    private datePipe: DatePipe,
    public api: ApiService) {
  }

  /**
   * Print Pdf from multi tables
   * @param tableIds Table id's
   * @param fileName File name
   * @param details In Format = [['Customer: Elogist']]
   */
  jrxTablesPDF(tableIds: string[], fileName: string = 'report', details?: any, options?: jrxPdfOptions) {
    let tablesHeadings = [];
    let tablesRows = [];
    tableIds.map(tableId => {
      tablesHeadings.push(this.findTableHeadings(tableId));
      tablesRows.push(this.findTableRows(tableId));
    });

    /**************** PDF Size ***************** */
    let maxHeadingLength = 0;
    tablesHeadings.map(tblHeadings => {
      if (maxHeadingLength < tblHeadings[0].length)
        maxHeadingLength = tblHeadings[0].length;
    });
    let pageOrientation = "Portrait";
    if (maxHeadingLength >= 7) {
      pageOrientation = "Landscape";
    }
    let doc = new jsPDF({
      orientation: pageOrientation,
      unit: "px",
      format: "a4"
    });


    /********************* Logo ************* */
    try {
      let eltimg = document.createElement("img");
      eltimg.src = (options && options.logo) ? options.logo : "assets/images/elogist.png";
      doc.addImage(eltimg, 'JPEG', parseInt(doc.internal.pageSize.width) - 55, 15, 30, 30, 'logo', 'NONE', 0);
    } catch (e) {
      console.error('Unable to add logo:', e);
    }

    if (details && details.length) {
      let firstColumLength = details[0].length;
      let maxLength = Math.max(...details.map(detail => detail.length));
      if (maxLength !== firstColumLength) {
        for (let i = firstColumLength; i < maxLength; i++) {
          details[0].push('');
        }
      }
      let tempLineBreak = { fontSize: 10, cellPadding: 0, minCellHeight: 11, minCellWidth: 11, maxCellWidth: 80, valign: 'middle', halign: 'left' };

      doc.autoTable({
        body: details,
        theme: 'plain',
        styles: tempLineBreak
      });
    }

    tablesHeadings.map((tableHeadings, index) => {
      if (tableHeadings[0][0] == '') tableHeadings[0][0] = '#';
      doc = this.addTableInDoc(doc, tableHeadings, tablesRows[index]);
    });

    doc.save(fileName + '.pdf');
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

  newfindTableHeadings(tableId) {
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
      for (let i = 0; i < (hdgCols.length - 1); i++) {
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
          if (rowCols[j].querySelector("input")) {
            let eltinput = rowCols[j].querySelector("input");
            let attrval = eltinput.getAttribute("placeholder");
            rowdata.push(attrval);
          } else if (rowCols[j].querySelector("img")) {
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
            let plainText = rowCols[j].innerText;
            rowdata.push(plainText);
          }
        }
        rows.push(rowdata);
      }
    }
    return rows;
  }

  addTableInDoc(doc, headings, rows) {

    let tempLineBreak = { fontSize: 8, cellPadding: 2, minCellHeight: 11, minCellWidth: 11, maxCellWidth: 80, valign: 'middle', halign: 'center' };

    doc.autoTable({
      head: headings,
      body: rows,
      theme: 'grid',
      didDrawPage: this.didDrawPage,
      margin: { top: 20, bottom: 20 },
      rowPageBreak: 'avoid',
      headStyles: {
        fontSize: 8,
        halign: 'center',
        valign: 'middle'
      },
      styles: tempLineBreak,
      columnStyles: { text: { cellWidth: 40, halign: 'center', valign: 'middle' } },

    });
    return doc;
  }

  didDrawPage(data) {
    let doc = data.doc;
    //header
    // FOOTER
    let str = "Page " + data.pageCount;

    doc.setFontSize(8);
    doc.text(
      str,
      data.settings.margin.left,
      doc.internal.pageSize.height - 10
    );
  }

  newaddTableInDoc(doc, headings, rows) {
    // console.log("ids",left_heading,center_heading);
    let tempLineBreak = { fontSize: 10, cellPadding: 1, minCellHeight: 11, minCellWidth: 9, cellWidth: 48, valign: 'middle', halign: 'center' };

    doc.autoTable({
      head: headings,
      body: rows,
      theme: 'grid',
      didDrawPage: this.newdidDrawPage,
      margin: { top: 80, left: 15 },
      rowPageBreak: 'avoid',
      headStyles: {
        fillColor: [98, 98, 98],
        fontSize: 10,
        halign: 'center',
        valign: 'middle'

      },
      styles: tempLineBreak,
      columnStyles: { text: { cellWidth: 35, halign: 'center', valign: 'middle' } },

    });

    //  console.log("testing",left_heading,center_heading);



    return doc;
  }

  newdidDrawPage(data) {
    console.log('-----', data);
    let doc = data.doc;
    //header
    let x = 25;
    let y = 40;


    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("elogist Solutions ", x, y);



    let pageWidth = parseInt(doc.internal.pageSize.width);
    y = 15;
    doc.setFontSize(12);
    doc.line(20, 70, pageWidth - 20, 70);

    let eltimg = document.createElement("img");
    eltimg.src = "assets/images/elogist.png";
    eltimg.alt = "logo";




    // if (left_heading != "undefined" && left_heading != null && left_heading != '') {
    //   x = pageWidth / 2;
    //   let hdglen = left_heading.length / 2;
    //   let xpos = x - hdglen - 50;
    //   y = 40;
    //   doc.setFont("times", "bold", "text-center");
    //   doc.text(left_heading, xpos, y);
    // }
    // if (center_heading != "undefined" && center_heading != null && center_heading != '') {
    //   x = pageWidth / 2;
    //   y = 50;
    //   let hdglen = center_heading.length / 2;
    //   doc.setFontSize(14);
    //   doc.setFont("times", "bold", "text-center");
    //   doc.text(center_heading, x - hdglen - 40, y);
    // }


    doc.addImage(eltimg, 'JPEG', 370, 15, 50, 50, 'logo', 'NONE', 0);
    // FOOTER
    var str = "Page " + data.pageCount;

    doc.setFontSize(10);
    // doc.text(
    //   str,
    //   data.settings.margin.left,
    //   doc.internal.pageSize.height - 10
    // );
  }

  voucherPDF(pdfData?) {
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

  createPdfHtml(pdfData?) {
    // pdfData = {
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
    let date = this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-');

    mainElement.innerHTML = `
      <div class="voucher-customer ">
          <div class="voucher-company text-center">${pdfData.company}</div>
          <div class="voucher-address text-center">${pdfData.address}</div>
          <div class="voucher-city text-center">${pdfData.city}</div>
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
                <th colspan="1" class="text-right"><strong>Total</strong></th>
                ${this.getTotalHTML(pdfData.total)}
              </tr>
              <tr>
                <td colspan="3"><strong>In Words:</strong> ${pdfData.inWords}</td>
              </tr>
              <tr>
                <td colspan="3"><strong>Narration:</strong> ${pdfData.narration}</td>
              </tr>
            </tbody>
          </table>
          <div class="row voucher-footer"  style="position: absolute;bottom: 20px;width: 100%;">
            <div class="col-sm-6 col-xs-6"></div>
            <div class="col-sm-3 col-xs-3 voucher-signature">
              <div>Accountant</div>
            </div>
            <div class="col-sm-3 col-xs-3 voucher-signature">
              <div>Approved By</div>
            </div>
            <div class="col-sm-5 col-xs-5 footerselector">
            <div>Powered By : Elogist Solution</div>
            </div>
            <div class="col-sm-5 col-xs-5 footerselector">
            <div>Printed Date:  ${date} </div>
            </div> 
            <div class="col-sm-2 col-xs-2 footerselector">
            <div>Page No : 1 </div>
            </div> 
          </div>
        </div>`;

    return mainElement;
  }

  getDetailsHtml(details) {
    let html = '';
    details.map(detail => {
      html += `
        <div class="col-sm-6 col-xs-6 voucher-details">
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

  multiImagePdf(id) {
    let promises = [];
    //ids.map(id => {
    let element = document.getElementById(id);
    promises.push(html2canvas(element, { scale: 2 }));
    // });
    // this.common.loading++;
    Promise.all(promises).then(result => {
      console.log('Result:', result);
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      result.map((canvas, index) => {
        pdf = this.addImageToPdf(canvas, pdf, index);
        if (index < result.length - 1) pdf.addPage()
      });
      pdf.save('report.pdf'); // Generated PDF
      // this.common.loading--;
    });

  }

  addImageToPdf(canvas, pdf, position, width?, height?) {
    var imgWidth = width || 208;
    var pageHeight = 295;
    var imgHeight = height || (canvas.height * imgWidth / canvas.width);
    var heightLeft = imgHeight;



    const context = canvas.getContext('2d');
    context.scale(1, 1);
    context['dpi'] = 144;
    context['imageSmoothingEnabled'] = false;
    context['mozImageSmoothingEnabled'] = false;
    context['oImageSmoothingEnabled'] = false;
    context['webkitImageSmoothingEnabled'] = false;
    context['msImageSmoothingEnabled'] = false;

    const contentDataURL = canvas.toDataURL('image/png')

    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
    return pdf;
  }

  tableWithImages(id, tableIds, data, left_heading, center_heading) {
    let promises = [];
    let list = data;
    const status = [];
    list.map(list => {
      status.push(list.name);
    }
    );

    console.log(status);
    let element = document.getElementById(id);
    promises.push(html2canvas(element, { scale: 2 }));

    Promise.all(promises).then(result => {
      let pdf = new jsPDF('p', 'px', 'a4'); // A4 size page of PDF
      let eltimg = document.createElement("img");
      eltimg.src = "assets/images/elogist.png";
      eltimg.alt = "logo";

      pdf.addImage(eltimg, 'JPEG', 370, 15, 50, 50, 'logo', 'NONE', 0);
      result.map((canvas, index) => {

        pdf = this.addImageToPdf(canvas, pdf, index, 450, 600);
        if (index < result.length - 1) pdf.addPage()
      });

      pdf.addPage();
      /**************** LOGO Creation *************** */

      /**************** PDF Size ***************** */
      let maxHeadingLength = 0;
      let pageOrientation = "Portrait";

      pdf.setFontSize(14);
      pdf.setFont("times", "bold", "text-center");
      pdf.text(left_heading, 200, 60);


      pdf.setFontSize(14);
      pdf.setFont("times", "bold", "text-center");
      pdf.text(center_heading, 200, 45);
      tableIds.map((tableId, index) => {
        let tablesHeadings = [];
        let tablesRows = [];
        tablesHeadings = this.newfindTableHeadings(tableId);
        tablesRows = this.findTableRows(tableId);
        pdf.text(status[index], 25, 65);
        pdf = this.newaddTableInDoc(pdf, tablesHeadings, tablesRows);
        pdf.addPage();
      });
      pdf.save("report.pdf");
    });
  }

  convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + (n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      let value = 0;
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Crores ";
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred and ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split("  ").join(" ");
    }
    return words_string;
  }

  /**
   * Convert HTML view into to pdf
   * @param elementId {type: string} 
   * @param pdfName 
   */
  async htmlToPdf(elementId: string, pdfName: string = 'report') {
    let details = await this.common.getFoDetails();

    const pdfElement = document.getElementById(elementId);
    // <img src="assets/images/elogist.png" alt="elogist" style="width: 85px;">
    let headerHtml = `<div class="container">
    <div class="row">
      
      <div class="col-12" style="padding: 20px 30px 20px 0px;">
        <div style="font-size: 18px;margin-bottom: 5px;letter-spacing: 1px;"><strong>${details.foname}</strong></div>
        <div style="font-style: italic;color: #666;">Address: ${details.addressline}</div>
        <div class="row">
          <div class="col-4">Phone: ${details.phonenumber}</div>
          <div class="col-4">GST No: ${details.gstno}</div>
          <div class="col-4">PAN No: ${details.panno}</div>
        </div>
      </div>
    </div>
  </div>`;

    let headerElement = document.createElement('div');
    headerElement.innerHTML = headerHtml;
    headerElement.className = 'container';
    pdfElement.insertBefore(headerElement, pdfElement.children[0]);
    const opt = {
      margin: 10,
      filename: pdfName + '.pdf',
      html2canvas: { scale: 2.5 },
      jsPDF: { format: 'a4' }
    };

    html2pdf().from(pdfElement).set(opt).toPdf().get('pdf').then(pdf => {
      pdfElement.removeChild(headerElement);
      var totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(10, pdf.internal.pageSize.height - 5, 'Powered by: Elogist Solutions');
        pdf.text(pdf.internal.pageSize.width - 120, pdf.internal.pageSize.height - 5, 'Printed on: ' + this.datePipe.transform(new Date(), "dd-MM-yyyy"));
        pdf.text(pdf.internal.pageSize.width - 23, pdf.internal.pageSize.height - 5, 'Page: ' + i);
      }
    }).save();
  }

}
