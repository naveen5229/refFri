import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'routes-traffic-kpis',
  templateUrl: './routes-traffic-kpis.component.html',
  styleUrls: ['./routes-traffic-kpis.component.scss']
})
export class RoutesTrafficKpisComponent implements OnInit {
  id = this.common.params.doc._id ? this.common.params.doc._id : null;

  brands = [];
  modelId = null;
  brandId = null;
  targetTime=null;
  allowedTime=null;
  route = [{
    routeId: this.id,
    targetTime: null,
    allowedTime: null,
    modelId: null,
  }]
  
  constructor(
    public activeModal:NgbActiveModal,
    public common:CommonService,
    public api:ApiService
  ) {
    this.vehicleModalTypes();
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

  submit(){
    console.log("para",JSON.stringify(this.route))
    this.api.post('ViaRoutes/trafficKpiAdd',{ data: JSON.stringify(this.route) })
      .subscribe(res => 
        {
          console.log('data',res);
          console.log('msg',res['data'][0]);
          console.log('msg1',res['data'][0].y_msg);
          
          if(res['data'][0].y_id>0){
            this.common.showToast(res['data'][0].y_msg);
            this.route = [{
              routeId: null,
              targetTime: null,
              allowedTime: null,
              modelId: null,
            }]
          }
          else{
            this.common.showError(res['data'][0].y_msg);
          }
        },
        err => console.error('Activity Api Error:', err));
  }

  addMore() {
    this.route.push({
      routeId:this.id,
      targetTime:null,
      allowedTime: null,
      modelId: null
    });
 
  }

  selectId(event,i){
    this.modelId = event.id;
    this.brandId = event.brand_id;
    this.route[i]['modelId']=this.modelId;
    console.log("route",this.route);
    console.log("ids",this.modelId,this.brandId);

  }

}
