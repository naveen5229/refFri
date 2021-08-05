import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverVehicleRemappingComponent } from '../../modals/driver-vehicle-remapping/driver-vehicle-remapping.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { UserService } from '../../services/user.service';
import { DriverStatusChangeComponent } from '../../modals/driver-status-change/driver-status-change.component';
import { NewDriverStatusComponent } from '../../modals/new-driver-status/new-driver-status.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ExcelService } from '../../services/excel/excel.service';

@AutoUnsubscribe()
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
    private pdfService: PdfService,
    private csvService: CsvService,
    public user: UserService,
    public excelService: ExcelService,
    public api: ApiService,
    private modalService: NgbModal,
  ) {
    this.common.refresh = this.refresh.bind(this);
    this.getdriverMapping();
  }

  refresh() {
    this.getdriverMapping();
  }

  ngOnDestroy(){}
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
      mainDriver: { title: 'Primary Driver', placeholder: 'Primary Driver ' },
      mappedSinceM:{title: 'Mapped Since',placeholder:'Mapped Since'},
      mobileno: { title: 'Mobile Number', placeholder: 'Mobile Number' },
      secondaryDriver: { title: 'Secondary Driver', placeholder: 'Secondary Driver' },
      mappedSinceS:{title:'Mapped Since',placeholder:'Mapped Since'},
      mobileno2: { title: 'Mobile  Number', placeholder: 'Mobile Number' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true, 
        pagination: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.data.map(driver => {

      let column = {
        regno: { value: driver.regno, action: this.remapDriver.bind(this, driver) },
        mainDriver: { value: driver.md_name, action: '' },
        mappedSinceM:{value:driver.m_entry_dt?this.common.dateFormatter1(driver.m_entry_dt):null,action:''},
        mobileno: { value: driver.md_no, action: '' },
        secondaryDriver: { value: driver.sd_name, action: '' },
        mappedSinceS:{value:driver.s_entry_dt? this.common.dateFormatter1(driver.s_entry_dt):null,action:''},
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

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Report: '+'Vehicle-Driver-Map']
    ];
    this.pdfService.jrxTablesPDF(['vehicleMapping'], 'vehicle-driver-map', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,report:"Report:Vehicle-Driver-Map"}
    ];
    // this.csvService.byMultiIds(['vehicleMapping'], 'vehicle-driver-map', details);
    
    let headersArray = ["Vehicle Number", "Primary Driver", "Mapped Since", "Mobile Number", "Secondary Driver", "Mapped Since 2", "Mobile  Number"];
    let json = this.data.map(challan => {
      return {
        "Vehicle Number": challan['regno'],
        "Primary Driver": challan['md_name'],
        "Mapped Since": challan.m_entry_dt?this.common.dateFormatter1(challan.m_entry_dt):null,
        "Mobile Number": challan['md_no'],
        "Secondary Driver": challan['sd_name'],
        "Mapped Since 2": challan.s_entry_dt? this.common.dateFormatter1(challan.s_entry_dt):null,
        "Mobile  Number": challan['sd_no'],
      };
    });

    this.excelService.dkgExcel("Driver Vehicle Mapping", details, headersArray, json, 'Driver Vehicle Mapping', false);
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
