import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { OrderdetailComponent } from '../../acounts-modals/orderdetail/orderdetail.component';
import * as _ from 'lodash';
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';
import { ViewMVSFreightStatementComponent } from '../../modals/FreightRate/view-mvsfreight-statement/view-mvsfreight-statement.component';
import { FuelfilingComponent } from '../../acounts-modals/fuelfiling/fuelfiling.component';
import { VoucherSummaryComponent } from '../../accounts-modals/voucher-summary/voucher-summary.component';
import { VoucherSummaryShortComponent } from '../../accounts-modals/voucher-summary-short/voucher-summary-short.component';
import { AccountService } from '../../services/account.service';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { VoucherComponent } from '../../acounts-modals/voucher/voucher.component';
import { ServiceComponent } from '../service/service.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ledgerview',
  templateUrl: './ledgerview.component.html',
  styleUrls: ['./ledgerview.component.scss']
})
export class LedgerviewComponent implements OnInit {
  vouchertypedata = [];
  branchdata = [];
  ledgerViewData=[];
  VoucherEditTime=[];
  fuelFilings=[];
  TripEditData=[];
  pendingDataEditTme=[];
  tripExpDriver=[];
  tripExpenseVoucherTrips=[];
  ledger = {
    endDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    ledger: {
      name: 'All',
      id: 0
    },
    branch: {
      name: '',
      id: ''
    },
    voucherType: {
      name: 'All',
      id: 0
    }

  };

