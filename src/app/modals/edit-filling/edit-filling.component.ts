import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddPumpComponent } from '../add-pump/add-pump.component';

@Component({
  selector: 'edit-filling',
  templateUrl: './edit-filling.component.html',
  styleUrls: ['./edit-filling.component.scss', '../../pages/pages.component.css']
})
export class EditFillingComponent implements OnInit {
  title = '';
  filldate = '';
  litres = 0;
  isfull = false;
  regno = '';
  rate = 0.0;
  amount = 0.0;
  pump = '';
  pump_id = 0;
  vehicle_id = 0;
  filling_id = 0;
  isPump = true;
  pumpPayType = '-21';
  driverCash = 0;
  odoVal = 0;



  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '800');

    this.title = this.common.params.title;
    console.log("params", this.common.params);
    let rec = this.common.params.rowfilling;
    this.filldate = rec.fdate;
    this.litres = rec.litres;
    this.isfull = rec.is_full;
    this.regno = rec.regno;
    this.rate = rec.rate;
    this.amount = rec.amount;
    this.pump = rec.pp;
    this.pump_id = rec.fuel_station_id;
    this.vehicle_id = rec.vehicle_id;
    this.filling_id = rec.id;
    this.driverCash = rec.driver_cash ? rec.driver_cash : 0;
    this.odoVal = rec.odometer ? rec.odometer : 0;
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getDate() {
    this.common.params = { ref_page: 'user-call-summary' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        console.log("data date:");
        console.log(data.date);
        this.filldate = data.date;

      }

    });
  }

  getPumpData(pump) {
    console.log("sel:", pump);
    this.pump_id = pump.id;
    this.pump = pump.name;
    console.log("pumpname:", this.pump);
  }

  updateAmount() {
    let calcamt = this.litres * this.rate;
    //this.amount = (Math.round(calcamt)/ 100 * 100);
    this.amount = Math.round(calcamt);
  }

  getVehData(veh) {
    console.log("sel:", veh);
    this.vehicle_id = veh.id;
    this.regno = veh.regno;
    console.log("regno:", this.regno);
  }

  submitFillingData() {
    console.log('fill date', this.filldate);
    if (this.filldate == null || this.filldate == '') {
      this.common.showToast('Fill Date To Continue');
      return;
    } else {
      if (this.isfull == false) {
        this.isfull = null;
      }
      let fmtdate = this.common.dateFormatter1(this.filldate).split(' ')[0];
      console.log("date::", fmtdate);
      let params = {
        vehId: this.vehicle_id,
        siteId: this.pump_id,
        litres: this.litres,
        rate: this.rate,
        amount: this.amount,
        fuelDetailsId: this.filling_id,
        date: fmtdate,
        petrolPumplocation: '',
        petrolPumpName: this.pump,
        isFull: this.isfull,
        fuelCompany: '',
        petrolPumpId: this.pump_id,
        driver_cash: this.driverCash,
        odometer_val: this.odoVal
      };
      console.log("rowdata", this.common.params.rowfilling);
      console.log("newparams", params);
      let apiurl = '';
      if (this.filling_id) {
        apiurl = 'FuelDetails/updateFuelDetails';
      } else {
        apiurl = 'FuelDetails/insertFuelDetails';
      }

      this.common.loading++;
      this.api.post(apiurl, params)
        .subscribe(res => {
          this.common.loading--;
          console.log("result");
          console.log(res);
          if (res["success"]) {
            this.common.showToast("Details Updated Successfully");
            this.filldate = '';
            this.activeModal.close();
          } else {
            this.common.showError(res['msg']);
          }

        }, err => {
          this.common.showError("Error occurred");
          this.common.loading--;
          console.log(err);
          this.filldate = '';
        });

    }

  }

  showAddPump() {
    this.common.params = { title: 'Petrol Pump' };
    this.common.handleModalHeightWidth('class', 'modal-lg', '1200', '1200');
    const activeModal = this.modalService.open(AddPumpComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        window.location.reload();
      }
    });
  }


  pumpPayStatus() {

    if (this.pumpPayType == '-11') {
      this.pump_id = parseInt(this.pumpPayType);
      this.pump = '';
    } else {
      this.pump_id = parseInt(this.pumpPayType);
      this.pump = '';
    }

  }

}
