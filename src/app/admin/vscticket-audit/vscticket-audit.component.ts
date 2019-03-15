import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';

@Component({
  selector: 'vscticket-audit',
  templateUrl: './vscticket-audit.component.html',
  styleUrls: ['./vscticket-audit.component.scss']
})
export class VSCTicketAuditComponent implements OnInit {

  startDate='';
  element='';
  endDate='';
  reportUserWise=[];
  reportVehicleWise=[];

  vehicleId=null;
  adminId=null;
  ticketAccordingTo = 'user';
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
     
     }

  ngOnInit() {
  }

  searchVehicle(vehicle){
    this.vehicleId=vehicle.id;
  }
  searchUser(admin){
    this.adminId=admin.id;
  }

getAlert(){
  if(this.ticketAccordingTo=='user'){
    this.getUserReport()
  }else if(this.ticketAccordingTo=='vehicle'){
    this.getVehicleReport();
  }
}

  getVehicleReport(){
   this.startDate=this.common.dateFormatter(this.startDate);
   this.endDate=this.common.dateFormatter(this.endDate);
   let params= "vehicleId="+this.vehicleId+
    "&startTime="+this.startDate+
    "&endTime="+this.endDate;
    
   console.log('params: ',params);
   this.common.loading++;
   this.api.get('HaltOperations/getClearAlertsVehicleWise?'+params)
           .subscribe(res=>{
              this.common.loading--;
              console.log('res: ',res['data'])
              this.reportVehicleWise=res['data'];   
              console.log('reportVehicleWise: ',this.reportVehicleWise)                
           }, err =>{
             this.common.loading--;
             this.common.showError();
           })
  }
   
  getUserReport(){
    this.startDate=this.common.dateFormatter(this.startDate);
    this.endDate=this.common.dateFormatter(this.endDate);
    
    let params= "adminId="+this.adminId+
    "&startTime="+this.startDate+
    "&endTime="+this.endDate;
    
    console.log('params: ',params);
    this.common.loading++;
    this.api.get('HaltOperations/getClearAlertsAdminWise?'+params)
            .subscribe(res=>{
               this.common.loading--;
               this.reportUserWise=res['data']; 
               console.log('reportUserWise: ',this.reportUserWise)
            }, err =>{
              this.common.loading--;
              this.common.showError();
            })
   }

   openVSCModel(data){
    let VehicleStatusData = {
      vehicle_id : data.vehicle_id,
      ttime:data.ttime,
      suggest:11,
      latch_time:data.latch_time
    }
    console.log("VehicleStatusData", VehicleStatusData);
   
    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });
   }
}

