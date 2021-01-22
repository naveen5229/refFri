import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { UserService } from '../../../services/user.service';
import { PdfService } from '../../../services/pdf/pdf.service';
import { CsvService } from '../../../services/csv/csv.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
    id: null,
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: '0',
    refId: null,
    refTypeName: null,
    date: new Date(),
    selectOption: "Transfer",
    adviceTypeId: '-1',
    modeId: '-1',
    amount: null,
    remark: null,
    readOnly: false,
    approvalStatus: null,
    approvalRemark: null
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
  creditId = null;
  creditName = null;
  debitId = null;
  debitName = null;
  refData = null;

  constructor(public modalService: NgbModal,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private pdfService: PdfService,
    private csvService: CsvService,
    public api: ApiService) {
    this.getPaymentMode();
    this.getTypeList();
    console.log("this.common.params.refData", this.common.params.refData);
    
    this.common.handleModalSize('class', 'modal-lg', '1150', 'px');
    if (this.common.params && this.common.params.refData) {
      this.refData = this.common.params.refData;
      this.edit = 1;
      this.transferReceipt.id = this.common.params.refData.transferId ? this.common.params.refData.transferId : null;
      this.transferReceipt.readOnly = this.common.params.refData.readOnly ? this.common.params.refData.readOnly : false
      if (this.transferReceipt.id) {
        this.getEditDetils(this.transferReceipt.id);
      } else {
        this.transferReceipt.refernceType = this.common.params.refData.refType;
        this.transferReceipt.refId = this.common.params.refData.refId;
        this.transferReceipt.selectOption = this.common.params.refData.selectOption ? this.common.params.refData.selectOption : 'Transfer';
        this.getReferenceData();
        this.showdata();
        this.getRefernceType(this.transferReceipt.refernceType);
      }
    }

  }

  ngOnDestroy(){}
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

  showdata() {
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
              {
                class: this.user.permission.delete ? 'fa fa-trash' : '', action: this.deleteTransfer.bind(this, doc)
              },

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
        title: 'Delete Transfer ',
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
                this.common.showError(res['data'][0].y_msg);
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
      transferId: this.transferReceipt.id,
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
      creditLId: this.creditId,
      debitLId: this.debitId
    };
    this.api.post("LorryReceiptsOperation/saveTransfers", params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          // this.activeModal.close({ data: true });
          this.showdata();
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

  getEditDetils(id) {
    console.log("getEditDetils====", id);
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getTransferEditDetails?transferId=' + id)
      .subscribe(res => {
        this.common.loading--;
        if (res['data']) {
          this.setDetails(res['data'][0])
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  setDetails(data) {
    this.transferReceipt.id = data.id;
    this.transferReceipt.adviceTypeId = data.advice_type_id;
    this.transferReceipt.vehicleId = data.vid;
    this.transferReceipt.vehicleRegNo = data.regno;
    this.transferReceipt.refId = data.ref_id;
    this.transferReceipt.refTypeName = data.ref_name;
    this.transferReceipt.refernceType = data.ref_type;
    this.transferReceipt.selectOption = data.type;
    this.transferReceipt.date = new Date(data.dttime);
    this.transferReceipt.modeId = data.pay_mode;
    this.transferReceipt.amount = data.user_value;
    this.transferReceipt.remark = data.remarks;
    this.creditId = data.credit_ledger_id;
    this.creditName = data.credit_ledger_name;
    this.debitId = data.debit_ledger_id;
    this.debitName = data.debit_ledger_name;
    this.transferReceipt.approvalRemark = data._remarks;
    this.transferReceipt.approvalStatus = data._status;
    this.showdata();

    data.advice_id;
    data.advice_type_name;

    data.type;
    data.ref_type_name;


  }

  printPDF(){
    console.log("Name:",name);
    let details = [
      ['Regno: ' + this.transferReceipt.vehicleRegNo, this.referenceName+":" +this.transferReceipt.refTypeName]
    ];
    this.pdfService.jrxTablesPDF(['freightwithLocation'], 'Transfers', details);
  }

  printCSV(){
    let details = [
      { Regno: 'Regno:' +  this.transferReceipt.vehicleRegNo,reftype:this.referenceName+":" +this.transferReceipt.refTypeName}
    ];
    this.csvService.byMultiIds(['freightwithLocation'], 'Transfers', details);
  }

}
