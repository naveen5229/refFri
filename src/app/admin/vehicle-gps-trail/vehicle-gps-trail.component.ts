import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe, NumberFormatStyle } from '@angular/common';

@Component({
  selector: 'vehicle-gps-trail',
  templateUrl: './vehicle-gps-trail.component.html',
  styleUrls: ['./vehicle-gps-trail.component.scss']
})
export class VehicleGpsTrailComponent implements OnInit {

  startDate='';
  endDate='';
  vId='';
  gpsTrail=[];

  constructor(public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) { 
      let today;
      today = new Date();
      this.endDate = this.common.dateFormatter(today);
      this.startDate=this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)));
      console.log('dates ',this.endDate,this.startDate)
      this.getVehicleGpsTrail();
    }

  ngOnInit() {
  }

  searchVehicle(vehicleList) {
    this.vId = vehicleList.id;
  }

  getVehicleGpsTrail(){
    this.startDate = this.common.dateFormatter(this.startDate);
    this.endDate = this.common.dateFormatter(this.endDate);

    let params = {
      vehicleId: this.vId,
      startDate: this.startDate,
      endDate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('HaltOperations/getVehicleEvents', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.gpsTrail = res['data'];
        console.log('gpstrail',this.gpsTrail);
        if (!(res['data'].length))
          this.common.showToast('record empty !!');
              
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

}
