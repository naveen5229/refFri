// Author By Lalit

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
    rowId: null,
    partyId: null,
    partyName: '',
    vehicleId: null,
    regno: '',
    driverName: '',
    mobile: null,
    licensce: null,
    mappedDate: new Date()
  }
  partyList = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    this.title = this.common.params.vehicleSupplier.title;
    this.button = this.common.params.vehicleSupplier.button;
    if (this.button === 'Edit') {
      this.vehicleSupplierAssociation.rowId = this.common.params.vehicleSupplier.rowId;
      this.vehicleSupplierAssociation.partyId = this.common.params.vehicleSupplier.partyId;
      this.vehicleSupplierAssociation.partyName = this.common.params.vehicleSupplier.partyName;
      this.vehicleSupplierAssociation.vehicleId = this.common.params.vehicleSupplier.vehicleId;
      this.vehicleSupplierAssociation.regno = this.common.params.vehicleSupplier.regno;
      this.vehicleSupplierAssociation.driverName = this.common.params.vehicleSupplier.driverName;
      this.vehicleSupplierAssociation.mobile = this.common.params.vehicleSupplier.mobileNo;
      this.vehicleSupplierAssociation.licensce = this.common.params.vehicleSupplier.licensce;
    }
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

  saveVehicleSupplier() {
    if (!this.vehicleSupplierAssociation.partyId || !this.vehicleSupplierAssociation.regno
      || !this.vehicleSupplierAssociation.driverName || !this.vehicleSupplierAssociation.mobile
      || !this.vehicleSupplierAssociation.licensce) {
      this.common.showError("Please Fill All Field");
      return;
    }
    let params = {
      rowId: this.vehicleSupplierAssociation.rowId ? this.vehicleSupplierAssociation.rowId : null,
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
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ response: true });
        }
        else {
          this.common.showToast(res['data'][0].y_msg);
        }

      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }

}
