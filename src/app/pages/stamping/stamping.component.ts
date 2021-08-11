import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'stamping',
  templateUrl: './stamping.component.html',
  styleUrls: ['./stamping.component.scss']
})
export class StampingComponent implements OnInit {
  vehicleId = null;
  vehicleRegNo = '';
  preference = 'GPS';
  divername = '';
  divermobile=null;
  data :any;
  initiated='';
  activestatus='';
  remark='';
  finalstatus = '';
  allowed = false;
  disallowed = false;
  optionflag = false;
  spatialremarks='';
  allowedoption=true;
  stampingdata:any;
  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public user: UserService) { 
      console.log('finalstatus',this.finalstatus);
  }

  ngOnInit(): void {
  }
  changevalue(){
    setTimeout(() => {
    console.log('preference',this.preference);
    this.finalstatus = this.preference == 'GPS' ? this.data['gps_icon_color'] : this.preference == 'SIM' ? this.data['sim_icon_color'] : '';
  }, 100);

  }
  searchVehicle(value) {
    this.vehicleId = value.id;
    this.vehicleRegNo = value.regno;
    this.GetStampingdata();
  }
  GetStampingdata() {
    this.data = [];
  
    this.common.loading++;
    this.api.get('TripConsignment/GetStamping?vehicleid='+this.vehicleId)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'][0];
        this.preference = this.data['preferences'];
        this.divername = this.data['driver_name'];
        this.divermobile=this.data['driver_mobile_1'];
        this.initiated=this.data['driver_mobile_1'];
        this.activestatus=this.data['driver_mobile_1'];
        this.finalstatus =  this.preference == 'GPS' ? this.data['gps_icon_color'] : this.preference == 'SIM' ? this.data['sim_icon_color'] : '';
        console.log('res: ',this.data);
        

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  callsave(){
    let params = {
        stampingdata:this.data,
        preference:this.preference,
        divermobile:this.divermobile,
        finaliconcolor:this.finalstatus,
        remark:this.remark, 
        allowedoption:this.allowedoption, 
    };
    let url = 'TripConsignment/saveStampingDetails';
    this.common.loading++;
    this.api.post(url, params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Success:", res);
        if (res['code'] > 0) {
          this.common.showToast("success!!");
          
        }
        if (res['code'] < 0) {
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
