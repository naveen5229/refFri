import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'trip-analysis',
  templateUrl: './trip-analysis.component.html',
  styleUrls: ['./trip-analysis.component.scss']
})
export class TripAnalysisComponent implements OnInit {


  startDate = '';
  endDate = '';

  constructor(public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
    this.endDate = this.common.dateFormatter(new Date()).split(' ')[0];
    this.startDate = this.common.dateFormatter(new Date().setDate(new Date().getDate() - 15)).split(' ')[0];
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    console.log('Refresh');
  }

  getDate(type) {

    this.common.params = { ref_page: 'trip-analysis' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('startDate', this.startDate);
        }
        else {
          this.endDate = '';
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }

      }

    });

  }

  getTripAnalysis() {
    let params = {
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.common.loading++;
    this.api.post('TripsOperation/regenerateVehicleTrips', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

}
