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
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true

    }

  };
  headings = [];
  valobj = {};

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
        this.getdriverLists();
      }
    })
    // activeModal.result.then(data => {
    // if (data.response) {
    // this.getdriverLists();
    // }
    // });

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


  getdriverLists() {
    this.common.loading++;
    let response;
    this.api.get('Drivers/index')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.driverLists = res['data'];

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }


  importDriverCsv() {
    this.common.params = { title: 'Bulk Import Driver', };
    const activeModal = this.modalService.open(ImportDocumentComponent, { container: 'nb-layout', backdrop: 'static' });
  }
  fetchLisense(res) {
    console.log('photo', res.licence_photo);
    let images = [{
      name: "image",
      image: res.licence_photo
    }]
    this.common.params = { images, title: 'Image' };
    this.common.handleModalSize('class', 'modal-lg', '1024');
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }
  fetchAadhar(res) {
    console.log('aadhar', res.aadhar_photo);
    let images = [{
      name: "image",
      image: res.aadhar_photo
    }]
    this.common.params = { images, title: 'Image' };
    this.common.handleModalSize('class', 'modal-lg', '1024');
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  getdata() {
    console.log("ap")
    this.api.get("Task/getTaskLogs.json").subscribe(
      res => {
        this.data = [];
        this.data = res['data'];
        console.log("result", res);
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }
    );
  }
    
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  updateDriver(){
    const activeModal = this.modalService.open(UploadDocsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });


  }

}
