import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'add-freight-revenue',
  templateUrl: './add-freight-revenue.component.html',
  styleUrls: ['./add-freight-revenue.component.scss', '../../../pages/pages.component.css']
})
export class AddFreightRevenueComponent implements OnInit {
  isFormSubmit = false;
  revenueForm: FormGroup;

  revenue = {
    id: null,
    vehicleType: 1,
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: 0,
    date: new Date(),
    shortage: null,
    damage: null,
    delay: null,
    loadDetention: null,
    unloadDetention: null,
    tolls: null,
    amount: null,
    remark: null,
    refId: null,
    otherAmount: null,
    refTypeName: null,
  };
  refernceData = [];
  title = null;
  result = [];

  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
    private formBuilder: FormBuilder) {
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.title = this.common.params.title ? this.common.params.title : '';
    console.log("Row data:", this.common.params.row);
    if (this.common.params.row) {
      this.revenue.id = this.common.params.row._id;
      this.getData();
      // let date = new Date();
      // this.revenue.vehicleType = this.common.params.row._vehasstype;
      // this.revenue.vehicleRegNo = this.common.params.row._regno;
      // this.revenue.vehicleId = this.common.params.row._vid;
      // this.revenue.amount = this.common.params.row._amount;
      // this.revenue.date = this.common.params.row._dttime ? new Date(this.common.params.row._dttime) : date;
      // this.revenue.refernceType = this.common.params.row._ref_type;
      // this.revenue.refTypeName = this.common.params.row._ref_name;
      // this.revenue.refId = this.common.params.row._ref_id;
      // this.refernceTypes();
      // this.revenue.damage = this.common.params.row._damage_penality;
      // this.revenue.delay = this.common.params.row._delay_penality;
      // this.revenue.shortage = this.common.params.row._short_penality;
      // this.revenue.loadDetention = this.common.params.row._load_detention;
      // this.revenue.unloadDetention = this.common.params.row._unload_dentention;
      // this.revenue.tolls = this.common.params.row._tolls;
      // this.revenue.otherAmount = this.common.params.row._others_amt;
      // this.revenue.remark = this.common.params.row._remarks;



    }
  }


  ngOnInit() {
    this.revenueForm = this.formBuilder.group({
      revenueAmount: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(6)]],
      revenueType: ['',],
      autoSuggestion: ['',],
      shortageAmount: ['', [Validators.minLength(0), Validators.maxLength(6)]],
      damageAmount: ['', [Validators.minLength(0), Validators.maxLength(6)]],
      delayAmount: ['', [Validators.minLength(0), Validators.maxLength(6)]],
      tollsAmount: ['', [Validators.minLength(0), Validators.maxLength(6)]],
      loadDetention: ['', [Validators.minLength(0), Validators.maxLength(6)]],
      unloadDetention: ['', [Validators.minLength(0), Validators.maxLength(6)]],
      otherAmount: ['', [Validators.minLength(0), Validators.maxLength(6)]],
      Remarks: ['',],

    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.revenueForm.controls; }


  closeModal() {
    this.activeModal.close();
  }




  getData() {
    let params = {
      id: this.revenue.id,
    }
    console.log("params", params);
    this.api.post("FrieghtRate/viewSingleRevenue", params)
      .subscribe(res => {
        this.result = res['data'];
        console.log("Data", this.result);
        console.log("Date2", this.result[0]._vehasstype);


        let date = new Date();
        this.revenue.vehicleType = this.result[0]._vehasstype;
        this.revenue.vehicleRegNo = this.result[0]._regno;
        this.revenue.vehicleId = this.result[0]._vid;
        this.revenue.amount = this.result[0]._amount;
        this.revenue.date = this.result[0]._dttime ? new Date(this.result[0]._dttime) : date;
        this.revenue.refernceType = this.result[0]._ref_type;
        this.revenue.refTypeName = this.result[0]._ref_name;
        this.revenue.refId = this.result[0]._ref_id;
        this.refernceTypes();
        this.revenue.damage = this.result[0]._damage_penality;
        this.revenue.delay = this.result[0]._delay_penality;
        this.revenue.shortage = this.result[0]._short_penality;
        this.revenue.loadDetention = this.result[0]._load_detention;
        this.revenue.unloadDetention = this.result[0]._unload_dentention;
        this.revenue.tolls = this.result[0]._tolls;
        this.revenue.otherAmount = this.result[0]._others_amt;
        this.revenue.remark = this.result[0]._remarks;
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


  resetData(type) {
    this.revenue.vehicleType = type.target.value;
    this.resetvehicle();
    this.refernceTypes();
  }
  resetvehicle() {
    document.getElementById('vehicleno')['value'] = '';
    this.revenue.vehicleId = null;
    this.revenue.vehicleRegNo = null;
    this.resetRefernceType();
  }

  resetRefernceType(isReset = true) {
    document.getElementById('referncetype')['value'] = '';
    if (isReset)
      this.revenue.refernceType = null;
    this.refernceData = [];
  }
  getvehicleData(vehicle) {
    this.revenue.vehicleId = vehicle.id;
    this.revenue.vehicleRegNo = vehicle.regno;
  }

  refernceTypes() {

    let type = this.revenue.refernceType + "";

    let url = null;
    let params = {
      vid: this.revenue.vehicleId,
      regno: this.revenue.vehicleRegNo
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


  checkValue(ref, refKey, value) {

    if (ref[refKey] > value) {
      ref[refKey] = value;
    }
    else if (ref[refKey] < 0) {
      ref[refKey] = 0;
    }
    console.log("ref", ref, value);
  }

  saveRevenue() {
    console.log("Params");

    ++this.common.loading;
    let params = {
      row_id: this.revenue.id,
      vid: this.revenue.vehicleId,
      regno: this.revenue.vehicleRegNo,
      vehasstype: this.revenue.vehicleType,
      ref_type: this.revenue.refernceType,
      ref_id: this.revenue.refId,
      ref_name: this.revenue.refTypeName,
      amount: this.revenue.amount,
      dttime: this.common.dateFormatter(this.revenue.date),
      short_penality: this.revenue.shortage,
      damage_penality: this.revenue.damage,
      delay_penality: this.revenue.delay,
      load_detention: this.revenue.loadDetention,
      unload_dentention: this.revenue.unloadDetention,
      tolls: this.revenue.tolls,
      freight_rate_id: null,
      remarks: this.revenue.remark,
      other_amt: this.revenue.otherAmount,

    }
    let url = this.revenue.id ? 'FrieghtRate/editRevenue' : 'FrieghtRate/saveRevenue';
    console.log("params", params);
    this.api.post(url, params)
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
