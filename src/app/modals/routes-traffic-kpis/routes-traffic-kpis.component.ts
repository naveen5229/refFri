import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'routes-traffic-kpis',
  templateUrl: './routes-traffic-kpis.component.html',
  styleUrls: ['./routes-traffic-kpis.component.scss']
})
export class RoutesTrafficKpisComponent implements OnInit {
  id = this.common.params.doc._id ? this.common.params.doc._id : null;

  brands = [];
  modelId = null;
  dltId: number = 0;
  dltModelId: number = 0;
  dltRouterId: number = 0;
  brandId = null;
  targetTime = null;
  allowedTime = null;
  route = [{
    routeId: this.id,
    targetTime: null,
    allowedTime: null,
    modelId: null,
  }]

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

  constructor(
    public activeModal: NgbActiveModal,
    public common: CommonService,
    private modalService: NgbModal,
    public api: ApiService
  ) {
    this.vehicleModalTypes();
    this.addMore();
    this.getdata();
  }

  ngOnInit() {
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


  dismiss() {
    this.activeModal.close();
  }

  submit() {
    if (!this.validationCheck()) {
      return;
    }
    console.log("para", JSON.stringify(this.route))
    this.api.post('ViaRoutes/trafficKpiAdd', { data: JSON.stringify(this.route) })
      .subscribe(res => {
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.route = [{
            routeId: this.id,
            targetTime: null,
            allowedTime: null,
            modelId: null,
          }];
          this.addMore();
          this.getdata();
        }
        else {
          this.common.showError(res['data'][0].y_msg);
        }
      },
        err => console.error('Activity Api Error:', err));
  }

  addMore() {
    this.route.push({
      routeId: this.id,
      targetTime: null,
      allowedTime: null,
      modelId: null
    });
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          console.log("Test");
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-trash-alt', action: this.deleteTrafficKpis.bind(this, doc) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  getdata() {
    const params = "routeId=" + this.id;
    //   console.log("params", params);
    console.log("params", params);
    ++this.common.loading;
    this.api.get('ViaRoutes/viewTrafficKpis?' + params)
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
        this.table.data.columns = this.getTableColumns();
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  selectId(event, i) {
    this.modelId = event.id;
    this.brandId = event.brand_id;
    this.route[i]['modelId'] = this.modelId;
    console.log("route", this.route);
    console.log("ids", this.modelId, this.brandId);
  }

  viewTrafficKpis() {
    const params = "routeId=" + this.id;
    console.log("params", params);
    this.common.loading++;
    this.api.get('ViaRoutes/viewTrafficKpis?' + params)
      .subscribe(res => {
        this.data = res['data'];
        console.log("data", this.data);
        this.common.loading--;
      }, err => {
        this.common.showError();
      })
  }

  deleteTrafficKpis(doc) {
    console.log("values", doc);
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
          this.common.loading++;
          console.log("par", params);
          this.api.post('ViaRoutes/deleteTrafficKpis', params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.getdata();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }

  resetData(event, index) {
    this.route[index].modelId = null;
    console.log(event);
  }
  validationCheck() {
    let isValidate = true;
    this.route.forEach(element => {
      if ((element.targetTime && (element.targetTime <= 0)) ||
        (element.allowedTime && (element.allowedTime <= 0))) {
        this.common.showError("Time(Hr) range is not Valid");
        isValidate = false;
        return isValidate;
      }
    });
    return isValidate;
  }


}
