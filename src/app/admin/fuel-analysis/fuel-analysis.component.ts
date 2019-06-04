import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'fuel-analysis',
  templateUrl: './fuel-analysis.component.html',
  styleUrls: ['./fuel-analysis.component.scss']
})
export class FuelAnalysisComponent implements OnInit {

  startDate = '';
  endDate = '';

  constructor(
    public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) {
    this.endDate = this.common.dateFormatter(new Date());
    this.startDate = this.common.dateFormatter(new Date().setDate(new Date().getDate() - 15));
    //this.populateFilling();
  }

  ngOnInit() {
  }

  populateFilling() {
    let params = {
      start_time: this.startDate,
      end_time: this.endDate
    };
    this.common.loading++;
    this.api.post('Fuel/populateFillingStationEntriesWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getDate(flag) {
    this.common.params = { ref_page: 'lrDetails' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (flag == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('fromDate', this.startDate);
        }
        else {
          this.endDate = '';
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }

      }

    });

  }

  mappingFE() {

    let params = {
      start_time: this.startDate,
      end_time: this.endDate
    };
    this.common.loading++;
    this.api.post('Fuel/FSEMapiingWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  mappingIsFull() {

    let params = {
      start_time: this.startDate,
      end_time: this.endDate
    };
    this.common.loading++;
    this.api.post('Fuel/UpdateIsFullWrtFF', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }
  populateFAL() {
    let params = {
      start_time: this.startDate,
      end_time: this.endDate
    };
    this.common.loading++;
    this.api.post('Fuel/populateFALogsAndUpdateWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}
