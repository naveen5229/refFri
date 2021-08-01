import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tripshared',
  templateUrl: './tripshared.component.html',
  styleUrls: ['./tripshared.component.scss']
})
export class TripsharedComponent implements OnInit {
  tripData :any;
  hourdata = [];
  activehour=6;
  sharedname='Shared : 2021-07-27';
  sharedvehicledata :any;
  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public user: UserService) {
      this.getVehicleFowise();
      this.getSharedVehicles();
      for(let i=1; i<=6;i++){
        if(i == 1){
          this.hourdata.push(6);
        }
        this.hourdata.push(12*i);
      }
      console.log('hourdata',this.hourdata);
  }
  ngOnInit(): void {
  }
  getVehicleFowise() {
    this.tripData = [];
  
    this.common.loading++;
    this.api.get('Vehicles/getVehicleFowise')
      .subscribe(res => {
        this.common.loading--;
        this.tripData = res['data'];
        this.tripData.map((dd,index)=>{
          this.tripData[index].status=false;
        }); 
        console.log('res: ',this.tripData);
        

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  saveTripStatus(){
    let xrefids='';
    console.log('tripData',this.tripData);
    this.tripData.map((xdata)=>{
      if(xdata.status){
        xrefids += xdata.r_vid+',';
      }
    });
    let params= {
      name: this.sharedname,
      expiryhrs: this.activehour,
      xrefids: (xrefids)?(xrefids.substring(0,xrefids.length-1)):'',
      xid:0
    };
    this.common.loading++;
    this.api.post('Vehicles/savesharedvehicles',params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
         
        this.getSharedVehicles();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  getSharedVehicles() {
    this.sharedvehicledata = [];
  
    this.common.loading++;
    this.api.get('Vehicles/getSharedVehicles')
      .subscribe(res => {
        this.common.loading--;
        if(res['data']){
        this.sharedvehicledata = res['data'];
        
        console.log('res shared vehicle: ',this.sharedvehicledata);
        }else{
          this.common.showToast('Data Are Not Available');
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}
