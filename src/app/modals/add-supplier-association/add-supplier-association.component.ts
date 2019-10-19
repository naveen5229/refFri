import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasicPartyDetailsComponent } from '../basic-party-details/basic-party-details.component';

@Component({
  selector: 'add-supplier-association',
  templateUrl: './add-supplier-association.component.html',
  styleUrls: ['./add-supplier-association.component.scss']
})
export class AddSupplierAssociationComponent implements OnInit {
  title = '';
  button = '';
  vehicleSupplierAssociation = {
    partyId: null,
    partyName: '',
    vehicleId: null,
    regno: '',
    driverName: '',
    mobile: null,
    licensce: null,
    mappedDate: new Date()
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    this.title = this.common.params.vehicleSupplier.title;
    this.button = this.common.params.vehicleSupplier.button;
  }

  ngOnInit() {
  }

  ngDestroy() {
    this.common.params = null;
  }

  closeModal() {
    this.activeModal.close(false);
  }

  addParty() {
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    });
  }
  selectParty(party) {
    console.log("party", party);
    this.vehicleSupplierAssociation.partyId = party.id;
    this.vehicleSupplierAssociation.partyName = party.name;
  }
  selectVehicle(vehicle) {
    this.vehicleSupplierAssociation.vehicleId = vehicle.id;
    this.vehicleSupplierAssociation.regno = vehicle.regno;
  }
  resetvehicle() {
    this.vehicleSupplierAssociation.vehicleId = null;
    this.vehicleSupplierAssociation.regno = '';

  }

  saveVehicleSupplier() {
    let params = {
      partyId: this.vehicleSupplierAssociation.partyId,
      vehilceId: this.vehicleSupplierAssociation.vehicleId,
      regNo: this.vehicleSupplierAssociation.regno,
      driverName: this.vehicleSupplierAssociation.driverName,
      mobileNo: this.vehicleSupplierAssociation.mobile,
      licenseNo: this.vehicleSupplierAssociation.licensce,
      mappedDate: this.common.dateFormatter(this.vehicleSupplierAssociation.mappedDate),
    }
    console.log("params:", params);

    this.common.loading++;
    this.api.post('ManageParty/vehicleSupplierAssoc', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("data:");
        console.log(res);
        if (res['data'].y_id > 0) {
          this.common.showToast('Success');
          this.activeModal.close({ respose: true });
        }
        else {
          this.common.showToast(res['data'].y_msg);
        }

      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }

}
