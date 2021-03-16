import { Component, OnInit } from '@angular/core';
import { TripKmRepairViewComponent } from '../../modals/trip-km-repair-view/trip-km-repair-view.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TollpaymentmanagementComponent } from '../../modals/tollpaymentmanagement/tollpaymentmanagement.component';
import { RouteMapper } from '../../modals';



@Component({
  selector: 'tripmasterreport',
  templateUrl: './tripmasterreport.component.html',
  styleUrls: ['./tripmasterreport.component.scss']
})
export class TripmasterreportComponent implements OnInit {
  tripData = [];
  tripMasterReportData = [];
  selectedVehicle = {
    id: 0
  };
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  startTime = new Date();
  endTime = new Date();

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    public user: UserService) {
    let today = new Date();
    this.startTime = new Date(today.setDate(today.getDate() - 1));
  }

  ngOnInit(): void {
  }

  getVehicle(vehicle) {
    console.log('test fase', vehicle);
    this.selectedVehicle = vehicle;
    console.log('test fase', this.selectedVehicle.id);
  }

  // getTripMasterReport(){

  // }

  getTripMasterReport() {
    this.tripData = [];
    const params = "vid=" + this.selectedVehicle.id + "&startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime);
    this.common.loading++;
    this.api.get('TripsOperation/getTripMasterReport?' + params)
      .subscribe(res => {
        this.common.loading--;
        if (res['code'] > 0) {
          this.tripMasterReportData = res['data'] ? res['data'] : [];
          this.tripData = this.tripMasterReportData.map(item => {
            item.origin = item['trp_points'][0];
            let last = item['trp_points'].length - 1;
            item.via = item['trp_points'].length > 2 ? item['trp_points'][1] : '';
            item.destination = item['trp_points'].length >= 2 ? item['trp_points'][last] : '';

            console.log("origin:", item.origin);
            console.log("via:", item.via);
            console.log("destination:", item.destination);

            // item['trp_points'][1]='Via';
            // item['trp_points'][last]='Destination';
            return item;
          })

          console.log("tripData:", this.tripData);


          console.log("data:", this.tripMasterReportData);
        } else {
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  openTripKmRepair(data) {
    console.log("KMdata:", data);
    if (!data['route_kms']) {
      this.common.showError('No Data');
      return;
    }
    let tripData = {
      tripId: data['trip_id'],
      vId: data['vid']
    };
    this.common.params = tripData;
    console.log("tripData", this.common.params);

    const activeModal = this.modalService.open(TripKmRepairViewComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      // this.getVehicleTrips();
    });
  }

  tollPaymentManagement(trip) {
    console.log("trip------", trip);
    let fromTime = trip._startdate;
    let toTime = trip._enddate;
    console.log("trip------", fromTime, toTime);
    this.common.params = { vehId: trip.vid, vehRegNo: trip.regno, startDate: trip['origin']['act_start_time'], endDate: trip['destination']['act_end_time'], startDatedis: trip['origin']['act_start_time'], endDatedis: trip['destination']['act_end_time'] };
    this.common.openType = "modal";
    // this.common.handleModalHeightWidth('class', 'modal-lg', '200', '1500');
    this.modalService.open(TollpaymentmanagementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "mycustomModalClass" });
  }

  showRouteMapper(trip) {
    console.log('trip', trip);
    let today, startday, fromDate;
    today = new Date();
    startday = this.common.dateFormatter(trip.inv_start_time);
    fromDate = this.common.dateFormatter(startday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(new Date());
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: trip.vid,
      vehicleRegNo: trip.regno,
      fromTime: fromTime,
      toTime: toTime
    };
    this.modalService.open(RouteMapper, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
  }

}
