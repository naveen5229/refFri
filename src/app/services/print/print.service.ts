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
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 101, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 102, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 103, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 104, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 105, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 106, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 107, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 108, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 110, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 111, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 112, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 113, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 114, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 115, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 116, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 117, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 118, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 119, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 120, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 121, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 122, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 123, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 124, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 125, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],
        [{ "txt": "Total" }, { "txt": 100, align: 'right' }, { "txt": 126, align: 'right' }],


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
    this.wrapper2(json);
    // this.printWrapper(this['invoiceFormat' + format](json));
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
    console.log('MainElement:', mainElement.offsetHeight);

    let bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.appendChild(mainElement);
    bodyElement.className += ' printing';
    console.log('MainElement:', mainElement.offsetHeight);
    console.log(mainElement);
    //72 dpi (web) = 595 X 842 pixels. 
  }

  hanldePages(mainElement) {
    let childrens = mainElement.children[0].children;
    let height = 0;
    childrens.map(ele => {
      height += ele.offsetHeight;
      if (height > 820) {

      }
    });

  }

  wrapper2(json) {
    let mainElement = document.createElement('div');
    mainElement.className = 'printing-page';
    mainElement.id = 'printing-page';

    let bodyElement = document.getElementsByTagName('body')[0];
    bodyElement.appendChild(mainElement);
    bodyElement.className += ' printing';

    let ppContainer = document.createElement('div');
    ppContainer.className = 'pp-container';
    ppContainer.id = 'pp-container';
    mainElement.appendChild(ppContainer);
    let pageIndex = 1;
    let rowIndex = 0;
    while (rowIndex != json.table.rows.length - 1) {
      let pageContainer = this.createPage(json);
      ppContainer.appendChild(pageContainer);
      let page = pageContainer.children[0];
      let pageInsider = page.children[0];
      if (pageIndex == 1) {
        pageInsider.appendChild(this.getHeader(json));
        pageInsider.appendChild(this.getDetails(json));
      }

      let tableContainer = this.createTable(json);
      pageInsider.appendChild(tableContainer);
      let table = tableContainer.children[0];
      if (pageIndex == 1) {
        table.appendChild(this.setTableHead(json));
      }

      let tbody = this.setTableBody(json)
      table.appendChild(tbody);
      for (let i = rowIndex; i < json.table.rows.length; i++) {
        let row = this.createTableRow(json.table.rows[i]);
        tbody.appendChild(row);
        console.log('__', page['offsetHeight'], pageInsider['offsetHeight']);
        if (pageInsider['offsetHeight'] + row.offsetHeight > page['offsetHeight'] && i != json.table.rows.length - 1) {
          // json.table.rows.splice(0, i + 1);
          rowIndex = i + 1;
          break;
        }
        rowIndex = i;
      }
      if (rowIndex == json.table.rows.length - 1) {
        pageContainer.appendChild(this.getSignature(json));
      }
      pageContainer.appendChild(this.getFooter(json, pageIndex));
      pageIndex++;
    }

    // let pageContainer1 = this.createPage(json);
    // ppContainer.appendChild(pageContainer1);
    // let page1 = pageContainer1.children[0];
    // let pageInsider1 = page1.children[0];
    // pageInsider1.appendChild(this.getHeader(json));
    // pageInsider1.appendChild(this.getDetails(json));

    // pageInsider1.appendChild(this.createTable(json));
    // let table1 = pageInsider1.children[2].children[0];
    // table1.appendChild(this.setTableHead(json));

    // let tbody1 = this.setTableBody(json)
    // table1.appendChild(tbody1);
    // for (let i = 0; i < json.table.rows.length; i++) {
    //   let row = this.createTableRow(json.table.rows[i]);
    //   tbody1.appendChild(row);
    //   console.log('__', page1['offsetHeight'], pageInsider1['offsetHeight']);
    //   if (pageInsider1['offsetHeight'] + row.offsetHeight > page1['offsetHeight'] && i != json.table.rows.length - 1) {
    //     json.table.rows.splice(0, i + 1);
    //     break;
    //   }
    // }

    // pageContainer1.appendChild(this.getFooter(json, 1));

    // let pageContainer2 = this.createPage(json);
    // ppContainer.appendChild(pageContainer2);
    // let page2 = pageContainer2.children[0];
    // let pageInsider2 = page2.children[0];

    // pageInsider2.appendChild(this.createTable(json));
    // let table2 = pageInsider2.children[0].children[0];
    // table2.appendChild(this.setTableHead(json));

    // let tbody2 = this.setTableBody(json)
    // table2.appendChild(tbody2);
    // for (let i = 0; i < json.table.rows.length; i++) {
    //   let row = this.createTableRow(json.table.rows[i]);
    //   tbody2.appendChild(row);
    //   console.log('2__', page2['offsetHeight'], pageInsider2['offsetHeight']);
    //   if (pageInsider2['offsetHeight'] + row.offsetHeight > page2['offsetHeight']) {
    //     json.table.rows.splice(0, i);
    //     break;
    //   }
    // }

    // pageContainer2.appendChild(this.getSignature(json));
    // pageContainer2.appendChild(this.getFooter(json, 2));
  }

  getFooter(json, page) {
    let ele = document.createElement('div');
    ele.className = 'pp-v1-footer';
    ele.innerHTML = `
      <div class="row">
        <div class="col-4"><strong>${json.footer.left.name}</strong>: <span>${json.footer.left.value}</span></div>
        <div class="col-4 text-center"><strong>${json.footer.center.name}</strong>: <span>${json.footer.center.value}</span></div>
        <div class="col-4 text-right"><strong>${json.footer.right.name}</strong>: <span class="page-number">${page}</span></div>
      </div>`;
    return ele;
  }

  getSignature(json) {
    let ele = document.createElement('div');
    ele.className = 'pp-v1-signature';
    ele.innerHTML = json.signatures.map(signature => { return `<div>${signature}</div>` }).join('');
    return ele;
  }

  createTableRow(row) {
    let ele = document.createElement('tr');
    ele.innerHTML = row.map(col => {
      return `<td colspan="${col.colspan || 1}" style="text-align: ${col.align || 'left'}">${
        (typeof col.txt === 'string' || typeof col.txt === 'number') ? col.txt : `<strong>${col.txt.name}</strong>: <span>${col.txt.value}</span>`
        }</td>`
    }).join('');
    return ele;
  }

  getHeader(json) {
    let headerElement = document.createElement('div');
    headerElement.className = 'pp-v1-header';
    // Invoice Format1 Header
    headerElement.innerHTML = json.headers.map(header => {
      return `<div style="text-align: ${header.align || 'center'}; font-size: ${header.size || '16px'}; font-weight: ${header.weight || 100}; color: ${header.color || '#000'};">${header.txt}</div>`;
    }).join('');
    return headerElement;
  }

  getDetails(json) {
    let ele = document.createElement('div');
    ele.className = 'pp-v1-details';
    // Details part of invoice
    ele.innerHTML = `
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
    `;
    return ele;
  }

  createTable(json) {

    let ele = document.createElement('div');
    ele.className = 'pp-v1-container';
    ele.innerHTML = ` <table class="table table-bordered"></table>`;

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
    return ele;
  }

  setTableHead(json) {
    let ele = document.createElement('thead');
    ele.innerHTML = json.table.headings.map(heading => { return `<th>${heading.txt}</th>`; }).join('');
    return ele;
  }

  setTableBody(json) {
    let ele = document.createElement('tbody');
    return ele;
  }

  createPage(json) {
    let pageContainer = document.createElement('div');
    pageContainer.className = 'print-page-container';
    let page = document.createElement('div');
    page.className = 'print-page';
    pageContainer.appendChild(page);
    let pageInsider = document.createElement('div');
    pageInsider.className = 'page-insider';
    page.appendChild(pageInsider);
    return pageContainer;
  }


  /**
   * Handle Printing functionality 
   */
  print() {
    window.print();
    // let printWindowListener = setInterval(() => {
    //   if (document.readyState == "complete") {
    //     clearInterval(printWindowListener);
    //     this.clearPrintHtml();
    //   }
    // }, 1000);
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
