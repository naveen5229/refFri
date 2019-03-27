import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';
import { Component, OnInit } from '@angular/core';
import { AddTripComponent } from '../../modals/add-trip/add-trip.component';
import { ReportIssueComponent } from '../../modals/report-issue/report-issue.component';

@Component({
  selector: 'vehicle-trip',
  templateUrl: './vehicle-trip.component.html',
  styleUrls: ['./vehicle-trip.component.scss','../pages.component.css']
})
export class VehicleTripComponent implements OnInit {

  vehicleTrips = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getVehicleTrips();
  }

  ngOnInit() {
  }


  getVehicleTrips() {
    ++this.common.loading;
    this.api.post('TripsData/VehicleTrips', {  })
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        this.vehicleTrips = res['data'];
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

  getUpadte(vehicleTrip){
    if(vehicleTrip.endTime){
      this.common.showToast("This trip cannot be updated ");
    }else{
      this.common.params= vehicleTrip;
      console.log("vehicleTrip",vehicleTrip);
      const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        console.log("data", data.respone);
        
          this.getVehicleTrips();
       
      });
    }
  }
  openAddTripModal(){
    this.common.params = {vehId:-1};
    //console.log("open add trip maodal", this.common.params.vehId);
    const activeModal = this.modalService.open(AddTripComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' })
    activeModal.result.then(data => {      
        this.getVehicleTrips();
     
    });
  }

  reportIssue(vehicleTrip){
    this.common.params= {refPage : 'vt'};
    console.log("reportIssue",vehicleTrip);
    const activeModal = this.modalService.open(ReportIssueComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data => data.status && this.common.reportAnIssue(data.issue, vehicleTrip.id));

  }
  deleteTrip(vehicleTrip){
    console.log("deleteTrip",vehicleTrip);
    let params = {
      tripId : vehicleTrip.id
    }
    ++this.common.loading;
    this.api.post('VehicleTrips/deleteVehicleTrip',params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);
        this.common.showToast(res['msg']);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }
}
