import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
@Component({
  selector: 'vehicle-report',
  templateUrl: './vehicle-report.component.html',
  styleUrls: ['./vehicle-report.component.scss']
})
export class VehicleReportComponent implements OnInit {

  startDate='';
  element='';
  endDate='';
  startTime:any;
  endTime:any;
  resultTime:any;
  duration=[];
  vid='';
  report=[];
  i:'';d:'';
  
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
     
     }

  ngOnInit() {
  }

  searchVehicle(vehicleList){
    this.vid=vehicleList.id;
  }
  getVehicleReport(){
   this.startDate=this.common.dateFormatter(this.startDate);
   this.endDate=this.common.dateFormatter(this.endDate);
   
   let params={
    vehicleId:this.vid,
    startDate :this.startDate,
    endDate :this.endDate
   };
   console.log('params: ',params);
   this.common.loading++;
   this.api.post('HaltOperations/getVehicleEvents',params)
           .subscribe(res=>{
              this.common.loading--;
              console.log('res: ',res['data'])
              this.report=res['data'];
              this.report.forEach((d)=>{
                this.startTime=d.start_time;
                this.startTime=new Date(this.startTime);
                console.log('startTime: '+this.startTime);
                this.endTime=d.end_time;
                this.endTime=new Date(this.endTime);
                console.log('endTime: '+this.endTime);
                this.resultTime=this.endTime-this.startTime;
                console.log('resultTime: '+this.resultTime);
                this.duration.push(this.resultTime);
               });
                   
           }, err =>{
             this.common.loading--;
             this.common.showError();
           })
  }
    
  showMap(details){
    if (!details.lat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    const location = {
      lat: details.lat,
      lng: details.long,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Vehicle Location' };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
  }

  

}
