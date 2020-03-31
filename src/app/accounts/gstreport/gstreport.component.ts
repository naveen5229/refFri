import { Component, OnInit, HostListener ,Pipe, PipeTransform} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import * as _ from 'lodash';
import { ExcelService } from '../../services/excel/excel.service';

@Component({
  selector: 'gstreport',
  templateUrl: './gstreport.component.html',
  styleUrls: ['./gstreport.component.scss']
})
export class GstreportComponent implements OnInit {
  selectedName = '';
  headings=[];
  totalLength=0;
  bankBook = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: ((((new Date()).getMonth())+1) > 3) ? this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-') : this.common.dateFormatternew(((new Date().getFullYear())-1) + '-04-01', 'ddMMYYYY', false, '-'),
    reportype: 'b2b',
    issumrise: 'true'

  };
  vouchertypedata = [];
  branchdata = [];
  DayData = [];
  ledgerData = [];
  activeId = 'ledger';
  selectedRow = -1;
  allowBackspace = true;


  f2Date = 'startdate';
  lastActiveId = '';
  showDateModal = false;
  activedateid = '';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private excelService: ExcelService,
    public modalService: NgbModal) {
    // this.getVoucherTypeList();
    this.common.refresh = this.refresh.bind(this);

    this.setFoucus('startdate');
    this.common.currentPage = 'Gst Report';


  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
  refresh() {
    this.setFoucus('ledger');
  }
  getTableColumnName() {

  this.headings = [];
  let first_rec = this.DayData[0];
  for (var key in first_rec) {
    //console.log('kys',first_rec[key]);
      this.headings.push(key);    
  }

  console.log("headings", this.headings);
 // this.getTableColumns();
}

  // getVoucherTypeList() {
  //   let params = {
  //     search: 123
  //   };
  //   this.common.loading++;
  //   this.api.post('Suggestion/GetVouchertypeList', params)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log('Res:', res['data']);
  //       this.vouchertypedata = res['data'];
  //     }, err => {
  //       this.common.loading--;
  //       console.log('Error: ', err);
  //       this.common.showError();
  //     });
  // }
 


  
  
  pdfFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1 + remainingstring3;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','','Gst From :'+this.bankBook.startdate+' To :'+this.bankBook.enddate);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  

  getCsvData() {
    console.log('Accounts:', this.bankBook);
    let params = {
      startdate: this.bankBook.startdate,
      enddate: this.bankBook.enddate,
      reporttype: 'all'
    };

    this.common.loading++;
    this.api.post('Voucher/getGstAllReport', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res report:', res['data'][0]);
       
        this.csvFunction(res['data']);
      
        this.totalLength = this.DayData.length;
        

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  csvFunction(csvdata){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.excelService.getMultipleSheetsInExcel(['b2b','b2cl','b2cs','cdnr','cdnur','exp','at','atadj','exemp','hsn','docs'],foname,cityaddress,remainingstring3,csvdata);

     
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  getCsvReport() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = (res['data'][0]) ? res['data'][0].addressline + '\n' : '';
        let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1;
        let foname = (res['data'][0]) ? res['data'][0].foname : '';
        this.common.getCSVFromTableIdNew('table', foname, cityaddress, '', '', remainingstring3);
        // this.common.getCSVFromTableIdNew('table',res['data'][0].foname,cityaddress,'','',remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  getVoucherEdited() {
    console.log('Accounts:', this.bankBook);
    let params = {
      startdate: this.bankBook.startdate,
      enddate: this.bankBook.enddate,
      reporttype: this.bankBook.reportype
    };

    this.common.loading++;
    this.api.post('Voucher/getGstReport', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res report:', res['data'][0]);
       
        this.DayData =res['data'];
        this.getTableColumnName();
        //this.filterData();
        this.totalLength = this.DayData.length;
        // if (this.DayData.length) {

        //   // console.log('lenght',this.DayData.length);
        //   // document.activeElement['blur']();
        //   this.selectedRow = 0;
        // }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  counter(i: number) {
    return new Array(i);
}

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.bankBook[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.bankBook[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.bankBook[type].name = selectedData[display];
    this.bankBook[type].id = selectedData.y_ledger_id;
    console.log('Selected Data: ', selectedData, type, display);
    console.log('order User: ', this.bankBook);
  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startdate') ? 'startdate' : 'enddate';
    if (this.bankBook[datestring].includes('-')) {
      dateArray = this.bankBook[datestring].split('-');
    } else if (this.bankBook[datestring].includes('/')) {
      dateArray = this.bankBook[datestring].split('/');
      separator = '/';
    } else {
      this.common.showError('Invalid Date Format!');
      return;
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    console.log('Date: ', date + separator + month + separator + year);
    this.bankBook[datestring] = date + separator + month + separator + year;
  }

  // filterData() {
  //   let yCodes = [];
  //   this.DayData.map(dayData => {
  //     if (yCodes.indexOf(dayData.y_code) !== -1) {
  //       dayData.y_code = ' ';
  //       dayData.y_date = 0;
  //     }
  //   });
  // }

  getBookDetail(voucherId) {
    console.log('vouher id', voucherId);
    this.common.params = voucherId;

    const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        return;
        //   if (stocksubType) {

        //     this.updateStockSubType(stocksubType.id, data.stockSubType);
        //     return;
        //   }
        //  this.addStockSubType(data.stockSubType)
      }
    });
  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event, this.activeId);
    if (key == 'enter' && !this.activeId && this.DayData.length && this.selectedRow != -1) {
      /***************************** Handle Row Enter ******************* */
      this.getBookDetail(this.DayData[this.selectedRow].y_ledger_id);
      return;
    }
    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = this.activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = this.activeId;
      this.activedateid = this.lastActiveId;
      return;
    } else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      return;
    }
    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('ledger')) {
        this.setFoucus('startdate');
      } else if (this.activeId.includes('startdate')) {
        this.bankBook.startdate = this.common.handleDateOnEnterNew(this.bankBook.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.bankBook.enddate = this.common.handleDateOnEnterNew(this.bankBook.enddate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
      if (this.activeId == 'startdate') this.setFoucus('ledger');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    }else if ((this.activeId == 'startdate' || this.activeId == 'enddate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.DayData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.DayData.length - 1) this.selectedRow++;

    }
  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

  test(e) {
    console.log('--------: ', e);
  }

}