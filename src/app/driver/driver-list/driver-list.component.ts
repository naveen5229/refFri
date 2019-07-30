import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ImportDocumentComponent } from '../../documents/documentation-modals/import-document/import-document.component';
import { EditDriverComponent } from '../../modals/edit-driver/edit-driver.component';
import { AddDriverCompleteComponent } from '../../modals/DriverModals/add-driver-complete/add-driver-complete.component';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { UploadDocsComponent } from '../../modals/upload-docs/upload-docs.component';
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
    public router: Router,
    private modalService: NgbModal,
    public common: CommonService,
    public user: UserService) {
    this.getdriverLists();

  }

  ngOnInit() {
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
    // const activeModal =
    const activeModal = this.modalService.open(EditDriverComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        // closeModal(true);
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
            { class: 'fa fa-tasks', action: this.updateDriverInfo.bind(this, req) }
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




  updateDriver(driver) {
    this.common.params = { driver };
    const activeModal = this.modalService.open(UploadDocsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });


  }

}
