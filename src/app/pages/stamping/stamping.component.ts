import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AddDriverCompleteComponent } from '../../modals/DriverModals/add-driver-complete/add-driver-complete.component';
import { AddDriverVehicleComponent } from '../../modals/DriverModals/add-driver-vehicle/add-driver-vehicle.component';

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
  optionselect='';
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: '75vh'
    }
  };
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
    this.GetdefaultStampingdata();

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
  GetdefaultStampingdata() {
    this.stampingdata = [];
  
    this.common.loading++;
    this.api.get('TripConsignment/GetStampingdata?vehicleid='+this.vehicleId)
      .subscribe(res => {
        this.common.loading--;
        this.stampingdata = res['data'];
        
        console.log('res: ',this.stampingdata);
        if (this.stampingdata.length > 0) {
          let first_rec = this.stampingdata[0];
          console.log("first_Rec", first_rec);
          this.headings = [];
          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }
          }

          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);

        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  addDriver() {
    this.common.params = { 'vid':this.vehicleId };
    const activeModal = this.modalService.open(AddDriverVehicleComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        this.GetStampingdata();
       // this.getDriverConsentList();
      }
    })
  }
  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.stampingdata.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
          this.valobj[this.headings[j]] = { value: this.stampingdata[i][this.headings[j]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    }
    return columns;
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  callsave(){
    let params = {
        stampingdata:this.data,
        preference:this.preference,
        divermobile:this.divermobile,
        finaliconcolor:this.finalstatus,
        remark:this.remark, 
        allowedoption:this.allowedoption, 
        optstr:this.optionselect,
        optremarks:this.spatialremarks
    };
    let url = 'TripConsignment/saveStampingDetails';
    this.common.loading++;
    this.api.post(url, params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Success:", res);
        if (res['code'] > 0) {
          this.allowed = false;
          this.optionflag = false;
          this.GetdefaultStampingdata();
          this.common.showToast(res['data']);
          
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
