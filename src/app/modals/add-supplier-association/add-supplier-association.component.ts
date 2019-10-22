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
  title = 'Add Vehicle Supplier Association';
  button = 'Add';
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
  vehicleSupplier = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    if (this.common.params && this.common.params.vehicleSupplier.id) {
      this.vehicleSupplierAssociation.rowId = this.common.params.vehicleSupplier.id ? this.common.params.vehicleSupplier.id : null;
      this.title = this.vehicleSupplierAssociation.rowId ? 'Edit Vehicle Supplier Association' : 'Add Vehicle Supplier Association';
      this.button = this.vehicleSupplierAssociation.rowId ? 'Edit' : 'Add';
      this.getVehicleSupplierData();
    }
  }

  ngOnInit() {
  }

  ngDestroy() {
    this.common.params = null;
  }

  closeModal() {
    this.common.params = null;
    this.activeModal.close(false);
  }

  getVehicleSupplierData() {
    const params = "rowId=" + this.vehicleSupplierAssociation.rowId;
    this.api.get('ManageParty/getVehicleSupplierAssocWrtId?' + params)
      .subscribe(res => {
        this.vehicleSupplier = res['data'];
        console.log("data:");
        console.log(this.vehicleSupplier);
        this.vehicleSupplierAssociation.partyId = this.vehicleSupplier[0]._partyid;
        this.vehicleSupplierAssociation.partyName = this.vehicleSupplier[0].Company;
        this.vehicleSupplierAssociation.vehicleId = this.vehicleSupplier[0]._vid
        this.vehicleSupplierAssociation.regno = this.vehicleSupplier[0].Regno;
        this.vehicleSupplierAssociation.driverName = this.vehicleSupplier[0].Driver;
        this.vehicleSupplierAssociation.mobile = this.vehicleSupplier[0]['Mobile No'];
        this.vehicleSupplierAssociation.licensce = this.vehicleSupplier[0]['License No'];

      }, err => {

        this.common.loading--;
        console.log(err);
      });
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
      || !this.vehicleSupplierAssociation.driverName || !this.vehicleSupplierAssociation.mobile) {
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
          this.common.params = null;
          this.activeModal.close({ response: true });
        }
        else {
          this.common.showError(res['data'][0].y_msg);
        }

      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }

}
