import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service';
import { VechileTrailsComponent } from '../../modals/vechile-trails/vechile-trails.component';


@Component({
  selector: 'diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent implements OnInit {
  Distance = null;
  diagnostics = {
    vechileno: null,
    endDate : this.common.dateFormatter(new Date()),
    startTime : this.common.dateFormatter(new Date())

  };
  selectedVehicleId=null;
  Trails={
    vechileno:null,
    startTime : this.common.dateFormatter(new Date()),
    endDate : this.common.dateFormatter(new Date())
  };

  constructor(
    public router: Router,
    private modalservice: NgbModal,
    public common: CommonService,
    public api: ApiService  ) {
    // this.getvehicleData(this.diagnostics.vechileno);
    // this.getDistance();
  }

  ngOnInit() {

  }
  
  getDate(time) {
    const activeModal = this.modalservice.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.diagnostics[time] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.diagnostics[time]);
    });

  }
  calculateDistance() {

      let params={
        vehId : this.diagnostics.vechileno,
        startTime: this.common.dateFormatter(this.diagnostics.startTime),
        endDate: this.common.dateFormatter(this.diagnostics.endDate)
      };
      console.log("params :", params);
      this.common.loading++;
      this.api.post('Vehicles/getVehDistanceBwTime', {vehId:params.vehId,startTime:params.startTime,endDate:params.endDate})
        .subscribe(res => {
          this.common.loading--;
          console.log('res: ', res['data']);
          this.Distance = res['data']?res['data']+" KM":"Not Available";
        }, err => {
          this.common.loading--;
          this.common.showError();
        })
    }
    getvehicleData(vehicle,type) {
      console.log('Vehicle Data: ', vehicle,type); 

      if(type=='trails'){
        this.Trails.vechileno= vehicle.id;
      }else{
        this.diagnostics.vechileno = vehicle.id;
      }
    }
    getVehicleTrails(){
     let param = {
      vehicleId : this.Trails.vechileno,
      fromTime : this.common.dateFormatter( this.Trails.startTime),
      toTime : this.common.dateFormatter(this.Trails.endDate),
      suggestId:1
     }
     console.log("param",param);
      this.common.loading++;
      this.api.post('VehicleStatusChange/getVehicleTrail', param)
        .subscribe(res => {
          this.common.loading--;
          if(res['data'].length>0){
          this.common.params = res['data'];
          console.log('res: ', this.common.params);          
          this.modalservice.open(VechileTrailsComponent,{ size: 'lg', container: 'nb-layout'});
          }else{
            alert("Vehicle Trails are not present for this time period");
          }
        }, err => {
          this.common.loading--;
          this.common.showError();
        })
    }
    }


