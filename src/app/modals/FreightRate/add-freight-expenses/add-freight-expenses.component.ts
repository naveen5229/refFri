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
  endDate = new Date();
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
  ) {
    //this.common.handleModalSize('class', 'modal-lg', '1100');
    this.getFreightHeads();

    console.log("this.common.params.expenseData", this.common.params.expenseData);
    if (this.common.params.expenseData) {
      this.expense.id = this.common.params.expenseData._id;
      this.expense.vehicleType = this.common.params.expenseData._vehasstype;
      this.expense.vehicleRegNo = this.common.params.expenseData.Regno;
      this.expense.refernceType = this.common.params.expenseData._ref_type;
      this.expense.refTypeName = this.common.params.expenseData._ref_name;
      this.expense.vehicleId = this.common.params.expenseData._vid;
      this.expense.refId = this.common.params.expenseData._ref_id;
      // this.getExpenseDetails();
    }
    this.getExpenses();

  }
  ngOnInit() {
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
      vehicleId: this.expense.vehicleId,
      vehicleNo: this.expense.vehicleRegNo,
      vehicleType: this.expense.vehicleType,
      referId: this.expense.refId,
      referType: this.expense.refernceType,
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
          this.getExpenses();
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getExpenses() {
    var enddate = new Date(this.common.dateFormatter1(this.endDate).split(' ')[0]);
    let params = {
      refId: this.expense.refId,
      refType: this.expense.refernceType

    };
    console.log('params', params);
    ++this.common.loading;
    this.api.post('FrieghtRate/getFrieghtExpenses', params)
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
      expId: del._exp_id,
      ledgerId: del._ledger_id
    }
    ++this.common.loading;
    this.api.post('FrieghtRate/deleteExpenses', params)
      .subscribe(res => {
        --this.common.loading;
        this.getExpenses();
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
}

