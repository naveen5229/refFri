import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  xJSON1 = {
    "headers":
      [
        { "txt": "Shankar Test", size: '22px', weight: 'bold' },
        { "txt": "" }, { "txt": "" },
        { "txt": "Ledger Report", size: '20px', weight: 600, align: 'left' }
      ],
    "details": [
      { "name": "Voucher Number", "value": "test01" },
      { "name": "Branch", "value": "12new" },
      { "name": "Voucher Date", "value": "29-06-2019" }
    ],
    "table": {
      "headings":
        [{ "txt": "Particulars" }, { "txt": "Debit Amount" }, { "txt": "Credit Amount" }],
      "rows": [
        [{ "txt": "Testing12 [Testing12]" }, { "txt": 100, align: 'right' }, { "txt": "", align: 'right' }],
        [{ "txt": "shyam and co [shyam and co]" }, { "txt": "", align: 'right' }, { "txt": 100, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 100, align: 'right' }],
        [{ "txt": { "name": "In Words", "value": "One Hundred " }, "colspan": 3 }],
        [{ "txt": { "name": "Narration", "value": "test" }, "colspan": 3 }],
      ]
    },
    "signatures": ["Accountant", "Approved By"],
    "footer": {
      "left": { "name": "Powered By", "value": "Elogist Solutions" },
      "center": { "name": "Printed Date", "value": "06-July-2019" },
      "right": { "name": "Page No", "value": 1 }
    }
  };

  constructor() { }

  /**
   * Print Invoice used to print invoices in different formats
   * @param json JSON data in printing format
   * @param format Format number ex: 1, 2....
   */
  printInvoice(json: any, format: number = 1) {
    this.printWrapper(this['invoiceFormat' + format](json));
    this.print();
  }

  /**
   * Convert JSON data into HTML format
   * @param json JSON data for format1 :see xJSON1
   */
  invoiceFormat1(json) {
    // Invoice Header
    const header = `
    <div class="pp-v1-header">
      ${json.headers.map(header => {
      return `<div style="text-align: ${header.align || 'center'}; font-size: ${header.size || '16px'}; font-weight: ${header.weight || 100}; color: ${header.color || '#000'};">${header.txt}</div>`;
    }).join('')}
    </div>`;

    // Details part of invoice
    const details = `
    <div class="pp-v1-details">
      <div class="row">
      ${json.details.map(detail => {
      return `
        <div class="col-6">
          <strong>${detail.name}</strong>
          <span>: </span>
          <span>${detail.value}</span>
        </div>`;
    }).join('')}
      </div>
    </div>
    `;

    // Table part of invoice
    const table = `
    <div class="pp-v1-table-container">
      <table class="table table-bordered">
        <thead>
          ${json.table.headings.map(heading => { return `<th>${heading.txt}</th>`; }).join('')}
      </thead>
      <tbody>
        ${json.table.rows.map(row => {
      return `
            <tr>
              ${row.map(col => {
        return `<td colspan="${col.colspan || 1}" style="text-align: ${col.align || 'left'}">${
          (typeof col.txt === 'string' || typeof col.txt === 'number') ? col.txt : `<strong>${col.txt.name}</strong>: <span>${col.txt.value}</span>`
          }</td>`
      }).join('')}
            </tr>
          `;
    }).join('')}
      </tbody>
      </table>
    </div>
    `;

    // Signature Part of Invoice
    const signature = `
      <div class="pp-v1-signature">
        ${json.signatures.map(signature => { return `<div>${signature}</div>` }).join('')}
      </div>`;

    // Footer Details of Invoice
    const footer = `
      <div class="pp-v1-footer">
        <div class="row">
          <div class="col-4"><strong>${json.footer.left.name}</strong>: <span>${json.footer.left.value}</span></div>
          <div class="col-4 text-center"><strong>${json.footer.center.name}</strong>: <span>${json.footer.center.value}</span></div>
          <div class="col-4 text-right"><strong>${json.footer.right.name}</strong>: <span class="page-number">${json.footer.right.value}</span></div>
        </div>
      </div>`;

    return `<div class="pp-container">${header + details + table + signature + footer}</div>`;
  }

  /**
   * Create a wrapper to show print HTML page
   * @param xHTML Generated HTML to print
   */
  printWrapper(xHTML) {
    let mainElement = document.createElement('div');
    mainElement.className = 'printing-page';
    mainElement.id = 'printing-page';
    mainElement.innerHTML = xHTML;

    let bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.appendChild(mainElement);
    bodyElement.className += ' printing';
  }

  /**
   * Handle Printing functionality 
   */
  print() {
    window.print();
    let printWindowListener = setInterval(() => {
      if (document.readyState == "complete") {
        clearInterval(printWindowListener);
        this.clearPrintHtml();
      }
    }, 1000);
  }

  /**
   * Remove print HTML from body tag
   */
  clearPrintHtml() {
    let bodyElement = document.getElementsByTagName('body')[0];
    let printElement = document.getElementById('printing-page');
    bodyElement.removeChild(printElement);
    bodyElement.className = bodyElement.className.replace(' printing', '');
  }
}
