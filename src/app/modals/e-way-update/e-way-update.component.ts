import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'e-way-update',
  templateUrl: './e-way-update.component.html',
  styleUrls: ['./e-way-update.component.scss']
})
export class EWayUpdateComponent implements OnInit {

  title = '';
  formType = 1;
  updateAt = '';

  billDateExtend = {
    action: 'EXTENDVALIDITY',
    eWid: null,
    GeneratorGstin: "",
    EwbNo: "",
    VehicleNo: "",
    FromCity: "",
    FromState: "",
    ExtnRsn: "",
    ExtnRemarks: "",
    TransDocNumber: "",
    TransDocDate: new Date(),
    TransportMode: null,
    TransitType: null,
    RemainingDistance: "",
    FromPincode: "",
    AddressLine1: "",
    AddressLine2: "",
    AddressLine3: ""
  }

  partsInfo = {
    eWayBillId: null,
    GeneratorGstin: "",
    EwbNo: "",
    FromCityPlace: "",
    VehicleNo: "",
    TransDocNumber: "",
    StateName: "",
    TransportMode: null,
    VehicleReason: "",
    VehicleType: "Normal",
    Remarks: "",
    TransDocDate: new Date()
  }

  stateData = [];
  citydata = [];
  transmodeOptions = [
    { id: 1, name: 'Road' },
    { id: 2, name: 'Rail' },
    { id: 3, name: 'Air' },
    { id: 4, name: 'Ship' },
    { id: 5, name: 'In-Transit' }];

  ExtnRsn = [
    { id: 1, name: 'Natural Calamity' },
    { id: 2, name: 'Law and Order Situation' },
    { id: 4, name: 'Transshipment' },
    { id: 5, name: 'Accident' },
    { id: 99, name: 'Others' }];

  transitType = [
    { id: 'R', name: 'Road' },
    { id: 'W', name: 'Warehouse' },
    { id: 'O', name: 'Others' }
  ]

  constructor(
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    this.getStates();

    this.title = this.common.params.title;
    this.formType = this.common.params.type;
    this.updateAt = this.common.params.api;

    if (this.formType == 1) {
      this.billDateExtend = {
        action: 'EXTENDVALIDITY',
        eWid: this.common.params.data_ewid,
        GeneratorGstin: this.common.params.data.generator_gstin,
        EwbNo: this.common.params.data.ewbno,
        VehicleNo: this.common.params.data.regno,
        FromCity: '',
        FromState: '',
        ExtnRsn: '',
        ExtnRemarks: '',
        TransDocNumber: this.common.params.data.trans_doc_number,
        TransDocDate: this.common.params.data.trans_doc_date,
        TransportMode: null,
        RemainingDistance: this.common.params.data.distleft,
        TransitType: '',
        FromPincode: null,
        AddressLine1: '',
        AddressLine2: '',
        AddressLine3: ''
      }
    } else if (this.formType == 2) {
      this.partsInfo = {
        eWayBillId: this.common.params.data._ewid,
        GeneratorGstin: this.common.params.data.generator_gstin,
        EwbNo: this.common.params.data.ewbno,
        FromCityPlace: '',
        VehicleNo: null,
        TransDocNumber: null,
        StateName: '',
        TransportMode: null,
        VehicleReason: '',
        VehicleType: 'Normal',
        Remarks: '',
        TransDocDate: new Date()
      }
    }
  }

  ngOnInit(): void {
  }

  getStates() {
    const params = {
      foid: 123,
    };
    this.common.loading++;

    this.api.post('Suggestion/GetState', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.stateData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  GetCity(stateid) {
    let params = {
      state: stateid
    };

    this.common.loading++;
    this.api.post('Suggestion/GetCity', params)
      .subscribe(res => {
        this.common.loading--;
        // console.log('Res:', res['data']);
        this.citydata = res['data'];
        console.log('Res:', this.citydata);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  closeModal(state) {
    this.resetFields();
    this.activeModal.close({ response: state });
  }

  updateForm() {
    console.log(this.formType, this.updateAt, this.billDateExtend, this.partsInfo);

    let params = {};
    if (this.formType == 1) {
      let requiredFields = ['FromState', 'FromCity', 'TransportMode'];
      if (this.billDateExtend.TransportMode == 'In-Transit') {
        let otherValidation = ['TransitType', 'AddressLine1'];
        requiredFields = requiredFields.concat(otherValidation);
      } else {
        this.billDateExtend.TransitType = '';
        this.billDateExtend.AddressLine1 = '';
        this.billDateExtend.AddressLine2 = '';
        this.billDateExtend.AddressLine3 = '';
      }
      let ValidationFound = [];
      requiredFields.forEach(key => {
        if (!this.billDateExtend[key]) ValidationFound.push(key);
      });
      if (ValidationFound && ValidationFound.length > 0) return this.common.showError(`${this.common.formatTitle(ValidationFound[0])} is Required Field.`);
      params = this.billDateExtend;
    } else if (this.formType == 2) {
      let requiredFields = ['TransportMode'];
      if (this.partsInfo.TransportMode == 'Road') {
        let otherValidation = ['VehicleType', 'VehicleNo'];
        requiredFields = requiredFields.concat(otherValidation);
      } else {
        let otherValidation = ['TransDocNumber', 'TransDocDate'];
        requiredFields = requiredFields.concat(otherValidation);
      }
      let ValidationFound = [];
      requiredFields.forEach(key => {
        if (!this.partsInfo[key]) ValidationFound.push(key);
      });
      if (ValidationFound && ValidationFound.length > 0) return this.common.showError(`${this.common.formatTitle(ValidationFound[0])} is Required Field.`)
      params = this.partsInfo;
    }
    console.log('test going ahead', params);

    // return;
    this.common.loading++;
    this.api.postEway(this.updateAt, params).subscribe(res => {
      console.log(res);
      this.common.loading--;
      if (res['code'] === 1) {
        if (res['data'][0]['y_id'] > 0) {
          // this.resetTask();
          this.common.showToast(res['data'][0].y_msg);
          this.closeModal(true);
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      } else {
        this.common.showError(res['msg']);
      }
    }, err => {
      this.common.loading--;
      this.common.showError();
    })
  }

  resetFields() {
    this.billDateExtend = {
      action: 'EXTENDVALIDITY',
      eWid:null,
      GeneratorGstin: "",
      EwbNo: "",
      VehicleNo: "",
      FromCity: "",
      FromState: "",
      ExtnRsn: "",
      ExtnRemarks: "",
      TransDocNumber: "",
      TransDocDate: new Date(),
      TransportMode: null,
      TransitType: null,
      RemainingDistance: "",
      FromPincode: "",
      AddressLine1: "",
      AddressLine2: "",
      AddressLine3: ""
    }

    this.partsInfo = {
      eWayBillId: null,
      GeneratorGstin: "",
      EwbNo: "",
      FromCityPlace: "",
      VehicleNo: "",
      TransDocNumber: "",
      StateName: "",
      TransportMode: null,
      VehicleReason: "",
      VehicleType: "Normal",
      Remarks: "",
      TransDocDate: new Date()
    }
  }
}
