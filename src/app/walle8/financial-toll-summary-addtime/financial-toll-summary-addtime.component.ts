import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CsvService } from '../../services/csv/csv.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'financial-toll-summary-addtime',
  templateUrl: './financial-toll-summary-addtime.component.html',
  styleUrls: ['./financial-toll-summary-addtime.component.scss']
})
export class FinancialTollSummaryAddtimeComponent implements OnInit {
  // dates = {
  //   currentdate: this.common.dateFormatter1(new Date()),
  //   start: null,
  //   end: this.common.dateFormatter1(new Date()),
  // };
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();

  fo = {
    id: null,
    name: null,
    mobileNo: null
  }
  customerFoid=null;
  foid = null;
  regno = null;
  typedKey = '';
  vehId = '';
  result = [];
  data = [];
  openingBalance = 0;
  closingBalance = 0;
  creditAmount = 0;
  debitAmount = 0;
  vehid = this.user._details.vehid;
  mobileno = this.user._details.fo_mobileno;
  foAgents = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private csvService: CsvService ) {
      this.foid = this.user._loggedInBy == 'admin' ? this.user._customer.foid:this.user._details.foid;
      console.log("FOID:",this.foid);
      console.log("this.user._details.",this.user._details);
      this.fo.id = this.user._details.foid;
      this.fo.mobileNo = this.user._details.fo_mobileno;
      this.fo.name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
      this.common.refresh = this.refresh.bind(this);
      // this.dates.start = this.common.dateFormatter1(new Date(new Date().setDate(new Date().getDate() - 15)));
  }

  ngOnInit() {
  }

  selectVehicle(vehData) {
    this.vehId = vehData.id;
    this.regno = vehData.regno;
    this.data = this.result.filter((ele) => {
      if (!this.regno) {
        return true;
      } else {
        console.log("ele", ele);
        return ele.vehid == this.regno ? true : false;
      }
    })
    console.log(this.data);
  }


  refresh() {
    this.getaddTimeFinancialTollReport();
  }

  calculateAmount(arr) {
    let usageStatus = arr[0]['entry_type'];
    let opening_balance_new = arr[0]['balance'];
    let usageAmount = arr[0]['amount'];

    console.log("usageStatus", (usageStatus).toLowerCase, "opening_balance_new", opening_balance_new, "usageAmount", usageAmount)
    if ((usageStatus).toLowerCase() == "usage" || (usageStatus).toLowerCase() == "balance recharge") {

      this.openingBalance = parseInt(opening_balance_new) - usageAmount;
    } else {
      this.openingBalance = parseInt(opening_balance_new) + (usageAmount);
    }
    this.closingBalance = arr[(arr.length - 1)]['balance'];
  }

  // getDate(date) {
  //   this.common.params = { ref_page: "card usage" };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.dates);
  //   });
  // }

  getaddTimeFinancialTollReport() {
    this.openingBalance = 0;
    this.closingBalance = 0;
    this.data = [];
    console.log("mobile no", this.mobileno);
    if (this.mobileno) {
      let params = "&startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate)) + "&mobileno=" + this.mobileno + "&vehid=" + this.vehId;
      this.common.loading++;
      this.api.walle8Get('FinancialAccountSummary/getFinancialAccountSummaryAddTime.json?' + params)
        .subscribe(res => {
          this.common.loading--;
          console.log('Res:', res);
          if (res && res['data'] && res['data'].length > 0) {
            this.result = res['data'];
            this.data = res['data'];
            // this.openingBalance = this.data[0]['amount'];
            // this.closingBalance = this.data[this.data.length - 1]['amount'];
            this.calculateAmount(this.data);
          } else {
            this.common.showError("data not found");
          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }

  }

  selectFo(fo) {
    this.fo.id = fo.foid;
    this.fo.name = fo.name;
    this.fo.mobileNo = fo.mobileno;
  }

  getFoAgents() {
    let search = document.getElementById('agentFo')['value'];
    console.log("searvh ", search)
    this.api.walle8Get('Suggestion/getFoAgents.json?search=' + search)
      .subscribe(res => {
        console.log("res", res);
        this.foAgents = res['data'];
        console.log("-0-0-0", this.foAgents);
      }, err => {
        console.log(err);
      });
  }

  filterData(event) {
    console.log('typedKey', this.typedKey)
    this.data = this.result.filter((ele) => {
      if (!this.typedKey) {
        return true;
      } else {
        console.log("ele", ele);
        return ele.vehid ? ele.vehid.toLowerCase().includes(this.typedKey) : false;
      }
    })
    console.log("data", this.data);
  }

  generatePDF() {
    let doc = new jsPDF({
      orientation: 'l',
      unit: "px",
      format: "a4"
    });

    doc = this.setPdfHeader(doc);

    let startingPage = doc.internal.getCurrentPageInfo().pageNumber;
    doc.autoTable(this.getPdfTableConfig('provider', { right: 330, left: 30, top: 20 }, null, 70,140));
    doc.setPage(startingPage);
    doc.autoTable(this.getPdfTableConfig('customer', { left: 330, right: 30, top: 20 }, null, 70,140));
    doc.autoTable(this.getPdfTableConfig('account', { left: 30, right: 30, top: 0 },null,null,290));
    doc.autoTable(this.getPdfTableConfig('tblData', { left: 30, right: 30, top: 0 }, this.setPdfPageFooter.bind(this, doc)));
    doc.save('financial-toll-summary.pdf');
  }

  setPdfHeader(doc) {
    doc.setFontSize(12);
    doc.setFontStyle('bold');
    doc.text(30, 30, 'eLogist Solutions Pvt. Ltd.');

    doc.setFontSize(8)
    doc.setFontStyle('normal');
    doc.text(30, 39, 'Address: 605-21, Jaipur Electronic Market,');
    doc.text(30, 46, 'Riddhi Siddhi Circle, Gopalpura Bypass, Jaipur, Rajasthan - 302018');
    doc.text(30, 53, 'Support: 8081604455');
    doc.text(30, 60, 'Website: www.walle8.com');

    let image = this.getImgTagToBase64('logo');
    doc.addImage(image, 'PNG', 550, 15, 40, 40);

    return doc;
  }

  setPdfPageFooter(doc, data) {
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text(
      'Page ' + data.pageCount,
      data.settings.margin.left,
      doc.internal.pageSize.height - 10
    );
    /******** Page Top Margin *********** */
    data.settings.margin.top = 20;
  };

  getPdfTableConfig(id: string, margin: object, footerSetter?: any, startY?: number,cellWidth=65) {
    let config = {
      html: '#' + id,
      theme: 'grid',
      margin: margin,
      rowPageBreak: 'avoid',
      headStyles: {
        fillColor: [98, 98, 98],
        fontSize: 10,
        halign: 'center',
        valign: 'middle'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        minCellHeight: 11,
        minCellWidth: 10,
        cellWidth: cellWidth,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        text: {
          cellWidth: cellWidth,
          halign: 'center',
          valign: 'middle'
        }
      },
    }

    if (startY)
      config['startY'] = startY;

    if (footerSetter)
      config['didDrawPage'] = footerSetter;

    return config;
  }

  getImgTagToBase64(id: string) {
    let canvas = document.createElement('canvas');
    let img: any = document.getElementById(id);
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }
  printCsv(tblEltId,tblEltId1) {
    let customerName = this.user._customer.name;
    if (this.user._loggedInBy == "customer")
       customerName = this.user._details.name;
        let details = [
          { customer: 'Customer : ' + this.fo.name },
          { report: 'Report : Financial Toll Summary (Add Time)' },
          {period : 'Period : '+this.common.dateFormatter(new Date(this.startDate))+" To "+this.common.dateFormatter(new Date(this.endDate))},
          { time: 'Time : ' + this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss a') }
         ];
        this.csvService.byMultiIds([tblEltId1], 'Financial Toll Summary', details);
  }

}
