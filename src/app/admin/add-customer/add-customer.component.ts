import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
// import { AddVehicleComponent } from '../../modals/add-vehicle/add-vehicle.component';
import { AddFoAdminUsersComponent } from '../../modals/add-fo-admin-users/add-fo-admin-users.component';
import { LocationSelectionComponent } from '../../modals/location-selection/location-selection.component';
import { CommonService } from '../../services/common.service';
import { AddFoComponent } from '../../modals/add-fo/add-fo.component';
import { PullHistoryGPSDataComponent } from '../../modals/pull-history-gps-data/pull-history-gps-data.component';
import { AddVehicleComponent } from '../../modals/add-vehicle/add-vehicle.component';
import { VehiclesViewComponent } from '../vehicles-view/vehicles-view.component';
import { TicketSubscribeComponent } from '../ticket-subscribe/ticket-subscribe.component';
import { GpsEnabledDisabledComponent } from '../../modals/gps-enabled-disabled/gps-enabled-disabled.component';
import { TypeMasterComponent } from '../../modals/type-master/type-master.component';
import { GetUserBankInfoComponent } from '../../modals/get-user-bank-info/get-user-bank-info.component';
import { BulkCompanyAssociationComponent } from '../../modals/bulk-company-association/bulk-company-association.component';
import { MultiVehicleHaltAddComponent } from '../../modals/multi-vehicle-halt-add/multi-vehicle-halt-add.component';
import { SingleVehicleGpsDataComponent } from '../../modals/single-vehicle-gps-data/single-vehicle-gps-data.component';
import { AtSitesComponent } from '../../modals/at-sites/at-sites.component';
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
  data = [];
  constructor(
    public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
  ) {
    this.common.refresh = this.refresh.bind(this);


  }
  refresh(){
    console.log('Refresh');
  }

  ngOnInit() {
  }
  addVehicle() {
    const activeModal = this.modalService.open(AddVehicleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  addFoAdminUser() {
    const activeModal = this.modalService.open(AddFoAdminUsersComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  submitted1() {
    const activeModal = this.modalService.open(AddFoComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
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
  submitted2() {
    const activeModal = this.modalService.open(PullHistoryGPSDataComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  typeMaster(){
    const activeModal = this.modalService.open(    TypeMasterComponent,  { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }
  getUserBank(){
    const activeModal = this.modalService.open(GetUserBankInfoComponent,  { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  // selectLocation(location) {
  //   this.location = {
  //     grade: location.grade,
  //     location: location.location,
  //     lat: location.lat,
  //     lng: location.long
  //   };
  // }
  // locationSelection(user) {
  //   this.common.params = { user, placeholder: 'selectLocation', title: 'SelectLocation' };
  //   const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(res => {
  //     console.log('response', res);
  //     if (res.location) {
  //       this.location = {
  //         grade: '',
  //         location: res.location.name,
  //         lat: res.location.lat,
  //         lng: res.location.lng
  //       };
  //     }
  //   })
  // }

  vehiclesview() {
    const activeModal = this.modalService.open(VehiclesViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }
  VSCSubscribe() {
    const activeModal = this.modalService.open(TicketSubscribeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }
  GpsDetail() {

    this.common.loading++;
    this.api.get('GpsData/getGpsInfoWrtFo')
      .subscribe(res => {
        this.common.loading--;
        console.log(res)

        this.data = res['data']
        console.log("pa", this.data)
        if (this.data) {
          this.common.params = this.data;
          const activeModal = this.modalService.open(GpsEnabledDisabledComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

        }
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();

      });

  }

  bulkCompanyAssociation(){
    const activeModal = this.modalService.open(BulkCompanyAssociationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }
  addMultiVehicleHalt(){
    const activeModal = this.modalService.open(MultiVehicleHaltAddComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }
  addSingleVehicleHalt(){
    const activeModal = this.modalService.open(SingleVehicleGpsDataComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }

  importATSites(){
    const activeModal = this.modalService.open(AtSitesComponent,{size: 'lg', container: 'nb-layout', backdrop: 'static'})
  }
  
}
