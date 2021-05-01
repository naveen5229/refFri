import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { VehicleWiseFuelFillingComponent } from '../../modals/vehicle-wise-fuel-filling/vehicle-wise-fuel-filling.component';
import { PumpWiseFuelFillingComponent } from '../../modals/pump-wise-fuel-filling/pump-wise-fuel-filling.component';
import { ModalWiseFuelAvgComponent } from '../../modals/modal-wise-fuel-avg/modal-wise-fuel-avg.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-analysis',
  templateUrl: './fuel-analysis.component.html',
  styleUrls: ['./fuel-analysis.component.scss']
})
export class FuelAnalysisComponent implements OnInit {

  startDate = '';
  endDate = '';
  data = [];

  constructor(
    public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) {
    this.endDate = this.common.dateFormatter(new Date());
    this.startDate = this.common.dateFormatter(new Date().setDate(new Date().getDate() - 15));
    // this.xdate = this.common.dateFormatter(new Date());
    // this.ydate = this.common.dateFormatter(new Date());
    //this.populateFilling();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    console.log('Refresh');
    
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
    this.common.params = { ref_page: 'fuel-analysis' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (flag == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('fromDate', this.startDate);
        }
        if (flag == 'end') {
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
  modalWiseFuel() {

    const activeModal = this.modalService.open(ModalWiseFuelAvgComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });


  }
  getreport() {
    // console.log('Dates', this.dates.date);
    let params = "start_time=" + this.startDate + "&end_time=" + this.endDate;

    console.log('params', params);


    this.common.loading++;
    this.api.get('Fuel/getPumpWiseTotalFilling?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data) {
          this.common.params = this.data;
          console.log('response', this.common.params);
          const activeModal = this.modalService.open(PumpWiseFuelFillingComponent, { size: 'lg', container: 'nb-layout' });
        }

        //this.table = this.setTable();
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  vechilewiseFuel() {
    let params = "start_time=" + this.startDate + "&end_time=" + this.endDate;

    console.log('params', params);


    this.common.loading++;
    this.api.get('Fuel/getVehWiseTotalFilling?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data) {
          this.common.params = this.data;
          // console.log('response', this.common.params);
          const activeModal = this.modalService.open(VehicleWiseFuelFillingComponent, { size: 'lg', container: 'nb-layout' });
          activeModal.result.then(data => {
            if (data.response) {
              this.vechilewiseFuel();
            }
          })
        }

        //this.table = this.setTable();
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });



  }

  // this.common.params = { data };
  // console.log('..................', this.common.params.data);
  // const activeModal = this.modalService.open(PumpWiseFuelFillingComponent, { size: 'lg', container: 'nb-layout' });


}
