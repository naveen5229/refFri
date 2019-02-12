import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';
import { Component, OnInit } from '@angular/core';

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
    }
    this.getVehicleTrips();
    

  }

}
