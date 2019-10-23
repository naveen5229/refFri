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
import { VehiclesViewComponent } from '../../vehicles-view/vehicles-view.component';
import { AddDriverCompleteComponent } from '../../DriverModals/add-driver-complete/add-driver-complete.component';
import { AddSupplierAssociationComponent } from '../../add-supplier-association/add-supplier-association.component';

@Component({
  selector: 'lr-generate',
  templateUrl: './lr-generate.component.html',
  styleUrls: ['./lr-generate.component.scss', '../../../pages/pages.component.css']
})
export class LrGenerateComponent implements OnInit {
  lr = {
    lrType: 1,
    vehicleType: 1,
    lrCategory: 1,
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
  lrDetails = {
    id: null
  }
  lrGeneralField = [];
  generalDetailColumn2 = [];
  generalDetailColumn1 = [];
  foCmpnyId = 0;
  disorderId = null;
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
    if (this.common.params.lrData) {
      this.lrDetails.id = this.common.params.lrData.lrId ? this.common.params.lrData.lrId : 'null';
      this.disorderId = this.common.params.lrData.dispOrdId ? this.common.params.lrData.dispOrdId : 'null';
      this.btnTxt = 'SAVE'
    }
    if (this.lrDetails.id || this.accountService.selected.branch.id || this.disorderId ) {
      this.getLrFields(true);
    }
    this.formatGeneralDetails();
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }

