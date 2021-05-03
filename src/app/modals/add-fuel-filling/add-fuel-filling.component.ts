import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-fuel-filling',
  templateUrl: './add-fuel-filling.component.html',
  styleUrls: ['./add-fuel-filling.component.scss']
})
export class AddFuelFillingComponent implements OnInit {
  fillDate;
  VehicleId;
  fuelEntries = {
    stationId: null,
    stationName: null,
    quantity: null,
    rate: null,
    amount: null
  };
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.VehicleId = this.common.params.vehId;
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  addFuelFilling() {
    console.log(this.fuelEntries);
    // this.fillDate = this.fillDate.split("/").reverse().join("-");
    // this.fillDate  = new Date(this.fillDate);
    this.common.dateFormatter(this.fillDate);
    console.log('fillDate', this.fillDate);

    let params = {
      vehId: this.VehicleId,
      stationName: this.fuelEntries.stationName,
      id: this.fuelEntries.stationId,
      litres: this.fuelEntries.quantity,
      rate: this.fuelEntries.rate,
      amount: this.fuelEntries.amount,
      date: this.fillDate
    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('FuelDetails/insertFuelDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['msg']);
        this.common.showToast(res['msg']);
        this.activeModal.close();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  searchStationName(stationList, type?) {
    this.fuelEntries.stationName = stationList.name;
    this.fuelEntries.stationId = stationList.id;
  }

  getDate(type?) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.fillDate = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('lrdate: ' + this.fillDate);

      }

    });
  }

  closeModal() {
    this.activeModal.close();
  }

}
