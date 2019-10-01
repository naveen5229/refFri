import { Injectable } from '@angular/core';

const PAGE_SIZE = {
  chrome: 360,
  firefox: 280,
  safari: 360,
  ei: 280,
  edge: 360,
  opera: 360
};

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
    this['invoiceFormat' + format](this.createPrintWrapper(), json);
    console.log('json Format data', json);
    this.print();
  }

  /**
   * Create a configured HTML element for printing
   */
  createPrintWrapper() {
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
    return ppContainer;
  }

  /**
   * Invoice Format 1 : This is one format of invoice if you want to create like this, you can use it.
   * @param ppContainer - All printing pages container
   * @param json - JSON data in format 1
   */
  invoiceFormat1(ppContainer: HTMLElement, json: any) {
    const DPI = this.getDPI();
    const pageSize = PAGE_SIZE[this.detectBrowser()];
    let pageIndex = 1;
    let rowIndex = 0;
    while (rowIndex < json.table.rows.length) {
      let pageContainer = this.createPageHtml();
      ppContainer.appendChild(pageContainer);
      let page = pageContainer.children[0];
      let pageInsider = page.children[0];
      if (pageIndex == 1) {
        pageInsider.appendChild(this.createHeaderHtml(json.headers));
        pageInsider.appendChild(this.createBasicDetailsHtml(json.details));
      }

      let tableContainer = this.createTableHtml();
      pageInsider.appendChild(tableContainer);
      let table = tableContainer.children[0];
      if (pageIndex == 1) {
        table.appendChild(this.createTheadHtml(json.table.headings));
      }

      let tbody = this.createTbodyHtml()
      table.appendChild(tbody);
      for (let i = rowIndex; i < json.table.rows.length; i++) {
        let row = this.createTrHtml(json.table.rows[i]);
        tbody.appendChild(row);
        let mm = (pageInsider['offsetHeight'] + row.offsetHeight * 25.4) / DPI;
        if (mm > pageSize && i != json.table.rows.length - 1) {
          rowIndex = i + 1;
          break;
        }
        rowIndex++;
      }
      if (rowIndex == json.table.rows.length) {
        pageContainer.appendChild(this.createSignatureHtml(json.signatures));
      }
      pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
      pageIndex++;
    }
  }

  /**
  * Invoice Format 1 : This is one format of invoice if you want to create like this, you can use it.
  * @param ppContainer - All printing pages container
  * @param json - JSON data in format 1
  */
  invoiceFormat2(ppContainer: HTMLElement, json: any) {
    const DPI = this.getDPI();
    const pageSize = PAGE_SIZE[this.detectBrowser()];
    let pageIndex = 1;
    let previousPageContainer = null;
    json.tables.map((tableJSON, tableIndex) => {
      let rowIndex = 0;
      // while (rowIndex < tableJSON.rows.length) {
      let pageContainer = previousPageContainer;
      if (!pageContainer) {
        pageContainer = this.createPageHtml();
        ppContainer.appendChild(pageContainer);
      }

      let page = pageContainer.children[0];
      let pageInsider = page.children[0];
      if (tableIndex === 0 && rowIndex === 0) {
        pageInsider.appendChild(this.createHeaderHtml(json.headers));
        pageInsider.appendChild(this.createBasicDetailsHtml(json.details));
      }

      let tableContainer = this.createTableHtml(tableJSON.name);
      pageInsider.appendChild(tableContainer);
      let table = tableContainer.children[1];
      if (rowIndex == 0) {
        table.appendChild(this.createTheadHtml(tableJSON.headings));
      }

      let tbody = this.createTbodyHtml()
      table.appendChild(tbody);
      let newPageFlag = false;
      for (let i = rowIndex; i < tableJSON.rows.length; i++) {
        let row = this.createTrHtml(tableJSON.rows[i]);
        tbody.appendChild(row);
        let mm = ((pageInsider['offsetHeight'] + row.offsetHeight) * 25.4) / DPI;
        console.log('MM:', mm, ', pageSize:', pageSize, ', i', pageInsider['offsetHeight']);
        if (mm > pageSize && i != tableJSON.rows.length - 1) {
          rowIndex = i + 1;
          newPageFlag = true;
          break;
        }
        rowIndex++;
      }
      if (rowIndex == tableJSON.rows.length && tableIndex == json.tables.length - 1) {
        pageInsider.appendChild(this.createBasicDetailsHtml(json.footertotal));
        pageContainer.appendChild(this.createSignatureHtml(json.signatures));
      }

      pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
      if (!newPageFlag) {
        previousPageContainer = pageContainer;
      } else {
        pageIndex++;
        previousPageContainer = null;
      }
      // }
    });
  }


  /**
   * Invoice Format 2 : This is one format of invoice if you want to create like this, you can use it.
   * @param ppContainer - All printing pages container
   * @param json - JSON data in format 1
   */
  generalPrint(json: any) {
    let ppContainer = this.createPrintWrapper();
    const DPI = this.getDPI();
    const pageSize = PAGE_SIZE[this.detectBrowser()];
    let pageIndex = 1;
    let previousPageContainer = null;

    json.tables.map((tableJSON, tableIndex) => {
      let rowIndex = 0;
      while (rowIndex < tableJSON.rows.length) {
        let pageContainer = previousPageContainer;
        if (!pageContainer) {
          pageContainer = this.createPageHtml();
          ppContainer.appendChild(pageContainer);
        }

        let page = pageContainer.children[0];
        let pageInsider = page.children[0];
        if (tableIndex === 0 && rowIndex === 0) {
          pageInsider.appendChild(this.createHeaderHtml(json.headers));
          pageInsider.appendChild(this.createBasicDetailsHtml(json.details));
        }

        let tableContainer = this.createTableHtml(tableJSON.name);
        pageInsider.appendChild(tableContainer);
        let table = tableContainer.children[tableJSON.name ? 1 : 0];
        // if (rowIndex == 0) {
        table.appendChild(this.createTheadHtml(tableJSON.headings));
        // }

        let tbody = this.createTbodyHtml()
        table.appendChild(tbody);
        let newPageFlag = false;
        for (let i = rowIndex; i < tableJSON.rows.length; i++) {
          let row = this.createTrHtml(tableJSON.rows[i]);
          tbody.appendChild(row);
          let mm = ((pageInsider['offsetHeight'] + row.offsetHeight) * 25.4) / DPI;
          console.log('MM:', mm, ', pageSize:', pageSize, ', i', pageInsider['offsetHeight']);
          if (mm > pageSize && i != tableJSON.rows.length - 1) {
            rowIndex = i + 1;
            newPageFlag = true;
            break;
          }
          rowIndex++;
        }
        if (rowIndex == tableJSON.rows.length && tableIndex == json.tables.length - 1) {
          pageInsider.appendChild(this.createBasicDetailsHtml(json.footertotal));
          pageContainer.appendChild(this.createSignatureHtml(json.signatures));
        }

        pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
        if (!newPageFlag) {
          previousPageContainer = pageContainer;
        } else {
          pageIndex++;
          previousPageContainer = null;
        }
      }
    });
    this.print();
  }

  /**
   * Invoice Format 2 : This is one format of invoice if you want to create like this, you can use it.
   * @param ppContainer - All printing pages container
   * @param json - JSON data in format 1
   */
  generalPrint2(json: any) {
    let xJSON1 = {
      "headers":
        [
          {
            columns: [
              {
                type: 'normal',
                col: 8,
                values: [
                  {
                    type: 'txt',
                    value: 'WAYMORE',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'html',
                    value: "Address :S.N.491/1,Near Bharat Petrol Pump,Sanand-Sarkhej Highway,Telav-Ahmedabad,Gujarat,382210<br /> Mobile : 9662128210<br /> Phone : 9825226596<br /> GST No. : 24AACFW8917C1Z8<br /> Email : mrways99@yahoo.co.in",
                    fontSize: '14px',
                    fontWeight: 500,
                    align: 'left',
                    color: '#000',
                    class: '',
                  }
                ]
              },
              {
                type: 'table',
                col: 4,
                values: [
                  {
                    type: 'object',
                    value: {
                      lable: 'INVOICE NO.',
                      value: 'KJS0005'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'To',
                      value: 'KJS Cement(I) Limited'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'PAN',
                      value: 'AABCD5727F'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'GST',
                      value: '23AABCD5727F1Z0'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'Date',
                      value: '18 Sep 19'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ]
              }
            ]
          }
        ],
      "details": [],
      "tables": [{
        "headings":
          [
            { "txt": "SN" },
            { "txt": "Vehicle" },
            { "txt": "LR Number" },
            { "txt": "LR Date" },
            { "txt": "From" },
            { "txt": "To" },
            { "txt": "Net Weight" },
            { "txt": "Rate Per Tonne" },
            { "txt": "Shortage" },
            { "txt": "Adv Amount" },
            { "txt": "Amount" },
          ]
        ,
        "rows": [
          [{ "txt": "1" }, { "txt": "GJ12BW6465" }, { "txt": "KH00006" }, { "txt": "17 Aug 19" }, { "txt": "Bina" }, { "txt": "Nimrani" }, { "txt": "39.92" }, { "txt": "900" }, { "txt": "" }, { "txt": "25000.00" }, { "txt": "35928.00" }],
        ]
      }],
      "footer": {
        "left": { "name": "Powered By", "value": "Elogist Solutions" },
        "center": { "name": "Printed Date", "value": "06-July-2019" },
        "right": { "name": "Page No", "value": 1 }
      },
      "footers":
        [
          {
            columns: [
              {
                col: 8,
                type: 'normal',
                values: [
                  {
                    type: 'html',
                    value: '<strong>Amount In Words :</strong> Two Lakh Seven Thousand One Hundred Eight',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ]
              },
              {
                col: 4,
                type: 'table',
                values: [
                  {
                    type: 'object',
                    value: {
                      lable: 'Total',
                      value: '504108.00'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'Advance Amount',
                      value: '297000.00'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'Net Amount',
                      value: '207108.00'
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ]
              },
              {
                col: 8,
                type: 'normal',
                border: '1px solid #c2c2c2',
                values: [
                  {
                    type: 'html',
                    value: `<b>Terms & Conditions :</b> We hereby declare that cenvet credit on capital goods and input services used for providing the taxable service has not been taken the provisions of the cenvet credit rules 2004(under condition of 13/2012-stdated 17.03.12)and hence eligible for abatemend`,
                    fontSize: '14px',
                    fontWeight: '500',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ]
              },
              {
                col: 4,
                type: 'normal',
                border: '1px solid #c2c2c2',
                values: [
                  {
                    type: 'html',
                    value: `<div>Logistic Sign</div> <div style="margin-top:100px;">Receiver Sign</div>`,
                    fontSize: '14px',
                    fontWeight: '500',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ]
              },
              {
                col: 12,
                border: '1px solid #c2c2c2',
                type: 'normal',
                values: [
                  {
                    type: 'txt',
                    value: `Late payment would be charged 24% interest per annum.`,
                    fontSize: '14px',
                    fontWeight: '700',
                    align: 'center',
                    color: '#000',
                    class: '',
                  },
                ]
              },
            ]
          }
        ],
    };
    // json = xJSON1;

    let ppContainer = this.createPrintWrapper();
    const DPI = this.getDPI();
    const pageSize = PAGE_SIZE[this.detectBrowser()] - 1;
    let pageIndex = 1;
    let previousPageContainer = null;
    let headerIndex = 0;
    while (headerIndex < json.headers.length) {
      let header = json.headers[headerIndex];
      let pageContainer = previousPageContainer;
      if (!pageContainer) {
        pageContainer = this.createPageHtml();
        ppContainer.appendChild(pageContainer);
      }
      let page = pageContainer.children[0];
      let pageInsider = page.children[0];
      let headerHtml = this.createHeader2(header);
      pageInsider.appendChild(headerHtml);
      let mm = ((pageInsider['offsetHeight']) * 25.4) / DPI;
      console.log('MM:', mm, ', pageSize:', pageSize, ', i', pageInsider['offsetHeight']);
      if (mm > pageSize) {
        pageInsider.removeChild(headerHtml);
        previousPageContainer = null;
        pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
        pageIndex++;
      } else {
        headerIndex++;
        previousPageContainer = pageContainer;
      }
      if(headerIndex === json.headers.length){
        pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
      }
    };

    json.tables.map((tableJSON, tableIndex) => {
      let rowIndex = 0;
      while (rowIndex < tableJSON.rows.length) {
        let pageContainer = previousPageContainer;
        if (!pageContainer) {
          pageContainer = this.createPageHtml();
          ppContainer.appendChild(pageContainer);
        }

        let page = pageContainer.children[0];
        let pageInsider = page.children[0];
        // if (tableIndex === 0 && rowIndex === 0) {
        //   pageInsider.appendChild(this.createHeaderHtml(json.headers, 2));
        //   pageInsider.appendChild(this.createBasicDetailsHtml(json.details));
        // }

        let tableContainer = this.createTableHtml(tableJSON.name);
        pageInsider.appendChild(tableContainer);
        let table = tableContainer.children[tableJSON.name ? 1 : 0];
        // if (rowIndex == 0) {
        table.appendChild(this.createTheadHtml(tableJSON.headings));
        // }

        let tbody = this.createTbodyHtml()
        table.appendChild(tbody);
        let newPageFlag = false;
        for (let i = rowIndex; i < tableJSON.rows.length; i++) {
          let row = this.createTrHtml(tableJSON.rows[i]);
          tbody.appendChild(row);
          let mm = ((pageInsider['offsetHeight'] + row.offsetHeight) * 25.4) / DPI;
          console.log('MM:', mm, ', pageSize:', pageSize, ', i', pageInsider['offsetHeight']);
          if (mm > pageSize && i != tableJSON.rows.length - 1) {
            rowIndex = i + 1;
            newPageFlag = true;
            break;
          }
          rowIndex++;
        }
        if (rowIndex == tableJSON.rows.length && tableIndex == json.tables.length - 1) {
          // pageInsider.appendChild(this.createBasicDetailsHtml(json.footertotal));
          // pageContainer.appendChild(this.createSignatureHtml(json.signatures));
          // pageInsider.appendChild(this.createFooter2(json.footers));
        }


        pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
        if (!newPageFlag) {
          previousPageContainer = pageContainer;
        } else {
          pageIndex++;
          previousPageContainer = null;
        }
      }
    });

    let footerIndex = 0;
    while (footerIndex < json.footers.length) {
      console.log('___________INDEX:', footerIndex, json.footers.length);
      let footer = json.footers[footerIndex];
      let pageContainer = previousPageContainer;
      if (!pageContainer) {
        pageContainer = this.createPageHtml();
        ppContainer.appendChild(pageContainer);
      }
      let page = pageContainer.children[0];
      let pageInsider = page.children[0];
      let headerHtml = this.createHeader2(footer);
      pageInsider.appendChild(headerHtml);
      let mm = ((pageInsider['offsetHeight']) * 25.4) / DPI;
      console.log('MM:', mm, ', pageSize:', pageSize, ', i', pageInsider['offsetHeight']);
      if (mm > pageSize) {
        pageInsider.removeChild(headerHtml);
        previousPageContainer = null;
        pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
        pageIndex++;
      } else {
        footerIndex++;
        previousPageContainer = pageContainer;
      }
      if(footerIndex === json.footers.length){
        pageContainer.appendChild(this.createFooterHtml(json.footer, pageIndex));
      }
    };
    this.print();
  }

  /**
   * Create printing page
   */
  createPageHtml() {
    let pageContainer = document.createElement('div');
    pageContainer.className = 'print-page-container';
    pageContainer.innerHTML = `<div class="print-page"><div class="page-insider"></div></div>`
    return pageContainer;
  }

  /**
   * Create Print page header to show print details liek as company name, address etc
   * @param headers - Contains header properties like as font size, color etc.
   */
  createHeaderHtml(headers: any[], template = 1) {
    if (template == 1) {
      let headerContainer = document.createElement('div');
      headerContainer.className = 'pp-v1-header';
      headerContainer.innerHTML = headers.map(header => {
        return `<div style="text-align: ${header.align || 'center'}; font-size: ${header.size || '16px'}; font-weight: ${header.weight || 100}; color: ${header.color || '#000'};">${header.txt}</div>`;
      }).join('');
      return headerContainer;
    }
    return this['createHeader' + template](headers);
  }

  createHeader2(header) {
    console.log('_______________________Header:', header);
    let headerContainer = document.createElement('div');
    // headerContainer.className = 'pp-v1-header';
    headerContainer.className = "row";
    headerContainer.innerHTML = header.columns.map((column, index) => {
      if (!column.values.length) return [];
      return `<div class="col-${column.col}" style="margin-top: 20px; border: ${column.border || ''}">
                  ${column.type === 'normal' ? column.values.map((value, index) => {
        return `<div style="font-size: ${value.fontSize || '14px'}; font-weight: ${value.fontWeight || 100}; text-align: ${value.align || 'left'};
                    color: ${value.color || '#000'}; border: ${value.border || ''} " class="${value.class}"
          >${value.type === 'object' ? `<strong>${value.value.label}</strong>: <span>${value.value.value}</span>` : `${value.value}`}</div>`
      }).join('') :
          `<table class="table table-bordered">
              ${column.values.map((value, index) => {
            return `<tr style="font-size: ${value.fontSize || '14px'}; font-weight: ${value.fontWeight || 100}; text-align: ${value.align || 'left'};
              color: ${value.color || '#000'};" class="${value.class}"
              ><td><strong>${value.value.lable}:</strong></td><td>${value.value.value}</td></tr>`
          }).join('')}
            </table>`}
                </div>`;
    }).join('');
    return headerContainer;
  }

  createFooter2(footers) {
    let headerContainer = document.createElement('div');
    headerContainer.className = 'pp-v1-header';
    headerContainer.innerHTML = footers.map(header => {
      return `<div class="row">${header.columns.map((column, index) => {
        return `<div class="col-${column.col}" style="margin-top: 20px; border: ${column.border || ''}">
                  ${column.type === 'normal' ? column.values.map((value, index) => {
          return `<div style="font-size: ${value.fontSize || '14px'}; font-weight: ${value.fontWeight || 100}; text-align: ${value.align || 'left'};
                    color: ${value.color || '#000'}; " class="${value.class}"
          >${value.type === 'object' ? `<strong>${value.value.label}</strong>: <span>${value.value.value}</span>` : `${value.value}`}</div>`
        }).join('') :
            `<table class="table table-bordered">
              ${column.values.map((value, index) => {
              return `<tr style="font-size: ${value.fontSize || '14px'}; font-weight: ${value.fontWeight || 100}; text-align: ${value.align || 'left'};
              color: ${value.color || '#000'};" class="${value.class}"
              ><td><strong>${value.value.lable}:</strong></td><td>${value.value.value}</td></tr>`
            }).join('')}
            </table>`}
                </div>`;
      }).join('')}</div>`;
    }).join('');
    return headerContainer;
  }

  /**
   * Create Basic Details for first page of PRINT
   * @param details - Array of object with key value pair
   */
  createBasicDetailsHtml(details: any[]) {
    let detailsContainer = document.createElement('div');
    detailsContainer.className = 'pp-v1-details';
    detailsContainer.innerHTML = `
      <div class="row">
      ${details.map(detail => {
      return `<div class="col-6" style="margin-top: 8px"><strong>${detail.name}</strong><span>${detail.value}</span></div>`;
    }).join('')}
      </div>
    `;
    console.log('_________________________________________:', detailsContainer.innerHTML);
    return detailsContainer;
  }

  /**
   * Create table tag
   */
  createTableHtml(tableName?) {
    let tableContainer = document.createElement('div');

    tableContainer.className = 'pp-v1-container';
    tableContainer.innerHTML = '';
    if (tableName) {
      tableContainer.innerHTML = `<h5>${tableName}</h5>`;
    }
    tableContainer.innerHTML += `<table class="table table-bordered"></table>`;
    return tableContainer;
  }

  /**
   * Create thead tag for table
   * @param headings - Array of object to set table head
   */
  createTheadHtml(headings: any[]) {
    let tHead = document.createElement('thead');
    console.log('headings:__________________', headings);
    tHead.innerHTML = headings.map(heading => { return `<th>${heading.txt}</th>`; }).join('');
    return tHead;
  }

  /**
   * Create tbody tag for Table
   */
  createTbodyHtml() {
    let tBody = document.createElement('tbody');
    return tBody;
  }

  /**
   * Create tr tag with td values
   * @param row - Array of object 
   */
  createTrHtml(row: any[]) {
    let tr = document.createElement('tr');
    tr.innerHTML = row.map(col => {
      console.log('{{{', col);
      return `<td colspan="${col.colspan || 1}" style="text-align: ${col.align || 'left'}">${
        (!col.txt || typeof col.txt === 'string' || typeof col.txt === 'number') ? (col.txt || '') : `<strong>${col.txt.name}</strong>: <span>${col.txt.value}</span>`
        }</td>`
    }).join('');
    return tr;
  }

  /**
   * Create Signature HTML to print on last page of PRINT
   * @param signatures - Array of string
   */
  createSignatureHtml(signatures: string[]) {
    let signatureContainer = document.createElement('div');
    signatureContainer.className = 'pp-v1-signature';
    signatureContainer.innerHTML = signatures.map(signature => { return `<div>${signature}</div>` }).join('');
    return signatureContainer;
  }

  /**
   * Create Footer HTML for Printng Page
   * @param footer - Footer object with 3 values {left, center, right} 
   * @param page - Page number 
   */
  createFooterHtml(footer: any, page: number) {
    let footerContainer = document.createElement('div');
    footerContainer.className = 'pp-v1-footer';
    footerContainer.innerHTML = `
      <div class="row">
        <div class="col-4">${footer.left.name}: <span>${footer.left.value}</span></div>
        <div class="col-4 text-center">${footer.center.name}: <span>${footer.center.value}</span></div>
        <div class="col-4 text-right">${footer.right.name}: <span class="page-number">${page}</span></div>
      </div>`;
    return footerContainer;
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


  getDPI() {
    let div = document.createElement("div");
    div.style.height = "1in";
    div.style.width = "1in";
    div.style.top = "-100%";
    div.style.left = "-100%";
    div.style.position = "absolute";

    document.body.appendChild(div);

    let result = div.offsetHeight;

    document.body.removeChild(div);

    return result;
  }

  detectBrowser() {
    let broswers = {
      opera: false,
      firefox: false,
      safari: false,
      ie: false,
      edge: false,
      chrome: false,
      blink: false
    };

    broswers.opera = (!!window['opr'] && !!window['opr'].addons) || !!window['opera'] || navigator.userAgent.indexOf(' OPR/') >= 0;
    broswers.firefox = typeof window['InstallTrigger'] !== 'undefined';
    // broswers.safari = /constructor/i.test((function HTMLElementConstructor() {}).toString());
    broswers.ie = /*@cc_on!@*/false || !!document['documentMode'];
    broswers.edge = !broswers.ie && !!window['StyleMedia'];
    broswers.chrome = !!window['chrome'] && (!!window['chrome'].webstore || !!window['chrome'].runtime);

    let browserName = '';
    for (let broswer in broswers) {
      if (broswers[broswer]) {
        browserName = broswer;
        break;
      }
    }

    return browserName;
  }


}
