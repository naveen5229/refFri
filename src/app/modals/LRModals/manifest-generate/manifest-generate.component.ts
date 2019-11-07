//  Author : Prashant Sharma
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../../services/map.service';
import { AccountService } from '../../../services/account.service';
import { AddConsigneeComponent } from '../add-consignee/add-consignee.component';
import { ChangeDriverComponent } from '../../DriverModals/change-driver/change-driver.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { LRViewComponent } from '../lrview/lrview.component';
import { isArray } from 'util';
import { AddFieldComponent } from '../add-field/add-field.component';
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';
import { AddMaterialComponent } from '../add-material/add-material.component';
import { AddTransportAgentComponent } from '../add-transport-agent/add-transport-agent.component';
import { BasicPartyDetailsComponent } from '../../../modals/basic-party-details/basic-party-details.component';

@Component({
  selector: 'manifest-generate',
  templateUrl: './manifest-generate.component.html',
  styleUrls: ['./manifest-generate.component.scss']
})
export class ManifestGenerateComponent implements OnInit {

  manifest = {
    vehicleType: 1,
    serial: null,
    prefix: null,
    image: null,
    date: new Date(),
    id: null
  }
  vehicleData = {
    regno: null,
    id: null
  };
  driverData = {
    id: null,
    mobileNo: null
  }
  keepGoing = true;
  btnTxt = "SAVE";
  img_flag = false;
  images = [];
  manifestDetails = {
    id: null
  }
  manifestGeneralField = [];
  generalDetailColumn2 = [];
  generalDetailColumn1 = [];
  foCmpnyId = 0;

