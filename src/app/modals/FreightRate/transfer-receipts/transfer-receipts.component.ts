import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'transfer-receipts',
  templateUrl: './transfer-receipts.component.html',
  styleUrls: ['./transfer-receipts.component.scss', '../../../pages/pages.component.css']
})
export class TransferReceiptsComponent implements OnInit {
  tranferReceipt = {
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: 0,
    refId: null,
    refTypeName: null,
    date: new Date(),
    selectOption: "transfer",
    adviceTypeId: null,
    modeId: null,
    amount: null,
    remark: null
  };
  refernceData = [];
  typesData = [];
  ModeData = [];


  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService) {
    this.getTypeList();
    this.getPaymentMode();
    //   this.ModeData = [{
    //     id: 1,
    //     name: 'cash'
    //   },
    //   {
    //     id: 2,
    //     name: 'Card'
    //   },
    //   {
    //     id: 3,
    //     name: 'OnlinePay',
    //   }]
  }

  ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }


  getvehicleData(vehicle) {
    this.tranferReceipt.vehicleId = vehicle.id;
    this.tranferReceipt.vehicleRegNo = vehicle.regno;
  }

  resetvehicle() {
    document.getElementById('vehicleno')['value'] = '';
    this.tranferReceipt.vehicleId = null;
    this.tranferReceipt.vehicleRegNo = null;
    this.resetRefernceType();
  }
  resetRefernceType(isReset = true) {
    document.getElementById('referncetype')['value'] = '';
    if (isReset)
      this.tranferReceipt.refernceType = null;
    this.refernceData = [];
  }

  refernceTypes() {
    let type = this.tranferReceipt.refernceType + "";
    let url = null;
    let params = {
      vid: this.tranferReceipt.vehicleId,
      regno: this.tranferReceipt.vehicleRegNo
    };

    switch (type) {
      case '11':
        url = "Suggestion/getLorryReceipts";
        break;
      case '12':
        url = "Suggestion/getLorryManifest";
        break;
      case '13':
        url = "Suggestion/getVehicleStates";
        break;
      case '14':
        url = "Suggestion/getVehicleTrips";
        break;
      default:
        url = null;
        return;

    }
    console.log("params", params);
    this.api.post(url, params)
      .subscribe(res => {
        this.refernceData = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


  report(type) {
    console.log("test", type);
    this.tranferReceipt.selectOption = type;
  }
  getTypeList() {
    this.common.loading++;
    this.api.get('Suggestion/getTypeMaster?typeId=55')
      .subscribe(res => {
        this.common.loading--;
        this.typesData = res['data'];
        console.log('type', this.typesData);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  getPaymentMode() {
    this.common.loading++;
    this.api.get('Suggestion/getTypeMaster?typeId=56')
      .subscribe(res => {
        this.common.loading--;
        this.ModeData = res['data'];
        console.log('type', this.ModeData);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  save() {
    console.log("Params");
    ++this.common.loading;
    let params = {
      vid: this.tranferReceipt.vehicleId,
      regno: this.tranferReceipt.vehicleRegNo,
      vehasstype: 0,
      advice_type_id: this.tranferReceipt.adviceTypeId,
      advice_mode: this.tranferReceipt.modeId,
      dttime: this.common.dateFormatter(this.tranferReceipt.date),
      user_value: this.tranferReceipt.amount,
      ref_type: this.tranferReceipt.refernceType,
      ref_id: this.tranferReceipt.refId,
      for_ref_id: null,
      voucher_details_id: null,
      ledger_id: null,
      rec_value: null,
      is_transfer: this.tranferReceipt.selectOption,
      pay_mode: this.tranferReceipt.modeId,
      remarks: this.tranferReceipt.remark

    };
    this.api.post("LorryReceiptsOperation/saveTransfers", params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ data: true });
        }
        else {
          this.common.showError(res['data'][0].y_msg);

        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }



}
