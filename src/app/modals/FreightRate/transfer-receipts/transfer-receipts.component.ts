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
  transferReceipt = {
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: 1,
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
  referenceName = null;

  typesData = [];
  ModeData = [];
  edit = 0;
  referenceType = [{
    name: 'select Type',
    id: '0'

  },
  {
    name: 'Lr',
    id: '11'
  },
  {
    name: 'Manifest',
    id: '12'
  },
  {
    name: 'state',
    id: '13'
  },
  {
    name: 'Trip',
    id: '14'
  }]


  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService) {
    this.getPaymentMode();
    this.getTypeList();
    if (this.common.params && this.common.params.refData) {
      this.edit = 1;
      this.transferReceipt.refernceType = this.common.params.refData.refType;
      this.transferReceipt.refId = this.common.params.refData.refId;
      this.getReferenceData();
      this.getRefernceType(this.transferReceipt.refernceType);
    }

  }

  ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }

  getRefernceType(typeId) {
    this.referenceType.map(element => {
      if (element.id == typeId) {
        return this.referenceName = element.name;
      }
    });
    this.refernceTypes();
  }

  getReferenceData() {
    const params = "id=" + this.transferReceipt.refId +
      "&type=" + this.transferReceipt.refernceType;
    this.api.get('Vehicles/getRefrenceDetails?' + params)
      .subscribe(res => {
        console.log(res['data']);
        let resultData = res['data'][0];
        this.transferReceipt.vehicleId = resultData.vid;
        this.transferReceipt.vehicleRegNo = resultData.regno;
        this.transferReceipt.refTypeName = resultData.ref_name;
        // this.id = resultData.vehasstype
        this.refernceTypes();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getvehicleData(vehicle) {
    this.transferReceipt.vehicleId = vehicle.id;
    this.transferReceipt.vehicleRegNo = vehicle.regno;
  }

  resetvehicle() {
    document.getElementById('vehicleno')['value'] = '';
    this.transferReceipt.vehicleId = null;
    this.transferReceipt.vehicleRegNo = null;
    this.resetRefernceType();
  }
  resetRefernceType(isReset = true) {
    document.getElementById('referncetype')['value'] = '';
    if (isReset)
      this.transferReceipt.refernceType = null;
    this.refernceData = [];
  }

  refernceTypes() {
    let type = this.transferReceipt.refernceType + "";
    let url = null;
    let params = {
      vid: this.transferReceipt.vehicleId,
      regno: this.transferReceipt.vehicleRegNo
    };
    // const urls = {
    //   11: "Suggestion/getLorryReceipts",
    //   12: 
    // };
    // url = urls[type] || null ;
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
    this.transferReceipt.selectOption = type;
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
      vid: this.transferReceipt.vehicleId,
      regno: this.transferReceipt.vehicleRegNo,
      vehasstype: 0,
      advice_type_id: this.transferReceipt.adviceTypeId,
      advice_mode: this.transferReceipt.modeId,
      dttime: this.common.dateFormatter(this.transferReceipt.date),
      user_value: this.transferReceipt.amount,
      ref_type: this.transferReceipt.refernceType,
      ref_id: this.transferReceipt.refId,
      for_ref_id: null,
      voucher_details_id: null,
      ledger_id: null,
      rec_value: null,
      is_transfer: this.transferReceipt.selectOption,
      pay_mode: this.transferReceipt.modeId,
      remarks: this.transferReceipt.remark

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
