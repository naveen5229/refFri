import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vscticket-audit',
  templateUrl: './vscticket-audit.component.html',
  styleUrls: ['./vscticket-audit.component.scss']
})
export class VSCTicketAuditComponent implements OnInit {

  startDate='';
  element='';
  endDate='';
  report=[];
  vehicle_id=null;
  user_id=null;
  ticketAccordingTo = 'user';
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
     
     }

  ngOnInit() {
  }

  searchVehicle(vehicle){
    this.vehicle_id=vehicle.id;
  }
  searchUser(user){
    this.user_id=user.id;
  }
  getVehicleReport(){
   this.startDate=this.common.dateFormatter(this.startDate);
   this.endDate=this.common.dateFormatter(this.endDate);
   
   let params={
    vehicleId:this.vehicle_id,
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
           }, err =>{
             this.common.loading--;
             this.common.showError();
           })
  }
    


  

}

