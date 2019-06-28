import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

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
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal) {
    this.vehicleModalTypes();
    this.getExpensesType();
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

  saveExpenses() {
    let params = {
      data: JSON.stringify(this.routeExpenses),

    }
    this.common.loading++;
    this.api.post('ViaRoutes/expenses', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['data'][0].y_msg);
        if (res['data'][0].y_id > 0)
          this.routeExpenses = [{
            modelId: null,
            expenseType: null,
            amount: null,
            routeId: this.id,
          }];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
