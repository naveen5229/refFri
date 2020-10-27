import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { Router } from '@angular/router';
import { ImportDocumentComponent } from '../../documents/documentation-modals/import-document/import-document.component';
import { EditDriverComponent } from '../../modals/edit-driver/edit-driver.component';
import { AddDriverCompleteComponent } from '../../modals/DriverModals/add-driver-complete/add-driver-complete.component';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { UploadDocsComponent } from '../../modals/upload-docs/upload-docs.component';
import { DriverLedgerMappingComponent } from '../../modals/DriverModals/driver-ledger-mapping/driver-ledger-mapping.component';
import { DriverPersonalInfoComponent } from '../../modals/driver-personal-info/driver-personal-info.component';
@Component({
  selector: 'driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss', '../../pages/pages.component.css']
})
export class DriverListComponent implements OnInit {
  driverLists = [];
  data = [];
  table = null;


  constructor(public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public router: Router,
    private modalService: NgbModal,
    public common: CommonService,
    public user: UserService) {
    this.getdriverLists();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }
  refresh() {
    this.getdriverLists();

  }
  addDriver() {
    // this.router.navigate(['/driver/add-driver']);
    // const activeModal =
    const activeModal = this.modalService.open(AddDriverCompleteComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        // console.log('hrithik');


        this.getdriverLists();

        // this.getdriverLists();

      }
    })
  }




  getdriverLists() {
    this.driverLists = [];
    this.common.loading++;
    let response;
    this.api.get('Drivers/index')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.driverLists = res['data'];
        if (this.driverLists == null) {
          return;
          this.driverLists = [];
          this.table = null;
        }
        this.table = this.setTable();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  updateDriverInfo(driver) {
    this.common.params = { driver };
    const activeModal = this.modalService
      .open(EditDriverComponent,
        { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getdriverLists();
      }
    });
  }

  importDriverCsv() {
    this.common.params = { title: 'Bulk Import Driver', };
    const activeModal = this.modalService.open(ImportDocumentComponent, { container: 'nb-layout', backdrop: 'static' });
  }

  setTable() {
    let headings = {
      empname: { title: 'Driver', placeholder: 'Driver' },
      mobileno: { title: 'Mobile No', placeholder: 'Mobile No' },
      mobileno2: { title: 'Mobile No 2', placeholder: 'Mobile No 2' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },

    };
    return {
      driverLists: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.driverLists.map(req => {
      let column = {
        empname: { value: req.empname },
        mobileno: { value: req.mobileno },
        mobileno2: { value: req.mobileno2 == null ? "-" : req.mobileno2 },
        action: {
          value: '', isHTML: false, action: null, icons: [

            { class: 'fa fa-file', action: this.updateDriver.bind(this, req) },
            { class: 'fa fa-tasks', action: this.updateDriverInfo.bind(this, req) },
            { class: 'fab fa-reddit', action: this.driverLedgerMapping.bind(this, req) },
            { class: "fa fa-print", action: this.driverPersonalDetail.bind(this, req) }
          ]
        },
        rowActions: {
          click: 'selectRow'
        }


      };
      columns.push(column);
    });
    return columns;
  }

  driverLedgerMapping(driverdata) {
    this.common.params = {
      driverId: driverdata.id,
    }
    const activeModal = this.modalService.open(DriverLedgerMappingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }

  driverPersonalDetail(driverdata) {
    this.common.params = {
      driverId: driverdata.id,
    }
    const activeModal = this.modalService.open(DriverPersonalInfoComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }


  updateDriver(driver) {
    this.common.params = { driver };
    const activeModal = this.modalService.open(UploadDocsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });


  }

  printPDF() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:", name);
    let details = [
      ['Name: ' + name, 'Report: ' + 'Driver-List']
    ];
    this.pdfService.jrxTablesPDF(['driverList'], 'driver-list', details);
  }

  printCSV() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name, report: "Report:Driver-List" }
    ];
    this.csvService.byMultiIds(['driverList'], 'driver-list', details);
  }

}
