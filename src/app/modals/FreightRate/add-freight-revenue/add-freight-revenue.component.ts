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
  endDate = new Date();
  revenue = {
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
  revenueDetails = [{
    frHead: null,
    frHeadId: null,
    value: null,
    manualValue: null,
  },
  {
    frHead: null,
    frHeadId: null,
    value: null,
    manualValue: null,
  }, {
    frHead: null,
    frHeadId: null,
    value: null,
    manualValue: null,
  }];
  title = "Save Revenue";
  result = [];
  refernceData = [];
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


  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
    private formBuilder: FormBuilder) {

    this.getFreightHeads();

    console.log("this.common.params.revenue", this.common.params.revenueData);
    if (this.common.params.revenueData) {
      this.revenue.id = this.common.params.revenueData._id;
      this.revenue.refId = this.common.params.revenueData._ref_id;
      this.revenue.refernceType = this.common.params.revenueData._ref_type;

      this.revenue.remarks = this.common.params.revenueData._rev_remarks;
      this.getRevenueDetails();
    }
    this.getRevenue();
    const params = "id=" + this.revenue.refId +
      "&type=" + this.revenue.refernceType;
    this.api.get('Vehicles/getRefrenceDetails?' + params)
      .subscribe(res => {
        console.log(res['data']);
        let resultData = res['data'][0];
        this.revenue.vehicleId = resultData.vid;
        this.revenue.vehicleRegNo = resultData.regno;
        this.revenue.refTypeName = resultData.ref_name;
        this.revenue.vehicleType = resultData.vehasstype
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  ngOnInit() {

  }

  getRevenueDetails() {

  }

  getFrieghtHeaderId(type, index) {
    console.log("Type Id", type);

    this.revenueDetails[index].frHeadId = this.freightHeads.find((element) => {
      return element.r_name == type;
    }).r_id;
    console.log("this.expenseDetails[index].frHeadId ", this.revenueDetails[index].frHeadId)
  }
  closeModal() {
    this.activeModal.close();
  }

  getRefrenceData(type) {
    this.revenue.refId = this.refernceData.find((element) => {
      console.log("element", element);
      return element.source_dest == type;
    }).id;
    this.revenue.refTypeName = type;
  }

  addField(index) {
    this.revenueDetails.push(
      {
        frHead: null,
        value: null,
        frHeadId: null,
        manualValue: null,
      }
    )
  }

  getFreightHeads() {
    this.api.get('FrieghtRate/getFreightHeads?type=REV')
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
      vehicleId: this.revenue.vehicleId,
      vehicleNo: this.revenue.vehicleRegNo,
      vehicleType: this.revenue.vehicleType,
      referId: this.revenue.refId,
      referType: this.revenue.refernceType,
      remarks: this.revenue.remarks,
      podId: null,
      expenseDetails: JSON.stringify(this.revenueDetails),
    }
    console.log("params", params);


    this.api.post('FrieghtRate/saveFrieghtRevenue', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('response :', res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Freight added Successfully");
          this.getRevenue();
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getRevenue() {
    var enddate = new Date(this.common.dateFormatter1(this.endDate).split(' ')[0]);
    let params = {
      refId: this.revenue.refId,
      refType: this.revenue.refernceType

    };
    console.log('params', params);
    ++this.common.loading;
    this.api.post('FrieghtRate/getFrieghtRevenue', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = res['data'];
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
        if (!this.data || !this.data.length) {
          //document.getElementById('mdl-body').innerHTML = 'No record exists';
          return;
        }
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
        console.error(err);
        this.common.showError();
      });

  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-trash', action: this.DeleteExpense.bind(this, doc) }] };
        }
        else {

          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }
  DeleteExpense(del) {
    let params = {
      revId: del._rev_id,
      ledgerId: del._ledger_id
    }
    ++this.common.loading;
    this.api.post('FrieghtRate/deleteRevenue', params)
      .subscribe(res => {
        --this.common.loading;
        this.getRevenue();
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

}
