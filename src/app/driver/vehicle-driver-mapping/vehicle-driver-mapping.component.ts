import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverVehicleRemappingComponent } from '../../modals/driver-vehicle-remapping/driver-vehicle-remapping.component';
import { DriverStatusChangeComponent } from '../../modals/driver-status-change/driver-status-change.component';
import { NewDriverStatusComponent } from '../../modals/new-driver-status/new-driver-status.component';
@Component({
  selector: 'vehicle-driver-mapping',
  templateUrl: './vehicle-driver-mapping.component.html',
  styleUrls: ['./vehicle-driver-mapping.component.scss', '../../pages/pages.component.css']
})
export class VehicleDriverMappingComponent implements OnInit {
  data = [];
  //driverStatus = [{
  //id: null
  //}];
  table = null;

  // selectedStatus = '';

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
  ) {
    this.common.refresh = this.refresh.bind(this);

    this.getdriverMapping();

  }
  refresh() {
    this.getdriverMapping();

  }

  ngOnInit() {
  }
  getvehicleData($driverInfo) {
    console.log($driverInfo.mobileno);
    console.log($driverInfo.empname);
    console.log($driverInfo.status);
    console.log($driverInfo.refid);
  }


  setTable() {
    let headings = {
      regno: { title: 'Vehicle Number', placeholder: 'Vehicle Number' },
      mainDriver: { title: 'Primary Driver ', placeholder: 'Primary Driver ' },
      mobileno: { title: 'Mobile Number', placeholder: 'Mobile Number' },
      secondaryDriver: { title: 'Secondary Driver  ', placeholder: 'Secondary Driver ' },
      mobileno2: { title: 'Mobile  Number', placeholder: 'Mobile Number' },

    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.data.map(driver => {

      let column = {

        regno: { value: driver.regno, action: this.remapDriver.bind(this, driver) },
        mainDriver: { value: driver.md_name, action: '' },
        mobileno: { value: driver.md_no, action: '' },
        secondaryDriver: { value: driver.sd_name, action: '' },
        mobileno2: { value: driver.sd_no, action: '' },
        rowActions: {}
      };


      columns.push(column);
    });
    return columns;
  }



  getdriverMapping() {
    this.common.loading++;
    let response;
    // let params = "isCheck=" + 1;
    this.api.get('Drivers/getVehicleMapping')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

  selectDriverStatus(status) {
    console.log("Status :", status);

  }

  // getdriverStatus() {
  //   this.common.loading++;
  //   let response;
  //   this.api.get('Drivers/getStatus')
  //     .subscribe(res => {
  //       this.common.loading--;

  //       this.driverStatus = res['data'];
  //       console.log("Driver Status:", this.driverStatus);
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  //   return response;

  // }

  remapDriver(driver) {
    this.common.params = { driver };

    const activeModal = this.modalService.open(DriverVehicleRemappingComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        // closeModal(true);
        this.getdriverMapping();
      }
    });

  }

  // mapDriverSecondry(driver) {
  //   this.common.params={driver};
  //   this.modalService.open(DriverStatusChangeComponent,{ size: 'lg', container: 'nb-layout' })
  // }
  // Add(driver){
  //   console.log('Driver: ', driver); 
  //  // this.common.params = { data: this.data }; 
  //   this.modalService.open(NewDriverStatusComponent,{size: 'lg', container: 'nb-layout'});
  // }

}
