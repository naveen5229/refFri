import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../confirm/confirm.component';

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
      if (element.amount && (element.amount <= 0)) {
        this.common.showError("Amount Value is not Valid");
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
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.routeExpenses = [{
            modelId: null,
            expenseType: null,
            amount: null,
            routeId: this.id,
          }];
          this.viewExpenses();
          this.addMore();
        }
        else {
          this.common.showError(res['data'][0].y_msg)
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
        let key = "Model";
        this.headings.push(key);
        let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        this.table.data.headings[key] = headerObj;
        for (key in first_rec) {
          if (key.charAt(0) != "_" && key != "Model") {
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

    this.data.map(doc => {
      let valobj = {};
      let docobj = { routeId: 0 };
      let rowId = '';
      let val = 0;
      for (var i = 0; i < this.headings.length; i++) {
        console.log("doc Data:", doc);
        let strval = doc[this.headings[i]];
        console.log("srtvalue", strval);

        if (strval.indexOf('_') > 0) {
          let arrval = strval.split('_');
          val = arrval[0];
          rowId = arrval[1];
          console.log("RowId", rowId);

        } else if (strval.indexOf('_') === -1) {
          val = strval;
        } else {
          val = null;
        }

        docobj.routeId = doc['_route_id'];
        valobj[this.headings[i]] = {
          value: '',
          isHTML: false,
          icons: [
            { class: '', action: null, txt: val },
            { class: this.headings[i] == "Model" || val && 'fa fa-trash ml-2 text-danger', action: this.headings[i] == "Model" || val && this.deleteRow.bind(this, doc, rowId), }
          ],
        };
      }
      // icons: val > 0 ? this.delete(doc[this.headings[i]]) : ''

      columns.push(valobj);
    });
    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  // delete(row) {
  //   let icons = [];
  //   icons.push(
  //     {
  //       class: "fas fa-trash-alt",
  //       action: this.deleteRow.bind(this, row),
  //       value: row,
  //     }
  //   )
  //   return icons;
  // }
  deleteRow(row, id) {
    console.log("row:", row);
    console.log("id", id);


    let params = {
      id: id,
      routeId: row._route_id,
      modelId: row._model_id
    }
    if (id) {
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

  // resetData(event, index) {
  //   this.routeExpenses[index].modelId = null;
  //   console.log(event);
  // }


}
