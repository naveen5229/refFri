import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { VehicleReportComponent } from '../vehicle-report/vehicle-report.component';
import { RouteMapperComponent } from '../route-mapper/route-mapper.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss','../../pages/pages.component.css']
})
export class TripDetailsComponent implements OnInit {
  startDate=null;
  endDate=null;
  vehicleId = null;
  vehicleRegNo = null;
  trips = null;
  constructor(
    public common : CommonService,
    public api : ApiService,
    private modalService: NgbModal
  ) { 
    this.startDate = this.common.params.fromTime;
  this.endDate = this.common.params.toTime;
  this.vehicleId = this.common.params.vehicleId;
  this.vehicleRegNo = this.common.params.vehicleRegNo;
  }

  ngOnInit() {
  }

  getTripDetails(){
    let params = "vehicleId=" +this.vehicleId+
    "&startTime=" +this.common.dateFormatter(this.startDate)+
    "&endTime=" +this.common.dateFormatter(this.endDate);
    console.log(params)
    this.api.get('VehicleTrips/vehiclePlacements?' +params)
        .subscribe(res => {
          console.log('Res: ', res['data']);
          this.trips = res['data'];
        }, err => {
          console.error(err);
          this.common.showError();
        });
  }
  vehicleReport(kpi) {
    console.log('KPis: ', kpi);
    this.common.params = { kpi };
    this.modalService.open(VehicleReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }

  openRouteMapper(kpi){
    let today,startday,fromDate
    today= new Date();
    startday = new Date(today.setDate(today.getDate() - 2));
    fromDate = this.common.dateFormatter(startday);
    let fromTime =this.common.dateFormatter(fromDate);
    let toTime= this.common.dateFormatter(new Date());
    // this.common.params = {vehicleId:kpi.x_vehicle_id,vehicleRegNo:kpi.x_showveh,fromTime:fromTime,toTime:toTime}
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data =>
      console.log("data",data) 
      // this.reloadData()
      );


    }
}
