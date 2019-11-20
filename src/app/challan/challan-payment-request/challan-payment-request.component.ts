import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayChallanPaymentComponent } from '../../modals/challanModals/pay-challan-payment/pay-challan-payment.component';

@Component({
  selector: 'challan-payment-request',
  templateUrl: './challan-payment-request.component.html',
  styleUrls: ['./challan-payment-request.component.scss']
})
export class ChallanPaymentRequestComponent implements OnInit {


  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  challanRequest = [];
  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getChallanPaymentRequest();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.getChallanPaymentRequest();
  }



  getChallanPaymentRequest() {
    this.common.loading++;
    this.api.get('Challans/getChallanPaymentRequest')
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        this.clearAllTableData();
        if (!res['data']) {
          this.common.showError("Data Not Found");
          return;
        }
        this.challanRequest = res['data'];
        this.setTable();
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });

  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.challanRequest[0]),
      columns: this.getColumns(this.challanRequest, this.challanRequest[0])
    };
  }

  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getColumns(challanList, chHeadings) {
    let columns = [];
    challanList.map(item => {
      let column = {};
      for (let key in this.generateHeadings(chHeadings)) {
        if (key == "Action") {
          column[key] = { value: "", action: null, icons: [{ class: 'far fa-edit', action: this.acRemainingBalance.bind(this, item) }] }
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  acRemainingBalance(challanDetails) {
    this.common.loading++;
    let params = "foid=" + challanDetails._foid;
    this.api.get('Gisdb/getAccountRemainingBalance?' + params)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        if (!res['data']) {
          this.common.showError("Data Not Found");
          return;
        }
        this.payChallanPayment(challanDetails, res['data'][0]['main_balance']);


      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });


  }

  payChallanPayment(challanDetails, mainBalance) {
    this.common.params = {
      regNo: challanDetails.Regno,
      vehicleId: challanDetails._vehid,
      chDate: challanDetails['Challan Date'],
      chNo: challanDetails.ChallanNo,
      amount: challanDetails.Amount,
      rowId: challanDetails._id,
      mainBalance: mainBalance
    }
    const activeModal = this.modalService.open(PayChallanPaymentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        // this.getPendingChallans();
      }
    });

  }

  clearAllTableData() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }



}
