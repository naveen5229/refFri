import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'transfer-receipts',
  templateUrl: './transfer-receipts.component.html',
  styleUrls: ['./transfer-receipts.component.scss', '../../../pages/pages.component.css']
})
export class TransferReceiptsComponent implements OnInit {

  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};
  transferReceipt = {
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: '0',
    refId: null,
    refTypeName: null,
    date: new Date(),
    selectOption: "transfer",
    adviceTypeId: '-1',
    modeId: '-1',
    amount: null,
    remark: null
  };
  refernceData = [];
  referenceName = null;

  typesData = [];
  ModeData = [];
  edit = 0;
  referenceType = [{
    name: 'Select',
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
  }];
  creditId=null;
  debitId=null;
  


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
    this.transferReceipt.refernceType = '0';
  }

  showdata()
  {
    const params = "refId=" + this.transferReceipt.refId +
    "&refType=" + this.transferReceipt.refernceType;
  ++this.common.loading;

  this.api.get('FrieghtRate/getTransfers?' + params)
    .subscribe(res => {
      --this.common.loading;

      this.data = [];
      this.table = {
        data: {
          headings: {},
          columns: []
        },
        settings: {
          hideHeader: true
        }
      };
      this.headings = [];
      this.valobj = {};

      if (!res['data']) return;
      this.data = res['data'];
      let first_rec = this.data[0];
      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          this.headings.push(key);
          let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
          this.table.data.headings[key] = headerObj;
        }
      }
      this.table.data.columns = this.getTableColumns();
    }, err => {
      --this.common.loading;
      this.common.showError(err);
      console.log('Error: ', err);
    });
}


getTableColumns() {
  let columns = [];
  console.log("Data=", this.data);
  this.data.map(doc => {
    this.valobj = {};
    for (let i = 0; i < this.headings.length; i++) {
      if (this.headings[i] == "Action") {
        this.valobj[this.headings[i]] = {
          value: "",
          action: null,
          isHTML: false,
          icons: [
            { class: 'fa fa-trash', action: this.deleteTransfer.bind(this, doc) },
          ]
        };
      }
      else {

        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }

    }
    columns.push(this.valobj);

  });

  return columns;
}

formatTitle(title) {
  return title.charAt(0).toUpperCase() + title.slice(1);
}

deleteTransfer(row) {
  console.log("row", row);
  let params = {
    id: row._id,
  }
  if (row._id) {
    this.common.params = {
      title: 'Delete Route ',
      description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {
        console.log("data", data);
        this.common.loading++;
        this.api.post('FrieghtRate/deleteTransfers', params)
          .subscribe(res => {
            this.common.loading--;
            if (res['data'][0].y_id > 0) {
              this.common.showToast('Success');
              this.showdata();
            }
            else {
              this.common.showToast(res['data'][0].y_msg);
            }
          }, err => {
            this.common.loading--;
            console.log('Error: ', err);
          });
      }
    });
  }
}

  resetvehicle() {
    this.transferReceipt.vehicleId = null;
    this.transferReceipt.vehicleRegNo = null;
    document.getElementById('vehicleno')['value'] = '';
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
  changeRefernceType(type) {
    console.log("Type Id", type);
    this.transferReceipt.refId = this.refernceData.find((element) => {
      console.log(element.source_dest == type);
      return element.source_dest == type;
    }).id;
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

  saveTransfer() {
    console.log("Params");
    ++this.common.loading;
    let params = {
      vid: this.transferReceipt.vehicleId,
      regno: this.transferReceipt.vehicleRegNo,
      vehasstype: 1,
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
      remarks: this.transferReceipt.remark,
      creditLId:this.creditId,
      debitLId:this.debitId
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
