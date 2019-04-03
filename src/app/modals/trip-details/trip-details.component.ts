import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { VehicleReportComponent } from '../vehicle-report/vehicle-report.component';
import { RouteMapperComponent } from '../route-mapper/route-mapper.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { 
   // this.common.handleModalSize('class', 'modal-lg', '1600');
    this.startDate = this.common.params.fromTime;
  this.endDate = this.common.params.toTime;
  this.vehicleId = this.common.params.vehicleId;
  this.vehicleRegNo = this.common.params.vehicleRegNo;
  this.getTripDetails();
  }

  ngOnInit() {
  }

  getTripDetails(){
    let params = "vehicleId=" +this.vehicleId+
    "&startTime=" +this.common.dateFormatter(this.startDate)+
    "&endTime=" +this.common.dateFormatter(this.endDate);
    console.log(params)
    this.api.get('TripsOperation/viewBtw?' +params)
        .subscribe(res => {
          console.log('Res: ', res['data']);
          this.trips = res['data'];
        }, err => {
          console.error(err);
          this.common.showError();
        });
  }
  vehicleReport(trip) {
    let fromTime =this.common.dateFormatter(new Date(trip.start_time));
    let toTime= this.common.dateFormatter(new Date(trip.end_time));
    this.common.params = {vehicleId:trip.vehicle_id,vehicleRegNo:this.vehicleRegNo,fromTime:fromTime,toTime:toTime};
    this.common.handleModalHeightWidth('class', 'modal-lg', '200','1500');   
    this.modalService.open(VehicleReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static',windowClass: "mycustomModalClass" });

  }

  openRouteMapper(trip){
    let fromTime =this.common.dateFormatter(new Date(trip.start_time));
    let toTime= this.common.dateFormatter(new Date(trip.end_time));
    this.common.params = {vehicleId:trip.vehicle_id,vehicleRegNo:this.vehicleRegNo,fromTime:fromTime,toTime:toTime}
    // console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, { size: 'lg', container: 'nb-layout',windowClass: "mycustomModalClass" });
    activeModal.result.then(data =>
      console.log("data",data) 
      // this.reloadData()
      );
    }
    
  closeModal() {
    this.activeModal.close();
  }

}
