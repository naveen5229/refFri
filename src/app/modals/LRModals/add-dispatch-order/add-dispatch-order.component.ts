import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { AccountService } from '../../../services/account.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-dispatch-order',
  templateUrl: './add-dispatch-order.component.html',
  styleUrls: ['./add-dispatch-order.component.scss']
})
export class AddDispatchOrderComponent implements OnInit {

  dispatchOrderField = [];
  generalDetailColumn2 = [];
  generalDetailColumn1 = [];
  disOrder = {
    date: new Date(),
    id: null
  };
  vehicleData = {
    regno: null,
    id: null
  };
  btnTxt = 'SAVE';
  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1000');

    if (this.common.params.dispatchOrderData) {
      this.disOrder.id = this.common.params.dispatchOrderData.id ? this.common.params.dispatchOrderData.id : 'null';
    }
    if (this.disOrder.id || this.accountService.selected.branch.id) {
      this.getDispatchOrderFields(true);
    }
    this.formatGeneralDetails();
  }

  ngOnInit() {
  }

  getDispatchOrderFields(isSetBranchId?) {
    let branchId = this.accountService.selected.branch.id ? this.accountService.selected.branch.id : '';
    let params = "branchId=" + this.accountService.selected.branch.id +
      "&dispatchOrderId=" + null;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getDispatchOrderFields?' + params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'] && res['data'].result) {
          this.dispatchOrderField = res['data'].result[0];
          let headData = res['data'].headings;
          if (headData.length > 0) {
            this.setLrHeadData(headData[0]);
          }
          this.formatGeneralDetails();
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  setLrHeadData(headData) {
    this.vehicleData.id = headData.vehicle_id;
    this.vehicleData.regno = headData.regno;
    this.disOrder.id = headData.dispatch_id;
    this.disOrder.date = headData.dispatch_date;
    this.accountService.selected.branch.id = headData.branch_id;
  }


  resetVehicle() {
    this.vehicleData.id = null;
  }

  closeModal() {
    this.activeModal.close(true);
  }

  formatGeneralDetails() {
    console.log("dispatchOrderField", this.dispatchOrderField);
    this.generalDetailColumn2 = [];
    this.generalDetailColumn1 = [];
    this.dispatchOrderField.map(dd => {
      if (dd.r_coltype == 3) {
        dd.r_value = dd.r_value ? new Date(dd.r_value) : new Date();
        console.log("date==", dd.r_value);
      }
      if (dd.r_colorder % 2 == 0) {
        this.generalDetailColumn2.push(dd);
      } else {
        this.generalDetailColumn1.push(dd);
      }
    });
    console.log("generalDetailColumn2", this.generalDetailColumn2);
    console.log("generalDetailColumn1", this.generalDetailColumn1);
  }

}
