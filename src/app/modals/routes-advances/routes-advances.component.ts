import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'routes-advances',
  templateUrl: './routes-advances.component.html',
  styleUrls: ['./routes-advances.component.scss']
})
export class RoutesAdvancesComponent implements OnInit {
  route = [{
    routeId: 21,
    fuelAmt: null,
    cash: null,
    modelId: null,
  }]
  brands = [];

  brandId = null;
  modelId = null;

  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService
  ) {
    this.vehicleModalTypes();
    this.common.handleModalSize('class', 'modal-lg', '1050');


  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();

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
            routeId: null,
            fuelAmt: null,
            cash: null,
            modelId: null,
          }]
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


  addMore() {
    this.route.push({
      routeId: 21,
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

}
