import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ReminderComponent } from '../reminder/reminder.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'add-fuel-indent',
  templateUrl: './add-fuel-indent.component.html',
  styleUrls: ['./add-fuel-indent.component.scss']
})
export class AddFuelIndentComponent implements OnInit {
  title = '';
  button = '';
  isFormSubmit = false;
  fuelIndent: FormGroup;
  vehicleTypes = [
    { name: 'Own', id: 1 },
    { name: 'Group', id: 2 },
    { name: 'Market', id: 3 },
  ];

  dropDownRefTypes = {
    1: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }, { name: 'States', id: 13 }, { name: 'Trip', id: 14 }],
    2: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }],
    3: [{ name: 'LR', id: 11 }, { name: 'Manifest', id: 12 }]

  };

  fuelIndentData = {
    rowId: null,
    vehicleType: null,
    vehicleId: null,
    regno: null,
    vehicleRefType: null,
    amount: null,
    fuelId: null,
    issueDate: new Date(),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    remark: null,
    refType: null,
    refTypeSourceId: null,
    refName: null,
  };
  refTypeResults = [];
  indentType = '1';
  fuelStations = [];
  refData = {
    type: null,
    id: null,

  }

  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
    this.getFuelStationList();
    this.common.handleModalSize('class', 'modal-lg', '900', 'px', 1);
    if (this.common.params && this.common.params.title) {
      this.title = this.common.params.title;
      this.button = this.common.params.button;
    }
    if (this.common.params && this.common.params.editFuelData) {
      this.fuelIndentData.rowId = this.common.params.editFuelData._id;
      this.fuelIndentData.issueDate = new Date(this.common.dateFormatter(this.common.params.editFuelData._issue_date));
      this.fuelIndentData.expiryDate = new Date(this.common.dateFormatter(this.common.params.editFuelData._expiry_date));
      this.fuelIndentData.fuelId = this.common.params.editFuelData._fsid;
      this.fuelIndentData.regno = this.common.params.editFuelData.regno;
      this.fuelIndentData.vehicleId = this.common.params.editFuelData._vid;
      this.fuelIndentData.vehicleType = this.common.params.editFuelData._vehasstype;
      this.fuelIndentData.remark = this.common.params.editFuelData.Remarks;
      this.fuelIndentData.amount = this.common.params.editFuelData.Amount ? this.common.params.editFuelData.Amount : this.common.params.editFuelData.Fuel;
      this.indentType = this.common.params.editFuelData.Amount ? '0' : '1';
      this.fuelIndentData.refTypeSourceId = this.common.params.editFuelData._ref_id;
      this.fuelIndentData.refType = this.common.params.editFuelData._ref_type;

    }
    if (this.common.params && this.common.params.refData) {
      this.refData.type = this.common.params.refData.refType;
      this.refData.id = this.common.params.refData.refId;
      this.getReferenceData();
      // this.getFuelIndent();
    }
  }

  ngOnInit() {
    this.fuelIndent = this.formBuilder.group({
      vehicleType: [''],
      regno: ['', Validators.required],
      refType: ['',],
      refTypeSource: [''],
      indentTypeValue: ['', Validators.required],
      fuelStation: ['', Validators.required],

    });
  }
  ngOnDestroy() {
    this.common.params = null;
  }
  get f() {
    return this.fuelIndent.controls;
  }


  closeModal() {
    this.activeModal.close(false);
  }
  selectVehicle(vehicle) {
    this.fuelIndentData.vehicleId = vehicle.id;
    this.fuelIndentData.regno = vehicle.regno;
  }
  handleVehicleTypeChange() {
    this.fuelIndentData.vehicleRefType = "-1";
    this.fuelIndentData.vehicleId = null;
    this.fuelIndentData.regno = null;
  }
  selectRefType(type) {
    this.fuelIndentData.refType = type.target.value;
    this.selectedlist(this.fuelIndentData.refType);
  }

  selectedlist(type) {
    const params = {
      vid: this.fuelIndentData.vehicleId,
      regno: this.fuelIndentData.regno,
    };
    let url = null;

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
    console.log("params:", params, "url:", url);

    this.api.post(url, params)
      .subscribe(res => {
        this.refTypeResults = res['data'];
      }, err => {
        console.log(err);
      });

  }
  selectRefTypeSource(source) {
    this.fuelIndentData.refTypeSourceId = source.target.value;
  }

  getFuelStationList() {
    this.api.get("Suggestion/getFuelStaionWrtFo").subscribe(
      res => {
        this.fuelStations = res['data'];
      },
      err => {
        console.log(err);
      }
    );
  }

  saveFuelIndent() {
    console.log("hi  bro i am calling funcction");


    if (this.fuelIndentData.issueDate == null && this.fuelIndentData.expiryDate == null) {
      this.common.showToast("please enter Date");
    }
    const params = {
      rowid: this.fuelIndentData.rowId ? this.fuelIndentData.rowId : null,
      vid: this.fuelIndentData.vehicleId,
      vehasstype: this.fuelIndentData.vehicleType,
      regno: this.fuelIndentData.regno,
      ref_name: null,
      reftype: this.fuelIndentData.refType,
      refid: this.fuelIndentData.refTypeSourceId,
      amt: this.indentType == '0' ? this.fuelIndentData.amount : null,
      remarks: this.fuelIndentData.remark,
      ltr: this.indentType == '1' ? this.fuelIndentData.amount : null,
      issueDate: this.common.dateFormatter(this.fuelIndentData.issueDate),
      expDate: this.common.dateFormatter(this.fuelIndentData.expiryDate),
      fsid: this.fuelIndentData.fuelId
    };
    let result: any;
    this.common.loading++;
    this.api.post('Fuel/addFuelIndent', params)
      .subscribe(res => {
        this.common.loading--;

        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          result = res['data'];
          this.activeModal.close({ response: result });
        }
        else {
          this.common.showError(res['data'][0].y_msg)
        }
      },
        err => console.error('Api Error:', err));
    console.log("parameter", params);
  }

  getReferenceData() {
    const params = "id=" + this.refData.id +
      "&type=" + this.refData.type;
    this.api.get('Vehicles/getRefrenceDetails?' + params)
      .subscribe(res => {
        console.log("using refID:", res['data']);
        let resultData = res['data'][0];
        this.fuelIndentData.vehicleId = resultData.vid;
        // this.fuelIndentData.regno = resultData.regno;
        this.fuelIndentData.refName = resultData.ref_name;
        this.fuelIndentData.vehicleType = resultData.vehasstype
        this.fuelIndentData.refType = this.dropDownRefTypes['1'].find(element => { return element.id == 14; }).name;
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}


