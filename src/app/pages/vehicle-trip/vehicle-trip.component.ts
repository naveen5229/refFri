import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
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

  }

  ngOnInit() {
   // this.getVehicleTrips();
  }


  getVehicleTrips() {
    ++this.common.loading;
    this.api.post('FoDetails/getLorryStatus', {  })
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);
        this.vehicleTrips = res['data'];
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }


}
