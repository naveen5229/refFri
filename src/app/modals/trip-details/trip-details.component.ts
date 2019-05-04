import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { VehicleReportComponent } from '../vehicle-report/vehicle-report.component';
import { RouteMapperComponent } from '../route-mapper/route-mapper.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss', '../../pages/pages.component.css']
})
export class TripDetailsComponent implements OnInit {
  startDate = null;
  endDate = null;
  vehicleId = null;
  vehicleRegNo = null;
  trips = null;
  startTimePeriod = '00:00';
  endTimePeriod = '00:00';

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public dateService: DateService
  ) {
    // this.common.handleModalSize('class', 'modal-lg', '1600');
    this.startDate = this.common.params.fromTime;
    this.endDate = this.common.params.toTime;

    this.startTimePeriod = this.startDate.split(' ')[1];
    this.startTimePeriod = this.startTimePeriod.split(':')[0] + ":" + this.startTimePeriod.split(':')[1];

    this.endTimePeriod = this.endDate.split(' ')[1];
    this.endTimePeriod = this.endTimePeriod.split(':')[0] + ":" + this.endTimePeriod.split(':')[1];

    this.startDate = this.dateService.dateFormatter(this.startDate, '', false);
    this.endDate = this.dateService.dateFormatter(this.endDate, '', false);

    this.vehicleId = this.common.params.vehicleId;
    this.vehicleRegNo = this.common.params.vehicleRegNo;
    this.getTripDetails();
  }

  ngOnInit() {
  }

  get startTimeFull() {
    return this.startDate + " " + this.startTimePeriod;
  }

  get endTimeFull() {
    return this.endDate + " " + this.endTimePeriod;
  }

  getTripDetails() {
    let params = "vehicleId=" + this.vehicleId +
      "&startTime=" + this.startTimeFull +
      "&endTime=" + this.endTimeFull;
    console.log(params)
    this.api.get('TripsOperation/viewBtw?' + params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.trips = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
  vehicleReport(trip) {
    console.log("trip------", trip);
    let fromTime = trip.start_time;
    let toTime = trip.end_time;
    console.log("trip------", fromTime, toTime);
    this.common.params = { vehicleId: trip.vehicle_id, vehicleRegNo: this.vehicleRegNo, fromTime: fromTime, toTime: toTime };
    this.common.handleModalHeightWidth('class', 'modal-lg', '200', '1500');
    this.modalService.open(VehicleReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "mycustomModalClass" });

  }

  openRouteMapper(trip) {
    let fromTime = this.common.dateFormatter(new Date(trip.start_time));
    let toTime = this.common.dateFormatter(new Date(trip.end_time));
    this.common.params = { vehicleId: trip.vehicle_id, vehicleRegNo: this.vehicleRegNo, fromTime: fromTime, toTime: toTime }
    // console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, { size: 'lg', container: 'nb-layout', windowClass: "mycustomModalClass" });
    activeModal.result.then(data =>
      console.log("data", data)
      // this.reloadData()
    );
  }

  closeModal() {
    this.activeModal.close();
  }
  getDate(type) {

    this.common.params = { ref_page: 'trip status feedback' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.dateService.dateFormatter(data.date, '', false).split(' ')[0];
        }
        else {
          this.endDate = this.dateService.dateFormatter(data.date, '', false).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });

  }

}