  getLrFields(isSetBranchId?) {
    let branchId = this.accountService.selected.branch.id ? this.accountService.selected.branch.id : '';
    let params = "branchId=" + this.accountService.selected.branch.id +
      "&lrId=" + this.lrDetails.id+
      "&dispOrderId="+this.disorderId;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getLrFields?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("LoryReceipts:", res['data']['headings'][0].branch_id);
        console.log("res", res['data'], res);
        if (res['data'] && res['data'].result) {
          this.lrGeneralField = res['data'].result;
          let headData = res['data'].headings;
          this.foCmpnyId = res['data']['headings'][0].fo_companyid;
          console.log('focompnyid:::::::::', this.foCmpnyId);
          if (headData.length > 0) {
            this.setLrHeadData(headData[0], isSetBranchId);
          }
          this.particulars = res['data'].details;
          this.setlrParticulars(this.particulars);
          // console.log(this.particulars, this.particulars[0].fixed);
          // console.log("this.lrGeneralField", this.lrGeneralField, "head data", headData);
          this.formatGeneralDetails();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  setLrHeadData(headData, isSetBranchId?) {
    console.log("head_BranchId", headData.branch_id)
    isSetBranchId && (this.accountService.selected.branch.id = headData.branch_id);
    this.lr.lrType = headData.lr_asstype;
    this.lr.lrCategory = headData.is_ltl;
    this.lr.id = headData.lr_id;
    this.lr.vehicleType = headData.veh_asstype;
    //this.accountService.selected.branch.id = headData.branch_id;
    this.lr.serial = headData.lr_serial;
    this.lr.prefix = headData.lr_prefix;
    this.lr.image = headData.lr_image;
    if (this.lr.image) {
      this.images[0] = this.lr.image;
      this.img_flag = true;
    }
    if (this.img_flag) {
      this.common.handleModalSize('class', 'modal-lg', '1600');
    } else {
      this.common.handleModalSize('class', 'modal-lg', '1000');
    }
    this.lr.date = headData.lr_date ? new Date(headData.lr_date) : new Date();
    this.vehicleData.regno = headData.regno;
    this.vehicleData.id = headData.vehicle_id;
  }

  formatGeneralDetails() {
    this.generalDetailColumn2 = [];
    this.generalDetailColumn1 = [];
    this.lrGeneralField.map(dd => {
      if (dd.r_coltype == 3) {
        dd.r_value = dd.r_value ? new Date(dd.r_value) : new Date();
        console.log("date==", dd.r_value);
      }
      if (dd.r_fixedvalues) {
        dd.r_fixedvalues = JSON.parse(dd.r_fixedvalues);
      }
      if (dd.r_colorder % 2 == 0) {
        this.generalDetailColumn2.push(dd);
      } else {
        this.generalDetailColumn1.push(dd);
      }
    });
    console.log("generalDetailColumn2", this.generalDetailColumn2);
    console.log("generalDetailColumn1", this.generalDetailColumn1);
  }

  formatMaterialDetails(particularDetails) {
    particularDetails.map(dd => {
      if (dd.r_fixedvalues) {
        dd.r_fixedvalues = JSON.parse(dd.r_fixedvalues);
      }
    });
    return particularDetails

  }

  addCompany() {
    console.log("open consignee modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  addAssociation(assType) {
    console.log("open Association modal")
    this.common.params = {
      assType:assType
    };
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw'   });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }


  addDriver() {
    this.common.params = { vehicleId: null, vehicleRegNo: null };
    const activeModal = this.modalService.open(AddDriverCompleteComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
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
    this.setSupplierInfo(vehicle.supplier_name,vehicle.supplier_id)
    this.getDriverData(this.vehicleData.id);

  }
  addSupplierAssociation() {
    const activeModal = this.modalService.open(AddSupplierAssociationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
      }
    });
  }

  setSupplierInfo(supplier?,supplierId?) {
    if (supplier && supplierId) {
      this.lrGeneralField.map(lrField => {
        if (lrField.r_colname == 'supplier_name') {
          lrField.r_value = '';
          lrField.r_value = supplier;
          lrField.r_valueid = supplierId;
        }
      });
    } 
    // (<HTMLInputElement>document.getElementById('driver_name')).value = supplier;
  }
  getDriverData(vehicleId) {
    let params = {
      vid: vehicleId,
      vehicleType:this.lr.vehicleType
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
      this.lrGeneralField.map(lrField => {
        if (lrField.r_colname == 'driver_mobile') {
          lrField.r_value = '';
          lrField.r_value = driver.mobileno;
          lrField.r_valueid = driver.id ? driver.id : driver.driver_id;
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

  changeLrTypeData() {
    if (this.lr.lrType == 1) {
      // this.lrGeneralField.map(lrField => {
      //   if (lrField.r_colname == 'transporter_name') {
      //     lrField.r_value = '';
      //     lrField.r_valueid = '';
      //   }
      // });
    }
    else if (this.lr.lrType == 3) {
      this.lrGeneralField.map(lrField => {
        if (lrField.r_colname == 'consignee_name') {
          lrField.r_value = '';
          lrField.r_valueid = '';
        }
        if (lrField.r_colname == 'consignee_address') {
          lrField.r_value = '';
        }
        if (lrField.r_colname == 'consignor_name') {
          lrField.r_value = '';
          lrField.r_valueid = '';
        }
        if (lrField.r_colname == 'consigner_address') {
          lrField.r_value = '';
        }
        if (lrField.r_colname == 'invoiceto_name') {
          lrField.r_valueid2 = 3;
          lrField.r_value = 'Transport Agent';
        }
      });
    }
  }

  getCompanyData(field, company) {
    console.log("field", field, "data", company);
    if (field == 'consignee_name') {
      this.lrGeneralField.map(lrField => {
        if (lrField.r_colname == 'consignee_address') {
          lrField.r_value = company.address;
        }
      })
    }
    else if (field == 'consignor_name') {
      this.lrGeneralField.map(lrField => {
        if (lrField.r_colname == 'consigner_address') {
          lrField.r_value = company.address;
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
          if (customjfield.r_fixedvalues) {
            customjfield.r_fixedvalues = JSON.parse(customjfield.r_fixedvalues);
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
    this.lrGeneralField = this.generalDetailColumn2.concat(this.generalDetailColumn1);
    console.log("lr details", JSON.stringify(this.lrGeneralField));
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
      lrId: this.lr.id,
      lrType: this.lr.lrType,
      lrCategory: this.lr.lrCategory,
      vehicleType: this.lr.vehicleType,
      branchId: this.accountService.selected.branch.id,
      vehicleId: this.vehicleData.id,
      vehicleRegNo: document.getElementById('vehicleno')['value'],
      lrNo: this.lr.serial,
      lrNoText: this.lr.prefix,
      lrDate: this.common.dateFormatter(this.lr.date),
      generalDetails: JSON.stringify(this.lrGeneralField),
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
    this.lrGeneralField.map(lrField => {
      if (lrField.r_colname == 'supplier_name' || lrField.r_colname == 'driver_mobile' ) {
        console.log("lrField.r_colname",lrField.r_colname);
        lrField.r_value = '';
        lrField.r_value = null;
        lrField.r_valueid = null;
      }
    else if(lrField.r_colname == 'driver_name'){
      (<HTMLInputElement>document.getElementById('driver_name')).value = '';
    }else if(lrField.r_colname == 'driver_license'){
      (<HTMLInputElement>document.getElementById('driver_license')).value = '';

    }
    }
    );
    

  }

  resetData() {
    console.log("vehicleId 4", this.vehicleData.id);
    this.vehicleData.id = null;
  }


  closeModal() {
    this.activeModal.close(true);
  }

  lrView(lrId) {
    console.log("receipts", lrId);
    this.common.params = { lrId: lrId }
    const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  addMaterial() {
    console.log('add material');
    const activeModal = this.modalService.open(AddMaterialComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  displayVehicleData() {
    console.log("-------------vehicle id----------", this.vehicleData.id);
    this.common.params = { vehicleId: this.vehicleData.id }
    if (this.vehicleData.id > 0) {
      const activeModal = this.modalService.open(VehiclesViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });

      activeModal.result.then(data => {
        console.log('Date:', data);
      });
    } else {
      this.common.showError("Vehicle Id doesn't exit.");
    }

  }

  changeSerialNo(){
    console.log("changeLrSeries");
    if(!this.lr.id){
      let branchId = this.accountService.selected.branch.id ? this.accountService.selected.branch.id : '';
      let params = "branchId=" + this.accountService.selected.branch.id +
        "&prefix=" + this.lr.prefix+
        "&reportType=LR";
      this.common.loading++;
      this.api.get('LorryReceiptsOperation/getNextSerialNo?' + params)
        .subscribe(res => {
          console.log('reds',res['data'][0].result) ;
          this.lr.serial = res['data'][0].result;
          this.common.loading--;
        }, err => {
          this.common.loading--;
          console.log(err);
        });
      }
  }
}