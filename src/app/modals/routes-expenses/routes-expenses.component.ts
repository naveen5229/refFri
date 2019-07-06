import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'routes-expenses',
  templateUrl: './routes-expenses.component.html',
  styleUrls: ['./routes-expenses.component.scss']
})
export class RoutesExpensesComponent implements OnInit {
  id = this.common.params.doc._id ? this.common.params.doc._id : null;
  routeExpenses = [{
    modelId: null,
    expenseType: null,
    amount: null,
    routeId: this.id,
  }];
  models = [];
  expensesType = [];

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
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal) {
    this.vehicleModalTypes();
    this.getExpensesType();
    this.viewExpenses();
    this.addMore();
  }

  ngOnInit() {


  }


  vehicleModalTypes() {
    this.common.loading++;
    this.api.get('Vehicles/getVehicleModelsMaster?brandId=-1')
      .subscribe(res => {
        this.common.loading--;
        this.models = res['data'];
        console.log("Model Type", this.models);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  closeModal() {
    this.activeModal.close();
  }

  getExpensesType() {
    this.common.loading++;
    this.api.get('Suggestion/getTypeMaster?typeId=52')
      .subscribe(res => {
        this.common.loading--;
        this.expensesType = res['data'];
        console.log("Exp Type", this.expensesType);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  getModelService(modelId) {
    console.log("ModelID:", modelId);
  }

  addMore() {
    this.routeExpenses.push({
      modelId: null,
      expenseType: null,
      amount: null,
      routeId: this.id
    });

  }

  validationCheck() {
    let isValidate = true;
    this.routeExpenses.forEach(element => {
      console.log("Value:", element.amount);
      if (element.amount && (element.amount <= 0 || element.amount > 600000)) {
        this.common.showError("Amount  range Value 0 to 600000");
        isValidate = false;
        return isValidate;
      }
    });
    return isValidate;
  }

  saveExpenses() {
    if (!this.validationCheck()) {
      return;
    }
    let params = {
      data: JSON.stringify(this.routeExpenses),
    }
    this.common.loading++;
    this.api.post('ViaRoutes/expenses', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['data'][0].y_msg);
        if (res['data'][0].y_id > 0) {
          this.routeExpenses = [{
            modelId: null,
            expenseType: null,
            amount: null,
            routeId: this.id,
          }];
          this.viewExpenses();
          this.addMore();
        }


      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }



  viewExpenses() {
    ++this.common.loading;

    this.api.get('ViaRoutes/viewExpenses?routeId=' + this.id)
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
        // let action = { title: this.formatTitle('action'), placeholder: this.formatTitle('action'), hideHeader: true };
        // this.table.data.headings['action'] = action;


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
        if (this.headings[i] == 'Action')
          this.valobj[this.headings[i]] = { class: '', icons: this.delete(doc) };
        else
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  delete(row) {

    let icons = [];
    icons.push(
      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      }
    )
    return icons;
  }
  deleteRow(row) {
    console.log("row:", row);

    let params = {
      id: row._id,
      routeId: row._route_id,
      modelId: row._model_id
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('ViaRoutes/deleteExpenses', params)
            .subscribe(res => {
              this.common.loading--;

              this.common.showToast(res['msg']);

              this.viewExpenses();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  resetData(event, index) {
    this.routeExpenses[index].modelId = null;
    console.log(event);
  }


}
