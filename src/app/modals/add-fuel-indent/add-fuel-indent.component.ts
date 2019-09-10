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
    vehicleType: null,
    vehicleId: null,
    regno: null,
    vehicleRefType: null,
    amount: null,
    issueDate: new Date(),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    remark: null,
  };
  refType = null;
  refTypeResults = [];
  indentType = '1';

  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
    this.common.handleModalSize('class', 'modal-lg', '900', 'px', 1);
    if (this.common.params && this.common.params.title) {
      this.title = this.common.params.title;
      this.button = this.common.params.flag;

    }
  }

  ngOnInit() {
    this.fuelIndent = this.formBuilder.group({
      vehicleType: [''],
      regno: ['', Validators.required],
      refType: ['',],
      refTypeSource: [''],
      indentTypeValue: ['', Validators.required],

    });
  }
  get f() {
    return this.fuelIndent.controls;
  }


  closeModal() {
    this.activeModal.close();
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
    this.refType = type.target.value;
    this.selectedlist(this.refType);
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
}
