import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AddVehicleComponent } from '../../modals/add-vehicle/add-vehicle.component';
import { AddFoAdminUsersComponent } from '../../modals/add-fo-admin-users/add-fo-admin-users.component';
import { LocationSelectionComponent } from '../../modals/location-selection/location-selection.component';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  foid = null;
  location = {
    grade: '',
    location: '',
    lat: '',
    lng: ''
  };
  constructor(
    public modalService: NgbModal,
    public common: CommonService,
  ) {

  }

  ngOnInit() {
  }
  open() {
    const activeModal = this.modalService.open(AddVehicleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  addFoAdminUser() {
    const activeModal = this.modalService.open(AddFoAdminUsersComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  selectLocation(location) {
    this.location = {
      grade: location.grade,
      location: location.location,
      lat: location.lat,
      lng: location.long
    };
  }
  locationSelection() {
    this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
    const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(res => {
      console.log('response', res);
      if (res.location) {
        this.location = {
          grade: '',
          location: res.location.name,
          lat: res.location.lat,
          lng: res.location.lng
        };
      }
    })
  }
}
