import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  details=[];
  report=[];
  vehicleRegNo;
  i:'';d:'';
  
  constructor(private activeModal: NgbActiveModal, public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
      this.common.handleModalSize('class', 'modal-lg', '1600');
      if(this.common.params){
        let today,start;
        this.vid=this.common.params.kpi.x_vehicle_id;
        this.vehicleRegNo=this.common.params.kpi.x_showveh;
        today = new Date();
        this.endDate = this.common.dateFormatter(today);
        start=new Date(today.setDate(today.getDate() - 3))
        this.startDate=this.common.dateFormatter(start);
        console.log('details: ',this.vid,this.vehicleRegNo,this.endDate,this.startDate);
         this.getVehicleReport();
        }
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
                console.log('begore resultTime: '+this.resultTime);
                 // let sec = this.resultTime / 1000; //in s
                // let min = this.resultTime/ 60 / 1000; //in minutes
                // let hour = this.resultTime / 3600 / 1000; //in hours
                
                let sec=this.resultTime/1000;
                console.log('sec: '+sec);
                let min=sec/60;
                console.log('min: '+min);
                let hour=min/60;
                console.log('hour: '+hour); 
                // this.resultTime=hour.toFixed(2)
                // hour= Math.floor(hour) % 60;
                this.resultTime=hour.toFixed(2);
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

  closeModal() {
    this.activeModal.close();
  }

  

}