  ledgerData = [];
  ledgerList = [];
  activeId = 'voucherType';
  selectedRow = -1;
  allowBackspace = true;
  showDateModal = false;
  f2Date = 'startDate';
  activedateid = '';
  lastActiveId = '';
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public accountService: AccountService,
    public modalService: NgbModal) {
      this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate: this.ledger.startDate;
      this.accountService.todate = (this.accountService.todate)? this.accountService.todate: this.ledger.endDate;
     
    this.common.refresh = this.refresh.bind(this);
    this.getVoucherTypeList();
    this.getLedgerList();
    this.setFoucus('voucherType');
    this.common.currentPage = 'Ledger View';
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 0);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    this.getVoucherTypeList();
    this.getLedgerList();
    this.setFoucus('voucherType');
    if(this.ledger.ledger.id!=0)
    {
    this.getLedgerView();
  }
  }
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
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','','Ledger View From :'+this.ledger.startDate+' To :'+this.ledger.endDate);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  csvFunction(){
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
       this.common.getCSVFromTableIdNew('table',foname,cityaddress,'','',remainingstring3);
      // this.common.getCSVFromTableIdNew('table',res['data'][0].foname,cityaddress,'','',remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getVoucherTypeList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetVouchertypeList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.vouchertypedata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getBranchList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.branchdata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getLedgerList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerList = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getLedgerView() {
    this.ledger.startDate= this.accountService.fromdate;
    this.ledger.endDate= this.accountService.todate;
    console.log('Ledger:', this.ledger);
    if(this.ledger.ledger.id==0){
      this.common.showError('Please Select Ledger');
      this.setFoucus('ledger');
    }else{
    let params = {
      startdate: this.ledger.startDate,
      enddate: this.ledger.endDate,
      ledger: this.ledger.ledger.id,
      branch: this.ledger.branch.id,
      vouchertype: this.ledger.voucherType.id,
    };

    this.common.loading++;
    this.api.post('Accounts/getLedgerView', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
        this.generalizeData();
        if (this.ledgerData.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
}
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.ledger[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.ledger[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.ledger[type].name = selectedData[display];
    this.ledger[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter' && !this.activeId && this.ledgerData.length && this.selectedRow != -1) {
      /***************************** Handle Row Enter ******************* */
      this.getBookDetail(this.ledgerData[this.selectedRow].y_ledger_id,'','','');
      return;
    }
    // if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
    //   // document.getElementById("voucher-date").focus();
    //   // this.voucher.date = '';
    //   this.lastActiveId = this.activeId;
    //   this.setFoucus('voucher-date-f2', false);
    //   this.showDateModal = true;
    //   this.f2Date = this.activeId;
    //   this.activedateid = this.lastActiveId;
    //   return;
    // } 
    else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
      return;
    }else if ((event.ctrlKey && key === 'd') && (this.ledgerData.length && this.selectedRow != -1)) {
      ((this.ledgerData[this.selectedRow].y_type.toLowerCase().includes('voucher')) ? (this.ledgerData[this.selectedRow].y_type.toLowerCase().includes('trip')) ? '' : this.openVoucherEdit(this.ledgerData[this.selectedRow].y_voucherid, 6, this.ledgerData[this.selectedRow].y_vouchertype_id) : (this.ledgerData[this.selectedRow].y_type.toLowerCase().includes('invoice') || this.ledgerData[this.selectedRow].y_type.toLowerCase().includes('debit') || this.ledgerData[this.selectedRow].y_type.toLowerCase().includes('credit')) ? this.openinvoicemodeledit(this.ledgerData[this.selectedRow].y_voucherid,this.ledgerData[this.selectedRow].y_vouchertype_id,1) :'' )
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('voucherType')) {
        this.setFoucus('ledger');
      } else if (this.activeId.includes('ledger')) {
        this.setFoucus('startDate');
      } else if (this.activeId.includes('startDate')) {
        this.ledger.startDate = this.common.handleDateOnEnterNew(this.ledger.startDate);
        this.setFoucus('endDate');
      } else if (this.activeId.includes('endDate')) {
        this.ledger.endDate = this.common.handleDateOnEnterNew(this.ledger.endDate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'endDate') this.setFoucus('startDate');
      if (this.activeId == 'startDate') this.setFoucus('ledger');
      if (this.activeId == 'ledger') this.setFoucus('voucherType');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startDate' || this.activeId == 'endDate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }else if (key != 'backspace') {
      this.allowBackspace = false;
    }

    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.ledgerData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.ledgerData.length - 1) this.selectedRow++;

    }
  }


  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.ledger[datestring].includes('-')) {
      dateArray = this.ledger[datestring].split('-');
    } else if (this.ledger[datestring].includes('/')) {
      dateArray = this.ledger[datestring].split('/');
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
    this.ledger[datestring] = date + separator + month + separator + year;
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

  // getBookDetail(voucherId,vouhercode,ytype,dataItem) {
  //   console.log('vouher id', voucherId,'ytype',ytype);
  //   if((ytype.toLowerCase().includes('purchase')) || (ytype.toLowerCase().includes('sales')) || (ytype.toLowerCase().includes('debit')) || (ytype.toLowerCase().includes('credit'))){
  //     this.common.params = {
  //       invoiceid: voucherId,
  //       delete: 0,
  //       indexlg:0
  //     };
  //     const activeModal = this.modalService.open(OrderdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  //     activeModal.result.then(data => {
  //       // console.log('Data: ', data);
  //       if (data.response) {
  //         console.log('open succesfull');
  
  //         // this.addLedger(data.ledger);
  //       }
  //     });
  //   }else if(ytype.toLowerCase().includes('fuel')){
  //         this.openFuelEdit(dataItem);
  //   }  else if(dataItem.y_type.toLowerCase().includes('trip')){
  //     this.openConsignmentVoucherEdit(dataItem)
  //   } else{
  //   this.common.params={

  //     vchid :voucherId,
  //     vchcode:vouhercode
  //   }
  //   const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
  //   activeModal.result.then(data => {
  //     // console.log('Data: ', data);
  //     if (data.response) {
  //       return;
  //       //   if (stocksubType) {

  //       //     this.updateStockSubType(stocksubType.id, data.stockSubType);
  //       //     return;
  //       //   }
  //       //  this.addStockSubType(data.stockSubType)
  //     }
  //   });
  // }
  // }
  getBookDetail(voucherId,vouhercode,ytype,dataItem) {
    console.log('vouher id', voucherId,'ytype',ytype);
    if((ytype.toLowerCase().includes('purchase')) || (ytype.toLowerCase().includes('sales')) || (ytype.toLowerCase().includes('debit')) || (ytype.toLowerCase().includes('credit'))){
      this.common.params = {
        invoiceid: voucherId,
        delete: 0,
        newid: 0,
        ordertype: dataItem.y_vouchertype_id,
        isModal:true
      };
      const activeModal = this.modalService.open(ServiceComponent, { size: 'lg', container: 'nb-layout', windowClass: 'page-as-modal', });
      activeModal.result.then(data => {
        console.log('Data: invoice ', data);
          if (data.msg) {
        }
      });
      // this.common.params = {
      //   invoiceid: voucherId,
      //   delete: 0,
      //   newid:0,
      //   ordertype:dataItem.y_vouchertype_id
      // };
      // const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      // activeModal.result.then(data => {
      //    console.log('Data: invoice ', data);
      //   if (data.delete) {
      //     console.log('open succesfull');
      //   }
      // });
      // this.common.params = {
      //   invoiceid: voucherId,
      //   delete: 0,
      //   indexlg:0
      // };
      // const activeModal = this.modalService.open(OrderdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      // activeModal.result.then(data => {
      //   // console.log('Data: ', data);
      //   if (data.response) {
      //     console.log('open succesfull');
  
      //     // this.addLedger(data.ledger);
      //   }
      // });
    }else if(ytype.toLowerCase().includes('fuel')){
          this.openFuelEdit(dataItem);
    }  else if(dataItem.y_type.toLowerCase().includes('trip')){
      this.openConsignmentVoucherEdit(dataItem)
    } else{

      this.common.params = {
        voucherId: voucherId,
        delete: 0,
        addvoucherid: 0,
        voucherTypeId: dataItem.y_vouchertype_id,
      };
      const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        console.log('Data: ', data);
        if (data.delete) {
         // this.getDayBook();
        } 
        // this.common.showToast('Voucher updated');

      });
    // this.common.params={

    //   vchid :voucherId,
    //   vchcode:vouhercode
    // }
    // const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    // activeModal.result.then(data => {
    //   // console.log('Data: ', data);
    //   if (data.response) {
    //     return;
      
    //   }
    // });
  }
  this.common.currentPage = 'Ledger View';
  }
  openFuelEdit(vchData){
    console.log('vch data new ##',vchData);
    let promises = [];
    console.log('testing issue solved');
    promises.push(this.getVocherEditTime(vchData['y_voucherid']));
    promises.push(this.getDataFuelFillingsEdit(vchData['y_vehicle_id'],vchData['y_refid'],vchData['y_voucherid']));

    Promise.all(promises).then(result => {
    this.common.params = {
      vehId: vchData['y_vehicle_id'],
      lastFilling: this.ledger.startDate,
      currentFilling: this.ledger.endDate,
      fuelstationid: vchData['y_refid'],
      fuelData:this.fuelFilings,
      voucherId:vchData['y_voucherid'],
      voucherData:this.VoucherEditTime,
      //vehname:this.trips[0].y_vehicle_name
    };

    const activeModal = this.modalService.open(FuelfilingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
       console.log('Data return: ', data);
      if (data.success) {
     //   this.getDayBook();
      }
    });
  }).catch(err => {
    console.log(err);
    this.common.showError('There is some technical error occured. Please Try Again!');
  })
  }

  
  
  getDataFuelFillingsEdit(vehcleID,fuelStationId,vchrID) {
    return new Promise((resolve, reject) => {
    const params = {
      vehId: vehcleID,
      lastFilling: this.ledger.startDate,
      currentFilling:this.ledger.endDate,
      fuelstationid: fuelStationId,
      voucherId:vchrID
    };
    this.common.loading++;
    this.api.post('Fuel/getFeulfillings', params)
      .subscribe(res => {
      //  console.log('fuel data', res['data']);
        this.common.loading--;
        if(res['data'].length){
        this.fuelFilings = res['data'];
        resolve();
        }else {
          this.common.showError('please Select Correct date');
        }
        // this.getHeads();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
        reject();
      });
    })
   
  }
  getVocherEditTime(VoucherID) {
    return new Promise((resolve, reject) => {
      const params = {
        vchId: VoucherID
      };
      this.common.loading++;
      this.api.post('Voucher/getVoucherDetail', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.VoucherEditTime = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })
  }

  generalizeData() {
    let ledgerLastData=[];
this.ledgerData.map((data,index) => {
  let ledgerDataWithMonth=[];
  ledgerDataWithMonth['datemonth'] = this.common.changeMonthformat(data.y_date, 'MMMM');
  ledgerDataWithMonth['y_date'] = data.y_date;
  ledgerDataWithMonth['y_code'] = data.y_code;
  ledgerDataWithMonth['y_cust_code'] = data.y_cust_code;
  ledgerDataWithMonth['y_type'] = data.y_type;
  ledgerDataWithMonth['y_ledger'] = data.y_ledger;
  ledgerDataWithMonth['y_dramunt'] = data.y_dramunt;
  ledgerDataWithMonth['y_cramunt'] = data.y_cramunt;
  ledgerLastData.push(ledgerDataWithMonth);
    });

//console.log('+++++++++',ledgerLastData);

    this.ledgerViewData = [];
    let allGroups = _.groupBy(ledgerLastData, 'datemonth');
    let allKeys = Object.keys(allGroups);
    allKeys.map((key, index) => {
      this.ledgerViewData[index] = {
        name: key,
        amount: {
          debit: 0,
          credit: 0
        },
        vouchers: allGroups[key]
      };
      allGroups[key].map(data => {
        this.ledgerViewData[index].amount.debit += parseFloat(data.y_dramunt);
        this.ledgerViewData[index].amount.credit += parseFloat(data.y_cramunt);
      });
    });
    console.log('------',this.ledgerViewData);
    // this.showAllGroups();
  }

  openfreight(freightId){
    if(freightId){
    let invoice = {
      id: freightId,
    }
    this.common.params = { invoice: invoice }
    const activeModal = this.modalService.open(ViewMVSFreightStatementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);

    });
  }else{
    this.common.showError('Please Select another Entry');
  }
}

  openRevenue(freightId){
    if(freightId){
    let previewData = {
      title: 'Invoice',
      previewId: null,
      refId: freightId,
      refType: "FRINV"
    }
    this.common.params = { previewData };

    // const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });

    activeModal.result.then(data => {
      console.log('Date:', data);
    });

      }else{
        this.common.showError('Please Select another Entry');
      }
  }

  editTransfer(transferId) {
    if(transferId){
    let refData = {
      transferId:transferId,
      readOnly:true
    }
    this.common.params = { refData: refData };
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    //  this.viewTransfer();
    });
  }else{
    this.common.showError('Please Select another entry');
  }
  }
  openConsignmentVoucherEdit(voucherData) {
    const params = {
      vehId: 0,
      voucherid: voucherData.y_voucherid,
      isdate: 0
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getTripExpenceVouher', params)
      .subscribe(res => {
        console.log('trip expence', res);
        this.common.loading--;
        this.getVoucherSummary(res['data'][0], voucherData);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }
  getVoucherSummary(tripVoucher, voucherData) {
    let promises = [];
    promises.push(this.getPendingOnEditTrips(tripVoucher.y_vehicle_id));
    promises.push(this.getVocherEditTime(tripVoucher.y_voucher_id));
    promises.push(this.getPendingTripsEditTime(tripVoucher.y_id, tripVoucher.y_vehicle_id));

    if (voucherData.y_vouchertype_id == -151) {
      promises.push(this.getTripsExpDriver(tripVoucher.y_id));
    }

    promises.push(this.getTripExpenseVoucherTripsData(tripVoucher));

    Promise.all(promises).then(result => {
      this.showVoucherSummary(this.tripExpenseVoucherTrips, tripVoucher, voucherData);
    }).catch(err => {
      console.log(err);
      this.common.showError('There is some technical error occured. Please Try Again!');
    });

  }
  getPendingOnEditTrips(vehicleid) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vehicleid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTrips', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.TripEditData = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject(err);
        });
    });

  }
  getPendingTripsEditTime(voucherid, vhicleId) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vhicleId,
        vchrid: voucherid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTripsEdit', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.pendingDataEditTme = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }
  getTripsExpDriver(tripvoucherid) {
    return new Promise((resolve, reject) => {
      const params = {
        tripVchrId: tripvoucherid
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripsExpDriver', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpDriver = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })
  }
  
  getTripExpenseVoucherTripsData(tripVoucher) {
    return new Promise((resolve, reject) => {
      const params = {
        voucherId: tripVoucher.y_voucher_id,
        voucherDetail: tripVoucher
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripExpenseVoucherTripsData', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpenseVoucherTrips = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }
  showVoucherSummary(tripDetails, tripVoucher, voucherData) {
    let vehId = tripVoucher.y_vehicle_id;
    let tripEditData = this.TripEditData;
    let tripPendingDataSelected = this.pendingDataEditTme;
    let VoucherData = this.VoucherEditTime;
    let typeFlag = 1;
    let permanentDelete = 0;
    let showSubmit =1;


    if (voucherData.y_vouchertype_id == -151) {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete,showSubmit };


      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
         // this.getDayBook();
        }
      });
    } else {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete,showSubmit };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
        //  this.getDayBook();
        }
      });
    }
  }
  openVoucherEdit(voucherId, voucheradd, vchtypeid) {
    console.log('ledger123', vchtypeid);
    if (voucherId) {
      this.common.params = {
        voucherId: voucherId,
        delete: 0,
        addvoucherid: voucheradd,
        voucherTypeId: vchtypeid,
      };
      const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        console.log('Data: ', data);
        if (data.delete) {
          this.getLedgerView();
        } 
        // this.common.showToast('Voucher updated');

      });
    }
  }
  openinvoicemodeledit(invoiceid,ordertypeid,create=0) {
    // console.log('welcome to invoice ');
    //  this.common.params = invoiceid;
    // this.common.params = {
    //   invoiceid: invoiceid,
    //   delete: 0,
    //   newid:create,
    //   ordertype:ordertypeid
    // };
    // const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //    console.log('Data: invoice ', data);
    //   if (data.delete) {
    //     console.log('open succesfull');
    //       this.getLedgerView();
    //   }
    // });
    this.common.params = {
      invoiceid: invoiceid,
      delete: 0,
      newid: create,
      ordertype: ordertypeid,
      isModal:true
    };
    const activeModal = this.modalService.open(ServiceComponent, { size: 'lg', container: 'nb-layout', windowClass: 'page-as-modal', });
    activeModal.result.then(data => {
      console.log('Data: invoice ', data);
        if (data.msg) {
          this.getLedgerView();
      }
    });
  }
}
