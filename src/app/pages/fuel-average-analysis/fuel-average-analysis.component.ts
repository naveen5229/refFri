import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'fuel-average-analysis',
  templateUrl: './fuel-average-analysis.component.html',
  styleUrls: ['./fuel-average-analysis.component.scss', '../pages.component.css']
})
export class FuelAverageAnalysisComponent implements OnInit {

  fuelAvgDetails = [];
  dates = {
    start: this.common.dateFormatter(new Date()),
    end: this.common.dateFormatter(new Date())
  };

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getfuelAverageDetails();

  }

  ngOnInit() {
  }

  getfuelAverageDetails() {
    console.log("api hit");
    this.common.loading++;
    let params = {
      startTime: this.dates.start,
      endTime: this.dates.end,
      foId: 1,
    };
    this.api.post('FuelDetails/getFillingsByDateAndFoid', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.fuelAvgDetails = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.dates[date]);
        if (this.dates.start && this.dates.end)
          this.getfuelAverageDetails();
      }

    });
  }

  // getDetails(fuelAvgDetail){
  //   let params ={
  //     vehicle_id : fuelAvgDetail.veh_id,
  //     last_filling_entry_time : fuelAvgDetail.last_filling_entry_time,
  //     current_filling_entry_time : fuelAvgDetail.current_filling_entry_time
  //   } 
  //   this.common.loading++;
  //   this.api.get('VehicleKpis',)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log(res);
  //       let data = res['data'];
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }

  

}