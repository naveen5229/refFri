import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FuelEntriesComponent } from '../../modals/fuel-entries/fuel-entries.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';

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
      foId: null,
    };
    this.api.post('FuelDetails/getFuelFillingsAverage', params)
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
    this.common.params = { ref_page: 'fuel-avg' };
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


  getDetails(fuelAvgDetail) {
    this.common.params = fuelAvgDetail;
    console.log('Param', this.common.params);

    const activeModal = this.modalService.open(FuelEntriesComponent, { size: 'lg', container: 'nb-layout' });

  }


  openRouteMapper(fuelData) {
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: fuelData.vehicle_id,
      vehicleRegNo: fuelData.reg_number,
      fromTime: fuelData.startdate,
      toTime: fuelData.enddate
    };
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    activeModal.result.then(
      data => console.log("data", data)
    );
  }
}