  particulars = [];
  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public mapService: MapService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    if (this.img_flag) {
      this.common.handleModalSize('class', 'modal-lg', '1600');
    } else {
      this.common.handleModalSize('class', 'modal-lg', '1000');
    }
    if (this.common.params.manifestData) {
      this.manifestDetails.id = this.common.params.manifestData.manifestId ? this.common.params.manifestData.manifestId : 'null';
      this.btnTxt = 'SAVE'
    }
    if (this.manifestDetails.id || this.accountService.selected.branch.id) {
      this.getManifestFields(true);
    }
    this.common.formatDynamicData(this.manifestGeneralField);
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }

  getManifestFields(isSetBranchId?) {
    let branchId = this.accountService.selected.branch.id ? this.accountService.selected.branch.id : '';
    let params = "branchId=" + this.accountService.selected.branch.id +
      "&manifestId=" + this.manifestDetails.id;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getManifestFields?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("LoryReceipts:", res['data']['headings'][0].branch_id);
        console.log("res", res['data'], res);
        if (res['data'] && res['data'].result) {
          this.manifestGeneralField = res['data'].result;
          let headData = res['data'].headings;
          this.foCmpnyId = res['data']['headings'][0].fo_companyid;
          console.log('focompnyid:::::::::', this.foCmpnyId);
          if (headData.length > 0) {
            this.setLrHeadData(headData[0], isSetBranchId);
          }
          this.particulars = res['data'].details;
          this.setlrParticulars(this.particulars);
          // console.log(this.particulars, this.particulars[0].fixed);
          // console.log("this.manifestGeneralField", this.manifestGeneralField, "head data", headData);
          this.common.formatDynamicData(this.manifestGeneralField);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  setLrHeadData(headData, isSetBranchId?) {
    console.log("head_BranchId", headData.branch_id)
    isSetBranchId && (this.accountService.selected.branch.id = headData.branch_id);
    this.manifest.id = headData.manifest_id;
    this.manifest.vehicleType = headData.veh_asstype;
    //this.accountService.selected.branch.id = headData.branch_id;
    this.manifest.serial = headData.manifest_serial;
    this.manifest.prefix = headData.manifest_prefix;
    this.manifest.image = headData.manifest_image;
    if (this.manifest.image) {
      this.images[0] = this.manifest.image;
      this.img_flag = true;
    }
    if (this.img_flag) {
      this.common.handleModalSize('class', 'modal-lg', '1600');
    } else {
      this.common.handleModalSize('class', 'modal-lg', '1000');
    }
    this.manifest.date = headData.manifest_date ? new Date(headData.manifest_date) : new Date();
    this.vehicleData.regno = headData.regno;
    this.vehicleData.id = headData.vehicle_id;
  }

  addAssociation() {
    console.log("open Association modal")
    this.common.params = {
      cmpId: this.foCmpnyId,
    };
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  addDriver() {
    this.common.params = { vehicleId: null, vehicleRegNo: null };
    const activeModal = this.modalService.open(ChangeDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data);
      if (data.data) {
      }
    });
  }

  getVehicleInfo(vehicle) {
    console.log("vehicle", vehicle);
    this.vehicleData.regno = vehicle.regno;
    this.vehicleData.id = vehicle.id;
    console.log("vehicleId 1", this.vehicleData.id);
    this.getDriverData(this.vehicleData.id);
  }

  getDriverData(vehicleId) {
    let params = {
      vid: vehicleId
    };
    console.log("vehicleId 2", this.vehicleData.id);
    this.common.loading++;
    this.api.post('Drivers/getDriverInfo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.getDriverInfo(res['data'][0], true);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getDriverInfo(driver, arr?: any) {
    if (arr && arr === true) {
      this.manifestGeneralField.map(manifestField => {
        if (manifestField.r_colname == 'driver_mobile') {
          manifestField.r_value = '';
          manifestField.r_value = driver.mobileno;
          manifestField.r_valueid = driver.id ? driver.id : driver.driver_id;
        }
      });
    } else if (arr) {
      arr.r_value = '';
      arr.r_value = driver.mobileno;;
      arr.r_valueid = driver.id ? driver.id : driver.driver_id;
    }
    this.driverData.id = driver.id ? driver.id : driver.driver_id;
    // (<HTMLInputElement>document.getElementById('driver_id')).value = this.driverData.id;
    (<HTMLInputElement>document.getElementById('driver_name')).value = driver.empname;
    (<HTMLInputElement>document.getElementById('driver_license')).value = driver.licence_no;
  }



  getCompanyData(field, company) {
    console.log("field", field, "data", company);
    if (field == 'consignee_name') {
      this.manifestGeneralField.map(manifestField => {
        if (manifestField.r_colname == 'consignee_address') {
          manifestField.r_value = company.address;
        }
      })
    }
    else if (field == 'consignor_name') {
      this.manifestGeneralField.map(manifestField => {
        if (manifestField.r_colname == 'consigner_address') {
          manifestField.r_value = company.address;
        }
      })
    }


  }

  takeActionSource(type, res, i) {
    console.log("here", type, res, i, "this.generalDetailColumn1", this.generalDetailColumn1, "this.generalDetailColumn2", this.generalDetailColumn2);
    setTimeout(() => {
      if (type == 'generalDetailColumn1') {
        this.generalDetailColumn1[i].r_value = this.generalDetailColumn1[i].r_value ? this.generalDetailColumn1[i].r_value : '-------';
        if (this.keepGoing && this.generalDetailColumn1[i].r_value.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoing = false;
          activeModal.result.then(res => {
            this.keepGoing = true;
            if (res && res.location.lat) {
              console.log('response----', res.location);
              this.generalDetailColumn1[i].r_value = res.location.name;
              this.generalDetailColumn1[i].r_valueid = res.id;
              this.keepGoing = true;
            }
          })
        }
      }
      else if (type == 'generalDetailColumn2') {
        this.generalDetailColumn2[i].r_value = this.generalDetailColumn2[i].r_value ? this.generalDetailColumn2[i].r_value : '-------';
        if (this.keepGoing && this.generalDetailColumn2[i].r_value.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoing = false;
          activeModal.result.then(res => {
            this.keepGoing = true;
            if (res && res.location.lat) {
              console.log('response----', res.location);
              this.generalDetailColumn2[i].r_value = res.location.name;
              this.generalDetailColumn2[i].r_valueid = res.id;
              this.keepGoing = true;
            }
          })
        }
      }
    }, 1000);

  }

  setlrParticulars(particularDetails) {
    console.log('_________________________________Particulars:', particularDetails);
    particularDetails.forEach(detail => {
      let customjfields = [];
      if (detail.dynamics) {
        detail.dynamics.forEach((customjfield, index) => {
          const customIndex = Math.floor(index / 4);
          if (!customjfields[customIndex]) {
            customjfields[customIndex] = [];
          }
          if (customjfield.r_coltype == 3) {
            customjfield.r_value = customjfield.r_value ? new Date(customjfield.r_value) : new Date();
          }
          customjfields[customIndex].push(customjfield);
        });
      }
      detail.dynamics = customjfields;
    });
    // this.particulars = particularDetails;
    console.log("particularDetails-----", particularDetails);
  }

  addParticluar(particular) {
    console.log('___________________particular:', particular);
    let newParticular = {
      dynamics: particular.dynamics.map(dynamic => {
        return dynamic.map(dynamicField => {
          let field = Object.assign({}, dynamicField);
          field.r_value = null;
          field.r_valueid = null;
          return field;
        })
      }),
      fixed: particular.fixed.map(fixedField => {
        let field = Object.assign({}, fixedField);
        field.r_value = null;
        field.r_valueid = null;
        return field;
      })

    };
    console.log('___________________particular:', newParticular);
    this.particulars.push(newParticular);
  }

  saveDetails() {
    console.log("vehicleId 3", this.vehicleData.id);
    // return;
    this.manifestGeneralField = this.generalDetailColumn2.concat(this.generalDetailColumn1);
    console.log("lr details", JSON.stringify(this.manifestGeneralField));
    let materialDetails = JSON.parse(JSON.stringify(this.particulars));
    if (materialDetails && materialDetails.length > 0) {
      for (let i = 0; i < materialDetails.length; i++) {
        let dynamicArray = [];
        if (materialDetails[i].dynamics && materialDetails[i].dynamics.length > 0)
          for (let j = 0; j < materialDetails[i].dynamics.length; j++) {
            dynamicArray = dynamicArray.concat(materialDetails[i].dynamics[j]);
          }
        materialDetails[i].dynamics = [];
        materialDetails[i].dynamics = dynamicArray;
      }
    }


    console.log("materialDetails", materialDetails);

    ++this.common.loading;
    let params = {
      manifestId: this.manifest.id,
      vehicleType: this.manifest.vehicleType,
      branchId: this.accountService.selected.branch.id,
      vehicleId: this.vehicleData.id,
      vehicleRegNo: document.getElementById('vehicleno')['value'],
      manifestNo: this.manifest.serial,
      manifestText: this.manifest.prefix,
      manifestDate: this.common.dateFormatter(this.manifest.date),
      generalDetails: JSON.stringify(this.manifestGeneralField),
      materialDetails: JSON.stringify(materialDetails),
    }
    console.log("params", params);


    this.api.post('LorryReceiptsOperation/generateLR', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('response :', res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("LR Generated Successfully");
          this.closeModal();
          //this.lrView(res['data'][0].rtn_id);
        } else {
          this.common.showError(res['data'][0].rtn_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  resetVehicleData() {
    this.vehicleData.id = null;
    this.vehicleData.regno = null;
  }

  resetData() {
    console.log("vehicleId 4", this.vehicleData.id);
    this.vehicleData.id = null;
  }


  closeModal() {
    this.activeModal.close(true);
  }
  getLrFields() { }
}
