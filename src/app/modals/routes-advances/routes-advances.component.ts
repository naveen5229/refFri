import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'routes-advances',
  templateUrl: './routes-advances.component.html',
  styleUrls: ['./routes-advances.component.scss']
})
export class RoutesAdvancesComponent implements OnInit {
  id = this.common.params.doc._id ? this.common.params.doc._id : null;
  route = [{
    routeId: this.id,
    fuelAmt: null,
    cash: null,
    modelId: null,
  }]

  brands = [];
  headings = [];
  valobj = {};
  brandId = null;
  modelId = null;
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
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal
  ) {
    this.vehicleModalTypes();
    this.common.handleModalSize('class', 'modal-md', '1050');
    this.addMore();
    this.routeAdd();

  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();

  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          console.log("Test");
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-trash-alt', action: this.deleteRoute.bind(this, doc) }] };

        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      // this.valobj['action'] = { class: '', icons: this.routeDelete(doc) };

      columns.push(this.valobj);
    });
    return columns;
  }

  addMore() {
    this.route.push({
      routeId: this.id,
      fuelAmt: null,
      cash: null,
      modelId: null
    });

  }
  vehicleModalTypes() {
    this.common.loading++;
    this.api.get('Vehicles/getVehicleModelsMaster?brandId=-1')
      .subscribe(res => {
        this.common.loading--;
        this.brands = res['data'];
        console.log("Maintenance Type", this.brands);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  selectId(event, i) {
    this.modelId = event.id;
    this.brandId = event.brand_id;
    this.route[i]['modelId'] = this.modelId;
    console.log("route", this.route);

  }

  routeAdd() {
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
    console.log("id", this.id);
    const params = "routeId=" + this.id;
    this.api.get("ViaRoutes/viewAdvances?" + params).subscribe(
      res => {
        this.data = [];
        this.data = res['data'];
        console.log("result", res);
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }
    );
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  deleteRoute(doc) {

    const params = {
      id: doc._id,
      routeId: doc._route_id,

      modelId: doc._model_id,

    }
    if (doc._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          ++this.common.loading;

          this.api.post('ViaRoutes/deleteAdvances', params)
            .subscribe(res => {
              --this.common.loading;
              console.log(res['data'][0].result);
              this.common.showToast(res['msg']);

              this.routeAdd();
              // this.vehicleModalTypes();
              // this.addMore();
              // this.advanceRoute();
              // this.routeAdd();



            }, err => {
              --this.common.loading;
              this.common.showError(err);
              console.log('Error: ', err);
            });
        }
      });

    }
  }
  advanceRoute() {
    this.common.loading++;
    console.log("oara", JSON.stringify(this.route))
    this.api.post('ViaRoutes/advances', { data: JSON.stringify(this.route) })
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);

        // alert("Route and Model is Mandtory");
        console.log("detail", res['data'][0].result);
        console.log("msg1", res['data'][0]);

        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg)

          this.route = [{
            routeId: this.id,
            fuelAmt: null,
            cash: null,
            modelId: null,
          }];
          this.routeAdd();
          // this.vehicleModalTypes();
          this.addMore()
        }
        else {
          this.common.showError(res['data'][0].y_msg)

        }

      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err)
      });
  }
}
