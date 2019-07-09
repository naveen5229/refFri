import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'add-freight-expenses',
  templateUrl: './add-freight-expenses.component.html',
  styleUrls: ['./add-freight-expenses.component.scss']
})
export class AddFreightExpensesComponent implements OnInit {

  expense = {
    id: null,
    vehicleType: 1,
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: 0,
    refId: null,
    refTypeName: null,
    remarks: ''
  }
  freightHeads = [];
  expenseDetails = [{
    frHead: null,
    value: null
  },
  {
    frHead: null,
    frHeadId: null,
    value: null
  }, {
    frHead: null,
    value: null
  }]
  title = "Add Freight Expenses";
  result = [];
  refernceData = [];

  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.getFreightHeads();
    console.log("this.common.params.expenseData", this.common.params.expenseData);
    if (this.common.params.expenseData && this.common.params.expenseData._id) {
      this.expense.id = this.common.params.expenseData._id;
      this.getExpenseDetails();
    }

  }
  ngOnInit() {
  }
  getData() {
    let params = {
      id: this.expense.id,
    }
    console.log("params", params);
    this.api.post("FrieghtRate/viewSingleexpense", params)
      .subscribe(res => {
        this.result = res['data'];

        this.expense.vehicleType = this.result[0]._vehasstype;
        this.expense.vehicleRegNo = this.result[0]._regno;
        this.expense.vehicleId = this.result[0]._vid;
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  resetData(type) {
    this.expense.vehicleType = type.target.value;
    this.resetvehicle();
    this.refernceTypes();
  }
  resetvehicle() {
    document.getElementById('vehicleno')['value'] = '';
    this.expense.vehicleId = null;
    this.expense.vehicleRegNo = null;
    this.resetRefernceType();
  }

  resetRefernceType(isReset = true) {
    document.getElementById('referncetype')['value'] = '';
    if (isReset)
      this.expense.refernceType = null;
    this.refernceData = [];
  }
  getvehicleData(vehicle) {
    this.expense.vehicleId = vehicle.id;
    this.expense.vehicleRegNo = vehicle.regno;
  }

  getFrieghtHeaderId(type, index) {
    console.log("Type Id", type);

    this.expenseDetails[index].frHeadId = this.freightHeads.find((element) => {
      return element.r_name == type;
    }).r_id;
    console.log("this.expenseDetails[index].frHeadId ", this.expenseDetails[index].frHeadId)
  }
  closeModal() {
    this.activeModal.close();
  }
  refernceTypes() {
    let type = this.expense.refernceType + "";
    let url = null;
    let params = {
      vid: this.expense.vehicleId,
      regno: this.expense.vehicleRegNo
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

  getRefrenceData(type) {
    this.expense.refId = this.refernceData.find((element) => {
      console.log("element", element);
      return element.source_dest == type;
    }).id;
    this.expense.refTypeName = type;
  }

  addField(index) {
    this.expenseDetails.push(
      {
        frHead: null,
        value: null,
      }
    )
  }

  getFreightHeads() {
    this.api.get('FrieghtRate/getFreightHeads?type=exp')
      .subscribe(res => {
        this.freightHeads = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  saveDetails() {
    ++this.common.loading;

    let params = {
      id: this.expense.id,
      vehicleId: this.expense.vehicleId,
      vehicleNo: this.expense.vehicleRegNo,
      vehicleType: this.expense.vehicleType,
      referId: this.expense.refId,
      referType: this.expense.refernceType,
      referName: this.expense.refTypeName,
      remarks: this.expense.remarks,
      podId: null,
      expenseDetails: JSON.stringify(this.expenseDetails),
    }
    console.log("params", params);


    this.api.post('FrieghtRate/saveFrieghtExpenses', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('response :', res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Freight added Successfully");
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
  getExpenseDetails() {
    ++this.common.loading;

    let params = {
      id: this.expense.id,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getFrieghtExpenseDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('response :', res);
        this.setDetails(res['data'][0])
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  setDetails(data) {
    this.expense.id = data.id;
    this.expense.vehicleId = data.vid;
    this.expense.vehicleRegNo = data.regno;
    this.expense.vehicleType = data.vehasstype;
    this.expense.refId = data.ref_id;
    this.expense.refernceType = data.ref_type;
    this.expense.refTypeName = data.ref_name;
    this.expense.remarks = data.remarks;
    this.expenseDetails = data.details;
    console.log("expenseDetails", this.expenseDetails);
  }

}

