import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { userInfo } from 'os';
import { dateFieldName } from '@telerik/kendo-intl';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'pull-history-gps-data',
  templateUrl: './pull-history-gps-data.component.html',
  styleUrls: ['./pull-history-gps-data.component.scss']
})
export class PullHistoryGPSDataComponent implements OnInit {
  // startDate = null;
  // endDate = null;
  startDate = new Date();
  endDate = new Date();
  foid = '';
  gpsData = [];
  haltData = [];
  constructor(public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public api: ApiService) {
    console.log("Start Date:", this.startDate);
  }

  ngOnInit() {
    //this.Form = this.formBuilder.group({

  }
  closeModal() {
    this.activeModal.close();
  }
  selectFoUser(user) {
    this.foid = user.id;
  }
 
  getgpsData() {
    this.startDate = this.common.dateFormatter(this.startDate);
    this.endDate = this.common.dateFormatter(this.endDate);
   

    this.common.loading++;
    this.api.get3('schedulers/apidata/downloadapidata.php?history=1&&foid=' + this.foid + ' &&fromTime=' + this.startDate + '&&toTime=' + this.endDate)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.gpsData = res['data'];
        console.log('data', this.gpsData);

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }
  gethaltData() {
    this.startDate = this.common.dateFormatter(this.startDate).split(' ')[0];
    this.endDate = this.common.dateFormatter(this.endDate).split(' ')[0];
    let d1 = new Date(this.startDate);
    let d2 = new Date(this.endDate);
    console.log(d1, d2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    if (diffDays > 5) {
      window.alert('Diffrence between selected date should be less than 5 days');
      return;
    }
    this.common.loading++;
    this.api.get('GpsData/getFoWiseGpsData?foid=' + this.foid + ' &&start_time=' + this.startDate + '&&end_time=' + this.endDate)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.gpsData = res['data'];
        console.log('data', this.gpsData);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


}